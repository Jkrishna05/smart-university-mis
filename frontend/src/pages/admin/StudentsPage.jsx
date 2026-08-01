import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { PlusIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useForm } from 'react-hook-form';

const StudentsPage = () => {
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
      const res = await api.get(`/students?${params}`);
      setData(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) { toast.error('Failed to fetch students'); }
    finally { setLoading(false); }
  }, [query]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const loadUnassignedUsers = async () => {
    try {
      const [deptRes, userRes, studRes] = await Promise.all([
        api.get('/departments?limit=100'),
        api.get('/users?limit=100&role=Student'),
        api.get('/students?limit=500')
      ]);
      setDepartments(deptRes.data.data);

      const existingUserIds = new Set((studRes.data.data || []).map(s => s.user_id));
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
    reset({ user_id: '', department_id: '', roll_no: '', registration_no: '', semester: '', year: new Date().getFullYear(), phone: '', address: '', guardian_name: '', guardian_phone: '' });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    reset({ department_id: item.department_id, roll_no: item.roll_no, registration_no: item.registration_no, semester: item.semester, year: item.year, phone: item.phone || '', address: item.address || '', guardian_name: item.guardian_name || '', guardian_phone: item.guardian_phone || '' });
    setModalOpen(true);
  };

  const onSubmit = async (formData) => {
    try {
      if (editing) {
        await api.put(`/students/${editing.student_id}`, formData);
        toast.success('Student updated successfully');
      } else {
        await api.post('/students', formData);
        toast.success('Student created successfully');
      }
      setModalOpen(false);
      fetchData();
      loadUnassignedUsers();
    } catch (error) { toast.error(error.response?.data?.message || 'Operation failed'); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/students/${deleteTarget.student_id}`);
      toast.success('Student deleted successfully');
      setDeleteTarget(null);
      fetchData();
      loadUnassignedUsers();
    } catch (error) { toast.error(error.response?.data?.message || 'Delete failed'); }
  };

  const columns = [
    { key: 'roll_no', label: 'Roll No', sortable: true },
    { key: 'name', label: 'Name', render: (row) => row.user?.username || 'N/A' },
    { key: 'email', label: 'Email', render: (row) => row.user?.email || 'N/A' },
    { key: 'department', label: 'Department', render: (row) => row.department?.department_name || 'N/A' },
    { key: 'semester', label: 'Semester', sortable: true },
    { key: 'year', label: 'Year', sortable: true },
    { key: 'status', label: 'Status', render: (row) => (
      <span className={row.user?.status === 'active' ? 'badge-success' : 'badge-danger'}>{row.user?.status}</span>
    )},
    { key: 'actions', label: 'Actions', sortable: false, render: (row) => (
      <div className="flex gap-2">
        <button onClick={() => openEdit(row)} className="text-primary-600 hover:text-primary-800 text-sm font-medium">Edit</button>
        <button onClick={() => setDeleteTarget(row)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
      </div>
    )}
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="page-title">Students</h1><p className="page-subtitle">Manage student records</p></div>
        <button onClick={openCreate} className="btn-primary" id="add-student-btn"><PlusIcon className="w-5 h-5" /> Add Student</button>
      </div>

      <DataTable columns={columns} data={data} pagination={pagination} loading={loading}
        onPageChange={(p) => setQuery(q => ({ ...q, page: p }))}
        onSearch={(s) => setQuery(q => ({ ...q, search: s, page: 1 }))}
        onSort={(key, dir) => setQuery(q => ({ ...q, sortBy: key, sortOrder: dir }))}
        onExportExcel={() => window.open(`${api.defaults.baseURL}/students/export/excel`, '_blank')}
        onExportPdf={() => window.open(`${api.defaults.baseURL}/students/export/pdf`, '_blank')}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Student' : 'Add Student'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!editing && (
            <div>
              <label className="form-label">User Account</label>
              {unassignedUsers.length === 0 ? (
                <p className="text-xs text-amber-600 dark:text-amber-400 p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                  ⚠️ No unassigned Student users found. Please create a new User with Role <strong>Student</strong> in the <strong>Users</strong> menu first.
                </p>
              ) : (
                <select className="form-input" {...register('user_id', { required: 'User is required' })}>
                  <option value="">Select User Account</option>
                  {unassignedUsers.map(u => <option key={u.id} value={u.id}>{u.username} ({u.email})</option>)}
                </select>
              )}
              {errors.user_id && <p className="text-xs text-red-500 mt-1">{errors.user_id.message}</p>}
            </div>
          )}
          <div>
            <label className="form-label">Department</label>
            <select className="form-input" {...register('department_id', { required: 'Department is required' })}>
              <option value="">Select Department</option>
              {departments.map(d => <option key={d.department_id} value={d.department_id}>{d.department_name}</option>)}
            </select>
          </div>
          <div><label className="form-label">Roll No</label><input className="form-input" {...register('roll_no', { required: 'Required' })} /></div>
          <div><label className="form-label">Registration No</label><input className="form-input" {...register('registration_no', { required: 'Required' })} /></div>
          <div><label className="form-label">Semester</label><input type="number" min="1" max="8" className="form-input" {...register('semester', { required: 'Required', min: 1, max: 8 })} /></div>
          <div><label className="form-label">Year</label><input type="number" className="form-input" {...register('year', { required: 'Required' })} /></div>
          <div><label className="form-label">Phone</label><input className="form-input" {...register('phone')} /></div>
          <div><label className="form-label">Guardian Name</label><input className="form-input" {...register('guardian_name')} /></div>
          <div><label className="form-label">Guardian Phone</label><input className="form-input" {...register('guardian_phone')} /></div>
          <div className="md:col-span-2"><label className="form-label">Address</label><textarea className="form-input" rows="2" {...register('address')}></textarea></div>
          <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-dark-border">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={!editing && unassignedUsers.length === 0} className="btn-primary">{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Student" message="Are you sure you want to delete this student? This action cannot be undone." />
    </motion.div>
  );
};

export default StudentsPage;
