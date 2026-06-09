import api from './axios';

export const applicationsApi = {
  apply:        (data)     => api.post('/applications', data),
  my:           (params)   => api.get('/applications/my', { params }),
  companyAll:   (params)   => api.get('/applications/company', { params }),
  forOffer:     (offerId)  => api.get(`/applications/offer/${offerId}`),
  getOne:       (id)       => api.get(`/applications/${id}`),
  getHistory:     (id)       => api.get(`/applications/${id}/history`),
  updateStatus:   (id, data) => api.patch(`/applications/${id}/status`, data),
  withdraw:       (id)       => api.patch(`/applications/${id}/withdraw`),
  respondToOffer: (id, response) => api.patch(`/applications/${id}/respond`, { response }),
  messages:     (appId)    => api.get(`/messages/app/${appId}`),
};
