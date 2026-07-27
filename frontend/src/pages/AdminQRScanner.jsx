import React, { useState, useEffect } from 'react';
import QRScannerComponent from '../components/QRScannerComponent';
import { scannerAPI } from '../services/api';
import { ShieldCheck, History } from 'lucide-react';

const AdminQRScanner = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await scannerAPI.getLogs();
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScanSuccess = () => {
    fetchLogs();
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Smart QR Access Control</h1>
        <p className="text-xs text-slate-400">Scan QR codes to authenticate visitors, record attendance, and manage gate access logs.</p>
      </div>

      {/* Embedded Live Scanner */}
      <QRScannerComponent onResult={handleScanSuccess} />

      {/* Gate Entry Attendance Log Table */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-blue-400" /> Complete Entry & Attendance Log
        </h3>

        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">Loading entry logs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-4">Ticket Code</th>
                  <th className="py-3 px-4">Visitor Name</th>
                  <th className="py-3 px-4">Event Name</th>
                  <th className="py-3 px-4">Gate</th>
                  <th className="py-3 px-4">Entry Time</th>
                  <th className="py-3 px-4">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">#{l.id}</td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-400">{l.ticket_code}</td>
                    <td className="py-3 px-4 font-semibold text-white">{l.user_name}</td>
                    <td className="py-3 px-4">{l.event_name}</td>
                    <td className="py-3 px-4 text-slate-400">{l.gate_number}</td>
                    <td className="py-3 px-4 text-slate-400">{l.entry_time ? l.entry_time.replace('T', ' ') : ''}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQRScanner;
