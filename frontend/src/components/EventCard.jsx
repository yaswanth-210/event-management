import React from 'react';
import { Calendar, MapPin, Ticket, Tag } from 'lucide-react';

const EventCard = ({ event, onRegister }) => {
  const remainingPct = Math.round((event.remaining_seats / event.max_capacity) * 100);

  return (
    <div className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between">
      <div>
        <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
          <img
            src={event.banner_image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80'}
            alt={event.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-blue-400 text-xs font-semibold rounded-lg border border-blue-500/20 flex items-center gap-1">
              <Tag className="w-3 h-3" /> {event.category}
            </span>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border backdrop-blur-md ${
              event.status === 'Active' 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
            }`}>
              {event.status}
            </span>
          </div>
          <div className="absolute bottom-3 right-3 px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-lg shadow-md">
            {event.ticket_price > 0 ? `$${event.ticket_price.toFixed(2)}` : 'FREE'}
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold text-slate-100 mb-2 line-clamp-1">{event.name}</h3>
          <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">{event.description}</p>

          <div className="space-y-2 text-xs text-slate-300 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{event.date} • {event.start_time} - {event.end_time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-0">
        <div className="mb-3">
          <div className="flex justify-between text-xs font-medium mb-1">
            <span className="text-slate-400">Remaining Seats</span>
            <span className={event.remaining_seats < 50 ? 'text-red-400 font-bold' : 'text-slate-200'}>
              {event.remaining_seats} / {event.max_capacity}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                remainingPct < 20 ? 'bg-red-500' : remainingPct < 50 ? 'bg-amber-500' : 'bg-blue-500'
              }`}
              style={{ width: `${remainingPct}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => onRegister(event)}
          disabled={event.remaining_seats <= 0 || event.status === 'Completed' || event.status === 'Closed'}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
        >
          <Ticket className="w-4 h-4" />
          {event.remaining_seats <= 0 ? 'Sold Out' : 'Register Now'}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
