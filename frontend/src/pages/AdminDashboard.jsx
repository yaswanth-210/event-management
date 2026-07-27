import React, { useState, useEffect } from 'react';
import { Calendar, Users, UserCheck, Activity, Bell, DollarSign, PieChart, ShieldAlert } from 'lucide-react';
import { analyticsAPI, crowdAPI } from '../services/api';

const AdminDashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, alertsRes] = await Promise.all([
        analyticsAPI.getDashboardStats(),
        crowdAPI.getAlerts()
      ]);
      setStats(statsRes.data);
      setAlerts(alertsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return <div className="text-center py-16 text-slate-400 text-xs font-semibold">Loading Admin Dashboard Metrics...</div>;
  }

  const cards = [
    { title: 'Total Events', value: stats.total_events, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { title: 'Active Events', value: stats.active_events, icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { title: 'Registered Visitors', value: stats.registered_visitors, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { title: 'Visitors Entered', value: stats.visitors_entered, icon: UserCheck, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
    { title: 'Current Crowd', value: stats.current_crowd, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { title: "Today's Alerts", value: stats.todays_alerts, icon: Bell, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    { title: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { title: 'Capacity Utilization', value: `${stats.capacity_utilization}%`, icon: PieChart, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Admin Command Center</h1>
        <p className="text-xs text-slate-400">Real-time overview of events, ticketing, crowd safety, and revenues.</p>
      </div>

      {/* 8 Commercial Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">{c.title}</span>
                <p className="text-2xl font-extrabold text-white mt-1">{c.value}</p>
              </div>
              <div className={`p-3 rounded-xl border ${c.bg} ${c.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Navigation & Live Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" /> Recent Safety Alerts & Notifications
          </h3>
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {alerts.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No active safety alerts. All zones operating normally.</p>
            ) : (
              alerts.map((a) => (
                <div
                  key={a.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                    a.severity === 'Alert'
                      ? 'bg-red-500/10 border-red-500/30 text-red-300'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}
                >
                  <div>
                    <span className="font-bold uppercase tracking-wider">{a.severity}:</span> {a.message}
                    <div className="text-[10px] text-slate-400 mt-0.5">Location: {a.location} • {a.timestamp}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/60 border border-slate-800">
                    {a.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-2">Module Shortcuts</h3>
            <p className="text-xs text-slate-400 mb-4">Direct navigation to active operations:</p>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('events')}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl text-left border border-slate-700 transition-all flex justify-between items-center"
              >
                <span>Manage Events (CRUD)</span> →
              </button>
              <button
                onClick={() => onNavigate('scanner')}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl text-left border border-slate-700 transition-all flex justify-between items-center"
              >
                <span>Live QR Gate Scanner</span> →
              </button>
              <button
                onClick={() => onNavigate('crowd')}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl text-left border border-slate-700 transition-all flex justify-between items-center"
              >
                <span>5-Zone Crowd Monitor</span> →
              </button>
              <button
                onClick={() => onNavigate('analytics')}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl text-left border border-slate-700 transition-all flex justify-between items-center"
              >
                <span>Predictive ML Analytics</span> →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
