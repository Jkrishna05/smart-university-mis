import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { PlusIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useForm } from 'react-hook-form';

const CourseOfferingsPage = () => {
  const [data, setData] = useState([]); const [pagination, setPagination] = useState(null); const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false); const [editing, setEditing] = useState(null); const [deleteTarget, setDeleteTarget] = useState(null);
  const [courses, setCourses] = useState([]); const [faculty, setFaculty] = useState([]);
  const [query, setQuery] = useState({ page: 1, search: '' });
  const { register, handleSubmit, reset } = useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const params = new URLSearchParams({ page: query.page, limit: 10, ...(query.search && { search: query.search }) }); const res = await api.get(`/course-offerings?${params}`); setData(res.data.data); setPagination(res.data.pagination); }
    catch (e) { toast.error('Failed to fetch'); } finally { setLoading(false); }
  }, [query]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    api.get('/courses?limit=100').then(r => setCourses(r.data.data)).catch(() => {});
    api.get('/faculty?limit=100').then(r => setFaculty(r.data.data)).catch(() => {});
  }, []);

  const openCreate = () => { setEditing(null); reset({ course_id: '', faculty_id: '', semester: '', year: new Date().getFullYear(), section: 'A' }); setModalOpen(true); };
  const openEdit = (item) => { setEditing(item); reset({ course_id: item.course_id, faculty_id: item.faculty_id, semester: item.semester, year: item.year, section: item.section }); setModalOpen(true); };

  const onSubmit = async (formData) => {
    try {
      if (editing) { await api.put(`/course-offerings/${editing.offering_id}`, formData); toast.success('Updated'); }
      else { await api.post('/course-offerings', formData); toast.success('Created'); }
      setModalOpen(false); fetchData();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async () => {
    try { await api.delete(`/course-offerings/${deleteTarget.offering_id}`); toast.success('Deleted'); setDeleteTarget(null); fetchData(); }
    catch (error) { toast.error(error.response?.data?.message || 'Failed'); }
  };

  const columns = [
    { key: 'course', label: 'Course', render: (r) => `${r.course?.course_code} - ${r.course?.course_name}` },
    { key: 'faculty', label: 'Faculty', render: (r) => r.faculty?.user?.username },
    { key: 'semester', label: 'Semester' }, { key: 'year', label: 'Year' }, { key: 'section', label: 'Section' },
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
        <div><h1 className="page-title">Course Offerings</h1><p className="page-subtitle">Assign faculty to courses</p></div>
        <button onClick={openCreate} className="btn-primary" id="add-offering-btn"><PlusIcon className="w-5 h-5" /> Add Offering</button>
      </div>
      <DataTable columns={columns} data={data} pagination={pagination} loading={loading}
        onPageChange={(p) => setQuery(q => ({ ...q, page: p }))} onSearch={(s) => setQuery(q => ({ ...q, search: s, page: 1 }))} />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Offering' : 'Add Offering'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="form-label">Course</label><select className="form-input" {...register('course_id', { required: 'Required' })}><option value="">Select</option>{courses.map(c => <option key={c.course_id} value={c.course_id}>{c.course_code} - {c.course_name}</option>)}</select></div>
          <div><label className="form-label">Faculty</label><select className="form-input" {...register('faculty_id', { required: 'Required' })}><option value="">Select</option>{faculty.map(f => <option key={f.faculty_id} value={f.faculty_id}>{f.user?.username} - {f.designation}</option>)}</select></div>
          <div><label className="form-label">Semester</label><input type="number" min="1" max="8" className="form-input" {...register('semester', { required: 'Required' })} /></div>
          <div><label className="form-label">Year</label><input type="number" className="form-input" {...register('year', { required: 'Required' })} /></div>
          <div><label className="form-label">Section</label><input className="form-input" {...register('section')} /></div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-dark-border">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Offering" message="This action cannot be undone." />
    </motion.div>
  );
};
export default CourseOfferingsPage;
