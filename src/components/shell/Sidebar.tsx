'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Shield,
  ShoppingBag,
  Briefcase,
  CreditCard,
  Megaphone,
  Settings,
  UserCog,
  ScrollText,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useUiStore } from '@/store/ui.store';
import { Avatar } from '@/components/ui';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  superAdminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Moderation', href: '/moderation', icon: Shield },
  { label: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
  { label: 'Opportunities', href: '/opportunities', icon: Briefcase },
  { label: 'Subscriptions', href: '/subscriptions', icon: CreditCard },
  { label: 'Broadcasts', href: '/broadcasts', icon: Megaphone },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Admins', href: '/admins', icon: UserCog, superAdminOnly: true },
  { label: 'Audit Logs', href: '/audit-logs', icon: ScrollText, superAdminOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { admin, isSuperAdmin, logout } = useAdminAuth();
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  const visibleItems = NAV_ITEMS.filter((item) => !item.superAdminOnly || isSuperAdmin);

  return (
    <aside
      data-testid="sidebar"
      className={cn(
        'relative flex h-full flex-col bg-white border-r border-border transition-all duration-200',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo / brand */}
      <div className={cn('flex items-center gap-3 px-4 py-4 border-b border-border', collapsed && 'justify-center px-2')}>
        <Image
          src="/corpers-connect-logo-without-background.png"
          alt="Corpers Connect"
          width={collapsed ? 36 : 32}
          height={collapsed ? 36 : 32}
          className="flex-shrink-0 object-contain"
          priority
        />
        {!collapsed && (
          <div className="min-w-0">
            <span className="font-semibold text-sm text-foreground truncate block">Corpers Connect</span>
            <span className="text-[10px] text-foreground-secondary">Admin Portal</span>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5" data-testid="sidebar-nav">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`nav-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-foreground-secondary hover:bg-surface-alt hover:text-foreground',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Admin profile + sign out */}
      <div className={cn('border-t border-border p-3 space-y-1', collapsed && 'flex flex-col items-center')}>
        {admin && (
          <div className={cn('flex items-center gap-2', collapsed && 'justify-center')}>
            <Avatar
              src={null}
              firstName={admin.firstName}
              lastName={admin.lastName}
              size="sm"
              className="flex-shrink-0"
            />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground truncate">{admin.firstName} {admin.lastName}</p>
                <p className="text-xs text-foreground-secondary truncate">{admin.role}</p>
              </div>
            )}
          </div>
        )}
        <button
          data-testid="sidebar-logout"
          onClick={logout}
          className={cn(
            'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground-secondary hover:bg-error-light hover:text-error transition-colors',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Sign out' : undefined}
        >
          <LogOut size={16} />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        data-testid="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-white shadow-sm text-foreground-secondary hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
