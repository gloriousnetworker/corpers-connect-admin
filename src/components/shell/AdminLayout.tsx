'use client';

import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div data-testid="admin-layout" className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Topbar />
        <main
          data-testid="admin-main"
          className="flex-1 overflow-y-auto p-6"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
