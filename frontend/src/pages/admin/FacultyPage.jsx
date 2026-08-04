import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { PlusIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useForm } from 'react-hook-form';

const FacultyPage = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [unassignedUsers, setUnassignedUsers] = useState([]);
  const [query, setQuery] = useState({ page: 1, search: '', sortBy: '', sortOrder: 'ASC' });
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: query.page, limit: 10, ...(query.search && { search: query.search }), ...(query.sortBy && { sortBy: query.sortBy, sortOrder: query.sortOrder }) });
      const res = await api.get(`/faculty?${params}`);
      setData(res.data.data); setPagination(res.data.pagination);
    } catch (e) { toast.error('Failed to fetch faculty'); } finally { setLoading(false); }
  }, [query]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const loadUnassignedUsers = async () => {
    try {
      const [deptRes, userRes, facRes] = await Promise.all([
        api.get('/departments?limit=100'),
        api.get('/users?limit=100&role=Faculty'),
        api.get('/faculty?limit=500')
      ]);
      setDepartments(deptRes.data.data);

      const existingUserIds = new Set((facRes.data.data || []).map(f => f.user_id));
      const unassigned = (userRes.data.data || []).filter(u => !existingUserIds.has(u.id));
      setUnassignedUsers(unassigned);
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
    }
  };

  useEffect(() => {
    loadUnassignedUsers();
  }, []);

  const openCreate = () => {
    setEditing(null);
    loadUnassignedUsers();
    reset({ user_id: '', department_id: '', designation: '', qualification: '', phone: '' });
    setModalOpen(true);
  };

  const openEdit = (item) => { setEditing(item); reset({ department_id: item.department_id, designation: item.designation, qualification: item.qualification || '', phone: item.phone || '' }); setModalOpen(true); };

  const onSubmit = async (formData) => {
    try {
      if (editing) { await api.put(`/faculty/${editing.faculty_id}`, formData); toast.success('Faculty updated'); }
      else { await api.post('/faculty', formData); toast.success('Faculty created'); }
      setModalOpen(false); fetchData(); loadUnassignedUsers();
    } catch (error) { toast.error(error.response?.data?.message || 'Operation failed'); }
  };

  const handleDelete = async () => {
    try { await api.delete(`/faculty/${deleteTarget.faculty_id}`); toast.success('Faculty deleted'); setDeleteTarget(null); fetchData(); loadUnassignedUsers(); }
    catch (error) { toast.error(error.response?.data?.message || 'Delete failed'); }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (r) => r.user?.username },
    { key: 'email', label: 'Email', render: (r) => r.user?.email },
    { key: 'department', label: 'Department', render: (r) => r.department?.department_name },
    { key: 'designation', label: 'Designation' },
    { key: 'qualification', label: 'Qualification' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status', render: (r) => <span className={r.user?.status === 'active' ? 'badge-success' : 'badge-danger'}>{r.user?.status}</span> },
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
        <div><h1 className="page-title">Faculty</h1><p className="page-subtitle">Manage faculty members</p></div>
        <button onClick={openCreate} className="btn-primary" id="add-faculty-btn"><PlusIcon className="w-5 h-5" /> Add Faculty</button>
      </div>
      <DataTable columns={columns} data={data} pagination={pagination} loading={loading}
        onPageChange={(p) => setQuery(q => ({ ...q, page: p }))}
        onSearch={(s) => setQuery(q => ({ ...q, search: s, page: 1 }))}
        onSort={(k, d) => setQuery(q => ({ ...q, sortBy: k, sortOrder: d }))}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Faculty' : 'Add Faculty'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!editing && (
            <div>
              <label className="form-label">User Account</label>
              {unassignedUsers.length === 0 ? (
                <p className="text-xs text-amber-600 p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                  ⚠️ No unassigned Faculty users found. Please create a new User with Role <strong>Faculty</strong> in the <strong>Users</strong> menu first.
                </p>
              ) : (
                <select className="form-input" {...register('user_id', { required: 'Required' })}>
                  <option value="">Select User Account</option>
                  {unassignedUsers.map(u => <option key={u.id} value={u.id}>{u.username} ({u.email})</option>)}
                </select>
              )}
            </div>
          )}
          <div><label className="form-label">Department</label><select className="form-input" {...register('department_id', { required: 'Required' })}><option value="">Select</option>{departments.map(d => <option key={d.department_id} value={d.department_id}>{d.department_name}</option>)}</select></div>
          <div><label className="form-label">Designation</label><input className="form-input" {...register('designation', { required: 'Required' })} /></div>
          <div><label className="form-label">Qualification</label><input className="form-input" {...register('qualification')} /></div>
          <div><label className="form-label">Phone</label><input className="form-input" {...register('phone')} /></div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={!editing && unassignedUsers.length === 0} className="btn-primary">{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Faculty" message="This action cannot be undone." />
    </motion.div>
  );
};

export default FacultyPage;
