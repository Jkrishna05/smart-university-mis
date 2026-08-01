import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { PlusIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useForm } from 'react-hook-form';

const DepartmentsPage = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [query, setQuery] = useState({ page: 1, search: '' });
  const { register, handleSubmit, reset } = useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: query.page, limit: 10, ...(query.search && { search: query.search }) });
      const res = await api.get(`/departments?${params}`);
      setData(res.data.data); setPagination(res.data.pagination);
    } catch (e) { toast.error('Failed to fetch departments'); } finally { setLoading(false); }
  }, [query]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => { setEditing(null); reset({ department_name: '' }); setModalOpen(true); };
  const openEdit = (item) => { setEditing(item); reset({ department_name: item.department_name }); setModalOpen(true); };

  const onSubmit = async (formData) => {
    try {
      if (editing) { await api.put(`/departments/${editing.department_id}`, formData); toast.success('Department updated'); }
      else { await api.post('/departments', formData); toast.success('Department created'); }
      setModalOpen(false); fetchData();
    } catch (error) { toast.error(error.response?.data?.message || 'Operation failed'); }
  };

  const handleDelete = async () => {
    try { await api.delete(`/departments/${deleteTarget.department_id}`); toast.success('Department deleted'); setDeleteTarget(null); fetchData(); }
    catch (error) { toast.error(error.response?.data?.message || 'Cannot delete department with existing records'); }
  };

  const columns = [
    { key: 'department_id', label: 'ID' },
    { key: 'department_name', label: 'Department Name', sortable: true },
    { key: 'created_at', label: 'Created', render: (r) => new Date(r.created_at).toLocaleDateString() },
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
        <div><h1 className="page-title">Departments</h1><p className="page-subtitle">Manage university departments</p></div>
        <button onClick={openCreate} className="btn-primary" id="add-dept-btn"><PlusIcon className="w-5 h-5" /> Add Department</button>
      </div>
      <DataTable columns={columns} data={data} pagination={pagination} loading={loading}
        onPageChange={(p) => setQuery(q => ({ ...q, page: p }))} onSearch={(s) => setQuery(q => ({ ...q, search: s, page: 1 }))} />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Department' : 'Add Department'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="form-label">Department Name</label><input className="form-input" {...register('department_name', { required: 'Required' })} /></div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-dark-border">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Department" message="This will fail if the department has students, faculty or courses." />
    </motion.div>
  );
};

export default DepartmentsPage;
