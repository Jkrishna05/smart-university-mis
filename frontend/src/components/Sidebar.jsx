import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AcademicCapIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ items, title, subtitle, collapsed, mobileOpen, onMobileClose }) => {
  const sidebarContent = (isMobile = false) => (
    <>
      {/* OIT Logo Emblem */}
      <div className="p-6 border-b border-campus-navy-700/40 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="relative flex-shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-campus-gold-400 via-campus-gold-500 to-campus-gold-600 p-0.5 shadow-lg shadow-campus-gold-500/30">
              <div className="w-full h-full bg-campus-navy-900 rounded-[14px] flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-campus-gold-400" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-campus-navy-900"></span>
          </div>

          {(!collapsed || isMobile) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-1.5">
                <h2 className="font-extrabold text-base tracking-tight text-white">{title || 'OIT MIS'}</h2>
              </div>
              <p className="text-[10px] font-semibold text-campus-gold-400 tracking-wide uppercase">{subtitle || 'Orion Institute of Tech'}</p>
            </motion.div>
          )}
        </div>

        {/* Mobile Close Button */}
        {isMobile && (
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-lg text-campus-navy-200 hover:text-white hover:bg-white/10 transition-colors lg:hidden"
            aria-label="Close navigation drawer"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Academic Term Badge */}
      {(!collapsed || isMobile) && (
        <div className="mx-4 my-3 px-3 py-2 rounded-xl bg-campus-navy-800/60 border border-campus-navy-600/30 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-campus-navy-200">Academic Term:</span>
          <span className="text-[11px] font-bold text-campus-gold-400 bg-campus-gold-500/10 px-2 py-0.5 rounded-md border border-campus-gold-500/20">
            Fall 2025-26
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => {
              if (isMobile) onMobileClose?.();
            }}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {item.icon && <item.icon className="w-5 h-5 flex-shrink-0" />}
            {(!collapsed || isMobile) && <span className="tracking-wide">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {(!collapsed || isMobile) && (
        <div className="p-4 border-t border-campus-navy-700/40 text-center">
          <p className="text-[11px] font-semibold text-campus-navy-300">OIT MIS Portal v2.5</p>
          <p className="text-[10px] text-campus-navy-400 mt-0.5">Orion Institute of Technology</p>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR — 100% UNCHANGED AT lg: (1024px+) ── */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`sidebar fixed left-0 top-0 h-full z-30 hidden lg:flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}
      >
        {sidebarContent(false)}
      </motion.aside>

      {/* ── MOBILE & TABLET DRAWER — (<1024px) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
              aria-hidden="true"
            />

            {/* Slide-in Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="sidebar fixed inset-y-0 left-0 z-50 w-64 flex flex-col lg:hidden shadow-2xl"
            >
              {sidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
