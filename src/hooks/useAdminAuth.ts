'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { adminLogout } from '@/lib/api/admin';
import { AdminRole } from '@/types/enums';

export function useAdminAuth() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const admin = useAuthStore((s) => s.admin);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  // Only redirect after hydration completes — store starts empty on every
  // fresh render and hydrate() fills it via useEffect in AdminShellLayout.
  // Without this guard, the redirect fires before the token is restored,
  // hitting /login which the middleware bounces straight back to /dashboard.
  useEffect(() => {
    if (hasHydrated && !token && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hasHydrated, token, isAuthenticated, router]);

  const isSuperAdmin = admin?.role === AdminRole.SUPERADMIN;
  const isLoading = !hasHydrated;

  const logout = () => {
    // Call backend to clear the httpOnly cookie, then wipe in-memory state.
    adminLogout().catch(() => {/* ignore — clear locally regardless */});
    clearAuth();
    router.replace('/login');
  };

  return {
    admin,
    token,
    isAuthenticated,
    isLoading,
    isSuperAdmin,
    logout,
  };
}
