import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { apis } from '../assets/apis/apis';
import { toastService } from '../services/toast';
import { refreshToken } from './auth';

export const req = axios.create({
  baseURL: apis.root,
  withCredentials: true
});

let refreshTokenPromise: Promise<void> | null = null;

req.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401) {
      if (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        toastService.error(error.response.data.message as string);
      }
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // Prevent infinite loops for the same request
    if (originalRequest._retry) {
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
      await refreshTokenPromise;

      // Retry the original request with the refreshed cookie
      return req(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

async function refreshAccessToken(): Promise<void> {
  await refreshToken();
}
