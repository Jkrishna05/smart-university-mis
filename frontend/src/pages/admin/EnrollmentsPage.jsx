import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { PlusIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useForm } from 'react-hook-form';

const EnrollmentsPage = () => {
  const [data, setData] = useState([]); const [pagination, setPagination] = useState(null); const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false); const [deleteTarget, setDeleteTarget] = useState(null);
  const [students, setStudents] = useState([]); const [offerings, setOfferings] = useState([]);
  const [query, setQuery] = useState({ page: 1 });
  const { register, handleSubmit, reset } = useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await api.get(`/enrollments?page=${query.page}&limit=10`); setData(res.data.data); setPagination(res.data.pagination); }
    catch (e) { toast.error('Failed to fetch'); } finally { setLoading(false); }
  }, [query]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    api.get('/students?limit=100').then(r => setStudents(r.data.data)).catch(() => {});
    api.get('/course-offerings?limit=100').then(r => setOfferings(r.data.data)).catch(() => {});
  }, []);

  const openCreate = () => { reset({ student_id: '', offering_id: '' }); setModalOpen(true); };

  const onSubmit = async (formData) => {
    try { await api.post('/enrollments', formData); toast.success('Student enrolled'); setModalOpen(false); fetchData(); }
    catch (error) { toast.error(error.response?.data?.message || 'Enrollment failed'); }
  };

  const handleDelete = async () => {
    try { await api.delete(`/enrollments/${deleteTarget.enrollment_id}`); toast.success('Enrollment removed'); setDeleteTarget(null); fetchData(); }
    catch (error) { toast.error('Failed'); }
  };

  const columns = [
    { key: 'student', label: 'Student', render: (r) => r.student?.user?.username },
    { key: 'email', label: 'Email', render: (r) => r.student?.user?.email },
    { key: 'course', label: 'Course', render: (r) => `${r.courseOffering?.course?.course_code} - ${r.courseOffering?.course?.course_name}` },
    { key: 'faculty', label: 'Faculty', render: (r) => r.courseOffering?.faculty?.user?.username },
    { key: 'actions', label: 'Actions', sortable: false, render: (r) => (
      <button onClick={() => setDeleteTarget(r)} className="text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
    )}
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="page-title">Enrollments</h1><p className="page-subtitle">Enroll students in course offerings</p></div>
        <button onClick={openCreate} className="btn-primary" id="add-enrollment-btn"><PlusIcon className="w-5 h-5" /> Enroll Student</button>
      </div>
      <DataTable columns={columns} data={data} pagination={pagination} loading={loading}
        onPageChange={(p) => setQuery(q => ({ ...q, page: p }))} />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Enroll Student">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="form-label">Student</label><select className="form-input" {...register('student_id', { required: 'Required' })}><option value="">Select</option>{students.map(s => <option key={s.student_id} value={s.student_id}>{s.user?.username} ({s.roll_no})</option>)}</select></div>
          <div><label className="form-label">Course Offering</label><select className="form-input" {...register('offering_id', { required: 'Required' })}><option value="">Select</option>{offerings.map(o => <option key={o.offering_id} value={o.offering_id}>{o.course?.course_code} - {o.course?.course_name} (Sem {o.semester}, {o.year})</option>)}</select></div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Enroll</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Remove Enrollment" message="Remove this student from the course?" />
    </motion.div>
  );
};
export default EnrollmentsPage;
