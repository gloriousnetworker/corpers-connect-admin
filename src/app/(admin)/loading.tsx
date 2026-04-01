import { Spinner } from '@/components/ui';

export default function AdminLoading() {
  return (
    <div
      data-testid="admin-loading"
      className="flex items-center justify-center min-h-[400px]"
    >
      <Spinner size="lg" />
    </div>
  );
}
