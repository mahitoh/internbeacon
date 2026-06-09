import api from './axios';

export const analyticsApi = {
  student: () => api.get('/analytics'),
  company: () => api.get('/analytics/company'),
};
