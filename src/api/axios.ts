import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { apis } from '../assets/apis/apis';
import { toastService } from '../services/toast';
import { getAccessToken, removeAccessToken, setAccessToken } from '../utils';
import { refreshToken } from './auth';

export const req = axios.create({
  baseURL: apis.root,
  withCredentials: true
});

req.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return Promise.reject(error);
    }

    if (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
      toastService.error(error.response.data.message as string);
      return Promise.reject(error);
    }
  }
);

export const authReq = axios.create({
  baseURL: apis.root
});

authReq.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let refreshTokenPromise: Promise<string> | null = null;

authReq.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only handle 401 errors, and don't retry the refresh token endpoint
    if (error.response?.status !== 401 || originalRequest.url?.includes('/auth/refresh')) {
      if (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        toastService.error(error.response.data.message as string);
      }
      return Promise.reject(error);
    }

    // Prevent infinite loops for the same request
    if (originalRequest._retry) {
      removeAccessToken();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshAccessToken().finally(() => {
        refreshTokenPromise = null;
      });
    }

    try {
      // All subsequent failed requests will wait here for the single refreshTokenPromise to complete
      const newToken = await refreshTokenPromise;

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return authReq(originalRequest);
    } catch (refreshError) {
      removeAccessToken();
      return Promise.reject(refreshError);
    }
  }
);

async function refreshAccessToken(): Promise<string> {
  const response = await refreshToken();
  const { accessToken } = response.data;
  setAccessToken(accessToken);
  return accessToken;
}
