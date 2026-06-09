import api from './axios';

export const authApi = {
  login:           (data) => api.post('/auth/login', data),
  registerStudent: (data) => api.post('/auth/register', { ...data, role: 'student' }),
  registerCompany: (data) => api.post('/auth/register', { ...data, role: 'company' }),
  logout:          ()     => api.post('/auth/logout'),
  me:              ()     => api.get('/auth/me'),
  refresh:         (rt)   => api.post('/auth/refresh', { refreshToken: rt }),
  completeProfile: (data) => api.post('/auth/complete-profile', data),
  forgotPassword:  (email)          => api.post('/auth/forgot-password', { email }),
  resetPassword:   (access_token, password) => api.post('/auth/reset-password', { access_token, password }),
};
