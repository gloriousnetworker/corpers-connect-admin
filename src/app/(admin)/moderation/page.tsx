'use client';

import { useRouter } from 'next/navigation';
import type { ColumnDef } from '@tanstack/react-table';
import { useReports } from '@/hooks/useReports';
import { DataTable, FilterBar, Pagination, Badge } from '@/components/ui';
import { formatRelativeTime, getReportStatusColor } from '@/lib/utils';
import type { Report } from '@/types/models';
import { ReportStatus, ReportEntityType } from '@/types/enums';

const STATUS_OPTIONS = [
  { label: 'Pending', value: ReportStatus.PENDING },
  { label: 'Reviewed', value: ReportStatus.REVIEWED },
  { label: 'Actioned', value: ReportStatus.ACTIONED },
  { label: 'Dismissed', value: ReportStatus.DISMISSED },
];

const ENTITY_OPTIONS = [
  { label: 'Post', value: ReportEntityType.POST },
  { label: 'Story', value: ReportEntityType.STORY },
  { label: 'Reel', value: ReportEntityType.REEL },
  { label: 'Listing', value: ReportEntityType.LISTING },
  { label: 'User', value: ReportEntityType.USER },
  { label: 'Comment', value: ReportEntityType.COMMENT },
];

const COLUMNS: ColumnDef<Report>[] = [
  {
    accessorKey: 'entityType',
    header: 'Type',
    cell: ({ getValue }) => (
      <span className="capitalize text-sm text-foreground-secondary">
        {(getValue() as string | undefined)?.toLowerCase() ?? ''}
      </span>
    ),
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
    cell: ({ getValue }) => (
      <span className="text-sm text-foreground line-clamp-1">{getValue() as string}</span>
    ),
  },
  {
    id: 'reporter',
    header: 'Reporter',
    cell: ({ row }) => {
      const r = row.original.reporter;
      return (
        <span className="text-sm text-foreground-secondary">
          {r.firstName} {r.lastName}
        </span>
      );
    },
  },
  {
    id: 'reported',
    header: 'Reported',
    cell: ({ row }) => {
      const u = row.original.reportedUser;
      if (!u) return <span className="text-sm text-foreground-secondary">—</span>;
      return (
        <span className="text-sm text-foreground-secondary">
          {u.firstName} {u.lastName}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue() as ReportStatus;
      return (
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getReportStatusColor(status)}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Reported',
    cell: ({ getValue }) => (
      <span className="text-xs text-foreground-secondary whitespace-nowrap">
        {formatRelativeTime(getValue() as string)}
      </span>
    ),
  },
];

export default function ModerationPage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    filters,
    updateFilters,
    clearFilters,
    hasPrev,
    hasNext,
    goNext,
    goPrev,
  } = useReports();

  return (
    <div data-testid="moderation-page" className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Moderation</h1>
        {data?.total != null && (
          <p className="text-sm text-foreground-secondary mt-0.5">{data.total.toLocaleString()} reports</p>
        )}
      </div>

      <FilterBar
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: STATUS_OPTIONS,
            value: filters.status,
            onChange: (v) => updateFilters({ status: v }),
          },
          {
            key: 'entityType',
            label: 'Content Type',
            options: ENTITY_OPTIONS,
            value: filters.entityType,
            onChange: (v) => updateFilters({ entityType: v }),
          },
        ]}
        onClear={clearFilters}
      />

      <DataTable
        columns={COLUMNS}
        data={data?.data ?? []}
        loading={isLoading}
        emptyTitle="No reports found"
        emptyDescription="No reports match the current filters."
        onRowClick={(report) => router.push(`/moderation/${report.id}`)}
      />

      <Pagination
        hasPrev={hasPrev}
        hasMore={hasNext}
        onPrev={goPrev}
        onNext={goNext}
        loading={isLoading}
      />
    </div>
  );
}
