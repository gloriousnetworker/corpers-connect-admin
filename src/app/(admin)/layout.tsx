import { AdminLayout } from '@/components/shell';

export default function AdminShellLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
