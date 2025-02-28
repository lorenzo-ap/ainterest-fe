import axios from 'axios';
import { apis } from '../assets/apis/apis';
import { toastService } from '../services/toast';

export const req = axios.create({
  baseURL: apis.root
});

// Add bearer token to requests
req.interceptors.request.use(
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
req.interceptors.response.use(
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

export default req;
