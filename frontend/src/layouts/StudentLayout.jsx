import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import {
  HomeIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ClockIcon,
  BanknotesIcon,
  BuildingOffice2Icon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { path: '/student/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/student/my-courses', label: 'My Courses', icon: BookOpenIcon },
  { path: '/student/attendance', label: 'Attendance', icon: CalendarDaysIcon },
  { path: '/student/results', label: 'Results & Grades', icon: ChartBarIcon },
  { path: '/student/transcript', label: 'Degree Transcript', icon: AcademicCapIcon },
  { path: '/student/exam-schedule', label: 'Exam Schedule', icon: ClockIcon },
  { path: '/student/fees', label: 'Fee Details', icon: BanknotesIcon },
  { path: '/student/hostel', label: 'My Hostel', icon: BuildingOffice2Icon },
  { path: '/student/library', label: 'Library Catalog', icon: BookOpenIcon },
  { path: '/student/messages', label: 'Ask Faculty', icon: ChatBubbleLeftRightIcon },
  { path: '/student/events', label: 'Campus Events', icon: CalendarDaysIcon },
  { path: '/student/profile', label: 'Profile', icon: UserCircleIcon }
];

const StudentLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-950">
      <Sidebar items={navItems} title="STATE UNIVERSITY" subtitle="Student Portal" collapsed={collapsed} />
      <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <Navbar onMenuToggle={() => setCollapsed(!collapsed)} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
