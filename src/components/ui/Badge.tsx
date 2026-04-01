'use client';

import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'primary'
  | 'gold'
  | 'neutral';

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-success-light text-success',
  warning: 'bg-warning-light text-warning',
  error:   'bg-error-light text-error',
  info:    'bg-info-light text-info',
  primary: 'bg-primary-light text-primary',
  gold:    'bg-gold-light text-gold',
  neutral: 'bg-surface-alt text-foreground-secondary',
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      data-testid="badge"
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold whitespace-nowrap',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
