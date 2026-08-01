import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { PlusIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useForm } from 'react-hook-form';

const UsersPage = () => {
  const [data, setData] = useState([]); const [pagination, setPagination] = useState(null); const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false); const [editing, setEditing] = useState(null); const [deleteTarget, setDeleteTarget] = useState(null);
  const [query, setQuery] = useState({ page: 1, search: '' });
  const { register, handleSubmit, reset } = useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const params = new URLSearchParams({ page: query.page, limit: 10, ...(query.search && { search: query.search }) }); const res = await api.get(`/users?${params}`); setData(res.data.data); setPagination(res.data.pagination); }
    catch (e) { toast.error('Failed'); } finally { setLoading(false); }
  }, [query]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => { setEditing(null); reset({ username: '', email: '', password: '', role: 'Student', status: 'active' }); setModalOpen(true); };
  const openEdit = (item) => { setEditing(item); reset({ username: item.username, email: item.email, role: item.role, status: item.status, password: '' }); setModalOpen(true); };

  const onSubmit = async (formData) => {
    try {
      const payload = { ...formData };
      if (editing && !payload.password) delete payload.password;
      if (editing) { await api.put(`/users/${editing.id}`, payload); toast.success('Updated'); }
      else { await api.post('/users', payload); toast.success('Created'); }
      setModalOpen(false); fetchData();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async () => {
    try { await api.delete(`/users/${deleteTarget.id}`); toast.success('Deleted'); setDeleteTarget(null); fetchData(); }
    catch (error) { toast.error(error.response?.data?.message || 'Failed'); }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'username', label: 'Username', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', render: (r) => <span className="badge-info">{r.role}</span> },
    { key: 'status', label: 'Status', render: (r) => <span className={r.status === 'active' ? 'badge-success' : 'badge-danger'}>{r.status}</span> },
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
        <div><h1 className="page-title">Users</h1><p className="page-subtitle">Manage system users</p></div>
        <button onClick={openCreate} className="btn-primary" id="add-user-btn"><PlusIcon className="w-5 h-5" /> Add User</button>
      </div>
      <DataTable columns={columns} data={data} pagination={pagination} loading={loading}
        onPageChange={(p) => setQuery(q => ({ ...q, page: p }))} onSearch={(s) => setQuery(q => ({ ...q, search: s, page: 1 }))} />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit User' : 'Add User'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="form-label">Username</label><input className="form-input" {...register('username', { required: 'Required' })} /></div>
          <div><label className="form-label">Email</label><input type="email" className="form-input" {...register('email', { required: 'Required' })} /></div>
          <div><label className="form-label">{editing ? 'New Password (leave empty to keep)' : 'Password'}</label><input type="password" className="form-input" {...register('password', { ...(!editing && { required: 'Required' }) })} /></div>
          <div><label className="form-label">Role</label><select className="form-input" {...register('role', { required: 'Required' })}><option value="Student">Student</option><option value="Faculty">Faculty</option><option value="Admin">Admin</option></select></div>
          <div><label className="form-label">Status</label><select className="form-input" {...register('status')}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
          <div className="flex justify-end gap-3 pt-4 border-t"><button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button></div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete User" message="This will permanently delete this user account." />
    </motion.div>
  );
};
export default UsersPage;
