import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import {
  HomeIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  DocumentArrowUpIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { path: '/faculty/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/faculty/assigned-courses', label: 'Assigned Courses', icon: BookOpenIcon },
  { path: '/faculty/attendance', label: 'Attendance', icon: CalendarDaysIcon },
  { path: '/faculty/marks-upload', label: 'Marks Upload', icon: DocumentArrowUpIcon },
  { path: '/faculty/exam-schedule', label: 'Schedule Exams', icon: ClockIcon },
  { path: '/faculty/messages', label: 'Student Messages', icon: ChatBubbleLeftRightIcon },
  { path: '/faculty/profile', label: 'Profile', icon: UserCircleIcon }
];

const FacultyLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuToggle = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen(prev => !prev);
    } else {
      setCollapsed(prev => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-campus-parchment-100">
      <Sidebar
        items={navItems}
        title="OIT PORTAL"
        subtitle="Faculty Portal"
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className={`transition-all duration-300 ml-0 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <Navbar onMenuToggle={handleMenuToggle} />
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FacultyLayout;
