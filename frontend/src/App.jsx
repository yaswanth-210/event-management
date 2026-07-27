import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminEvents from './pages/AdminEvents';
import AdminQRScanner from './pages/AdminQRScanner';
import AdminCrowdMonitor from './pages/AdminCrowdMonitor';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminReports from './pages/AdminReports';
import VisitorDashboard from './pages/VisitorDashboard';
import { Shield, User, LogOut, Sparkles, QrCode } from 'lucide-react';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { user, isAdmin, logout } = useAuth();

  const renderPage = () => {
    // Admin routes strictly guarded
    const adminRoutes = ['dashboard', 'events', 'scanner', 'crowd', 'analytics', 'reports'];
    if (adminRoutes.includes(activeTab) && !isAdmin) {
      return <Home onSelectEvent={() => {}} />;
    }

    switch (activeTab) {
      case 'home':
        return <Home onSelectEvent={() => {}} />;
      case 'login':
        return <Login onSuccess={() => setActiveTab(isAdmin ? 'dashboard' : 'visitor-tickets')} />;
      case 'dashboard':
        return <AdminDashboard onNavigate={setActiveTab} />;
      case 'events':
        return <AdminEvents />;
      case 'scanner':
        return <AdminQRScanner />;
      case 'crowd':
        return <AdminCrowdMonitor />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'reports':
        return <AdminReports />;
      case 'visitor-tickets':
        return <VisitorDashboard />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAdmin}
        user={user}
        onLogout={logout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 glass-card border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Smart Event Management Framework
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-300 hidden sm:inline">
                  Welcome, <strong className="text-white">{user.name}</strong>
                  {isAdmin && <span className="ml-1.5 text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30 font-bold uppercase">Admin</span>}
                </span>

                {isAdmin ? (
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5" /> Admin Console
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('visitor-tickets')}
                    className="px-3.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" /> My Digital Passes
                  </button>
                )}

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" /> Sign In
              </button>
            )}
          </div>
        </header>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex overflow-x-auto p-2 bg-slate-900 border-b border-slate-800 gap-1">
          <button onClick={() => setActiveTab('home')} className="px-3 py-1 text-xs rounded-lg font-semibold bg-slate-800 text-slate-200 shrink-0">Active Events</button>
          {isAdmin && (
            <>
              <button onClick={() => setActiveTab('dashboard')} className="px-3 py-1 text-xs rounded-lg font-semibold bg-slate-800 text-slate-200 shrink-0">Dashboard</button>
              <button onClick={() => setActiveTab('events')} className="px-3 py-1 text-xs rounded-lg font-semibold bg-slate-800 text-slate-200 shrink-0">Events</button>
              <button onClick={() => setActiveTab('scanner')} className="px-3 py-1 text-xs rounded-lg font-semibold bg-slate-800 text-slate-200 shrink-0">QR Scanner</button>
              <button onClick={() => setActiveTab('crowd')} className="px-3 py-1 text-xs rounded-lg font-semibold bg-slate-800 text-slate-200 shrink-0">Crowd</button>
              <button onClick={() => setActiveTab('analytics')} className="px-3 py-1 text-xs rounded-lg font-semibold bg-slate-800 text-slate-200 shrink-0">Analytics</button>
              <button onClick={() => setActiveTab('reports')} className="px-3 py-1 text-xs rounded-lg font-semibold bg-slate-800 text-slate-200 shrink-0">Reports</button>
            </>
          )}
          {user && !isAdmin && (
            <button onClick={() => setActiveTab('visitor-tickets')} className="px-3 py-1 text-xs rounded-lg font-semibold bg-slate-800 text-slate-200 shrink-0">My Digital Passes</button>
          )}
        </div>

        {/* Page Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
