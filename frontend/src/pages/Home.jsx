import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Search, Sparkles, CheckCircle2 } from 'lucide-react';
import { eventAPI, ticketAPI } from '../services/api';
import EventCard from '../components/EventCard';
import TicketPass from '../components/TicketPass';

const Home = ({ onSelectEvent }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Registration modal state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regSuccess, setRegSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await eventAPI.getActive();
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRegister = (event) => {
    setSelectedEvent(event);
    setRegSuccess(null);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await ticketAPI.register({
        name: regName,
        email: regEmail,
        phone: regPhone,
        event_id: selectedEvent.id
      });
      setRegSuccess(res.data);
      fetchEvents(); // Refresh seat counts
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ['All', 'Technology', 'Entertainment', 'CleanTech', 'General'];

  const filteredEvents = events.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.venue.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'All' || e.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-card p-8 md:p-12 border border-blue-500/20 bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Intelligent Event Ecosystem
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Real-Time Crowd Monitoring & Smart QR Entry
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Discover upcoming active events, register instantly to get automated secure QR tickets, and enjoy seamless access control with predictive safety analytics.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                category === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'glass-card text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search active events..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-200 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Active Events Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 font-semibold text-xs">Loading active events...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl">
          <p className="text-slate-400 text-sm">No active events matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} onRegister={handleOpenRegister} />
          ))}
        </div>
      )}

      {/* Registration Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card rounded-3xl border border-slate-800 w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in my-8">
            <div className="p-6 bg-slate-900/90 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Event Registration</h3>
                <p className="text-xs text-blue-400 font-medium">{selectedEvent.name}</p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {regSuccess ? (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-black text-white">Registration Confirmed!</h4>
                    <p className="text-xs text-slate-300">
                      Your official digital pass has been generated. Show this scannable QR code at the event gate.
                    </p>
                  </div>

                  {/* Ultra-realistic Ticket Pass */}
                  <TicketPass ticket={regSuccess.ticket || regSuccess} />

                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all border border-slate-700"
                  >
                    Done & Return to Events
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Yaswanth Reddy"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="yaswanth@example.com"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+1 555 019 2831"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all"
                    >
                      {submitting ? 'Registering & Generating Ticket...' : 'Confirm Registration & Get Ticket'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
