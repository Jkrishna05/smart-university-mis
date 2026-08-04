import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import FacultyLayout from './layouts/FacultyLayout';
import StudentLayout from './layouts/StudentLayout';

// Auth
import LoginPage from './pages/auth/LoginPage';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import StudentsPage from './pages/admin/StudentsPage';
import FacultyPage from './pages/admin/FacultyPage';
import DepartmentsPage from './pages/admin/DepartmentsPage';
import CoursesPage from './pages/admin/CoursesPage';
import CourseOfferingsPage from './pages/admin/CourseOfferingsPage';
import EnrollmentsPage from './pages/admin/EnrollmentsPage';
import AdminAttendancePage from './pages/admin/AttendancePage';
import ExamsPage from './pages/admin/ExamsPage';
import ResultsPage from './pages/admin/ResultsPage';
import AdminFeesPage from './pages/admin/FeesPage';
import AdminHostelsPage from './pages/admin/HostelsPage';
import AdminLibraryPage from './pages/admin/LibraryPage';
import AdminInventoryPage from './pages/admin/InventoryPage';
import AdminEventsPage from './pages/admin/EventsPage';
import UsersPage from './pages/admin/UsersPage';
import ReportsPage from './pages/admin/ReportsPage';

// Faculty Pages
import FacultyDashboard from './pages/faculty/Dashboard';
import AssignedCoursesPage from './pages/faculty/AssignedCoursesPage';
import FacultyAttendancePage from './pages/faculty/AttendancePage';
import MarksUploadPage from './pages/faculty/MarksUploadPage';
import FacultyExamSchedulePage from './pages/faculty/ExamSchedulePage';
import FacultyMessagesPage from './pages/faculty/MessagesPage';
import FacultyProfilePage from './pages/faculty/ProfilePage';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import MyCoursesPage from './pages/student/MyCoursesPage';
import StudentAttendancePage from './pages/student/AttendancePage';
import StudentResultsPage from './pages/student/ResultsPage';
import StudentTranscriptPage from './pages/student/TranscriptPage';
import ExamSchedulePage from './pages/student/ExamSchedulePage';
import StudentFeesPage from './pages/student/FeesPage';
import StudentHostelPage from './pages/student/HostelPage';
import StudentLibraryPage from './pages/student/LibraryPage';
import StudentMessagesPage from './pages/student/MessagesPage';
import StudentEventsPage from './pages/student/EventsPage';
import StudentProfilePage from './pages/student/ProfilePage';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-campus-parchment-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-campus-navy-500 border-t-campus-gold-400 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-500 font-medium">Loading University MIS...</p>
        </div>
      </div>
    );
  }

  const getRedirectPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'Admin': return '/admin/dashboard';
      case 'Faculty': return '/faculty/dashboard';
      case 'Student': return '/student/dashboard';
      default: return '/login';
    }
  };

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={user ? <Navigate to={getRedirectPath()} replace /> : <LoginPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin']}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="faculty" element={<FacultyPage />} />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="course-offerings" element={<CourseOfferingsPage />} />
        <Route path="enrollments" element={<EnrollmentsPage />} />
        <Route path="attendance" element={<AdminAttendancePage />} />
        <Route path="exams" element={<ExamsPage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="fees" element={<AdminFeesPage />} />
        <Route path="hostels" element={<AdminHostelsPage />} />
        <Route path="library" element={<AdminLibraryPage />} />
        <Route path="inventory" element={<AdminInventoryPage />} />
        <Route path="events" element={<AdminEventsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>

      {/* Faculty Routes */}
      <Route path="/faculty" element={<ProtectedRoute allowedRoles={['Faculty']}><FacultyLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<FacultyDashboard />} />
        <Route path="assigned-courses" element={<AssignedCoursesPage />} />
        <Route path="attendance" element={<FacultyAttendancePage />} />
        <Route path="marks-upload" element={<MarksUploadPage />} />
        <Route path="exam-schedule" element={<FacultyExamSchedulePage />} />
        <Route path="messages" element={<FacultyMessagesPage />} />
        <Route path="profile" element={<FacultyProfilePage />} />
      </Route>

      {/* Student Routes */}
      <Route path="/student" element={<ProtectedRoute allowedRoles={['Student']}><StudentLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="my-courses" element={<MyCoursesPage />} />
        <Route path="attendance" element={<StudentAttendancePage />} />
        <Route path="results" element={<StudentResultsPage />} />
        <Route path="transcript" element={<StudentTranscriptPage />} />
        <Route path="exam-schedule" element={<ExamSchedulePage />} />
        <Route path="fees" element={<StudentFeesPage />} />
        <Route path="hostel" element={<StudentHostelPage />} />
        <Route path="library" element={<StudentLibraryPage />} />
        <Route path="messages" element={<StudentMessagesPage />} />
        <Route path="events" element={<StudentEventsPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to={getRedirectPath()} replace />} />
    </Routes>
  );
}

export default App;
