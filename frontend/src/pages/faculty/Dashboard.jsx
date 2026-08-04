import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import StatsCard from '../../components/StatsCard';
import ChartWidget from '../../components/ChartWidget';
import { BookOpenIcon, UserGroupIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const FacultyDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profRes, offRes] = await Promise.all([
        api.get('/faculty/me/profile'),
        api.get('/course-offerings/my-offerings')
      ]);
      setProfile(profRes.data.data);
      setOfferings(offRes.data.data);
    } catch (error) {
      console.error('Error fetching faculty dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card p-6"><div className="shimmer h-20 rounded-xl"></div></div>
          ))}
        </div>
      </div>
    );
  }

  const totalStudents = offerings.reduce((acc, curr) => acc + (curr.enrollments?.length || 0), 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="page-header">
        <h1 className="page-title">Welcome back, {profile?.user?.username}</h1>
        <p className="page-subtitle">{profile?.designation} • {profile?.department?.department_name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Assigned Courses" value={offerings.length} icon={BookOpenIcon} color="primary" />
        <StatsCard title="Total Enrolled Students" value={totalStudents} icon={UserGroupIcon} color="emerald" />
        <StatsCard title="Department" value={profile?.department?.department_name || 'N/A'} icon={CalendarDaysIcon} color="amber" />
      </div>

      {/* Assigned Courses List */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Current Course Offerings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offerings.map((offering) => (
            <div key={offering.offering_id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
              <div className="flex justify-between items-start">
                <div>
                  <span className="badge-info text-xs">{offering.course?.course_code}</span>
                  <h4 className="font-bold text-gray-900 mt-1">{offering.course?.course_name}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Semester {offering.semester} ({offering.year}) • Section {offering.section}
                  </p>
                </div>
                <span className="badge-success">{offering.enrollments?.length || 0} Students</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FacultyDashboard;
