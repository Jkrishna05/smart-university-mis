import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  CheckCircleIcon,
  CalendarIcon,
  MegaphoneIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const defaultNotifications = [
  {
    id: 1,
    title: 'Mid-Term Examinations Announced',
    message: 'Mid-Term exams for CS201, CS301, and CS302 scheduled from Sept 15, 2025.',
    time: '10m ago',
    type: 'exam',
    unread: true
  },
  {
    id: 2,
    title: 'End-Term Schedule Published',
    message: 'End-Term examinations schedule is now published in your Exam Schedule tab.',
    time: '1h ago',
    type: 'schedule',
    unread: true
  },
  {
    id: 3,
    title: 'Section A & B Course Enrollments Active',
    message: 'All 100 students have been enrolled across Section A & B for Semester 3.',
    time: '3h ago',
    type: 'info',
    unread: true
  }
];

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(defaultNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/90 border-b border-slate-200/80">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
            id="menu-toggle-btn"
          >
            <Bars3Icon className="w-5 h-5 text-slate-600" />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold text-campus-navy-900">
              {user?.role} Dashboard
            </h1>
            <p className="text-xs text-slate-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Semester Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-campus-gold-50 border border-campus-gold-200">
            <span className="text-[11px] font-bold text-campus-gold-700">🎓 Fall Semester 2025</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-600"
              id="notification-bell-btn"
            >
              <BellIcon className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-campus-burgundy-600 rounded-full ring-2 ring-white animate-ping"></span>
              )}
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-campus-burgundy-600 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-academic-lg overflow-hidden z-50 p-0"
                >
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-campus-navy-50">
                    <div className="flex items-center gap-2">
                      <BellIcon className="w-5 h-5 text-campus-navy-600" />
                      <h3 className="font-bold text-sm text-campus-navy-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="badge-info text-xs">{unreadCount} new</span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-campus-navy-600 hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications right now
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors ${
                            n.unread ? 'bg-campus-navy-50/50' : ''
                          }`}
                        >
                          <div className="p-2 rounded-lg bg-campus-navy-100 text-campus-navy-600 flex-shrink-0 mt-0.5">
                            {n.type === 'exam' ? (
                              <CalendarIcon className="w-4 h-4" />
                            ) : n.type === 'schedule' ? (
                              <CheckCircleIcon className="w-4 h-4" />
                            ) : (
                              <MegaphoneIcon className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-slate-800">{n.title}</h4>
                              <span className="text-[10px] text-slate-400">{n.time}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 leading-snug">{n.message}</p>
                          </div>
                          <button
                            onClick={() => clearNotification(n.id)}
                            className="text-slate-400 hover:text-slate-600 text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 border-t border-slate-200 bg-slate-50 text-center">
                    <p className="text-[11px] text-slate-400">Notifications auto-sync with university schedule</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User info */}
          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-700">{user?.username}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-campus-navy-700 to-campus-navy-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">{user?.username?.charAt(0)}</span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
            id="logout-btn"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
