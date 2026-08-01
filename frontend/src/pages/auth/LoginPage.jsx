import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, SunIcon, MoonIcon, AcademicCapIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const LoginPage = () => {
  const { login } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data.email, data.password);
      const redirectMap = {
        Admin: '/admin/dashboard',
        Faculty: '/faculty/dashboard',
        Student: '/student/dashboard'
      };
      navigate(redirectMap[user.role] || '/login');
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white relative overflow-hidden font-sans">
      {/* Background Academic Mesh Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-600/15 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[140px]"></div>
      </div>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors z-20"
        id="login-theme-toggle"
      >
        {darkMode ? <SunIcon className="w-5 h-5 text-amber-400" /> : <MoonIcon className="w-5 h-5 text-slate-300" />}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-lg px-4 my-8"
      >
        {/* OIT Header Emblem */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center p-3 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-2xl shadow-indigo-500/20 mb-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-amber-500 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <AcademicCapIcon className="w-8 h-8 text-amber-400" />
              </div>
            </div>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            ORION INSTITUTE OF TECHNOLOGY
          </h1>
          <p className="mt-2 text-sm text-amber-400 font-bold tracking-wide uppercase">
            Official Student & Faculty MIS Portal (OIT)
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 sm:p-10 border-indigo-500/20 shadow-2xl relative">
          <div className="mb-6 flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white">Portal Authentication</h2>
              <p className="text-xs text-slate-400 mt-0.5">Sign in with your OIT institutional email</p>
            </div>
            <span className="badge-gold text-[10px] uppercase">OIT Secure</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="form-label" htmlFor="email">OIT Institutional Email (@oit.edu)</label>
              <input
                id="email"
                type="email"
                placeholder="anita.sharmaFAC@oit.edu"
                className="form-input"
                {...register('email', {
                  required: 'OIT email address is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' }
                })}
              />
              {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="form-label" htmlFor="password">Security Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="form-input pr-12"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm transition-all duration-200 shadow-xl shadow-indigo-600/30 disabled:opacity-50 flex items-center justify-center gap-2"
              id="login-submit-btn"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <ShieldCheckIcon className="w-5 h-5 text-amber-400" />
                  Sign In to OIT Portal
                </>
              )}
            </button>
          </form>

          {/* OIT Credentials Panel */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">OIT Demo Accounts</p>
            <div className="space-y-1.5 text-xs text-slate-300 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <p><span className="text-indigo-400 font-bold">Admin:</span> `admin@oit.edu` / `Admin@123`</p>
              <p><span className="text-indigo-400 font-bold">Faculty:</span> `anita.sharmaFAC@oit.edu` / `Faculty@123`</p>
              <p><span className="text-indigo-400 font-bold">Student:</span> `aarav.sharma@oit.edu` / `Student@123`</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500 mt-6">
          © 2025 Orion Institute of Technology. All Rights Reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
