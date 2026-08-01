import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { PlusIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useForm } from 'react-hook-form';

const ResultsPage = () => {
  const [data, setData] = useState([]); const [pagination, setPagination] = useState(null); const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false); const [editing, setEditing] = useState(null); const [deleteTarget, setDeleteTarget] = useState(null);
  const [students, setStudents] = useState([]); const [exams, setExams] = useState([]);
  const [query, setQuery] = useState({ page: 1 });
  const { register, handleSubmit, reset } = useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await api.get(`/results?page=${query.page}&limit=10`); setData(res.data.data); setPagination(res.data.pagination); }
    catch (e) { toast.error('Failed'); } finally { setLoading(false); }
  }, [query]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    api.get('/students?limit=100').then(r => setStudents(r.data.data)).catch(() => {});
    api.get('/exams?limit=100').then(r => setExams(r.data.data)).catch(() => {});
  }, []);

  const openCreate = () => { setEditing(null); reset({ student_id: '', exam_id: '', marks: '', grade: '' }); setModalOpen(true); };
  const openEdit = (item) => { setEditing(item); reset({ marks: item.marks, grade: item.grade }); setModalOpen(true); };

  const onSubmit = async (formData) => {
    try {
      if (editing) { await api.put(`/results/${editing.result_id}`, formData); toast.success('Updated'); }
      else { await api.post('/results', formData); toast.success('Created'); }
      setModalOpen(false); fetchData();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async () => {
    try { await api.delete(`/results/${deleteTarget.result_id}`); toast.success('Deleted'); setDeleteTarget(null); fetchData(); }
    catch (error) { toast.error('Failed'); }
  };

  const columns = [
    { key: 'student', label: 'Student', render: (r) => r.student?.user?.username },
    { key: 'exam', label: 'Exam', render: (r) => r.exam?.exam_name },
    { key: 'course', label: 'Course', render: (r) => r.exam?.course?.course_name },
    { key: 'marks', label: 'Marks' },
    { key: 'grade', label: 'Grade', render: (r) => (
      <span className={`badge ${['A', 'A-'].includes(r.grade) ? 'badge-success' : ['F'].includes(r.grade) ? 'badge-danger' : 'badge-info'}`}>{r.grade}</span>
    )},
    { key: 'actions', label: 'Actions', sortable: false, render: (r) => (
      <div className="flex gap-2">
        <button onClick={() => openEdit(r)} className="text-primary-600 hover:text-primary-800 text-sm font-medium">Edit</button>
        <button onClick={() => setDeleteTarget(r)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
      </div>
    )}
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="page-title">Results</h1><p className="page-subtitle">Manage exam results</p></div>
        <button onClick={openCreate} className="btn-primary" id="add-result-btn"><PlusIcon className="w-5 h-5" /> Add Result</button>
      </div>
      <DataTable columns={columns} data={data} pagination={pagination} loading={loading} onPageChange={(p) => setQuery(q => ({ ...q, page: p }))} />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Result' : 'Add Result'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!editing && (<><div><label className="form-label">Student</label><select className="form-input" {...register('student_id', { required: 'Required' })}><option value="">Select</option>{students.map(s => <option key={s.student_id} value={s.student_id}>{s.user?.username} ({s.roll_no})</option>)}</select></div>
          <div><label className="form-label">Exam</label><select className="form-input" {...register('exam_id', { required: 'Required' })}><option value="">Select</option>{exams.map(e => <option key={e.exam_id} value={e.exam_id}>{e.exam_name} - {e.course?.course_name}</option>)}</select></div></>)}
          <div><label className="form-label">Marks</label><input type="number" step="0.01" className="form-input" {...register('marks', { required: 'Required' })} /></div>
          <div><label className="form-label">Grade (auto-calculated if empty)</label><input className="form-input" {...register('grade')} placeholder="Leave empty for auto" /></div>
          <div className="flex justify-end gap-3 pt-4 border-t"><button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button></div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Result" message="This action cannot be undone." />
    </motion.div>
  );
};
export default ResultsPage;
