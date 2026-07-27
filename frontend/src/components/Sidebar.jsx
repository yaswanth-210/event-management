import React from 'react';
import { Shield, Calendar, QrCode, Activity, TrendingUp, FileText, Home, LogOut, User, Sparkles } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isAdmin, user, onLogout }) => {
  const adminLinks = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: Home },
    { id: 'home', label: 'Active Events Catalog', icon: Calendar },
    { id: 'events', label: 'Events Management', icon: Calendar },
    { id: 'scanner', label: 'Gate QR Scanner', icon: QrCode },
    { id: 'crowd', label: 'Crowd Monitor', icon: Activity },
    { id: 'analytics', label: 'Predictive Analytics', icon: TrendingUp },
    { id: 'reports', label: 'Reports Export', icon: FileText },
  ];

  const visitorLinks = [
    { id: 'home', label: 'Active Events', icon: Calendar },
    ...(user ? [{ id: 'visitor-tickets', label: 'My Digital QR Passes', icon: QrCode }] : []),
  ];

  const links = isAdmin ? adminLinks : visitorLinks;

  return (
    <aside className="w-64 glass-card border-r border-slate-800 flex flex-col justify-between hidden md:flex shrink-0">
      <div className="p-5">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-600/10">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-white text-base leading-tight">SmartEvent</h2>
            <span className="text-[10px] text-blue-400 font-bold tracking-wider uppercase">Portal Framework</span>
          </div>
        </div>

        {/* Section Title */}
        <div className="px-3 mb-2">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">
            {isAdmin ? 'ADMIN CONSOLE' : 'VISITOR NAVIGATION'}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {link.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
        {user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-xs shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-extrabold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 capitalize font-medium">{user.role}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setActiveTab('login')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-blue-500/30 shadow-md"
          >
            <User className="w-4 h-4" /> Sign In To Account
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
