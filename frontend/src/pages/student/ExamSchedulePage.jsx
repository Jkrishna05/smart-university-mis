import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import DataTable from '../../components/DataTable';

const ExamSchedulePage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/exams/my-schedule')
      .then(res => setExams(res.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'course_code', label: 'Course Code', render: (r) => r.course?.course_code },
    { key: 'course_name', label: 'Course Name', render: (r) => r.course?.course_name },
    { key: 'exam_name', label: 'Exam Name' },
    { key: 'total_marks', label: 'Total Marks' },
    { key: 'exam_date', label: 'Date', render: (r) => new Date(r.exam_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Exam Schedule</h1>
        <p className="page-subtitle">Upcoming and scheduled examinations for your courses</p>
      </div>

      <DataTable columns={columns} data={exams} loading={loading} />
    </motion.div>
  );
};

export default ExamSchedulePage;
