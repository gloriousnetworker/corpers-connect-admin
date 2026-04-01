'use client';

import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { AdminBottomNav } from './AdminBottomNav';
import { useAuthStore } from '@/store/auth.store';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const hydrate = useAuthStore((s) => s.hydrate);

  // Hydrate as early as possible so hasHydrated is set before any page
  // component or hook (especially useAdminAuth) checks the auth state.
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div data-testid="admin-layout" className="flex h-screen overflow-hidden bg-surface">
      {/* Sidebar: desktop only */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Topbar />
        <main
          data-testid="admin-main"
          className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 lg:pb-6"
        >
          {children}
        </main>
      </div>

      {/* Bottom nav: mobile only */}
      <AdminBottomNav />
    </div>
  );
}
