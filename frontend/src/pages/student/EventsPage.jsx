import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { CalendarDaysIcon, MapPinIcon, SparklesIcon } from '@heroicons/react/24/outline';

const StudentEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events')
      .then(res => setEvents(res.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="shimmer h-48 rounded-xl"></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">Campus Events & Academic Calendar</h1>
          <p className="page-subtitle">Upcoming hackathons, seminars, cultural fests, and campus workshops</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((e) => (
          <motion.div
            key={e.event_id}
            whileHover={{ y: -4 }}
            className="glass-card p-6 border-l-4 border-indigo-500 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="badge-gold text-[10px]">{e.event_type}</span>
                <span className="text-xs text-amber-400 font-semibold">{new Date(e.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <h3 className="text-lg font-bold text-white leading-snug mt-1">{e.title}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{e.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1"><MapPinIcon className="w-4 h-4 text-emerald-400" /> {e.location}</span>
              <span className="badge-info text-[10px]">Open to All</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StudentEventsPage;
