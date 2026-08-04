import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { PlusIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { useForm } from 'react-hook-form';

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/events');
      setEvents(res.data.data);
    } catch (e) {
      toast.error('Failed to fetch campus events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreate = () => {
    reset({
      title: '',
      description: '',
      event_type: 'Workshop',
      event_date: new Date().toISOString().split('T')[0],
      location: 'Main Auditorium'
    });
    setModalOpen(true);
  };

  const onSubmit = async (formData) => {
    try {
      await api.post('/events', formData);
      toast.success('Campus event scheduled successfully');
      setModalOpen(false);
      fetchData();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to schedule event');
    }
  };

  const columns = [
    { key: 'title', label: 'Event Title', sortable: true },
    { key: 'event_type', label: 'Type', render: (r) => <span className="badge-gold">{r.event_type}</span> },
    { key: 'event_date', label: 'Date', render: (r) => new Date(r.event_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) },
    { key: 'location', label: 'Location' },
    { key: 'description', label: 'Description', render: (r) => <span className="text-xs text-slate-500">{r.description || 'N/A'}</span> }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">University Events & Calendar</h1>
          <p className="page-subtitle">Schedule workshops, hackathons, seminars, cultural fests, and academic holidays</p>
        </div>
        <button onClick={openCreate} className="btn-primary" id="add-event-btn">
          <PlusIcon className="w-5 h-5" /> Schedule Event
        </button>
      </div>

      <DataTable columns={columns} data={events} loading={loading} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Schedule University Event">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="form-label">Event Title</label><input className="form-input" {...register('title', { required: 'Required' })} /></div>
          <div>
            <label className="form-label">Event Type</label>
            <select className="form-input" {...register('event_type')}>
              <option value="Workshop">Workshop / Hackathon</option>
              <option value="Seminar">Seminar / Keynote</option>
              <option value="Cultural">Cultural Fest</option>
              <option value="Sports">Sports Meet</option>
              <option value="Academic">Academic Schedule</option>
              <option value="Holiday">University Holiday</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="form-label">Event Date</label><input type="date" className="form-input" {...register('event_date', { required: 'Required' })} /></div>
            <div><label className="form-label">Venue / Location</label><input className="form-input" {...register('location', { required: 'Required' })} /></div>
          </div>
          <div><label className="form-label">Event Description</label><textarea className="form-input" rows="3" {...register('description')}></textarea></div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Schedule</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default AdminEventsPage;
