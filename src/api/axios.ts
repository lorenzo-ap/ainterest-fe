import axios from 'axios';
import { toastService } from '../services/toast';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`
});

// Add bearer token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt-token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('jwt-token');

      window.location.href = '/';
    }

    toastService.error(error.response.data.message);

    return Promise.reject(error);
  }
);

export default api;
