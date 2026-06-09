import api from './axios';

export const aiApi = {
  parseCv:         ()         => api.post('/ai/parse-cv'),
  matchOffer:      (offerId)  => api.get(`/ai/match-offer/${offerId}`),
  rankApplicants:  (offerId)  => api.get(`/ai/rank-applicants/${offerId}`),
};
