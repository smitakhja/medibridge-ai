import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medibridge_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('medibridge_token');
      localStorage.removeItem('medibridge_user');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  register: (data: Record<string, unknown>) => api.post('/auth/register', data),
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
};

// Health
export const healthApi = {
  analyze: (data: Record<string, unknown>) => api.post('/health/analyze', data),
  getHistory: () => api.get('/health/history'),
  getAssessment: (id: string) => api.get(`/health/${id}`),
};

// Reports
export const reportsApi = {
  upload: (formData: FormData) => api.post('/reports/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAll: () => api.get('/reports'),
  getOne: (id: string) => api.get(`/reports/${id}`),
};

// Doctors
export const doctorsApi = {
  getAll: (params?: Record<string, string>) => api.get('/doctors', { params }),
  getOne: (id: string) => api.get(`/doctors/${id}`),
};

// Appointments
export const appointmentsApi = {
  create: (data: Record<string, unknown>) => api.post('/appointments', data),
  getAll: () => api.get('/appointments'),
  update: (id: string, data: Record<string, unknown>) => api.put(`/appointments/${id}`, data),
};

// Facilities
export const facilitiesApi = {
  getNearby: (params?: Record<string, string>) => api.get('/facilities/nearby', { params }),
};

// Dashboard
export const dashboardApi = {
  get: () => api.get('/dashboard'),
};

// Admin
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
};

export default api;
