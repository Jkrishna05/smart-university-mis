import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const FacultyProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/faculty/me/profile').then(res => {
      setProfile(res.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="shimmer h-48 rounded-xl"></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Faculty profile details</p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-dark-border">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold">
            {profile?.user?.username?.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile?.user?.username}</h2>
            <p className="text-sm text-gray-500 dark:text-dark-muted">{profile?.designation}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-semibold text-gray-500">Email:</span> <p className="text-gray-900 dark:text-white mt-0.5">{profile?.user?.email}</p></div>
          <div><span className="font-semibold text-gray-500">Department:</span> <p className="text-gray-900 dark:text-white mt-0.5">{profile?.department?.department_name}</p></div>
          <div><span className="font-semibold text-gray-500">Qualification:</span> <p className="text-gray-900 dark:text-white mt-0.5">{profile?.qualification || 'N/A'}</p></div>
          <div><span className="font-semibold text-gray-500">Phone:</span> <p className="text-gray-900 dark:text-white mt-0.5">{profile?.phone || 'N/A'}</p></div>
        </div>
      </div>
    </motion.div>
  );
};

export default FacultyProfilePage;
