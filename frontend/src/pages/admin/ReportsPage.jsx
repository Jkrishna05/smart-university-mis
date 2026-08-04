import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import ChartWidget from '../../components/ChartWidget';
import DataTable from '../../components/DataTable';

const ReportsPage = () => {
  const [deptStudents, setDeptStudents] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [enrollmentTrends, setEnrollmentTrends] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [logsPagination, setLogsPagination] = useState(null);
  const [logsPage, setLogsPage] = useState(1);

  useEffect(() => {
    Promise.all([
      api.get('/reports/department-students'),
      api.get('/reports/attendance-summary'),
      api.get('/reports/grade-distribution'),
      api.get('/reports/enrollment-trends')
    ]).then(([dept, att, grade, enroll]) => {
      setDeptStudents(dept.data.data);
      setAttendanceSummary(att.data.data);
      setGradeDistribution(grade.data.data);
      setEnrollmentTrends(enroll.data.data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    api.get(`/reports/audit-logs?page=${logsPage}&limit=10`).then(res => {
      setAuditLogs(res.data.data); setLogsPagination(res.data.pagination);
    }).catch(() => {});
  }, [logsPage]);

  const logColumns = [
    { key: 'user', label: 'User', render: (r) => r.user?.username || 'System' },
    { key: 'action', label: 'Action', render: (r) => <span className="badge-info">{r.action}</span> },
    { key: 'entity', label: 'Entity' },
    { key: 'entity_id', label: 'Entity ID' },
    { key: 'ip_address', label: 'IP' },
    { key: 'created_at', label: 'Time', render: (r) => new Date(r.created_at).toLocaleString() }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="page-header"><h1 className="page-title">Reports & Analytics</h1><p className="page-subtitle">University data insights</p></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWidget type="bar" title="Students by Department" labels={deptStudents.map(d => d.department_name)} datasets={[{ label: 'Students', data: deptStudents.map(d => d.student_count) }]} />
        <ChartWidget type="doughnut" title="Attendance Distribution" labels={attendanceSummary.map(a => a.status)} datasets={[{ data: attendanceSummary.map(a => a.count) }]} />
        <ChartWidget type="pie" title="Grade Distribution" labels={gradeDistribution.map(g => g.grade || 'N/A')} datasets={[{ data: gradeDistribution.map(g => g.count) }]} />
        <ChartWidget type="line" title="Enrollment Trends" labels={enrollmentTrends.map(e => `Sem ${e.semester} (${e.year})`)} datasets={[{ label: 'Enrollments', data: enrollmentTrends.map(e => e.enrollment_count) }]} />
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Audit Logs</h2>
        <DataTable columns={logColumns} data={auditLogs} pagination={logsPagination} onPageChange={setLogsPage} />
      </div>
    </motion.div>
  );
};
export default ReportsPage;
