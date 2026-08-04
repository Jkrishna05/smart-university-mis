import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { PlusIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { useForm } from 'react-hook-form';

const HostelsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/hostels');
      setData(res.data.data);
    } catch (e) {
      toast.error('Failed to fetch hostels');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    api.get('/students?limit=500').then(r => setStudents(r.data.data)).catch(() => {});
  }, [fetchData]);

  const openCreate = () => {
    reset({
      student_id: students[0]?.student_id || '',
      hostel_name: 'Aryabhata Boys Hostel',
      block: 'Block A',
      room_no: 'A-101',
      warden_name: 'Dr. S. K. Nandi',
      warden_phone: '9876500112'
    });
    setModalOpen(true);
  };

  const onSubmit = async (formData) => {
    try {
      await api.post('/hostels', formData);
      toast.success('Room allocated successfully');
      setModalOpen(false);
      fetchData();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to allocate room');
    }
  };

  const columns = [
    { key: 'student_name', label: 'Student', render: (r) => r.student?.user?.username },
    { key: 'roll_no', label: 'Roll No', render: (r) => r.student?.roll_no },
    { key: 'hostel_name', label: 'Hostel Name' },
    { key: 'block', label: 'Block' },
    { key: 'room_no', label: 'Room No', render: (r) => <span className="badge-gold">{r.room_no}</span> },
    { key: 'warden_name', label: 'Warden Name' },
    { key: 'warden_phone', label: 'Warden Contact' },
    { key: 'status', label: 'Status', render: (r) => <span className="badge-success">{r.status}</span> }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Hostel & Accommodation Management</h1>
          <p className="page-subtitle">Manage campus hostel buildings, room allocations, and warden details</p>
        </div>
        <button onClick={openCreate} className="btn-primary" id="add-hostel-btn">
          <BuildingOffice2Icon className="w-5 h-5" /> Allocate Room
        </button>
      </div>

      <DataTable columns={columns} data={data} loading={loading} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Allocate Hostel Room">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label">Student</label>
            <select className="form-input" {...register('student_id', { required: 'Required' })}>
              {students.map(s => (
                <option key={s.student_id} value={s.student_id}>{s.user?.username} ({s.roll_no})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Hostel Building</label>
            <input className="form-input" {...register('hostel_name', { required: 'Required' })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Block</label>
              <input className="form-input" {...register('block', { required: 'Required' })} />
            </div>
            <div>
              <label className="form-label">Room Number</label>
              <input className="form-input" {...register('room_no', { required: 'Required' })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Warden Name</label>
              <input className="form-input" {...register('warden_name', { required: 'Required' })} />
            </div>
            <div>
              <label className="form-label">Warden Phone</label>
              <input className="form-input" {...register('warden_phone', { required: 'Required' })} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Allocate</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default HostelsPage;
