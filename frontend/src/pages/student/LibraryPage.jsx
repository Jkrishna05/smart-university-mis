import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import { BookOpenIcon, ClockIcon } from '@heroicons/react/24/outline';

const StudentLibraryPage = () => {
  const [books, setBooks] = useState([]);
  const [myBorrows, setMyBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/library/books'),
      api.get('/library/my-borrows')
    ]).then(([bookRes, borrowRes]) => {
      setBooks(bookRes.data.data || []);
      setMyBorrows(borrowRes.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const bookColumns = [
    { key: 'isbn', label: 'ISBN', render: (r) => <span className="badge-gold font-mono">{r.isbn}</span> },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'author', label: 'Author' },
    { key: 'category', label: 'Category' },
    { key: 'copies', label: 'Copies Available', render: (r) => <span className="badge-success">{r.available_copies} Available</span> }
  ];

  const borrowColumns = [
    { key: 'title', label: 'Book Title', render: (r) => r.book?.title },
    { key: 'author', label: 'Author', render: (r) => r.book?.author },
    { key: 'issue_date', label: 'Issue Date' },
    { key: 'due_date', label: 'Due Date', render: (r) => <strong className="text-amber-400">{r.due_date}</strong> },
    { key: 'status', label: 'Status', render: (r) => <span className="badge-info">{r.status}</span> }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">University Digital Library</h1>
          <p className="page-subtitle">Search textbook catalog and view your issued books and due dates</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-amber-400" /> My Currently Issued Books
          </h3>
          <DataTable columns={borrowColumns} data={myBorrows} loading={loading} />
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BookOpenIcon className="w-5 h-5 text-indigo-400" /> Full Library Catalog Search
          </h3>
          <DataTable columns={bookColumns} data={books} loading={loading} />
        </div>
      </div>
    </motion.div>
  );
};

export default StudentLibraryPage;
