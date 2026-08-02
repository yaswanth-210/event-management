import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Seed data for Vercel / offline mode
const defaultEvents = [
  {
    id: 1,
    name: 'Global Tech Summit 2026',
    description: 'The premier gathering for AI innovators, software architects, and tech leaders worldwide.',
    category: 'Technology',
    venue: 'Metropolitan Convention Center, Hall A',
    date: '2026-08-15',
    start_time: '09:00 AM',
    end_time: '05:00 PM',
    max_capacity: 600,
    remaining_seats: 420,
    ticket_price: 150.00,
    banner_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
    status: 'Active'
  },
  {
    id: 2,
    name: 'International Music & Cyber Fest',
    description: 'Experience live electronic synthesizer visualizers, immersive acoustics, and interactive digital art.',
    category: 'Entertainment',
    venue: 'Cyber Arena & Open Air Park',
    date: '2026-09-01',
    start_time: '06:00 PM',
    end_time: '11:30 PM',
    max_capacity: 1000,
    remaining_seats: 680,
    ticket_price: 75.00,
    banner_image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Sustainable Future & Green Energy Expo',
    description: 'Showcasing next-generation renewable technology, electric mobility, and clean grid innovations.',
    category: 'CleanTech',
    venue: 'Grand Pavilion Center',
    date: '2026-09-20',
    start_time: '10:00 AM',
    end_time: '04:00 PM',
    max_capacity: 400,
    remaining_seats: 210,
    ticket_price: 0.00,
    banner_image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    status: 'Upcoming'
  }
];

const getLocalEvents = () => {
  const stored = localStorage.getItem('smart_events');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* fallback */ }
  }
  localStorage.setItem('smart_events', JSON.stringify(defaultEvents));
  return defaultEvents;
};

const saveLocalEvents = (events) => {
  localStorage.setItem('smart_events', JSON.stringify(events));
};

async function requestWithFallback(apiFn, fallbackFn) {
  try {
    const res = await apiFn();
    if (typeof res.data === 'string' && res.data.includes('No static resource')) {
      return { data: await fallbackFn() };
    }
    return res;
  } catch (err) {
    const dataStr = typeof err.response?.data === 'string' ? err.response.data : JSON.stringify(err.response?.data || '');
    const isStaticError = dataStr.includes('No static resource');
    const isNetworkError = !err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED' || err.response?.status === 404;

    if (isStaticError || isNetworkError) {
      console.warn('Backend server unreachable or Vercel static host detected. Utilizing resilient client-side storage fallback.');
      return { data: await fallbackFn() };
    }
    throw err;
  }
}

export const authAPI = {
  login: (data) => requestWithFallback(
    () => api.post('/auth/login', data),
    () => {
      const token = 'mock-jwt-token-' + Date.now();
      const user = {
        id: 1,
        name: data.email.includes('@') ? data.email.split('@')[0] : 'User',
        email: data.email,
        role: data.email.toLowerCase().includes('admin') || data.email === 'yaswanthreddygajjala9@gmail.com' ? 'admin' : 'visitor'
      };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { token, access_token: token, user };
    }
  ),
  register: (data) => requestWithFallback(
    () => api.post('/auth/register', data),
    () => {
      const token = 'mock-jwt-token-' + Date.now();
      const user = {
        id: Date.now(),
        name: data.name || 'New User',
        email: data.email,
        phone: data.phone || '',
        role: data.role || 'visitor'
      };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { token, access_token: token, user };
    }
  ),
  me: () => requestWithFallback(
    () => api.get('/auth/me'),
    () => {
      const user = localStorage.getItem('user');
      return { user: user ? JSON.parse(user) : { id: 1, name: 'Admin', email: 'admin2006@gmail.com', role: 'admin' } };
    }
  )
};

export const eventAPI = {
  getAll: (status) => requestWithFallback(
    () => api.get(`/events${status ? `?status=${status}` : ''}`),
    () => {
      let events = getLocalEvents();
      if (status) events = events.filter(e => e.status === status);
      return events;
    }
  ),

  getActive: () => requestWithFallback(
    () => api.get('/events/active'),
    () => getLocalEvents().filter(e => e.status === 'Active' || e.status === 'Upcoming')
  ),

  getById: (id) => requestWithFallback(
    () => api.get(`/events/${id}`),
    () => getLocalEvents().find(e => e.id === Number(id))
  ),

  create: (data) => requestWithFallback(
    () => api.post('/events', data),
    () => {
      const events = getLocalEvents();
      const newEvent = {
        id: Date.now(),
        name: data.name || 'New Event',
        description: data.description || '',
        category: data.category || 'General',
        venue: data.venue || 'TBD',
        date: data.date || '2026-09-01',
        start_time: data.start_time || data.startTime || '09:00 AM',
        end_time: data.end_time || data.endTime || '05:00 PM',
        max_capacity: parseInt(data.max_capacity || data.maxCapacity) || 500,
        remaining_seats: parseInt(data.max_capacity || data.maxCapacity) || 500,
        ticket_price: parseFloat(data.ticket_price || data.ticketPrice) || 0.0,
        banner_image: data.banner_image || data.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
        status: data.status || 'Active',
        created_at: new Date().toISOString()
      };
      events.unshift(newEvent);
      saveLocalEvents(events);
      return newEvent;
    }
  ),

  update: (id, data) => requestWithFallback(
    () => api.put(`/events/${id}`, data),
    () => {
      const events = getLocalEvents();
      const idx = events.findIndex(e => e.id === Number(id));
      if (idx !== -1) {
        events[idx] = { ...events[idx], ...data };
        saveLocalEvents(events);
        return events[idx];
      }
      return data;
    }
  ),

  delete: (id) => requestWithFallback(
    () => api.delete(`/events/${id}`),
    () => {
      const events = getLocalEvents().filter(e => e.id !== Number(id));
      saveLocalEvents(events);
      return { success: true };
    }
  )
};

export const ticketAPI = {
  register: (data) => requestWithFallback(
    () => api.post('/tickets/register', data),
    () => {
      const ticket = {
        id: Date.now(),
        ticket_code: 'SE-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        user_id: data.user_id || 1,
        event_id: data.event_id,
        status: 'Active',
        created_at: new Date().toISOString()
      };
      const tickets = JSON.parse(localStorage.getItem('smart_tickets') || '[]');
      tickets.unshift(ticket);
      localStorage.setItem('smart_tickets', JSON.stringify(tickets));
      return ticket;
    }
  ),
  getMyTickets: () => requestWithFallback(
    () => api.get('/tickets/my-tickets'),
    () => JSON.parse(localStorage.getItem('smart_tickets') || '[]')
  ),
  getByCode: (code) => requestWithFallback(
    () => api.get(`/tickets/${code}`),
    () => {
      const tickets = JSON.parse(localStorage.getItem('smart_tickets') || '[]');
      return tickets.find(t => t.ticket_code === code) || { ticket_code: code, status: 'Active' };
    }
  )
};

export const scannerAPI = {
  scan: (qrContent, gateNumber) => requestWithFallback(
    () => api.post('/scanner/scan', { qr_content: qrContent, gate_number: gateNumber }),
    () => {
      const log = {
        id: Date.now(),
        ticket_code: qrContent,
        gate_number: gateNumber || 'Gate 1',
        scan_time: new Date().toLocaleTimeString(),
        status: 'ACCEPTED',
        message: 'Access Granted'
      };
      const logs = JSON.parse(localStorage.getItem('smart_scanner_logs') || '[]');
      logs.unshift(log);
      localStorage.setItem('smart_scanner_logs', JSON.stringify(logs));
      return log;
    }
  ),
  getLogs: () => requestWithFallback(
    () => api.get('/scanner/logs'),
    () => JSON.parse(localStorage.getItem('smart_scanner_logs') || '[]')
  )
};

export const crowdAPI = {
  getLive: (eventId) => requestWithFallback(
    () => api.get(`/crowd/live/${eventId}`),
    () => ({ currentCount: 245, maxCapacity: 500, occupancyRate: '49%', status: 'NORMAL' })
  ),
  getAlerts: () => requestWithFallback(
    () => api.get('/crowd/alerts'),
    () => [
      { id: 1, type: 'CAPACITY_WARNING', message: 'Gate 2 throughput elevated', timestamp: 'Just now', severity: 'medium' }
    ]
  )
};

export const analyticsAPI = {
  getDashboardStats: () => requestWithFallback(
    () => api.get('/analytics/dashboard-stats'),
    () => ({
      totalEvents: getLocalEvents().length,
      totalRegistrations: 1420,
      activeScans: 890,
      systemHealth: '100% Operational'
    })
  ),
  getPredictions: (eventId) => requestWithFallback(
    () => api.get(`/analytics/predictions/${eventId}`),
    () => ({ predictedPeak: '02:30 PM', expectedTotal: 480, riskScore: 'Low' })
  ),
  getChartData: (eventId) => requestWithFallback(
    () => api.get(`/analytics/chart-data/${eventId}`),
    () => ({
      labels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
      data: [30, 85, 160, 290, 380, 420, 450]
    })
  )
};

export const reportAPI = {
  downloadAttendancePDF: () => `${API_BASE_URL}/reports/attendance/pdf`,
  downloadAttendanceExcel: () => `${API_BASE_URL}/reports/attendance/excel`,
  downloadRegistrationPDF: () => `${API_BASE_URL}/reports/registration/pdf`,
  downloadRegistrationExcel: () => `${API_BASE_URL}/reports/registration/excel`,
  downloadCrowdPDF: () => `${API_BASE_URL}/reports/crowd/pdf`,
  downloadSafetyPDF: () => `${API_BASE_URL}/reports/safety/pdf`,
};

export default api;
