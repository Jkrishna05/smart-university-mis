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

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-950">
      <Sidebar items={navItems} title="STATE UNIVERSITY" subtitle="Faculty Portal" collapsed={collapsed} />
      <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <Navbar onMenuToggle={() => setCollapsed(!collapsed)} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FacultyLayout;
