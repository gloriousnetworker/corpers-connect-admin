import { create } from 'zustand';
import type { AdminUser } from '@/types/models';

interface AuthState {
  token: string | null;
  admin: AdminUser | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setAuth: (token: string, admin: AdminUser) => void;
  clearAuth: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  admin: null,
  isAuthenticated: false,
  hasHydrated: false,

  setAuth: (token, admin) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cc_admin_token', token);
      localStorage.setItem('cc_admin_user', JSON.stringify(admin));
      // Store the JWT in the session cookie so middleware can decode it and
      // verify expiry + role — not just a presence flag.
      // Not httpOnly because client JS must be able to clear it on logout.
      document.cookie = `cc_admin_session=${token}; path=/; max-age=2592000; SameSite=Lax`;
    }
    set({ token, admin, isAuthenticated: true });
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cc_admin_token');
      localStorage.removeItem('cc_admin_user');
      document.cookie = 'cc_admin_session=; path=/; max-age=0';
    }
    set({ token: null, admin: null, isAuthenticated: false });
  },

  hydrate: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('cc_admin_token');
    const adminRaw = localStorage.getItem('cc_admin_user');
    const validToken = token && token !== 'undefined' && token !== 'null';
    if (validToken && adminRaw) {
      try {
        const admin = JSON.parse(adminRaw) as AdminUser;
        set({ token, admin, isAuthenticated: true, hasHydrated: true });
      } catch {
        localStorage.removeItem('cc_admin_token');
        localStorage.removeItem('cc_admin_user');
        document.cookie = 'cc_admin_session=; path=/; max-age=0';
        set({ hasHydrated: true });
      }
    } else {
      // Clear any stale/corrupt values
      localStorage.removeItem('cc_admin_token');
      localStorage.removeItem('cc_admin_user');
      document.cookie = 'cc_admin_session=; path=/; max-age=0';
      set({ hasHydrated: true });
    }
  },
}));
