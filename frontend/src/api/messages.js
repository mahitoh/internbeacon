import api from './axios';

export const messagesApi = {
  threads:     ()               => api.get('/messages/threads'),
  getThread:   (appId)          => api.get(`/messages/app/${appId}`),
  send:        (appId, content) => api.post(`/messages/app/${appId}`, { content }),
  markRead:    (id)             => api.patch(`/messages/${id}/read`),
  unreadCount: ()               => api.get('/messages/unread-count'),
};
