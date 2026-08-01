import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { PlusIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useForm } from 'react-hook-form';

const FacultyExamSchedulePage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [offerings, setOfferings] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const offRes = await api.get('/course-offerings/my-offerings');
      const myOfferings = offRes.data.data || [];
      setOfferings(myOfferings);

      const courseIds = [...new Set(myOfferings.map(o => o.course_id))];
      if (courseIds.length > 0) {
        const examsRes = await api.get(`/exams?limit=100`);
        const myExams = (examsRes.data.data || []).filter(e => courseIds.includes(e.course_id));
        setData(myExams);
      } else {
        setData([]);
      }
    } catch (e) {
      toast.error('Failed to fetch exam schedules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreate = () => {
    setEditing(null);
    reset({ course_id: offerings[0]?.course_id || '', exam_name: 'Mid-Term Examination', total_marks: 50, exam_date: new Date().toISOString().split('T')[0] });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    reset({ course_id: item.course_id, exam_name: item.exam_name, total_marks: item.total_marks, exam_date: item.exam_date });
    setModalOpen(true);
  };

  const onSubmit = async (formData) => {
    try {
      if (editing) {
        await api.put(`/exams/${editing.exam_id}`, formData);
        toast.success('Exam updated successfully');
      } else {
        await api.post('/exams', formData);
        toast.success('Exam scheduled successfully!');
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save exam schedule');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/exams/${deleteTarget.exam_id}`);
      toast.success('Exam schedule deleted');
      setDeleteTarget(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to delete exam');
    }
  };

  const columns = [
    { key: 'exam_name', label: 'Exam Type / Title', sortable: true },
    { key: 'course', label: 'Course', render: (r) => `${r.course?.course_code} - ${r.course?.course_name}` },
    { key: 'total_marks', label: 'Total Marks' },
    { key: 'exam_date', label: 'Date', render: (r) => new Date(r.exam_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (r) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(r)} className="text-primary-600 hover:text-primary-800 text-sm font-medium">Edit</button>
          <button onClick={() => setDeleteTarget(r)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
        </div>
      )
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Schedule Exams</h1>
          <p className="page-subtitle">Schedule Mid-Term & End-Term examinations for your courses</p>
        </div>
        <button onClick={openCreate} className="btn-primary" id="schedule-exam-btn">
          <PlusIcon className="w-5 h-5" /> Schedule New Exam
        </button>
      </div>

      <DataTable columns={columns} data={data} loading={loading} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Scheduled Exam' : 'Schedule New Exam'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label">Course</label>
            <select className="form-input" {...register('course_id', { required: 'Required' })}>
              {offerings.map(o => (
                <option key={o.offering_id} value={o.course_id}>
                  {o.course?.course_code} - {o.course?.course_name} (Sec {o.section})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Exam Type / Name</label>
            <select className="form-input" {...register('exam_name', { required: 'Required' })}>
              <option value="Mid-Term Examination">Mid-Term Examination</option>
              <option value="End-Term Examination">End-Term Examination</option>
              <option value="Class Test / Quiz">Class Test / Quiz</option>
              <option value="Practical / Lab Exam">Practical / Lab Exam</option>
            </select>
          </div>
          <div>
            <label className="form-label">Total Marks</label>
            <input type="number" className="form-input" {...register('total_marks', { required: 'Required', min: 1 })} />
          </div>
          <div>
            <label className="form-label">Exam Date</label>
            <input type="date" className="form-input" {...register('exam_date', { required: 'Required' })} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-dark-border">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editing ? 'Update Schedule' : 'Publish Schedule'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Cancel Exam Schedule" message="Are you sure you want to remove this scheduled exam?" />
    </motion.div>
  );
};

export default FacultyExamSchedulePage;
