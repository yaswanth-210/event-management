import React, { useState, useEffect } from 'react';
import { QrCode, Ticket as TicketIcon, Search, Calendar, Sparkles } from 'lucide-react';
import { ticketAPI } from '../services/api';
import TicketPass from '../components/TicketPass';

const VisitorDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    try {
      const res = await ticketAPI.getMyTickets();
      setTickets(res.data);
    } catch (err) {
      console.error('Error fetching visitor tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter((t) =>
    t.event_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.ticket_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-blue-500/20 bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> My Registered Access Passes
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
              Digital QR Gate Passes
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Official scannable QR tickets for your registered events. Present your pass at entry turnstiles or gate scanners.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl">
              <TicketIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Total Active Passes</span>
              <span className="text-lg font-black text-white">{tickets.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      {tickets.length > 0 && (
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search pass by event or ticket code..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-200 outline-none focus:border-blue-500"
            />
          </div>

          <span className="text-xs text-slate-400 font-semibold">
            Showing {filteredTickets.length} of {tickets.length} passes
          </span>
        </div>
      )}

      {/* Ticket List */}
      {loading ? (
        <div className="glass-card rounded-2xl p-12 text-center text-xs text-slate-400 font-semibold border border-slate-800">
          Loading your official QR passes...
        </div>
      ) : tickets.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-slate-800 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
            <QrCode className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Tickets Registered Yet</h3>
            <p className="text-xs text-slate-400 mt-1">
              You haven't registered for any active events. Head over to Active Events to claim your pass!
            </p>
          </div>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-400">
          No passes found matching "{searchTerm}".
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTickets.map((ticket) => (
            <TicketPass key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VisitorDashboard;
