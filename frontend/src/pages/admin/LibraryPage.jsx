import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { PlusIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { useForm } from 'react-hook-form';

const AdminLibraryPage = () => {
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const { register: regIssue, handleSubmit: submitIssue, reset: resetIssue } = useForm();

  const fetchLibraryData = useCallback(async () => {
    setLoading(true);
    try {
      const [bookRes, borrowRes] = await Promise.all([
        api.get('/library/books'),
        api.get('/library/borrows')
      ]);
      setBooks(bookRes.data.data || []);
      setBorrows(borrowRes.data.data || []);
    } catch (e) {
      toast.error('Failed to fetch library data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLibraryData();
    api.get('/students?limit=500').then(r => setStudents(r.data.data)).catch(() => {});
  }, [fetchLibraryData]);

  const openAddBook = () => {
    reset({ title: '', author: '', isbn: '', category: 'Computer Science', total_copies: 10, available_copies: 10 });
    setModalOpen(true);
  };

  const openIssueBook = () => {
    resetIssue({ student_id: students[0]?.student_id || '', book_id: books[0]?.book_id || '', due_date: '2025-10-30' });
    setIssueModalOpen(true);
  };

  const onAddBookSubmit = async (formData) => {
    try {
      await api.post('/library/books', formData);
      toast.success('Book added to library catalog');
      setModalOpen(false);
      fetchLibraryData();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to add book');
    }
  };

  const onIssueSubmit = async (formData) => {
    try {
      await api.post('/library/issue', formData);
      toast.success('Book issued to student successfully');
      setIssueModalOpen(false);
      fetchLibraryData();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to issue book');
    }
  };

  const bookColumns = [
    { key: 'isbn', label: 'ISBN', render: (r) => <span className="badge-gold font-mono">{r.isbn}</span> },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'author', label: 'Author' },
    { key: 'category', label: 'Category' },
    { key: 'copies', label: 'Availability', render: (r) => `${r.available_copies} / ${r.total_copies} Copies` }
  ];

  const borrowColumns = [
    { key: 'book', label: 'Book Title', render: (r) => r.book?.title },
    { key: 'student', label: 'Student', render: (r) => r.student?.user?.username },
    { key: 'issue_date', label: 'Issue Date' },
    { key: 'due_date', label: 'Due Date' },
    { key: 'status', label: 'Status', render: (r) => <span className="badge-info">{r.status}</span> }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Library Management System</h1>
          <p className="page-subtitle">Manage books catalog, inventory copies, and book borrow/return logs</p>
        </div>
        <div className="flex gap-3">
          <button onClick={openIssueBook} className="btn-secondary text-xs" id="issue-book-btn">
            Issue Book
          </button>
          <button onClick={openAddBook} className="btn-primary" id="add-book-btn">
            <PlusIcon className="w-5 h-5" /> Add New Book
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpenIcon className="w-5 h-5 text-amber-400" /> Book Catalog
        </h3>
        <DataTable columns={bookColumns} data={books} loading={loading} />

        <h3 className="text-xl font-bold text-white flex items-center gap-2 pt-4">
          Borrowed Books Log
        </h3>
        <DataTable columns={borrowColumns} data={borrows} loading={loading} />
      </div>

      {/* Add Book Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Book to Library">
        <form onSubmit={handleSubmit(onAddBookSubmit)} className="space-y-4">
          <div><label className="form-label">Book Title</label><input className="form-input" {...register('title', { required: 'Required' })} /></div>
          <div><label className="form-label">Author(s)</label><input className="form-input" {...register('author', { required: 'Required' })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="form-label">ISBN</label><input className="form-input" {...register('isbn', { required: 'Required' })} /></div>
            <div><label className="form-label">Category</label><input className="form-input" {...register('category', { required: 'Required' })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="form-label">Total Copies</label><input type="number" className="form-input" {...register('total_copies', { required: 'Required' })} /></div>
            <div><label className="form-label">Available Copies</label><input type="number" className="form-input" {...register('available_copies', { required: 'Required' })} /></div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add Book</button>
          </div>
        </form>
      </Modal>

      {/* Issue Book Modal */}
      <Modal isOpen={issueModalOpen} onClose={() => setIssueModalOpen(false)} title="Issue Book to Student">
        <form onSubmit={submitIssue(onIssueSubmit)} className="space-y-4">
          <div>
            <label className="form-label">Select Book</label>
            <select className="form-input" {...regIssue('book_id', { required: 'Required' })}>
              {books.map(b => (
                <option key={b.book_id} value={b.book_id}>{b.title} ({b.available_copies} available)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Select Student</label>
            <select className="form-input" {...regIssue('student_id', { required: 'Required' })}>
              {students.map(s => (
                <option key={s.student_id} value={s.student_id}>{s.user?.username} ({s.roll_no})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Return Due Date</label>
            <input type="date" className="form-input" {...regIssue('due_date', { required: 'Required' })} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={() => setIssueModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Issue Book</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default AdminLibraryPage;
