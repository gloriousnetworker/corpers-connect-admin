'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { AdminRole } from '@/types/enums';

export function useAdminAuth() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const admin = useAuthStore((s) => s.admin);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const isLoading = !token && !isAuthenticated;

  useEffect(() => {
    if (!token && !isAuthenticated) {
      router.replace('/login');
    }
  }, [token, isAuthenticated, router]);

  const isSuperAdmin = admin?.role === AdminRole.SUPERADMIN;

  const logout = () => {
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
