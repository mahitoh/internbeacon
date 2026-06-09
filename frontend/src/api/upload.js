import api from './axios';

// Content-Type must be undefined so axios drops the default 'application/json'
// and lets the browser set 'multipart/form-data; boundary=...' automatically.
const multipart = { headers: { 'Content-Type': undefined } };

function formData(file) {
  const fd = new FormData();
  fd.append('file', file);
  return fd;
}

export const uploadApi = {
  cv:       (file) => api.post('/upload/cv',     formData(file), multipart),
  avatar:   (file) => api.post('/upload/avatar', formData(file), multipart),
  logo:     (file) => api.post('/upload/logo',   formData(file), multipart),
  getCvUrl: (studentUserId) => api.get(`/upload/cv-url/${studentUserId}`),
};
