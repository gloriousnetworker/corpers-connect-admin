'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Shield,
  ShoppingBag,
  CreditCard,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const BOTTOM_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Users',     href: '/users',     icon: Users },
  { label: 'Moderation', href: '/moderation', icon: Shield },
  { label: 'Market',    href: '/marketplace', icon: ShoppingBag },
  { label: 'Subs',      href: '/subscriptions', icon: CreditCard },
];

export function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto px-2">
        {BOTTOM_NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-0.5 p-2 min-w-[48px] touch-manipulation"
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={cn(
                  'h-[22px] w-[22px] transition-colors',
                  isActive ? 'text-primary' : 'text-foreground-muted',
                )}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span
                className={cn(
                  'text-[10px] font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-foreground-muted',
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
