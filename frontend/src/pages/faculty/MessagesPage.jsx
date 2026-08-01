import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const FacultyMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/messages')
      .then(res => setMessages(res.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Inquiries & Messages</h1>
          <p className="page-subtitle">Questions and assignment inquiries submitted by students in your courses</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <ChatBubbleLeftRightIcon className="w-5 h-5 text-amber-400" /> Student Queries Inbox
        </h3>

        {loading ? (
          <div className="shimmer h-32 rounded-xl"></div>
        ) : messages.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center">No student inquiries received yet.</p>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <div key={m.message_id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-400">From Student: {m.sender?.username} ({m.sender?.email})</span>
                  <span className="text-[10px] text-slate-400">{new Date(m.createdAt).toLocaleString()}</span>
                </div>
                <h4 className="font-bold text-white text-base">{m.subject}</h4>
                <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg leading-relaxed">{m.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FacultyMessagesPage;
