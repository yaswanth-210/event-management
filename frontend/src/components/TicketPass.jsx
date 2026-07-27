import React from 'react';
import { QrCode, Download, Calendar, MapPin, CheckCircle2, User, Clock, ShieldCheck, Ticket as TicketIcon, Printer } from 'lucide-react';
import { BACKEND_URL } from '../services/api';

const TicketPass = ({ ticket, onDownload, onPrint }) => {
  if (!ticket) return null;

  const handlePrint = () => {
    if (onPrint) {
      onPrint(ticket);
    } else {
      window.print();
    }
  };

  return (
    <div className="relative group max-w-2xl mx-auto w-full transition-transform hover:-translate-y-0.5 duration-300">
      {/* Outer Card Container */}
      <div className="glass-card rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden bg-slate-900/90 text-slate-100 flex flex-col md:flex-row relative">
        
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 z-10" />

        {/* LEFT SECTION - Main Ticket Info */}
        <div className="p-6 md:p-7 flex-1 flex flex-col justify-between space-y-6 relative border-b md:border-b-0 md:border-r border-dashed border-slate-700/80">
          
          {/* Header & Pass Category */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <TicketIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 block">OFFICIAL EVENT PASS</span>
                <span className="text-xs font-semibold text-slate-400">SmartEvent Portal</span>
              </div>
            </div>

            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border shadow-sm ${
              ticket.status === 'Valid'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              {ticket.status === 'Valid' ? 'VIP ACCESS' : ticket.status}
            </span>
          </div>

          {/* Event Title & Venue */}
          <div className="space-y-2">
            <h3 className="text-xl font-black text-white tracking-tight leading-snug">
              {ticket.event_name || 'Global Tech Summit 2026'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{ticket.event_date || 'Aug 15, 2026'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{ticket.event_time || '09:00 AM PST'}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{ticket.event_venue || 'Metropolitan Convention Center, Hall A'}</span>
              </div>
            </div>
          </div>

          {/* Attendee Details & Ticket Serial */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">PASS HOLDER</span>
              <span className="font-extrabold text-white text-sm flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" /> {ticket.user_name || 'Yaswanth Reddy'}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">TICKET NO.</span>
              <span className="font-mono font-bold text-blue-400 text-sm tracking-wider">
                {ticket.ticket_code}
              </span>
            </div>
          </div>
        </div>

        {/* PERFORATION NOTCHES (Top & Bottom on Desktop) */}
        <div className="hidden md:block absolute left-1/2 -top-3 -translate-x-1/2 w-6 h-6 bg-slate-950 rounded-full border border-slate-800 z-20" />
        <div className="hidden md:block absolute left-1/2 -bottom-3 -translate-x-1/2 w-6 h-6 bg-slate-950 rounded-full border border-slate-800 z-20" />

        {/* RIGHT SECTION - QR Code & Gate Verification Stub */}
        <div className="p-6 md:w-56 bg-slate-950/90 flex flex-col items-center justify-between text-center space-y-4 shrink-0 relative">
          
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">GATE SCAN CODE</span>
            <div className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" /> VERIFIED REAL QR
            </div>
          </div>

          {/* High quality scannable QR Code display */}
          <div className="relative group/qr p-2 bg-white rounded-2xl shadow-xl border-2 border-slate-700/50">
            <img
              src={`${BACKEND_URL}${ticket.qr_image_path}`}
              alt={`QR Code ${ticket.ticket_code}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticket.ticket_code || 'TICK-PASS')}`;
              }}
              className="w-36 h-36 object-contain rounded-lg transition-transform group-hover/qr:scale-105 duration-300"
            />
          </div>

          {/* Realistic Barcode Graphic Strip */}
          <div className="w-full space-y-1">
            <div className="h-6 w-full bg-slate-900 border border-slate-800 rounded px-2 flex items-center justify-between overflow-hidden opacity-80">
              {/* Simulated barcode lines */}
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full bg-slate-200 ${i % 3 === 0 ? 'w-1' : i % 2 === 0 ? 'w-0.5' : 'w-1.5'}`}
                />
              ))}
            </div>
            <p className="text-[9px] font-mono text-slate-400 tracking-widest">{ticket.ticket_code}</p>
          </div>

          {/* Download & Print Actions */}
          <div className="w-full flex gap-2 pt-1">
            <a
              href={`${BACKEND_URL}${ticket.qr_image_path}`}
              download={`Pass_${ticket.ticket_code}.png`}
              className="flex-1 py-2 px-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 shadow-md shadow-blue-600/30"
              title="Download QR Image"
            >
              <Download className="w-3.5 h-3.5" /> Save
            </a>
            <button
              type="button"
              onClick={handlePrint}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center border border-slate-700"
              title="Print Pass"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TicketPass;
