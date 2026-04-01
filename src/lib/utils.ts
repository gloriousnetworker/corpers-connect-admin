import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import type { UserLevel, SubscriptionTier, ReportStatus, SellerApplicationStatus, ListingStatus, SubscriptionStatus, AdminRole } from '@/types/enums';

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
}

export function formatDate(date: string | Date, fmt = 'MMM d, yyyy'): string {
  return format(new Date(date), fmt);
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy · h:mm a');
}

export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date);
  if (isToday(d)) return formatDistanceToNow(d, { addSuffix: true });
  if (isYesterday(d)) return `Yesterday at ${format(d, 'h:mm a')}`;
  return format(d, 'MMM d, yyyy');
}

export function formatCurrency(amount: number, currency = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// Badge color utilities
export function getLevelColor(level: UserLevel): string {
  const map: Record<UserLevel, string> = {
    OTONDO: 'bg-info-light text-info',
    KOPA: 'bg-warning-light text-warning',
    CORPER: 'bg-gold-light text-gold',
  };
  return map[level] ?? 'bg-surface-alt text-foreground-secondary';
}

export function getSubscriptionColor(tier: SubscriptionTier): string {
  return tier === 'PREMIUM'
    ? 'bg-gold-light text-gold'
    : 'bg-surface-alt text-foreground-secondary';
}

export function getReportStatusColor(status: ReportStatus): string {
  const map: Record<ReportStatus, string> = {
    PENDING: 'bg-warning-light text-warning',
    REVIEWED: 'bg-info-light text-info',
    ACTIONED: 'bg-success-light text-success',
    DISMISSED: 'bg-surface-alt text-foreground-muted',
  };
  return map[status] ?? 'bg-surface-alt text-foreground-secondary';
}

export function getSellerAppStatusColor(status: SellerApplicationStatus): string {
  const map: Record<SellerApplicationStatus, string> = {
    PENDING: 'bg-warning-light text-warning',
    APPROVED: 'bg-success-light text-success',
    REJECTED: 'bg-error-light text-error',
  };
  return map[status] ?? 'bg-surface-alt text-foreground-secondary';
}

export function getListingStatusColor(status: ListingStatus): string {
  const map: Record<ListingStatus, string> = {
    ACTIVE: 'bg-success-light text-success',
    SOLD: 'bg-info-light text-info',
    INACTIVE: 'bg-surface-alt text-foreground-muted',
    REMOVED: 'bg-error-light text-error',
  };
  return map[status] ?? 'bg-surface-alt text-foreground-secondary';
}

export function getSubscriptionStatusColor(status: SubscriptionStatus): string {
  const map: Record<SubscriptionStatus, string> = {
    ACTIVE: 'bg-success-light text-success',
    CANCELLED: 'bg-warning-light text-warning',
    EXPIRED: 'bg-error-light text-error',
  };
  return map[status] ?? 'bg-surface-alt text-foreground-secondary';
}

export function getAdminRoleColor(role: AdminRole): string {
  return role === 'SUPERADMIN'
    ? 'bg-primary-light text-primary'
    : 'bg-surface-alt text-foreground-secondary';
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
