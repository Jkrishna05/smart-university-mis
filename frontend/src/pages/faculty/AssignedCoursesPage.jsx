import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';

const AssignedCoursesPage = () => {
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffering, setSelectedOffering] = useState(null);

  useEffect(() => {
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    try {
      const res = await api.get('/course-offerings/my-offerings');
      setOfferings(res.data.data);
    } catch (error) {
      console.error('Failed to fetch assigned courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'course_code', label: 'Code', render: (r) => r.course?.course_code },
    { key: 'course_name', label: 'Course Name', render: (r) => r.course?.course_name },
    { key: 'credits', label: 'Credits', render: (r) => r.course?.credits },
    { key: 'semester', label: 'Semester' },
    { key: 'year', label: 'Year' },
    { key: 'section', label: 'Section' },
    { key: 'students_count', label: 'Enrolled Students', render: (r) => r.enrollments?.length || 0 },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (r) => (
        <button
          onClick={() => setSelectedOffering(r)}
          className="btn-secondary text-xs"
        >
          View Students
        </button>
      )
    }
  ];

  const studentColumns = [
    { key: 'roll_no', label: 'Roll No', render: (e) => e.student?.roll_no },
    { key: 'name', label: 'Student Name', render: (e) => e.student?.user?.username },
    { key: 'email', label: 'Email', render: (e) => e.student?.user?.email }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Assigned Courses</h1>
        <p className="page-subtitle">Courses assigned to you for teaching</p>
      </div>

      <DataTable columns={columns} data={offerings} loading={loading} />

      <Modal
        isOpen={!!selectedOffering}
        onClose={() => setSelectedOffering(null)}
        title={`Enrolled Students - ${selectedOffering?.course?.course_name} (Section ${selectedOffering?.section})`}
        size="lg"
      >
        <DataTable
          columns={studentColumns}
          data={selectedOffering?.enrollments || []}
          loading={false}
        />
      </Modal>
    </motion.div>
  );
};

export default AssignedCoursesPage;
