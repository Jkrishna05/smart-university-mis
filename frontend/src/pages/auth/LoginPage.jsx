import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
  EyeIcon, EyeSlashIcon, AcademicCapIcon, ShieldCheckIcon,
  EnvelopeIcon, LockClosedIcon, ArrowRightIcon,
} from '@heroicons/react/24/outline';

/* ─── Orion Network SVG ───────────────────────────────────────────────── */
const NODES = [
  { id: 'hub',  x: 240, y: 240, r: 40, label: 'OIT',         primary: true },
  { id: 'std',  x: 240, y: 100, r: 22, label: 'Students',    icon: '👨‍🎓' },
  { id: 'fac',  x: 360, y: 162, r: 20, label: 'Faculty',     icon: '👩‍🏫' },
  { id: 'crs',  x: 380, y: 300, r: 20, label: 'Courses',     icon: '📚' },
  { id: 'lib',  x: 300, y: 390, r: 18, label: 'Library',     icon: '📖' },
  { id: 'cld',  x: 145, y: 370, r: 20, label: 'Cloud',       icon: '☁️' },
  { id: 'dpt',  x: 105, y: 255, r: 20, label: 'Depts',       icon: '🏛️' },
  { id: 'rch',  x: 155, y: 130, r: 18, label: 'Research',    icon: '🔬' },
];

const EDGES = [
  ['hub','std'], ['hub','fac'], ['hub','crs'],
  ['hub','lib'], ['hub','cld'], ['hub','dpt'], ['hub','rch'],
  ['std','fac'], ['fac','crs'], ['crs','lib'],
  ['lib','cld'], ['cld','dpt'], ['dpt','rch'], ['rch','std'],
];

const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));

const OrionNetwork = () => (
  <svg viewBox="0 0 480 480" aria-hidden="true" className="w-full h-full">
    <defs>
      {/* Hub radial gradient */}
      <radialGradient id="hubFill" cx="40%" cy="35%" r="65%">
        <stop offset="0%"  stopColor="#fbbf24" stopOpacity="0.95"/>
        <stop offset="60%" stopColor="#d97706" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#92400e" stopOpacity="0.6"/>
      </radialGradient>

      {/* Node gradient */}
      <radialGradient id="nodeFill" cx="38%" cy="32%" r="68%">
        <stop offset="0%"  stopColor="#d9e2ec" stopOpacity="0.9"/>
        <stop offset="100%" stopColor="#1b365d" stopOpacity="0.5"/>
      </radialGradient>

      {/* Glow filter */}
      <filter id="goldGlow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="outerGlow" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="18" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>

      {/* Animated line gradient */}
      <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#1b365d" stopOpacity="0.08"/>
        <stop offset="45%"  stopColor="#fbbf24" stopOpacity="0.6"/>
        <stop offset="55%"  stopColor="#fbbf24" stopOpacity="0.6"/>
        <stop offset="100%" stopColor="#1b365d" stopOpacity="0.08"/>
      </linearGradient>

      {/* Blueprint grid pattern */}
      <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#1b365d" strokeWidth="0.4" strokeOpacity="0.15"/>
      </pattern>
    </defs>

    {/* Blueprint grid background */}
    <rect width="480" height="480" fill="url(#grid)" opacity="0.7"/>

    {/* Ambient glow behind hub */}
    <circle cx="240" cy="240" r="90" fill="#1b365d" opacity="0.12" filter="url(#outerGlow)">
      <animate attributeName="r" values="85;100;85" dur="4s" repeatCount="indefinite"
        calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
      <animate attributeName="opacity" values="0.12;0.18;0.12" dur="4s" repeatCount="indefinite"/>
    </circle>
    <circle cx="240" cy="240" r="55" fill="#fbbf24" opacity="0.06" filter="url(#outerGlow)">
      <animate attributeName="r" values="50;68;50" dur="3.5s" repeatCount="indefinite"
        calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
    </circle>

    {/* Edges — static base */}
    {EDGES.map(([a, b], i) => {
      const na = nodeMap[a], nb = nodeMap[b];
      return (
        <line key={`base-${i}`}
          x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
          stroke="#1b365d" strokeWidth="1" strokeOpacity="0.18"
          strokeDasharray="4 4"
        />
      );
    })}

    {/* Edges — animated pulse */}
    {EDGES.map(([a, b], i) => {
      const na = nodeMap[a], nb = nodeMap[b];
      return (
        <g key={`pulse-${i}`}>
          <path id={`p${i}`} d={`M${na.x},${na.y} L${nb.x},${nb.y}`} fill="none" stroke="none"/>
          <circle r="2.5" fill="#fbbf24" opacity="0.85" filter="url(#softGlow)">
            <animateMotion dur={`${3 + i * 0.45}s`} repeatCount="indefinite"
              calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
              keyTimes="0;0.5;1">
              <mpath href={`#p${i}`}/>
            </animateMotion>
            <animate attributeName="opacity" values="0;0.9;0" dur={`${3 + i * 0.45}s`}
              repeatCount="indefinite"/>
          </circle>
        </g>
      );
    })}

    {/* Satellite nodes */}
    {NODES.slice(1).map((n, i) => (
      <g key={n.id}>
        {/* Outer ring pulse */}
        <circle cx={n.x} cy={n.y} r={n.r + 10} fill="#1b365d" opacity="0.06">
          <animate attributeName="r" values={`${n.r+8};${n.r+16};${n.r+8}`}
            dur={`${3.5 + i * 0.4}s`} repeatCount="indefinite"/>
        </circle>
        {/* Float animation */}
        <g>
          <animateTransform attributeName="transform" type="translate"
            values={`0,0; 0,${-5 - (i % 3) * 2}; 0,0`}
            dur={`${4 + i * 0.6}s`} repeatCount="indefinite"
            calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
            additive="sum"/>
          {/* Node circle */}
          <circle cx={n.x} cy={n.y} r={n.r} fill="url(#nodeFill)"
            stroke="#5e82a8" strokeWidth="1.2" strokeOpacity="0.7"
            filter="url(#softGlow)"/>
          {/* Highlight */}
          <ellipse cx={n.x - n.r * 0.22} cy={n.y - n.r * 0.22}
            rx={n.r * 0.3} ry={n.r * 0.2} fill="white" opacity="0.25"/>
          {/* Label */}
          <text x={n.x} y={n.y + n.r + 13} textAnchor="middle"
            fontFamily="Inter, sans-serif" fontSize="9" fontWeight="600"
            fill="#8da6c0" letterSpacing="0.5">{n.label}</text>
          {/* Icon */}
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="11">{n.icon}</text>
        </g>
      </g>
    ))}

    {/* Central hub — gold */}
    <circle cx="240" cy="240" r="52" fill="#fbbf24" opacity="0.08" filter="url(#outerGlow)">
      <animate attributeName="r" values="50;58;50" dur="3s" repeatCount="indefinite"
        calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
    </circle>
    <circle cx="240" cy="240" r="40" fill="url(#hubFill)"
      stroke="#fbbf24" strokeWidth="1.8" strokeOpacity="0.8"
      filter="url(#goldGlow)"/>
    {/* Hub glass sheen */}
    <ellipse cx="228" cy="226" rx="13" ry="9" fill="white" opacity="0.28"/>
    {/* OIT text */}
    <text x="240" y="237" textAnchor="middle" fontFamily="Inter, sans-serif"
      fontSize="11" fontWeight="800" fill="#0b192c" letterSpacing="2">OIT</text>
    <text x="240" y="251" textAnchor="middle" fontFamily="Inter, sans-serif"
      fontSize="6.5" fontWeight="600" fill="#0b192c" letterSpacing="1" opacity="0.7">PORTAL</text>

    {/* Tiny floating particles */}
    {[[80,120],[400,90],[440,350],[60,380],[370,430],[120,450],[450,180]].map(([px,py], i) => (
      <circle key={i} cx={px} cy={py} r="1.5" fill="#fbbf24" opacity="0.4">
        <animate attributeName="cy" values={`${py};${py-14};${py}`}
          dur={`${6 + i}s`} repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.4;0.1;0.4"
          dur={`${6 + i}s`} repeatCount="indefinite"/>
      </circle>
    ))}

    {/* Low-opacity decorative rings */}
    <circle cx="240" cy="240" r="140" fill="none" stroke="#1b365d" strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="3 9"/>
    <circle cx="240" cy="240" r="200" fill="none" stroke="#1b365d" strokeWidth="0.4" strokeOpacity="0.07" strokeDasharray="2 12"/>
  </svg>
);

/* ─── Floating-label input ────────────────────────────────────────────── */
const FieldInput = ({ id, type = 'text', label, Icon, placeholder, error, trail, registration }) => {
  const [active, setActive] = useState(false);
  const [filled, setFilled] = useState(false);

  return (
    <div>
      <div className="relative">
        {/* Leading icon */}
        <div className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${active ? 'text-campus-navy-600' : 'text-slate-400'}`}>
          <Icon className="w-[18px] h-[18px]"/>
        </div>

        {/* Input */}
        <input
          id={id}
          type={type}
          placeholder={active ? placeholder : ''}
          autoComplete="off"
          onFocus={() => setActive(true)}
          onBlur={(e) => { setActive(false); setFilled(e.target.value.length > 0); }}
          onChange={(e) => setFilled(e.target.value.length > 0)}
          aria-label={label}
          aria-invalid={!!error}
          className={`
            peer w-full bg-white text-sm text-slate-800 rounded-2xl border-2
            pl-11 pr-${trail ? '12' : '4'} pt-[22px] pb-[10px]
            placeholder:text-slate-300 transition-all duration-200 outline-none
            ${active
              ? 'border-campus-navy-500 shadow-[0_0_0_3px_rgba(27,54,93,0.10)]'
              : error
              ? 'border-rose-400 shadow-[0_0_0_3px_rgba(251,113,133,0.10)]'
              : 'border-slate-200 hover:border-slate-300'}
          `}
          style={{ paddingRight: trail ? '3rem' : undefined }}
          {...registration}
        />

        {/* Floating label */}
        <label
          htmlFor={id}
          className={`
            absolute left-11 pointer-events-none select-none transition-all duration-200
            ${active || filled
              ? 'top-[7px] text-[10px] font-bold tracking-wider uppercase text-campus-navy-600'
              : 'top-1/2 -translate-y-1/2 text-sm text-slate-400'}
          `}
        >
          {label}
        </label>

        {/* Trailing slot (password toggle) */}
        {trail}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 flex items-center gap-1 text-xs text-rose-500"
        >
          <span className="block w-1 h-1 rounded-full bg-rose-500 flex-shrink-0"/>
          {error}
        </motion.p>
      )}
    </div>
  );
};

/* ─── Main Login Page ─────────────────────────────────────────────────── */
const LoginPage = () => {
  /* ── ALL EXISTING AUTH LOGIC — UNTOUCHED ── */
  const { login } = useAuth();
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
  /* ── END UNTOUCHED LOGIC ── */

  /* Parallax on left panel */
  const panelRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 35, damping: 18 });
  const sy = useSpring(my, { stiffness: 35, damping: 18 });

  const onMouseMove = useCallback((e) => {
    if (!panelRef.current) return;
    const { left, top, width, height } = panelRef.current.getBoundingClientRect();
    mx.set(((e.clientX - left) / width - 0.5) * 18);
    my.set(((e.clientY - top) / height - 0.5) * 18);
  }, [mx, my]);

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row font-sans overflow-y-auto lg:overflow-hidden"
      style={{ background: '#f8fafc' }}
      onMouseMove={onMouseMove}
    >
      {/* ═══════════════════════════════════════
          LEFT — Dark Navy Enterprise Panel (Tablet + Desktop)
      ═══════════════════════════════════════ */}
      <motion.div
        ref={panelRef}
        className="hidden md:flex md:w-1/2 lg:w-[52%] xl:w-[55%] flex-col relative overflow-hidden flex-shrink-0"
        style={{
          background: 'linear-gradient(160deg, #0b192c 0%, #0f2942 40%, #0a1f33 70%, #0b192c 100%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(27,54,93,0.6) 0%, transparent 70%)' }}/>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(245,163,0,0.06) 0%, transparent 70%)' }}/>
        </div>

        {/* Top-left brand */}
        <div className="relative z-10 p-6 lg:p-10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
              boxShadow: '0 0 20px rgba(245,163,0,0.35)'
            }}>
            <AcademicCapIcon className="w-5.5 h-5.5 text-campus-navy-900" style={{ width: '22px', height: '22px' }}/>
          </div>
          <div>
            <p className="text-[13px] font-bold text-white tracking-tight leading-none">
              Orion Institute of Technology
            </p>
            <p className="text-[10px] text-campus-gold-400 tracking-widest uppercase mt-0.5">
              University Management System
            </p>
          </div>
        </div>

        {/* Network illustration — parallax */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-6 lg:px-10">
          <motion.div style={{ x: sx, y: sy }} className="w-full max-w-[280px] md:max-w-[340px] lg:max-w-[420px] aspect-square">
            <OrionNetwork/>
          </motion.div>
        </div>

        {/* Caption */}
        <motion.div
          className="relative z-10 px-6 lg:px-12 pb-6 lg:pb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <h2 className="text-lg lg:text-xl font-bold text-white mb-2 tracking-tight">
            Connected Campus Intelligence
          </h2>
          <p className="text-xs lg:text-sm leading-relaxed" style={{ color: 'rgba(141,166,192,0.85)' }}>
            A unified platform for students, faculty, and administration — built on cloud-native infrastructure with AI-powered analytics.
          </p>

          {/* Feature tags */}
          <div className="flex flex-wrap gap-1.5 lg:gap-2 mt-4 lg:mt-5">
            {['Smart Analytics', 'Cloud-Native', 'AI-Powered', 'Secure ERP'].map(tag => (
              <span key={tag}
                className="px-2.5 lg:px-3 py-1 text-[9px] lg:text-[10px] font-bold uppercase tracking-wider rounded-full"
                style={{
                  color: '#fbbf24',
                  background: 'rgba(245,163,0,0.08)',
                  border: '1px solid rgba(245,163,0,0.2)'
                }}>
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Bottom stats bar */}
        <div className="relative z-10 mx-6 lg:mx-10 mb-6 lg:mb-10 grid grid-cols-3 gap-px rounded-2xl overflow-hidden border border-campus-navy-700/40">
          {[
            { label: 'Students', value: '3,200+' },
            { label: 'Faculty', value: '120+' },
            { label: 'Courses', value: '240+' },
          ].map(({ label, value }) => (
            <div key={label} className="py-2.5 lg:py-3 text-center"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-sm lg:text-base font-bold text-white">{value}</p>
              <p className="text-[9px] lg:text-[10px] font-semibold uppercase tracking-wider mt-0.5"
                style={{ color: 'rgba(141,166,192,0.7)' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Right edge divider */}
        <div className="absolute right-0 top-[10%] bottom-[10%] w-px"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(94,130,168,0.2), transparent)' }}/>
      </motion.div>

      {/* ═══════════════════════════════════════
          RIGHT — Login Panel (Mobile + Tablet + Desktop)
      ═══════════════════════════════════════ */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 md:px-8 lg:px-12 relative bg-[#f8fafc]">
        {/* Subtle bg texture */}
        <div className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}/>

        {/* Mobile Header Banner (<md:) */}
        <div className="block md:hidden w-full max-w-[400px] mb-6 text-center">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl mb-3"
            style={{ background: 'linear-gradient(135deg, #0b192c, #0f2942)', boxShadow: '0 4px 16px rgba(11,25,44,0.15)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-campus-gold-400 to-campus-gold-600">
              <AcademicCapIcon className="w-6 h-6 text-campus-navy-900"/>
            </div>
          </div>
          <h2 className="text-base font-bold text-campus-navy-900 tracking-tight">Orion Institute of Technology</h2>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-campus-gold-600 mt-0.5">University Management System</p>

          {/* Compact Network Illustration preview for Mobile */}
          <div className="w-44 h-44 mx-auto my-2">
            <OrionNetwork />
          </div>
        </div>

        <motion.div
          className="relative w-full max-w-[400px]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          {/* Heading */}
          <div className="mb-6 lg:mb-7">
            <h1 className="text-2xl sm:text-[28px] font-bold text-campus-navy-900 tracking-tight leading-tight">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-snug">
              Sign in to Orion Institute of Technology Portal
            </p>
          </div>

          {/* Card */}
          <div
            className="bg-white rounded-[28px] border border-slate-200/80 p-6 sm:p-8"
            style={{ boxShadow: '0 4px 6px -1px rgba(15,23,42,0.04), 0 20px 40px -8px rgba(15,23,42,0.08), 0 0 0 1px rgba(226,232,240,0.6)' }}
          >
            {/* Card header */}
            <div className="flex items-center justify-between mb-6 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' }}>
                  <ShieldCheckIcon className="w-4 h-4 text-campus-navy-900"/>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-campus-navy-900 leading-none">Portal Authentication</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">OIT Institutional Access</p>
                </div>
              </div>
              <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
                style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"/>
                Secure
              </span>
            </div>

            {/* ── FORM — all validation, register, handleSubmit unchanged ── */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

              {/* Email */}
              <FieldInput
                id="email"
                type="email"
                label="Institutional Email"
                Icon={EnvelopeIcon}
                placeholder="anita.sharmaFAC@oit.edu"
                error={errors.email?.message}
                registration={register('email', {
                  required: 'OIT email address is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' }
                })}
              />

              {/* Password */}
              <FieldInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="Security Password"
                Icon={LockClosedIcon}
                placeholder="••••••••"
                error={errors.password?.message}
                trail={
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-campus-navy-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                  </button>
                }
                registration={register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
              />

              {/* Submit */}
              <motion.button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                whileHover={!loading ? { y: -2, boxShadow: '0 8px 28px rgba(245,163,0,0.35)' } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="relative w-full mt-1 py-3.5 rounded-2xl text-sm font-bold text-campus-navy-900 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-campus-gold-400 focus:ring-offset-2"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                  boxShadow: '0 4px 20px rgba(245,163,0,0.25), 0 1px 0 rgba(255,255,255,0.2) inset',
                }}
              >
                {/* Shine sweep */}
                {!loading && (
                  <span className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                    <span className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)',
                        backgroundSize: '200% 100%',
                        animation: 'goldShine 2.4s ease-in-out infinite',
                      }}/>
                  </span>
                )}
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Authenticating…
                    </>
                  ) : (
                    <>
                      Sign in to OIT Portal
                      <ArrowRightIcon className="w-4 h-4"/>
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            {/* Demo accounts */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-400 mb-2.5">
                OIT Demo Accounts
              </p>
              <div className="space-y-1.5 bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                {[
                  { role: 'Admin',   email: 'arabdas98@gmail.com',     pass: 'Admin@123',   bg: '#fffbeb', fg: '#b45309', bd: '#fde68a' },
                  { role: 'Faculty', email: 'anita.sharmaFAC@oit.edu', pass: 'Faculty@123', bg: '#f0fdf4', fg: '#15803d', bd: '#bbf7d0' },
                  { role: 'Student', email: 'zahir.arjun100@oit.edu',  pass: 'Student@123', bg: '#eff6ff', fg: '#1d4ed8', bd: '#bfdbfe' },
                ].map(({ role, email, pass, bg, fg, bd }) => (
                  <div key={role} className="flex items-center gap-2 text-[11px]">
                    <span className="w-[52px] flex-shrink-0 text-center font-bold py-0.5 rounded-full"
                      style={{ background: bg, color: fg, border: `1px solid ${bd}` }}>
                      {role}
                    </span>
                    <span className="text-slate-500 truncate flex-1">{email}</span>
                    <span className="text-slate-400 font-mono flex-shrink-0">{pass}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <motion.p
            className="text-center text-[11px] text-slate-400 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            © 2026 Orion Institute of Technology · All Rights Reserved
          </motion.p>
        </motion.div>
      </div>

      {/* Gold shine keyframe */}
      <style>{`
        @keyframes goldShine {
          0%   { background-position: -200% center; }
          60%  { background-position: 200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
