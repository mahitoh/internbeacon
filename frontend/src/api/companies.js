import api from './axios';

export const companiesApi = {
  list: (params) => api.get('/companies', { params }),
  get:  (id)     => api.get(`/companies/${id}`),
};
