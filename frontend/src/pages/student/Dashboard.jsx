import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import StatsCard from '../../components/StatsCard';
import { BookOpenIcon, CalendarDaysIcon, ChartBarIcon, AcademicCapIcon, SparklesIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profRes, enrRes, attRes, resRes] = await Promise.all([
        api.get('/students/me/profile'),
        api.get('/enrollments/my-enrollments'),
        api.get('/attendance/my-attendance'),
        api.get('/results/my-results')
      ]);
      setProfile(profRes.data.data);
      setEnrollments(enrRes.data.data || []);
      setAttendance(attRes.data.data || []);
      setResults(resRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch student dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="shimmer h-48 rounded-xl"></div>;

  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 100;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* University Student Hero Banner */}
      <div className="academic-hero">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-amber-500/20 flex-shrink-0 border-2 border-white/20">
              {profile?.user?.username?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="badge-gold text-[10px]">Academic Passport</span>
                <span className="text-xs text-indigo-300 font-semibold">• Semester {profile?.semester} ({profile?.year})</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Welcome, {profile?.user?.username}
              </h1>
              <p className="text-xs text-indigo-200 mt-1 font-medium">
                Roll No: <span className="text-amber-400 font-mono font-bold">{profile?.roll_no}</span> • {profile?.department?.department_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-2xl border border-indigo-500/30 backdrop-blur-xl">
            <div className="text-center px-4 border-r border-indigo-900/60">
              <p className="text-[10px] font-bold uppercase text-indigo-300">CGPA</p>
              <p className="text-xl font-extrabold text-amber-400">3.85</p>
            </div>
            <div className="text-center px-4 border-r border-indigo-900/60">
              <p className="text-[10px] font-bold uppercase text-indigo-300">Attendance</p>
              <p className={`text-xl font-extrabold ${attendanceRate >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {attendanceRate}%
              </p>
            </div>
            <div className="text-center px-4">
              <p className="text-[10px] font-bold uppercase text-indigo-300">Section</p>
              <p className="text-xl font-extrabold text-indigo-300">Sec A</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Enrolled Courses" value={enrollments.length} icon={BookOpenIcon} color="primary" />
        <StatsCard title="Attendance Rate" value={`${attendanceRate}%`} icon={CalendarDaysIcon} color={attendanceRate >= 75 ? 'emerald' : 'amber'} />
        <StatsCard title="Exams Graded" value={results.length} icon={ChartBarIcon} color="violet" />
      </div>

      {/* Enrolled Courses Section */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <AcademicCapIcon className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Current Enrolled Courses</h3>
          </div>
          <span className="badge-info">{enrollments.length} Active Courses</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrollments.map((e) => {
            const course = e.courseOffering?.course;
            const faculty = e.courseOffering?.faculty;
            return (
              <div key={e.enrollment_id} className="p-5 rounded-2xl border border-slate-700/80 bg-slate-900/60 hover:border-indigo-500/40 transition-all">
                <div className="flex justify-between items-start">
                  <span className="badge-gold text-xs">{course?.course_code}</span>
                  <span className="text-xs font-semibold text-slate-400">{course?.credits} Credits</span>
                </div>
                <h4 className="font-bold text-white text-base mt-2">{course?.course_name}</h4>
                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Instructor: <strong className="text-slate-200">{faculty?.user?.username || 'Faculty Member'}</strong></span>
                  <span className="badge-info text-[10px]">Section {e.courseOffering?.section}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;
