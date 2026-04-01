'use client';

import { cn } from '@/lib/utils';

export type SpinnerSize = 'sm' | 'md' | 'lg';

const sizeStyles: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
};

interface SpinnerProps {
  size?: SpinnerSize;
  centered?: boolean;
  className?: string;
}

export function Spinner({ size = 'md', centered = false, className }: SpinnerProps) {
  const spinner = (
    <div
      data-testid="spinner"
      role="status"
      aria-label="Loading"
      className={cn(
        'rounded-full border-primary/20 border-t-primary animate-spin',
        sizeStyles[size],
        className,
      )}
    />
  );

  if (centered) {
    return (
      <div className="flex items-center justify-center w-full py-8">
        {spinner}
      </div>
    );
  }

  return spinner;
}
