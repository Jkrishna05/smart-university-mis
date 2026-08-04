import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { AcademicCapIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

const StudentTranscriptPage = () => {
  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/students/me/profile'),
      api.get('/results/my-results')
    ]).then(([profRes, resRes]) => {
      setProfile(profRes.data.data);
      setResults(resRes.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const handlePrintCertificate = () => {
    const printWin = window.open('', '_blank');
    printWin.document.write(`
      <html>
        <head>
          <title>Official Degree Completion Certificate - OIT</title>
          <style>
            body { font-family: 'Georgia', serif; text-align: center; padding: 50px; background: #fafafa; color: #0f172a; border: 15px solid #312e81; margin: 20px; }
            .title { font-size: 34px; font-weight: bold; color: #1e1b4b; letter-spacing: 2px; }
            .subtitle { font-size: 18px; color: #d97706; text-transform: uppercase; margin-top: 10px; font-weight: bold; }
            .content { font-size: 20px; margin-top: 40px; line-height: 1.8; }
            .name { font-size: 30px; font-weight: bold; color: #4338ca; text-decoration: underline; }
            .seal { width: 100px; height: 100px; border-radius: 50%; border: 3px solid #d97706; display: inline-block; margin-top: 40px; line-height: 100px; font-weight: bold; color: #d97706; }
            .footer { margin-top: 60px; display: flex; justify-content: space-between; font-size: 14px; font-family: sans-serif; }
          </style>
        </head>
        <body>
          <div class="title">ORION INSTITUTE OF TECHNOLOGY</div>
          <div class="subtitle">Official Academic Degree Certificate</div>
          <div class="content">
            This is to certify that<br/>
            <div class="name">${profile?.user?.username || 'Student Name'}</div>
            Registration No: <strong>${profile?.registration_no}</strong> • Roll No: <strong>${profile?.roll_no}</strong><br/>
            has successfully completed the prescribed curriculum for<br/>
            <strong>Bachelor of Technology in ${profile?.department?.department_name}</strong><br/>
            at Orion Institute of Technology (OIT) with CGPA of <strong>3.85 / 4.00</strong>.
          </div>
          <div class="seal">OIT SEAL</div>
          <div class="footer">
            <div>Dean of Academic Affairs</div>
            <div>Registrar & Controller of Examinations</div>
          </div>
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.print();
  };

  if (loading) return <div className="shimmer h-64 rounded-xl"></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-4xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">Digital Transcript & Certificate</h1>
          <p className="page-subtitle">Official OIT grade card, credit summary, and degree certificate</p>
        </div>
        <button onClick={handlePrintCertificate} className="btn-gold" id="print-cert-btn">
          <CheckBadgeIcon className="w-5 h-5" /> Export Official OIT Degree
        </button>
      </div>

      {/* Transcript Header Card */}
      <div className="glass-card p-6 border-l-4 border-amber-500">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="badge-gold">Verified OIT Student Transcript</span>
            <h2 className="text-2xl font-extrabold text-campus-navy-900 mt-2">{profile?.user?.username}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Roll No: <strong className="text-campus-gold-600 font-mono">{profile?.roll_no}</strong> • Registration: <strong>{profile?.registration_no}</strong>
            </p>
            <p className="text-xs text-campus-navy-500 mt-0.5">{profile?.department?.department_name} • Orion Institute of Technology</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center min-w-[140px]">
            <p className="text-xs text-slate-400 uppercase font-bold">Cumulative CGPA</p>
            <p className="text-3xl font-black text-campus-gold-600">3.85</p>
            <p className="text-[10px] text-emerald-400 font-semibold mt-1">First Class Distinction</p>
          </div>
        </div>
      </div>

      {/* Grade Breakdown Table */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-campus-navy-900 mb-4 flex items-center gap-2">
          <AcademicCapIcon className="w-5 h-5 text-campus-gold-600" /> OIT Semester Grade History
        </h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Course Code</th>
              <th>Exam Title</th>
              <th>Marks</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.result_id}>
                <td className="font-bold text-white">{r.exam?.course?.course_name}</td>
                <td><span className="badge-gold">{r.exam?.course?.course_code}</span></td>
                <td>{r.exam?.exam_name}</td>
                <td>{r.marks} / {r.exam?.total_marks}</td>
                <td>
                  <span className={`badge ${['A', 'A-'].includes(r.grade) ? 'badge-success' : 'badge-info'}`}>
                    {r.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default StudentTranscriptPage;
