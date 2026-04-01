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
    }
    set({ token, admin, isAuthenticated: true });
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cc_admin_token');
      localStorage.removeItem('cc_admin_user');
    }
    set({ token: null, admin: null, isAuthenticated: false });
  },

  hydrate: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('cc_admin_token');
    const adminRaw = localStorage.getItem('cc_admin_user');
    if (token && adminRaw) {
      try {
        const admin = JSON.parse(adminRaw) as AdminUser;
        set({ token, admin, isAuthenticated: true, hasHydrated: true });
      } catch {
        localStorage.removeItem('cc_admin_token');
        localStorage.removeItem('cc_admin_user');
        set({ hasHydrated: true });
      }
    } else {
      set({ hasHydrated: true });
    }
  },
}));
