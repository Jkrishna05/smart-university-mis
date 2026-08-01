import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import DataTable from '../../components/DataTable';

const StudentResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/results/my-results')
      .then(res => setResults(res.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'course', label: 'Course', render: (r) => r.exam?.course?.course_name },
    { key: 'code', label: 'Course Code', render: (r) => r.exam?.course?.course_code },
    { key: 'exam', label: 'Exam Name', render: (r) => r.exam?.exam_name },
    { key: 'marks', label: 'Marks Obtained', render: (r) => r.marks },
    { key: 'grade', label: 'Grade', render: (r) => (
      <span className={`badge ${['A', 'A-'].includes(r.grade) ? 'badge-success' : r.grade === 'F' ? 'badge-danger' : 'badge-info'}`}>
        {r.grade}
      </span>
    )}
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">My Results</h1>
        <p className="page-subtitle">View your exam grades and academic performance</p>
      </div>

      <DataTable columns={columns} data={results} loading={loading} />
    </motion.div>
  );
};

export default StudentResultsPage;
