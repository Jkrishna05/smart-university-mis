import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-campus-parchment-100">
        <div className="w-12 h-12 border-4 border-campus-navy-200 border-t-campus-navy-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectMap = {
      Admin: '/admin/dashboard',
      Faculty: '/faculty/dashboard',
      Student: '/student/dashboard'
    };
    return <Navigate to={redirectMap[user.role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;
