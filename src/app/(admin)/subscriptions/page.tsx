'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { DataTable, FilterBar, Pagination } from '@/components/ui';
import { formatCurrency, formatDate, getSubscriptionStatusColor } from '@/lib/utils';
import type { SubscriptionRecord } from '@/types/models';
import { SubscriptionStatus, SubscriptionPlan } from '@/types/enums';

const STATUS_OPTIONS = [
  { label: 'Active', value: SubscriptionStatus.ACTIVE },
  { label: 'Cancelled', value: SubscriptionStatus.CANCELLED },
  { label: 'Expired', value: SubscriptionStatus.EXPIRED },
];

const PLAN_OPTIONS = [
  { label: 'Monthly', value: SubscriptionPlan.MONTHLY },
  { label: 'Quarterly', value: SubscriptionPlan.QUARTERLY },
  { label: 'Annual', value: SubscriptionPlan.ANNUAL },
];

export default function SubscriptionsPage() {
  const {
    data,
    isLoading,
    statusFilter,
    setStatusFilter,
    planFilter,
    setPlanFilter,
    hasPrev,
    hasNext,
    goNext,
    goPrev,
  } = useSubscriptions();

  const columns: ColumnDef<SubscriptionRecord>[] = [
    {
      id: 'user',
      header: 'User',
      cell: ({ row }: { row: { original: SubscriptionRecord } }) => {
        const u = row.original.user;
        return <span className="text-sm font-medium">{u.firstName} {u.lastName}</span>;
      },
    },
    {
      accessorKey: 'plan',
      header: 'Plan',
      cell: ({ getValue }: { getValue: () => unknown }) => (
        <span className="text-sm capitalize">{(getValue() as string | undefined)?.toLowerCase() ?? ''}</span>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ getValue }: { getValue: () => unknown }) => (
        <span className="text-sm font-medium">{formatCurrency(getValue() as number)}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }: { getValue: () => unknown }) => {
        const s = getValue() as SubscriptionStatus;
        return (
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getSubscriptionStatusColor(s)}`}>
            {s}
          </span>
        );
      },
    },
    {
      accessorKey: 'startDate',
      header: 'Start',
      cell: ({ getValue }: { getValue: () => unknown }) => (
        <span className="text-xs text-foreground-secondary">{formatDate(getValue() as string)}</span>
      ),
    },
    {
      accessorKey: 'endDate',
      header: 'End',
      cell: ({ getValue }: { getValue: () => unknown }) => {
        const d = getValue() as string | null;
        return <span className="text-xs text-foreground-secondary">{d ? formatDate(d) : '—'}</span>;
      },
    },
  ];

  return (
    <div data-testid="subscriptions-page" className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Subscriptions</h1>
        {data?.total != null && (
          <p className="text-sm text-foreground-secondary mt-0.5">{data.total.toLocaleString()} records</p>
        )}
      </div>

      <FilterBar
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: STATUS_OPTIONS,
            value: statusFilter,
            onChange: setStatusFilter,
          },
          {
            key: 'plan',
            label: 'Plan',
            options: PLAN_OPTIONS,
            value: planFilter,
            onChange: setPlanFilter,
          },
        ]}
        onClear={() => { setStatusFilter(''); setPlanFilter(''); }}
      />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={isLoading}
        emptyTitle="No subscriptions found"
        emptyDescription="No subscription records match the current filters."
      />

      <Pagination hasPrev={hasPrev} hasMore={hasNext} onPrev={goPrev} onNext={goNext} loading={isLoading} />
    </div>
  );
}
