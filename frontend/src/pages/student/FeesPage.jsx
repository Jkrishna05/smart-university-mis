import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import { BanknotesIcon, ArrowDownTrayIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const StudentFeesPage = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/fees/my-fees')
      .then(res => setFees(res.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const handlePrintReceipt = (fee) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>University Fee Receipt - Sem ${fee.semester}</title>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #1e293b; }
            .header { text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #1e1b4b; }
            .sub { font-size: 14px; color: #64748b; margin-top: 5px; }
            .details { margin-top: 30px; width: 100%; border-collapse: collapse; }
            .details td, .details th { padding: 12px; border: 1px solid #cbd5e1; text-align: left; }
            .details th { background: #f1f5f9; }
            .total { font-size: 18px; font-weight: bold; color: #15803d; text-align: right; margin-top: 20px; }
            .stamp { text-align: right; margin-top: 50px; font-[12px]; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">STATE UNIVERSITY - OFFICIAL FEE RECEIPT</div>
            <div class="sub">Academic Term: Fall 2025-26 • Semester ${fee.semester}</div>
          </div>
          <table class="details">
            <tr><th>Fee Description</th><th>Amount (INR)</th></tr>
            <tr><td>Tuition Fee</td><td>₹${parseFloat(fee.tuition_fee).toLocaleString()}</td></tr>
            <tr><td>Examination Fee</td><td>₹${parseFloat(fee.exam_fee).toLocaleString()}</td></tr>
            <tr><td>Hostel & Facilities Fee</td><td>₹${parseFloat(fee.hostel_fee).toLocaleString()}</td></tr>
            <tr style="font-weight: bold; background: #f8fafc;"><td>Total Fee Amount</td><td>₹${parseFloat(fee.total_amount).toLocaleString()}</td></tr>
            <tr style="font-weight: bold; color: #16a34a;"><td>Amount Paid</td><td>₹${parseFloat(fee.paid_amount).toLocaleString()}</td></tr>
            <tr style="font-weight: bold; color: #dc2626;"><td>Balance Dues</td><td>₹${parseFloat(fee.due_amount).toLocaleString()}</td></tr>
          </table>
          <div class="total">Payment Status: ${fee.status.toUpperCase()}</div>
          <div class="stamp">Verified by University Accounts Office • Generated on ${new Date().toLocaleDateString()}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const columns = [
    { key: 'semester', label: 'Semester', render: (r) => `Semester ${r.semester}` },
    { key: 'year', label: 'Academic Year', render: (r) => r.academic_year },
    { key: 'tuition', label: 'Tuition (₹)', render: (r) => `₹${parseFloat(r.tuition_fee).toLocaleString()}` },
    { key: 'exam', label: 'Exam (₹)', render: (r) => `₹${parseFloat(r.exam_fee).toLocaleString()}` },
    { key: 'hostel', label: 'Hostel (₹)', render: (r) => `₹${parseFloat(r.hostel_fee).toLocaleString()}` },
    { key: 'total', label: 'Total (₹)', render: (r) => `₹${parseFloat(r.total_amount).toLocaleString()}` },
    { key: 'paid', label: 'Paid (₹)', render: (r) => <span className="text-emerald-400 font-bold">₹{parseFloat(r.paid_amount).toLocaleString()}</span> },
    { key: 'due', label: 'Due (₹)', render: (r) => <span className="text-rose-400 font-bold">₹{parseFloat(r.due_amount).toLocaleString()}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <span className={r.status === 'Paid' ? 'badge-success' : r.status === 'Partial' ? 'badge-warning' : 'badge-danger'}>
          {r.status}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Receipt',
      sortable: false,
      render: (r) => (
        <button
          onClick={() => handlePrintReceipt(r)}
          className="btn-secondary text-xs"
        >
          <ArrowDownTrayIcon className="w-4 h-4" /> Print Receipt
        </button>
      )
    }
  ];

  const latestFee = fees[0];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">Fee Details & Dues</h1>
          <p className="page-subtitle">View your semester tuition fee structure, payment history, and balance dues</p>
        </div>
      </div>

      {/* Summary Cards */}
      {latestFee && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 border-l-4 border-campus-navy-500">
            <p className="text-xs font-bold text-slate-400 uppercase">Total Semester Fee</p>
            <p className="text-3xl font-extrabold text-campus-navy-900 mt-2">₹{parseFloat(latestFee.total_amount).toLocaleString()}</p>
            <p className="text-xs text-campus-navy-500 mt-1">Semester {latestFee.semester} • Academic Year {latestFee.academic_year}</p>
          </div>

          <div className="glass-card p-6 border-l-4 border-emerald-500">
            <p className="text-xs font-bold text-slate-400 uppercase">Amount Paid</p>
            <p className="text-3xl font-extrabold text-emerald-400 mt-2">₹{parseFloat(latestFee.paid_amount).toLocaleString()}</p>
            <p className="text-xs text-emerald-300 mt-1 flex items-center gap-1">
              <CheckCircleIcon className="w-4 h-4" /> Verified by Accounts Office
            </p>
          </div>

          <div className="glass-card p-6 border-l-4 border-rose-500">
            <p className="text-xs font-bold text-slate-400 uppercase">Balance Dues</p>
            <p className="text-3xl font-extrabold text-rose-400 mt-2">₹{parseFloat(latestFee.due_amount).toLocaleString()}</p>
            <p className="text-xs text-rose-300 mt-1 flex items-center gap-1">
              <ClockIcon className="w-4 h-4" /> Due Date: {new Date(latestFee.due_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {/* Fee Table */}
      <DataTable columns={columns} data={fees} loading={loading} />
    </motion.div>
  );
};

export default StudentFeesPage;
