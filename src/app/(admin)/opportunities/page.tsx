'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Star } from 'lucide-react';
import { useOpportunities } from '@/hooks/useOpportunities';
import { DataTable, FilterBar, Pagination, Badge, ConfirmModal } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils';
import type { Opportunity } from '@/types/models';
import { OpportunityType } from '@/types/enums';
import { useState } from 'react';

const TYPE_OPTIONS = [
  { label: 'Internship', value: OpportunityType.INTERNSHIP },
  { label: 'Job', value: OpportunityType.JOB },
  { label: 'Scholarship', value: OpportunityType.SCHOLARSHIP },
  { label: 'Volunteering', value: OpportunityType.VOLUNTEERING },
  { label: 'Other', value: OpportunityType.OTHER },
];

export default function OpportunitiesPage() {
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const {
    data,
    isLoading,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    hasPrev,
    hasNext,
    goNext,
    goPrev,
    feature,
    remove,
  } = useOpportunities();

  const columns: ColumnDef<Opportunity>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ getValue, row }) => (
        <div className="flex items-center gap-2">
          {row.original.isFeatured && <Star size={13} className="text-gold fill-gold flex-shrink-0" />}
          <span className="text-sm font-medium line-clamp-1">{getValue() as string}</span>
        </div>
      ),
    },
    {
      accessorKey: 'companyName',
      header: 'Company',
      cell: ({ getValue }) => <span className="text-sm text-foreground-secondary">{getValue() as string}</span>,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ getValue }) => <Badge variant="info">{getValue() as string}</Badge>,
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ getValue, row }) => (
        <span className="text-sm text-foreground-secondary">
          {row.original.isRemote ? 'Remote' : (getValue() as string | null) ?? '—'}
        </span>
      ),
    },
    {
      accessorKey: 'applicationCount',
      header: 'Applications',
      cell: ({ getValue }) => (
        <span className="text-sm text-foreground-secondary">{(getValue() as number).toLocaleString()}</span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Posted',
      cell: ({ getValue }) => (
        <span className="text-xs text-foreground-secondary whitespace-nowrap">{formatRelativeTime(getValue() as string)}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const opp = row.original;
        return (
          <div className="flex gap-2">
            <button
              data-testid={`feature-${opp.id}`}
              onClick={(e) => { e.stopPropagation(); feature.mutate({ id: opp.id, isFeatured: !opp.isFeatured }); }}
              disabled={feature.isPending}
              className={`px-2 py-1 rounded text-xs font-medium disabled:opacity-50 ${
                opp.isFeatured
                  ? 'bg-gold-light text-gold hover:bg-gold/20'
                  : 'bg-surface-alt text-foreground-secondary hover:bg-border'
              }`}
            >
              {opp.isFeatured ? 'Unfeature' : 'Feature'}
            </button>
            <button
              data-testid={`remove-opp-${opp.id}`}
              onClick={(e) => { e.stopPropagation(); setRemoveTarget(opp.id); }}
              className="px-2 py-1 rounded text-xs bg-error-light text-error font-medium hover:bg-error/20"
            >
              Remove
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div data-testid="opportunities-page" className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Opportunities</h1>
        {data?.total != null && (
          <p className="text-sm text-foreground-secondary mt-0.5">{data.total.toLocaleString()} opportunities</p>
        )}
      </div>

      <FilterBar
        search={{ value: search, onChange: setSearch, placeholder: 'Search opportunities…' }}
        filters={[{
          key: 'type',
          label: 'Type',
          options: TYPE_OPTIONS,
          value: typeFilter,
          onChange: setTypeFilter,
        }]}
        onClear={() => { setSearch(''); setTypeFilter(''); }}
      />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={isLoading}
        emptyTitle="No opportunities found"
        emptyDescription="No opportunities match the current filters."
      />

      <Pagination hasPrev={hasPrev} hasMore={hasNext} onPrev={goPrev} onNext={goNext} loading={isLoading} />

      <ConfirmModal
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={() => {
          if (removeTarget) remove.mutate(removeTarget);
          setRemoveTarget(null);
        }}
        title="Remove Opportunity"
        description="This opportunity will be permanently removed from the platform."
        confirmLabel="Remove"
        variant="danger"
        loading={remove.isPending}
      />
    </div>
  );
}
