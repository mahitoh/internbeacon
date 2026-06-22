import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    // Never attempt a token refresh when the failing request was itself an auth
    // endpoint — a 401 from /auth/login means wrong credentials, not expired session.
    const isAuthEndpoint = original?.url?.includes('/auth/');
    if (err.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers['Authorization'] = `Bearer ${token}`;
          return api(original);
        });
      }
      isRefreshing = true;
      try {
        const rt = localStorage.getItem('refreshToken');
        // Use the same baseURL as the api instance (bare axios keeps this call free
        // of the auth interceptors) so refresh still hits the backend when frontend
        // and backend are deployed on separate origins.
        const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken: rt });
        const { accessToken, refreshToken } = res.data;
        localStorage.setItem('accessToken', accessToken);
        // Supabase rotates refresh tokens — persist the new one or the next
        // refresh will fail with the now-revoked token and force a logout.
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        window.dispatchEvent(new CustomEvent('token:refreshed', { detail: { accessToken } }));
        processQueue(null, accessToken);
        original.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default api;
