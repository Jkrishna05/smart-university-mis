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
        subtitle="Student Portal"
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

export default StudentLayout;
