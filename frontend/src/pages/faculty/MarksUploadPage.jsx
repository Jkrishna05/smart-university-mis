import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../../services/api';

const MarksUploadPage = () => {
  const [offerings, setOfferings] = useState([]);
  const [selectedOffering, setSelectedOffering] = useState('');
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [students, setStudents] = useState([]);
  const [marksMap, setMarksMap] = useState({});
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
    if (selectedOffering) {
      // Find course for this offering
      const off = offerings.find(o => String(o.offering_id) === String(selectedOffering));
      if (off) {
        api.get(`/exams?course_id=${off.course_id}`).then(res => {
          setExams(res.data.data);
          if (res.data.data.length > 0) {
            setSelectedExam(res.data.data[0].exam_id);
          } else {
            setSelectedExam('');
          }
        });
      }
    }
  }, [selectedOffering, offerings]);

  useEffect(() => {
    if (selectedOffering && selectedExam) {
      fetchStudentMarks();
    }
  }, [selectedOffering, selectedExam]);

  const fetchStudentMarks = async () => {
    setLoading(true);
    try {
      const offRes = await api.get(`/course-offerings/${selectedOffering}`);
      const enrollments = offRes.data.data.enrollments || [];
      const studentList = enrollments.map(e => e.student);
      setStudents(studentList);

      const resRes = await api.get(`/results?exam_id=${selectedExam}`);
      const existingResults = resRes.data.data || [];

      const initialMap = {};
      studentList.forEach(s => {
        const found = existingResults.find(r => r.student_id === s.student_id);
        initialMap[s.student_id] = {
          marks: found ? found.marks : '',
          result_id: found ? found.result_id : null
        };
      });
      setMarksMap(initialMap);
    } catch (error) {
      toast.error('Failed to load students for marks upload');
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (studentId, value) => {
    setMarksMap(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], marks: value }
    }));
  };

  const handleSaveMarks = async (studentId) => {
    const item = marksMap[studentId];
    if (item.marks === '') return;

    try {
      if (item.result_id) {
        await api.put(`/results/${item.result_id}`, { marks: parseFloat(item.marks) });
        toast.success('Marks updated');
      } else {
        const res = await api.post('/results', {
          student_id: studentId,
          exam_id: parseInt(selectedExam, 10),
          marks: parseFloat(item.marks)
        });
        setMarksMap(prev => ({
          ...prev,
          [studentId]: { ...prev[studentId], result_id: res.data.data.result_id }
        }));
        toast.success('Marks uploaded');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save marks');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Marks Upload</h1>
        <p className="page-subtitle">Upload and update exam marks for your students</p>
      </div>

      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="form-label">Course Offering</label>
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
            <label className="form-label">Select Exam</label>
            <select
              className="form-input"
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
            >
              {exams.length === 0 ? (
                <option value="">No exams created for this course</option>
              ) : (
                exams.map(ex => (
                  <option key={ex.exam_id} value={ex.exam_id}>
                    {ex.exam_name} (Total: {ex.total_marks})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="shimmer h-24 rounded-xl"></div>
        ) : !selectedExam ? (
          <div className="text-center py-8 text-gray-500">Please select an exam to upload marks.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Marks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.student_id}>
                    <td className="font-semibold">{s.roll_no}</td>
                    <td>{s.user?.username}</td>
                    <td>
                      <input
                        type="number"
                        step="0.1"
                        className="form-input w-32"
                        placeholder="Marks"
                        value={marksMap[s.student_id]?.marks || ''}
                        onChange={(e) => handleMarksChange(s.student_id, e.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleSaveMarks(s.student_id)}
                        className="btn-primary text-xs"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MarksUploadPage;
