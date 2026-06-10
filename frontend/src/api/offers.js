import api from './axios';

export const offersApi = {
  list:        (params) => api.get('/offers', { params }),
  getOne:      (id)     => api.get(`/offers/${id}`),
  myOffers:    (params) => api.get('/offers/my', { params }),
  recommended: (limit)  => api.get('/offers/recommended', { params: { limit } }),
  create:      (data)   => api.post('/offers', data),
  update:      (id, d)  => api.patch(`/offers/${id}`, d),
  close:       (id)     => api.patch(`/offers/${id}`, { status: 'closed' }),
  remove:      (id)     => api.delete(`/offers/${id}`),
  bookmark:    (id)     => api.post(`/offers/${id}/bookmark`),
  unbookmark:  (id)     => api.delete(`/offers/${id}/bookmark`),
  bookmarks:   ()       => api.get('/offers/bookmarks'),
};
