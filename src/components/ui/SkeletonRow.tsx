'use client';

import { cn } from '@/lib/utils';

interface SkeletonRowProps {
  columns?: number;
  rows?: number;
  className?: string;
}

function SkeletonCell({ className }: { className?: string }) {
  return (
    <div className={cn('h-4 rounded-md shimmer', className)} />
  );
}

export function SkeletonRow({ columns = 5, rows = 5, className }: SkeletonRowProps) {
  return (
    <tbody data-testid="skeleton-row" className={className}>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={rowIdx} className="border-b border-border">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <td key={colIdx} className="px-4 py-3">
              <SkeletonCell
                className={colIdx === 0 ? 'w-32' : colIdx === columns - 1 ? 'w-16' : 'w-full'}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
