import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { BuildingOffice2Icon, PhoneIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const StudentHostelPage = () => {
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/hostels/my-hostel')
      .then(res => setHostel(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="shimmer h-48 rounded-xl"></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Hostel & Accommodation</h1>
          <p className="page-subtitle">View your allocated hostel room, block, and warden contact information</p>
        </div>
      </div>

      {!hostel ? (
        <div className="glass-card p-8 text-center text-slate-400">
          <BuildingOffice2Icon className="w-12 h-12 mx-auto mb-3 text-slate-500 opacity-60" />
          <p className="text-lg font-bold text-white">No Hostel Room Allocated</p>
          <p className="text-xs mt-1">Contact the University Housing Office for hostel room assignment.</p>
        </div>
      ) : (
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-campus-gold-600">
                <BuildingOffice2Icon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{hostel.hostel_name}</h2>
                <p className="text-xs text-campus-navy-500 font-semibold">{hostel.block} • Status: <span className="text-emerald-400 font-bold">{hostel.status}</span></p>
              </div>
            </div>
            <span className="badge-gold text-lg font-mono px-4 py-1.5">{hostel.room_no}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <UserIcon className="w-6 h-6 text-campus-navy-600" />
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Hostel Warden</p>
                <p className="text-sm font-bold text-campus-navy-900 mt-0.5">{hostel.warden_name}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <PhoneIcon className="w-6 h-6 text-emerald-400" />
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Warden Emergency Phone</p>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">{hostel.warden_phone}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StudentHostelPage;
