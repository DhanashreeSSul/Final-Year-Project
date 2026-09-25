import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('shakti_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      const token = localStorage.getItem('shakti_token');
      if (token && token !== 'demo-session-token') {
        localStorage.removeItem('shakti_token');
        localStorage.removeItem('shakti_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

export const authAPI = {
  sendOTP: (phone, purpose = 'login') => api.post('/auth/send-otp', { phone, purpose }),
  verifyAadhaar: (aadhaar) => api.post('/auth/verify-aadhaar', { aadhaar }),
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  loginWithAadhaar: (aadhaar, password, otp) => api.post('/auth/login', { aadhaar, password, otp }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  me: () => api.get('/auth/me'),
};


export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getOne: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};

export const schemesAPI = {
  getAll: (params) => api.get('/schemes', { params }),
  getOne: (id) => api.get(`/schemes/${id}`),
};

export const coursesAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getOne: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
};

export const applicationsAPI = {
  apply: (data) => api.post('/applications', data),
  getMy: () => api.get('/applications/my'),
  updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
};

export const chatAPI = {
  sendMessage: (data) => api.post('/chatbot/message', data),
  getHistory: (token) => api.get(`/chatbot/history/${token}`),
};

export const recommendationsAPI = {
  // Full dashboard: jobs + courses + schemes + profile tips + completeness
  get: () => api.get('/recommendations'),
  // Standalone endpoints for Jobs, Courses, and Schemes pages
  getJobs: (limit = 8) => api.get('/recommendations/jobs', { params: { limit } }),
  getCourses: (limit = 8) => api.get('/recommendations/courses', { params: { limit } }),
  getSchemes: (limit = 10, fully_eligible = false) => api.get('/recommendations/schemes', { params: { limit, fully_eligible } }),
  // Record user interaction for feedback loop
  recordFeedback: (entity_id, entity_type, action = 'view') =>
    api.post('/recommendations/feedback', { entity_id, entity_type, action }),
};


export const usersAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
  getNotifications: () => api.get('/users/notifications'),
  markNotifRead: (id) => api.patch(`/users/notifications/${id}/read`),
  bookmarkToggle: (data) => api.post('/users/bookmarks', data),
  getBookmarks: () => api.get('/users/bookmarks'),
};

export const orgAPI = {
  get: () => api.get('/organizations/my'),
  upsert: (data) => api.post('/organizations/my', data),
  getDashboard: () => api.get('/organizations/dashboard'),
};

export const analyticsAPI = {
  getStats: () => api.get('/analytics/stats'),
};
