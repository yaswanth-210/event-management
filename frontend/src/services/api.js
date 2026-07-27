import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

export const eventAPI = {
  getAll: (status) => api.get(`/events${status ? `?status=${status}` : ''}`),
  getActive: () => api.get('/events/active'),
  getById: (id) => api.get(`/events/${id}`),
  create: (formData) => api.post('/events/', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

export const ticketAPI = {
  register: (data) => api.post('/tickets/register', data),
  getMyTickets: () => api.get('/tickets/my-tickets'),
  getByCode: (code) => api.get(`/tickets/${code}`),
};

export const scannerAPI = {
  scan: (qrContent, gateNumber) => api.post('/scanner/scan', { qr_content: qrContent, gate_number: gateNumber }),
  getLogs: () => api.get('/scanner/logs'),
};

export const crowdAPI = {
  getLive: (eventId) => api.get(`/crowd/live/${eventId}`),
  getAlerts: () => api.get('/crowd/alerts'),
};

export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard-stats'),
  getPredictions: (eventId) => api.get(`/analytics/predictions/${eventId}`),
  getChartData: (eventId) => api.get(`/analytics/chart-data/${eventId}`),
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
