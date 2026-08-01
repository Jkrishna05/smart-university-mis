import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../../services/api';

const FacultyAttendancePage = () => {
  const [offerings, setOfferings] = useState([]);
  const [selectedOffering, setSelectedOffering] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/course-offerings/my-offerings').then((res) => {
      setOfferings(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedOffering(res.data.data[0].offering_id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedOffering && date) {
      fetchAttendanceData();
    }
  }, [selectedOffering, date]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      // Get offering details to get enrolled students
      const offRes = await api.get(`/course-offerings/${selectedOffering}`);
      const enrollments = offRes.data.data.enrollments || [];
      const studentList = enrollments.map(e => e.student);
      setStudents(studentList);

      // Get existing attendance for this offering & date
      const attRes = await api.get(`/attendance/offering?offering_id=${selectedOffering}&date=${date}`);
      const existing = attRes.data.data || [];

      const initialMap = {};
      studentList.forEach(s => {
        const found = existing.find(a => a.student_id === s.student_id);
        initialMap[s.student_id] = found ? found.status : 'Present';
      });
      setAttendanceMap(initialMap);
    } catch (error) {
      toast.error('Failed to load students for attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const records = Object.keys(attendanceMap).map(student_id => ({
        student_id: parseInt(student_id, 10),
        status: attendanceMap[student_id]
      }));

      await api.post('/attendance/bulk', {
        offering_id: parseInt(selectedOffering, 10),
        date,
        records
      });

      toast.success('Attendance saved successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Manage Attendance</h1>
        <p className="page-subtitle">Mark and update student attendance</p>
      </div>

      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="form-label">Select Course Offering</label>
            <select
              className="form-input"
              value={selectedOffering}
              onChange={(e) => setSelectedOffering(e.target.value)}
            >
              {offerings.map(o => (
                <option key={o.offering_id} value={o.offering_id}>
                  {o.course?.course_code} - {o.course?.course_name} (Section {o.section})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 py-6">
            <div className="shimmer h-12 rounded-xl"></div>
            <div className="shimmer h-12 rounded-xl"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No students enrolled in this offering.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Student Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.student_id}>
                      <td className="font-semibold">{s.roll_no}</td>
                      <td>{s.user?.username}</td>
                      <td>
                        <div className="flex gap-2">
                          {['Present', 'Absent', 'Late'].map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleStatusChange(s.student_id, st)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                attendanceMap[s.student_id] === st
                                  ? st === 'Present'
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : st === 'Absent'
                                    ? 'bg-red-600 text-white shadow-md'
                                    : 'bg-amber-500 text-white shadow-md'
                                  : 'bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-dark-muted hover:bg-gray-200'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                id="save-attendance-btn"
              >
                {submitting ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default FacultyAttendancePage;
