import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import {
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
  DocumentChartBarIcon,
  ChartBarIcon,
  BanknotesIcon,
  BuildingOffice2Icon,
  CubeIcon,
  UsersIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/admin/students', label: 'Students', icon: AcademicCapIcon },
  { path: '/admin/faculty', label: 'Faculty', icon: UserGroupIcon },
  { path: '/admin/departments', label: 'Departments', icon: BuildingOfficeIcon },
  { path: '/admin/courses', label: 'Courses', icon: BookOpenIcon },
  { path: '/admin/course-offerings', label: 'Course Offerings', icon: ClipboardDocumentListIcon },
  { path: '/admin/enrollments', label: 'Enrollments', icon: ClipboardDocumentCheckIcon },
  { path: '/admin/attendance', label: 'Attendance', icon: CalendarDaysIcon },
  { path: '/admin/exams', label: 'Exams', icon: DocumentChartBarIcon },
  { path: '/admin/results', label: 'Results', icon: ChartBarIcon },
  { path: '/admin/fees', label: 'Fee Collection', icon: BanknotesIcon },
  { path: '/admin/hostels', label: 'Hostel Rooms', icon: BuildingOffice2Icon },
  { path: '/admin/library', label: 'Library Catalog', icon: BookOpenIcon },
  { path: '/admin/inventory', label: 'Lab Inventory', icon: CubeIcon },
  { path: '/admin/events', label: 'Campus Events', icon: CalendarDaysIcon },
  { path: '/admin/users', label: 'Users', icon: UsersIcon },
  { path: '/admin/reports', label: 'Reports & Audits', icon: PresentationChartLineIcon }
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-950">
      <Sidebar items={navItems} title="STATE UNIVERSITY" subtitle="Admin System" collapsed={collapsed} />
      <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <Navbar onMenuToggle={() => setCollapsed(!collapsed)} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
