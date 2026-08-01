import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import DataTable from '../../components/DataTable';

const StudentAttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/attendance/my-attendance?page=${page}&limit=10`)
      .then(res => {
        setAttendance(res.data.data || []);
        setPagination(res.data.pagination);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const columns = [
    { key: 'course', label: 'Course', render: (r) => r.courseOffering?.course?.course_name },
    { key: 'code', label: 'Course Code', render: (r) => r.courseOffering?.course?.course_code },
    { key: 'date', label: 'Date', render: (r) => new Date(r.date).toLocaleDateString() },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span className={
          r.status === 'Present' ? 'badge-success' : r.status === 'Absent' ? 'badge-danger' : 'badge-warning'
        }>
          {r.status}
        </span>
      )
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">My Attendance</h1>
        <p className="page-subtitle">Track your class attendance history</p>
      </div>

      <DataTable
        columns={columns}
        data={attendance}
        pagination={pagination}
        onPageChange={setPage}
        loading={loading}
      />
    </motion.div>
  );
};

export default StudentAttendancePage;
