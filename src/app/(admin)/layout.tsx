'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { AdminLayout } from '@/components/shell';

export default function AdminShellLayout({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);

  // Restore token + admin from localStorage into Zustand on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <AdminLayout>{children}</AdminLayout>;
}
