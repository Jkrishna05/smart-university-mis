import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, color = 'primary', trend, trendValue }) => {
  const colorMap = {
    primary: 'from-primary-500 to-primary-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
    rose: 'from-rose-500 to-rose-600',
    blue: 'from-blue-500 to-blue-600',
    violet: 'from-violet-500 to-violet-600',
    cyan: 'from-cyan-500 to-cyan-600',
    orange: 'from-orange-500 to-orange-600'
  };

  const bgMap = {
    primary: 'bg-primary-50 dark:bg-primary-900/20',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20',
    amber: 'bg-amber-50 dark:bg-amber-900/20',
    rose: 'bg-rose-50 dark:bg-rose-900/20',
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    violet: 'bg-violet-50 dark:bg-violet-900/20',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/20',
    orange: 'bg-orange-50 dark:bg-orange-900/20'
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="stats-card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-dark-muted">{title}</p>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
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
