import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, color = 'primary', trend, trendValue }) => {
  const colorMap = {
    primary: 'from-campus-navy-600 to-campus-navy-500',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-campus-gold-500 to-campus-gold-600',
    rose: 'from-rose-500 to-rose-600',
    blue: 'from-blue-500 to-blue-600',
    violet: 'from-violet-500 to-violet-600',
    cyan: 'from-cyan-500 to-cyan-600',
    orange: 'from-orange-500 to-orange-600'
  };

  const bgMap = {
    primary: 'bg-campus-navy-50',
    emerald: 'bg-emerald-50',
    amber: 'bg-campus-gold-50',
    rose: 'bg-rose-50',
    blue: 'bg-blue-50',
    violet: 'bg-violet-50',
    cyan: 'bg-cyan-50',
    orange: 'bg-orange-50'
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="stats-card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-extrabold text-campus-navy-900 tracking-tight">
            {value}
          </p>
          {trend && (
            <p className={`mt-2 text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </p>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${bgMap[color]}`}>
          <div className={`p-2 rounded-xl bg-gradient-to-br ${colorMap[color]} shadow-lg`}>
            {Icon && <Icon className="w-6 h-6 text-white" />}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
