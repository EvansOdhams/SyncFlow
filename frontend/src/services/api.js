import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me')
};

// Platforms API
export const platformsAPI = {
  getPlatforms: () => api.get('/platforms'),
  getPlatform: (id) => api.get(`/platforms/${id}`),
  connectWooCommerce: (data) => api.post('/platforms/woocommerce', data),
  connectShopify: (data) => api.post('/platforms/shopify', data),
  disconnectPlatform: (id) => api.delete(`/platforms/${id}`)
};

// Sync API
export const syncAPI = {
  syncPlatforms: (data) => api.post('/sync/platforms', data),
  syncAll: () => api.post('/sync/all'),
  getSyncHistory: (limit) => api.get(`/sync/history?limit=${limit || 50}`)
};

export default api;

