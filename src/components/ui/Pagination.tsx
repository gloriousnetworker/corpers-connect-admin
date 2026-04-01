'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  hasMore: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
  /** e.g. "1–25 of 240" — optional summary text */
  summary?: string;
  loading?: boolean;
  className?: string;
}

export function Pagination({
  hasMore,
  hasPrev,
  onNext,
  onPrev,
  summary,
  loading = false,
  className,
}: PaginationProps) {
  return (
    <div
      data-testid="pagination"
      className={cn('flex items-center justify-between gap-4 py-3 px-1', className)}
    >
      {summary ? (
        <span className="text-sm text-foreground-secondary">{summary}</span>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-2">
        <button
          data-testid="pagination-prev"
          onClick={onPrev}
          disabled={!hasPrev || loading}
          aria-label="Previous page"
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border transition-colors',
            hasPrev && !loading
              ? 'text-foreground hover:bg-surface-alt'
              : 'text-foreground-muted cursor-not-allowed opacity-50',
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>

        <button
          data-testid="pagination-next"
          onClick={onNext}
          disabled={!hasMore || loading}
          aria-label="Next page"
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border transition-colors',
            hasMore && !loading
              ? 'text-foreground hover:bg-surface-alt'
              : 'text-foreground-muted cursor-not-allowed opacity-50',
          )}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
