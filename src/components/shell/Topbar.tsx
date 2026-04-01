'use client';

import { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, ChevronDown, LogOut, User } from 'lucide-react';
import { useUiStore } from '@/store/ui.store';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Avatar } from '@/components/ui';
import { cn } from '@/lib/utils';

const ROUTE_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'Users',
  '/moderation': 'Moderation',
  '/marketplace': 'Marketplace',
  '/opportunities': 'Opportunities',
  '/subscriptions': 'Subscriptions',
  '/broadcasts': 'Broadcasts',
  '/settings': 'Settings',
  '/admins': 'Admins',
  '/audit-logs': 'Audit Logs',
};

function getPageTitle(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return 'Dashboard';
  const base = '/' + segments[0];
  return ROUTE_LABELS[base] ?? segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
}

export function Topbar() {
  const pathname = usePathname();
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const { admin, logout } = useAdminAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pageTitle = getPageTitle(pathname);

  const handleDropdownToggle = () => setDropdownOpen((v) => !v);
  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

  return (
    <header
      data-testid="topbar"
      className="flex h-14 items-center justify-between border-b border-border bg-white px-4 gap-4"
    >
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          data-testid="topbar-menu-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="rounded-md p-1.5 text-foreground-secondary hover:bg-surface-alt hover:text-foreground transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1
          data-testid="topbar-title"
          className="text-sm font-semibold text-foreground"
        >
          {pageTitle}
        </h1>
      </div>

      {/* Right: admin avatar dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          data-testid="topbar-avatar-button"
          onClick={handleDropdownToggle}
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground-secondary hover:bg-surface-alt hover:text-foreground transition-colors"
        >
          <Avatar
            src={null}
            firstName={admin?.firstName ?? 'Admin'}
            lastName={admin?.lastName ?? ''}
            size="sm"
          />
          {admin && (
            <span className="hidden sm:block font-medium text-foreground truncate max-w-[120px]">
              {admin.firstName} {admin.lastName}
            </span>
          )}
          <ChevronDown
            size={14}
            className={cn('transition-transform', dropdownOpen && 'rotate-180')}
          />
        </button>

        {dropdownOpen && (
          <div
            data-testid="topbar-dropdown"
            className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border bg-white shadow-md z-50 py-1"
          >
            {admin && (
              <div className="px-3 py-2 border-b border-border">
                <p className="text-xs font-medium text-foreground truncate">{admin.firstName} {admin.lastName}</p>
                <p className="text-xs text-foreground-secondary truncate">{admin.email}</p>
              </div>
            )}
            <button
              data-testid="topbar-profile-link"
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground-secondary hover:bg-surface-alt hover:text-foreground transition-colors"
              onClick={() => setDropdownOpen(false)}
            >
              <User size={14} />
              Profile
            </button>
            <button
              data-testid="topbar-logout"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error-light transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
