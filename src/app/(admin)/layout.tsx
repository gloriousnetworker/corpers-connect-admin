'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { AdminLayout } from '@/components/shell';

export default function AdminShellLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    if (hasHydrated && !token && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hasHydrated, token, isAuthenticated, router]);

  if (!hasHydrated) {
    return null;
  }

  if (!token && !isAuthenticated) {
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
