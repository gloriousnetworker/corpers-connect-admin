import axios, { type AxiosError } from 'axios';
import { routerPush } from '@/lib/router-ref';
import { useAuthStore } from '@/store/auth.store';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL is not set — add it to your .env.local or Vercel env vars');

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token from localStorage on every request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('cc_admin_token');
    // Guard against stale "undefined" / "null" strings from broken prior logins
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// On 401: clear token and redirect to login
apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        useAuthStore.getState().clearAuth();
        routerPush(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      }
    }
    const message =
      (error.response?.data as { message?: string })?.message ??
      error.message ??
      'An unexpected error occurred';
    const err = new Error(message) as Error & { statusCode?: number };
    err.statusCode = error.response?.status;
    return Promise.reject(err);
  },
);
