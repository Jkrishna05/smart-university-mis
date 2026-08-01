import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import DataTable from '../../components/DataTable';

const MyCoursesPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enrollments/my-enrollments')
      .then(res => setEnrollments(res.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'code', label: 'Course Code', render: (r) => r.courseOffering?.course?.course_code },
    { key: 'name', label: 'Course Name', render: (r) => r.courseOffering?.course?.course_name },
    { key: 'credits', label: 'Credits', render: (r) => r.courseOffering?.course?.credits },
    { key: 'instructor', label: 'Instructor', render: (r) => r.courseOffering?.faculty?.user?.username },
    { key: 'section', label: 'Section', render: (r) => r.courseOffering?.section },
    { key: 'semester', label: 'Semester', render: (r) => r.courseOffering?.semester },
    { key: 'year', label: 'Year', render: (r) => r.courseOffering?.year }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">My Courses</h1>
        <p className="page-subtitle">Courses you are currently enrolled in</p>
      </div>

      <DataTable columns={columns} data={enrollments} loading={loading} />
    </motion.div>
  );
};

export default MyCoursesPage;
