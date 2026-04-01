import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      data-testid="not-found-page"
      className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4 bg-surface-elevated"
    >
      <div className="text-6xl font-bold text-primary select-none">404</div>
      <div>
        <h1 className="text-xl font-semibold text-foreground">Page not found</h1>
        <p className="text-sm text-foreground-secondary mt-1">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
