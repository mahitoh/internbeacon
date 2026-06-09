import api from './axios';

export const adminApi = {
  stats: () => api.get('/admin/stats'),

  listUsers:  (params)       => api.get('/admin/users', { params }),
  getUser:    (id)            => api.get(`/admin/users/${id}`),
  setActive:  (id, isActive) => api.patch(`/admin/users/${id}/activate`, { isActive }),
  setRole:    (id, role)     => api.patch(`/admin/users/${id}/role`, { role }),
  deleteUser: (id)            => api.delete(`/admin/users/${id}`),

  listOffers:     (params)       => api.get('/admin/offers', { params }),
  setOfferStatus: (id, status)   => api.patch(`/admin/offers/${id}/status`, { status }),
  deleteOffer:    (id)           => api.delete(`/admin/offers/${id}`),

  listApplications: (params) => api.get('/admin/applications', { params }),

  verifyCompany: (userId, isVerified) => api.patch(`/admin/companies/${userId}/verify`, { isVerified }),

  broadcast: (data) => api.post('/admin/notifications/broadcast', data),
};
