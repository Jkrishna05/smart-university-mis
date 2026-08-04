import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { PlusIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useForm } from 'react-hook-form';

const CoursesPage = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [query, setQuery] = useState({ page: 1, search: '' });
  const { register, handleSubmit, reset } = useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: query.page, limit: 10, ...(query.search && { search: query.search }) });
      const res = await api.get(`/courses?${params}`);
      setData(res.data.data); setPagination(res.data.pagination);
    } catch (e) { toast.error('Failed to fetch courses'); } finally { setLoading(false); }
  }, [query]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { api.get('/departments?limit=100').then(r => setDepartments(r.data.data)).catch(() => {}); }, []);

  const openCreate = () => { setEditing(null); reset({ department_id: '', course_name: '', course_code: '', credits: 3 }); setModalOpen(true); };
  const openEdit = (item) => { setEditing(item); reset({ department_id: item.department_id, course_name: item.course_name, course_code: item.course_code, credits: item.credits }); setModalOpen(true); };

  const onSubmit = async (formData) => {
    try {
      if (editing) { await api.put(`/courses/${editing.course_id}`, formData); toast.success('Course updated'); }
      else { await api.post('/courses', formData); toast.success('Course created'); }
      setModalOpen(false); fetchData();
    } catch (error) { toast.error(error.response?.data?.message || 'Operation failed'); }
  };

  const handleDelete = async () => {
    try { await api.delete(`/courses/${deleteTarget.course_id}`); toast.success('Course deleted'); setDeleteTarget(null); fetchData(); }
    catch (error) { toast.error(error.response?.data?.message || 'Delete failed'); }
  };

  const columns = [
    { key: 'course_code', label: 'Code', sortable: true },
    { key: 'course_name', label: 'Course Name', sortable: true },
    { key: 'department', label: 'Department', render: (r) => r.department?.department_name },
    { key: 'credits', label: 'Credits', sortable: true },
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
        <div><h1 className="page-title">Courses</h1><p className="page-subtitle">Manage university courses</p></div>
        <button onClick={openCreate} className="btn-primary" id="add-course-btn"><PlusIcon className="w-5 h-5" /> Add Course</button>
      </div>
      <DataTable columns={columns} data={data} pagination={pagination} loading={loading}
        onPageChange={(p) => setQuery(q => ({ ...q, page: p }))} onSearch={(s) => setQuery(q => ({ ...q, search: s, page: 1 }))} />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Course' : 'Add Course'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="form-label">Department</label><select className="form-input" {...register('department_id', { required: 'Required' })}><option value="">Select</option>{departments.map(d => <option key={d.department_id} value={d.department_id}>{d.department_name}</option>)}</select></div>
          <div><label className="form-label">Course Name</label><input className="form-input" {...register('course_name', { required: 'Required' })} /></div>
          <div><label className="form-label">Course Code</label><input className="form-input" {...register('course_code', { required: 'Required' })} /></div>
          <div><label className="form-label">Credits</label><input type="number" min="1" max="6" className="form-input" {...register('credits', { required: 'Required' })} /></div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Course" message="This action cannot be undone." />
    </motion.div>
  );
};
export default CoursesPage;
