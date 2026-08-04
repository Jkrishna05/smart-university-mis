import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { PlusIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useForm } from 'react-hook-form';

const ExamsPage = () => {
  const [data, setData] = useState([]); const [pagination, setPagination] = useState(null); const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false); const [editing, setEditing] = useState(null); const [deleteTarget, setDeleteTarget] = useState(null);
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState({ page: 1, search: '' });
  const { register, handleSubmit, reset } = useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const params = new URLSearchParams({ page: query.page, limit: 10, ...(query.search && { search: query.search }) }); const res = await api.get(`/exams?${params}`); setData(res.data.data); setPagination(res.data.pagination); }
    catch (e) { toast.error('Failed'); } finally { setLoading(false); }
  }, [query]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { api.get('/courses?limit=100').then(r => setCourses(r.data.data)).catch(() => {}); }, []);

  const openCreate = () => { setEditing(null); reset({ course_id: '', exam_name: '', total_marks: 100, exam_date: '' }); setModalOpen(true); };
  const openEdit = (item) => { setEditing(item); reset({ course_id: item.course_id, exam_name: item.exam_name, total_marks: item.total_marks, exam_date: item.exam_date }); setModalOpen(true); };

  const onSubmit = async (formData) => {
    try {
      if (editing) { await api.put(`/exams/${editing.exam_id}`, formData); toast.success('Updated'); }
      else { await api.post('/exams', formData); toast.success('Created'); }
      setModalOpen(false); fetchData();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async () => {
    try { await api.delete(`/exams/${deleteTarget.exam_id}`); toast.success('Deleted'); setDeleteTarget(null); fetchData(); }
    catch (error) { toast.error('Failed'); }
  };

  const columns = [
    { key: 'exam_name', label: 'Exam Name', sortable: true },
    { key: 'course', label: 'Course', render: (r) => `${r.course?.course_code} - ${r.course?.course_name}` },
    { key: 'total_marks', label: 'Total Marks' },
    { key: 'exam_date', label: 'Date', render: (r) => new Date(r.exam_date).toLocaleDateString() },
    { key: 'actions', label: 'Actions', sortable: false, render: (r) => (
      <div className="flex gap-2">
        <button onClick={() => openEdit(r)} className="text-campus-navy-600 hover:text-campus-navy-800 text-sm font-medium">Edit</button>
        <button onClick={() => setDeleteTarget(r)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
      </div>
    )}
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="page-title">Exams</h1><p className="page-subtitle">Manage examinations</p></div>
        <button onClick={openCreate} className="btn-primary" id="add-exam-btn"><PlusIcon className="w-5 h-5" /> Add Exam</button>
      </div>
      <DataTable columns={columns} data={data} pagination={pagination} loading={loading}
        onPageChange={(p) => setQuery(q => ({ ...q, page: p }))} onSearch={(s) => setQuery(q => ({ ...q, search: s, page: 1 }))} />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Exam' : 'Add Exam'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="form-label">Course</label><select className="form-input" {...register('course_id', { required: 'Required' })}><option value="">Select</option>{courses.map(c => <option key={c.course_id} value={c.course_id}>{c.course_code} - {c.course_name}</option>)}</select></div>
          <div><label className="form-label">Exam Name</label><input className="form-input" {...register('exam_name', { required: 'Required' })} /></div>
          <div><label className="form-label">Total Marks</label><input type="number" className="form-input" {...register('total_marks', { required: 'Required' })} /></div>
          <div><label className="form-label">Exam Date</label><input type="date" className="form-input" {...register('exam_date', { required: 'Required' })} /></div>
          <div className="flex justify-end gap-3 pt-4 border-t"><button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button></div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Exam" message="This action cannot be undone." />
    </motion.div>
  );
};
export default ExamsPage;
