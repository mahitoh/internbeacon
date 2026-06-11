import api from './axios';

export const profilesApi = {
  updateStudent:     (data) => api.patch('/profiles/student', data),
  updateCompany:     (data) => api.patch('/profiles/company', data),
  getStudent:        (id)   => api.get(`/profiles/student/${id}`),
  getCompany:        (id)   => api.get(`/profiles/company/${id}`),
  getPreferences:    ()     => api.get('/profiles/preferences'),
  updatePreferences: (data) => api.patch('/profiles/preferences', data),
};
