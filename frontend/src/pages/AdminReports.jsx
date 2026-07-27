import React from 'react';
import { FileText, Download, FileSpreadsheet } from 'lucide-react';
import { reportAPI } from '../services/api';

const AdminReports = () => {
  const reports = [
    {
      title: 'Attendance Report',
      description: 'Comprehensive log of scanned tickets, visitor names, entry times, and gate numbers.',
      pdfUrl: reportAPI.downloadAttendancePDF(),
      excelUrl: reportAPI.downloadAttendanceExcel(),
    },
    {
      title: 'Registration Report',
      description: 'Full record of registered visitors, contact emails, registration dates, and payments.',
      pdfUrl: reportAPI.downloadRegistrationPDF(),
      excelUrl: reportAPI.downloadRegistrationExcel(),
    },
    {
      title: 'Crowd Analysis Report',
      description: 'Historical 5-zone crowd density logs, occupancy percentages, and venue peak metrics.',
      pdfUrl: reportAPI.downloadCrowdPDF(),
      excelUrl: reportAPI.downloadAttendanceExcel(),
    },
    {
      title: 'Safety Alert Report',
      description: 'Complete log of automated warning alerts (>90%) and critical overcrowding alerts (>100%).',
      pdfUrl: reportAPI.downloadSafetyPDF(),
      excelUrl: reportAPI.downloadRegistrationExcel(),
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-400" /> Commercial Reports Export Center
        </h1>
        <p className="text-xs text-slate-400">Generate and download official PDF documents and Excel spreadsheets for event post-analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((r, idx) => (
          <div key={idx} className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">{r.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{r.description}</p>
            </div>

            <div className="flex gap-3 pt-2">
              <a
                href={r.pdfUrl}
                download
                className="flex-1 py-2.5 px-4 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download PDF
              </a>
              <a
                href={r.excelUrl}
                download
                className="flex-1 py-2.5 px-4 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" /> Download Excel
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
