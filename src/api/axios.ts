import axios from 'axios';

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

    return Promise.reject(error);
  }
);

export default api;
