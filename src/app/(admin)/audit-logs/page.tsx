'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { DataTable, FilterBar, Pagination } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils';
import type { AuditLog } from '@/types/models';

const COLUMNS: ColumnDef<AuditLog>[] = [
  {
    id: 'admin',
    header: 'Admin',
    cell: ({ row }) => {
      const a = row.original.admin;
      return (
        <div>
          <p className="text-sm font-medium text-foreground">{a.firstName} {a.lastName}</p>
          <p className="text-xs text-foreground-secondary">{a.email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ getValue }) => (
      <span className="text-xs bg-surface-alt text-foreground-secondary px-2 py-0.5 rounded font-mono">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: 'targetType',
    header: 'Target Type',
    cell: ({ getValue }) => {
      const v = getValue() as string | null;
      return <span className="text-sm text-foreground-secondary capitalize">{v?.toLowerCase() ?? '—'}</span>;
    },
  },
  {
    accessorKey: 'targetLabel',
    header: 'Target',
    cell: ({ getValue }) => {
      const v = getValue() as string | null;
      return <span className="text-sm text-foreground-secondary">{v ?? '—'}</span>;
    },
  },
  {
    accessorKey: 'ipAddress',
    header: 'IP',
    cell: ({ getValue }) => {
      const v = getValue() as string | null;
      return <span className="text-xs font-mono text-foreground-secondary">{v ?? '—'}</span>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'When',
    cell: ({ getValue }) => (
      <span className="text-xs text-foreground-secondary whitespace-nowrap">
        {formatRelativeTime(getValue() as string)}
      </span>
    ),
  },
];

export default function AuditLogsPage() {
  const {
    data,
    isLoading,
    action,
    setAction,
    hasPrev,
    hasNext,
    goNext,
    goPrev,
  } = useAuditLogs();

  return (
    <div data-testid="audit-logs-page" className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Audit Logs</h1>
        {data?.data.length != null && (
          <p className="text-sm text-foreground-secondary mt-0.5">Activity trail for all admin actions</p>
        )}
      </div>

      <FilterBar
        search={{
          value: action,
          onChange: setAction,
          placeholder: 'Filter by action (e.g. SUSPEND_USER)…',
        }}
        onClear={() => setAction('')}
      />

      <DataTable
        columns={COLUMNS}
        data={data?.data ?? []}
        loading={isLoading}
        emptyTitle="No audit logs found"
        emptyDescription="No admin actions match the current filter."
      />

      <Pagination hasPrev={hasPrev} hasMore={hasNext} onPrev={goPrev} onNext={goNext} loading={isLoading} />
    </div>
  );
}
