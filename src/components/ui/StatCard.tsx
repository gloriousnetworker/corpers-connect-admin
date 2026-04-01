'use client';

import { type LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  /** Percentage change — positive = up, negative = down, undefined = no change chip */
  change?: number;
  changeLabel?: string;
  href?: string;
  className?: string;
}

export function StatCard({ icon: Icon, label, value, change, changeLabel, href, className }: StatCardProps) {
  const hasChange = change !== undefined;
  const isUp = hasChange && change > 0;
  const isDown = hasChange && change < 0;
  const isFlat = hasChange && change === 0;

  const changeChip = hasChange ? (
    <span
      data-testid="stat-card-change"
      className={cn(
        'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full',
        isUp   && 'bg-success-light text-success',
        isDown && 'bg-error-light text-error',
        isFlat && 'bg-surface-alt text-foreground-muted',
      )}
    >
      {isUp   && <TrendingUp  className="w-3 h-3" aria-hidden />}
      {isDown && <TrendingDown className="w-3 h-3" aria-hidden />}
      {isFlat && <Minus        className="w-3 h-3" aria-hidden />}
      {Math.abs(change)}%{changeLabel ? ` ${changeLabel}` : ''}
    </span>
  ) : null;

  const card = (
    <div
      data-testid="stat-card"
      className={cn(
        'bg-surface rounded-xl p-5 shadow-card flex flex-col gap-3',
        href && 'hover:shadow-card-hover transition-shadow cursor-pointer',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground-secondary">{label}</span>
        <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-primary" aria-hidden />
        </div>
      </div>
      <div className="flex items-end justify-between gap-2">
        <span data-testid="stat-card-value" className="text-2xl font-bold text-foreground leading-none">
          {value}
        </span>
        {changeChip}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{card}</Link>;
  }

  return card;
}
