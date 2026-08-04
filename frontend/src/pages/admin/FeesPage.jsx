import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { PlusIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useForm } from 'react-hook-form';

const FeesPage = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState({ page: 1, search: '' });

  const { register, handleSubmit, reset, watch, setValue } = useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: query.page, limit: 10 });
      const res = await api.get(`/fees?${params}`);
      setData(res.data.data);
      setPagination(res.data.pagination);
    } catch (e) {
      toast.error('Failed to fetch fee records');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    api.get('/students?limit=500').then(r => setStudents(r.data.data)).catch(() => {});
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset({
      student_id: students[0]?.student_id || '',
      semester: 3,
      academic_year: 2025,
      tuition_fee: 45000,
      exam_fee: 3000,
      hostel_fee: 12000,
      paid_amount: 0,
      due_date: '2025-10-31'
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    reset({
      tuition_fee: item.tuition_fee,
      exam_fee: item.exam_fee,
      hostel_fee: item.hostel_fee,
      paid_amount: item.paid_amount,
      due_date: item.due_date
    });
    setModalOpen(true);
  };

  const onSubmit = async (formData) => {
    try {
      if (editing) {
        await api.put(`/fees/${editing.fee_id}`, formData);
        toast.success('Fee record updated successfully');
      } else {
        await api.post('/fees', formData);
        toast.success('Fee bill generated successfully');
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save fee record');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/fees/${deleteTarget.fee_id}`);
      toast.success('Fee record deleted');
      setDeleteTarget(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to delete fee record');
    }
  };

  const columns = [
    { key: 'roll_no', label: 'Roll No', render: (r) => r.student?.roll_no },
    { key: 'student_name', label: 'Student Name', render: (r) => r.student?.user?.username },
    { key: 'semester', label: 'Sem' },
    { key: 'total', label: 'Total Fee (₹)', render: (r) => `₹${parseFloat(r.total_amount).toLocaleString()}` },
    { key: 'paid', label: 'Paid Amount (₹)', render: (r) => `₹${parseFloat(r.paid_amount).toLocaleString()}` },
    { key: 'due', label: 'Due Amount (₹)', render: (r) => `₹${parseFloat(r.due_amount).toLocaleString()}` },
    {
      key: 'status',
      label: 'Payment Status',
      render: (r) => (
        <span className={r.status === 'Paid' ? 'badge-success' : r.status === 'Partial' ? 'badge-warning' : 'badge-danger'}>
          {r.status}
        </span>
      )
    },
    { key: 'due_date', label: 'Due Date', render: (r) => new Date(r.due_date).toLocaleDateString() },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (r) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(r)} className="text-campus-navy-600 hover:text-campus-navy-800 text-sm font-medium">Update Payment</button>
          <button onClick={() => setDeleteTarget(r)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
        </div>
      )
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Fee Management</h1>
          <p className="page-subtitle">Generate fee structures, track payments, and update student dues</p>
        </div>
        <button onClick={openCreate} className="btn-primary" id="add-fee-btn">
          <BanknotesIcon className="w-5 h-5" /> Issue Fee Bill
        </button>
      </div>

      <DataTable columns={columns} data={data} pagination={pagination} loading={loading} onPageChange={(p) => setQuery(q => ({ ...q, page: p }))} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Update Fee & Payment' : 'Issue New Fee Bill'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!editing && (
            <div>
              <label className="form-label">Select Student</label>
              <select className="form-input" {...register('student_id', { required: 'Required' })}>
                {students.map(s => (
                  <option key={s.student_id} value={s.student_id}>
                    {s.user?.username} ({s.roll_no}) - Sem {s.semester}
                  </option>
                ))}
              </select>
            </div>
          )}
          {!editing && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Semester</label>
                <input type="number" min="1" max="8" className="form-input" {...register('semester', { required: 'Required' })} />
              </div>
              <div>
                <label className="form-label">Academic Year</label>
                <input type="number" className="form-input" {...register('academic_year', { required: 'Required' })} />
              </div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="form-label">Tuition Fee (₹)</label>
              <input type="number" className="form-input" {...register('tuition_fee', { required: 'Required' })} />
            </div>
            <div>
              <label className="form-label">Exam Fee (₹)</label>
              <input type="number" className="form-input" {...register('exam_fee', { required: 'Required' })} />
            </div>
            <div>
              <label className="form-label">Hostel Fee (₹)</label>
              <input type="number" className="form-input" {...register('hostel_fee', { required: 'Required' })} />
            </div>
          </div>
          <div>
            <label className="form-label">Amount Received / Paid (₹)</label>
            <input type="number" step="100" className="form-input font-bold text-emerald-400" {...register('paid_amount', { required: 'Required' })} />
          </div>
          <div>
            <label className="form-label">Due Date</label>
            <input type="date" className="form-input" {...register('due_date', { required: 'Required' })} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editing ? 'Save Payment' : 'Issue Bill'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Fee Bill" message="Are you sure you want to delete this fee bill record?" />
    </motion.div>
  );
};

export default FeesPage;
