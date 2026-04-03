import { create } from 'zustand';
import type { AdminUser } from '@/types/models';

interface AuthState {
  token: string | null;
  admin: AdminUser | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setAuth: (token: string, admin: AdminUser) => void;
  clearAuth: () => void;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  admin: null,
  isAuthenticated: false,
  hasHydrated: false,

  setAuth: (token, admin) => {
    // Store token in memory only — never in localStorage.
    // The backend sets the httpOnly cc_admin_session cookie so there is no
    // client-side token to persist.
    set({ token, admin, isAuthenticated: true });
  },

  clearAuth: () => {
    // Remove legacy localStorage entries from before the httpOnly migration.
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cc_admin_token');
      localStorage.removeItem('cc_admin_user');
    }
    set({ token: null, admin: null, isAuthenticated: false });
  },

  hydrate: async () => {
    // Restore session by calling GET /admin/auth/me — the httpOnly
    // cc_admin_session cookie is sent automatically (withCredentials).
    // This replaces the old localStorage-based approach.
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL not set');

      const res = await fetch(`${API_URL}/api/v1/admin/auth/me`, {
        credentials: 'include',
        cache: 'no-store',
      });

      if (!res.ok) throw new Error('Session invalid');

      const json = (await res.json()) as {
        status: string;
        data: { token: string; admin: AdminUser };
      };

      set({
        token: json.data.token,
        admin: json.data.admin,
        isAuthenticated: true,
        hasHydrated: true,
      });
    } catch {
      // No valid session — clean up any legacy localStorage artefacts
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cc_admin_token');
        localStorage.removeItem('cc_admin_user');
      }
      set({ hasHydrated: true });
    }
  },
}));
