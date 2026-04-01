'use client';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-surface-elevated flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-6 mx-auto">
        <span className="text-white text-2xl font-bold">CC</span>
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">You're offline</h1>
      <p className="text-foreground-secondary text-sm max-w-xs mb-6">
        No internet connection. Check your network and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
      >
        Try again
      </button>
      <p className="mt-8 text-xs text-foreground-muted">Corpers Connect Admin Portal</p>
    </div>
  );
}
