'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Admin Error Boundary]', error);
  }, [error]);

  return (
    <div
      data-testid="admin-error-boundary"
      className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center px-4"
    >
      <div className="w-12 h-12 rounded-full bg-error-light flex items-center justify-center">
        <AlertTriangle className="text-error" size={24} />
      </div>
      <div>
        <h2 className="text-base font-semibold text-foreground">Something went wrong</h2>
        <p className="text-sm text-foreground-secondary mt-1 max-w-sm">
          An unexpected error occurred. Try refreshing the page.
        </p>
        {error.digest && (
          <p className="text-xs text-foreground-muted mt-2 font-mono">Error ID: {error.digest}</p>
        )}
      </div>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90"
      >
        <RefreshCw size={14} />
        Try again
      </button>
    </div>
  );
}
