import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { CalendarDaysIcon, FunnelIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import DataTable from '../../components/DataTable';

const AdminAttendancePage = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offerings, setOfferings] = useState([]);
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedOffering, setSelectedOffering] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get('/course-offerings?limit=100').then((res) => {
      const list = res.data.data || [];
      setOfferings(list);
    });
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(selectedSection && { section: selectedSection }),
        ...(selectedOffering && { offering_id: selectedOffering }),
        ...(selectedDate && { date: selectedDate })
      });
      const res = await api.get(`/attendance?${params}`);
      setData(res.data.data || []);
      setPagination(res.data.pagination);
    } catch (e) {
      toast.error('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  }, [page, selectedSection, selectedOffering, selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    {
      key: 'serial',
      label: 'Serial #',
      render: (_, index) => <span className="font-mono text-campus-gold-600 font-bold">#{(page - 1) * 10 + index + 1}</span>
    },
    { key: 'roll_no', label: 'Roll No', render: (r) => <span className="badge-gold font-mono">{r.student?.roll_no}</span> },
    { key: 'student_name', label: 'Student Name (Alphabetical)', render: (r) => <strong className="text-white">{r.student?.user?.username}</strong> },
    { key: 'course', label: 'Course Code', render: (r) => r.courseOffering?.course?.course_code },
    { key: 'course_name', label: 'Course Name', render: (r) => r.courseOffering?.course?.course_name },
    { key: 'section', label: 'Class Section', render: (r) => <span className="badge-info">Section {r.courseOffering?.section}</span> },
    { key: 'date', label: 'Date', render: (r) => new Date(r.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) },
    {
      key: 'status',
      label: 'Attendance Status',
      render: (r) => (
        <span className={r.status === 'Present' ? 'badge-success' : r.status === 'Absent' ? 'badge-danger' : 'badge-warning'}>
          {r.status}
        </span>
      )
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Section-wise Attendance Log</h1>
          <p className="page-subtitle">Inspect daily student attendance filtered by Section A and Section B</p>
        </div>
      </div>

      {/* Section & Course Filter Bar */}
      <div className="glass-card p-6 border-l-4 border-campus-navy-500">
        <div className="flex items-center gap-2 mb-4">
          <FunnelIcon className="w-5 h-5 text-campus-gold-600" />
          <h3 className="text-sm font-bold text-campus-navy-900 uppercase tracking-wider">Attendance Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Section Filter Pills */}
          <div>
            <label className="form-label">Filter by Class Section</label>
            <div className="flex gap-2 pt-1">
              {['A', 'B', ''].map((sec) => (
                <button
                  key={sec || 'ALL'}
                  type="button"
                  onClick={() => { setSelectedSection(sec); setPage(1); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedSection === sec
                      ? 'bg-gradient-to-r from-campus-navy-700 to-campus-navy-600 text-campus-navy-900 shadow-lg shadow-campus-navy-500/20 border border-campus-navy-300'
                      : 'bg-slate-50 text-slate-500 hover:bg-white border border-slate-200'
                  }`}
                >
                  {sec ? `Section ${sec}` : 'All Sections'}
                </button>
              ))}
            </div>
          </div>

          {/* Course Offering Select */}
          <div>
            <label className="form-label">Course Subject</label>
            <select
              className="form-input"
              value={selectedOffering}
              onChange={(e) => { setSelectedOffering(e.target.value); setPage(1); }}
            >
              <option value="">All Course Subjects</option>
              {offerings.map((o) => (
                <option key={o.offering_id} value={o.offering_id}>
                  {o.course?.course_code} - {o.course?.course_name} (Section {o.section})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="form-label">Filter Date</label>
            <input
              type="date"
              className="form-input"
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setPage(1); }}
            />
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        loading={loading}
        onPageChange={setPage}
      />
    </motion.div>
  );
};

export default AdminAttendancePage;
