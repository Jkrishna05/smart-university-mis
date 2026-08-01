import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  SunIcon,
  MoonIcon,
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
  const { darkMode, toggleDarkMode } = useTheme();
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
    <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/80 dark:bg-dark-card/80 border-b border-gray-100 dark:border-dark-border">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
            id="menu-toggle-btn"
          >
            <Bars3Icon className="w-5 h-5 text-gray-600 dark:text-dark-muted" />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
              {user?.role} Dashboard
            </h1>
            <p className="text-xs text-gray-400 dark:text-dark-muted">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
            id="theme-toggle-btn"
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5 text-amber-400" />
            ) : (
              <MoonIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-border transition-colors text-gray-600 dark:text-dark-muted"
              id="notification-bell-btn"
            >
              <BellIcon className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-dark-card animate-ping"></span>
              )}
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-dark-card"></span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 glass-card shadow-2xl overflow-hidden z-50 p-0"
                >
                  <div className="p-4 border-b border-gray-100 dark:border-dark-border flex items-center justify-between bg-primary-50/50 dark:bg-primary-900/10">
                    <div className="flex items-center gap-2">
                      <BellIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="badge-info text-xs">{unreadCount} new</span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-dark-border">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-gray-400 dark:text-dark-muted">
                        No notifications right now
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3.5 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-dark-border/40 transition-colors ${
                            n.unread ? 'bg-primary-50/20 dark:bg-primary-900/10' : ''
                          }`}
                        >
                          <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5">
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
                              <h4 className="text-xs font-bold text-gray-900 dark:text-white">{n.title}</h4>
                              <span className="text-[10px] text-gray-400">{n.time}</span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-dark-muted mt-1 leading-snug">{n.message}</p>
                          </div>
                          <button
                            onClick={() => clearNotification(n.id)}
                            className="text-gray-400 hover:text-gray-600 text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 border-t border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg/50 text-center">
                    <p className="text-[11px] text-gray-400">Notifications auto-sync with university schedule</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User info */}
          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-dark-border">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700 dark:text-white">{user?.username}</p>
              <p className="text-xs text-gray-400 dark:text-dark-muted">{user?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-white text-sm font-bold">{user?.username?.charAt(0)}</span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
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
