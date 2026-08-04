import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import StatsCard from '../../components/StatsCard';
import ChartWidget from '../../components/ChartWidget';
import { AcademicCapIcon, UserGroupIcon, BuildingOfficeIcon, BookOpenIcon, ClipboardDocumentCheckIcon, UsersIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [deptStudents, setDeptStudents] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, deptRes, attendRes, gradeRes] = await Promise.all([
        api.get('/reports/dashboard'),
        api.get('/reports/department-students'),
        api.get('/reports/attendance-summary'),
        api.get('/reports/grade-distribution')
      ]);
      setStats(statsRes.data.data);
      setDeptStudents(deptRes.data.data);
      setAttendanceSummary(attendRes.data.data);
      setGradeDistribution(gradeRes.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-6"><div className="shimmer h-20 rounded-xl"></div></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Overview of the university management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard title="Total Students" value={stats?.totalStudents || 0} icon={AcademicCapIcon} color="primary" />
        <StatsCard title="Total Faculty" value={stats?.totalFaculty || 0} icon={UserGroupIcon} color="emerald" />
        <StatsCard title="Departments" value={stats?.totalDepartments || 0} icon={BuildingOfficeIcon} color="amber" />
        <StatsCard title="Total Courses" value={stats?.totalCourses || 0} icon={BookOpenIcon} color="violet" />
        <StatsCard title="Total Enrollments" value={stats?.totalEnrollments || 0} icon={ClipboardDocumentCheckIcon} color="cyan" />
        <StatsCard title="Active Users" value={stats?.activeUsers || 0} icon={UsersIcon} color="rose" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWidget
          type="bar"
          title="Students by Department"
          labels={deptStudents.map(d => d.department_name)}
          datasets={[{ label: 'Students', data: deptStudents.map(d => d.student_count) }]}
        />
        <ChartWidget
          type="doughnut"
          title="Attendance Distribution"
          labels={attendanceSummary.map(a => a.status)}
          datasets={[{ data: attendanceSummary.map(a => a.count) }]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWidget
          type="pie"
          title="Grade Distribution"
          labels={gradeDistribution.map(g => g.grade || 'N/A')}
          datasets={[{ data: gradeDistribution.map(g => g.count) }]}
        />
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h3>
          <div className="space-y-4">
            {deptStudents.map((dept, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <span className="text-sm font-medium text-gray-700">{dept.department_name}</span>
                <span className="badge-info">{dept.student_count} students</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
