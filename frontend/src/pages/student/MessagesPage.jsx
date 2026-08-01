import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { useForm } from 'react-hook-form';

const StudentMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();

  const fetchMessages = useCallback(async () => {
    try {
      const res = await api.get('/messages');
      setMessages(res.data.data || []);
    } catch (e) {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    api.get('/faculty?limit=100').then(r => setFacultyList(r.data.data)).catch(() => {});
  }, [fetchMessages]);

  const onSubmit = async (formData) => {
    try {
      await api.post('/messages', formData);
      toast.success('Message sent to faculty member');
      reset({ subject: '', content: '' });
      fetchMessages();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to send message');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-4xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">Faculty Q&A & Messaging Portal</h1>
          <p className="page-subtitle">Ask questions, request course guidance, and message your course instructors directly</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Send Form */}
        <div className="md:col-span-1 glass-card p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <PaperAirplaneIcon className="w-5 h-5 text-amber-400" /> Send Query
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="form-label">Select Faculty</label>
              <select className="form-input" {...register('receiver_id', { required: 'Required' })}>
                {facultyList.map(f => (
                  <option key={f.faculty_id} value={f.user_id}>
                    {f.user?.username} ({f.department?.department_name})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Subject</label>
              <input className="form-input" placeholder="e.g. Doubts in CS201 Assignment 2" {...register('subject', { required: 'Required' })} />
            </div>
            <div>
              <label className="form-label">Message Details</label>
              <textarea className="form-input" rows="4" placeholder="Write your question here..." {...register('content', { required: 'Required' })}></textarea>
            </div>
            <button type="submit" className="btn-primary w-full" id="send-msg-btn">
              Send Message
            </button>
          </form>
        </div>

        {/* Message Log */}
        <div className="md:col-span-2 glass-card p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-indigo-400" /> Message History
          </h3>
          {loading ? (
            <div className="shimmer h-32 rounded-xl"></div>
          ) : messages.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No messages sent or received yet.</p>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {messages.map((m) => (
                <div key={m.message_id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-400">To: {m.receiver?.username || 'Faculty'}</span>
                    <span className="text-[10px] text-slate-400">{new Date(m.createdAt).toLocaleString()}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{m.subject}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg">{m.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StudentMessagesPage;
