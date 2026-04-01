'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useSellerApplications, useListings } from '@/hooks/useMarketplace';
import { DataTable, FilterBar, Pagination, ConfirmModal } from '@/components/ui';
import { formatRelativeTime, formatCurrency, getSellerAppStatusColor, getListingStatusColor } from '@/lib/utils';
import type { SellerApplication, Listing } from '@/types/models';
import { SellerApplicationStatus, ListingStatus } from '@/types/enums';

type Tab = 'applications' | 'listings';

const APP_STATUS_OPTIONS = [
  { label: 'Pending', value: SellerApplicationStatus.PENDING },
  { label: 'Approved', value: SellerApplicationStatus.APPROVED },
  { label: 'Rejected', value: SellerApplicationStatus.REJECTED },
];

const LISTING_STATUS_OPTIONS = [
  { label: 'Active', value: ListingStatus.ACTIVE },
  { label: 'Sold', value: ListingStatus.SOLD },
  { label: 'Inactive', value: ListingStatus.INACTIVE },
  { label: 'Removed', value: ListingStatus.REMOVED },
];

export default function MarketplacePage() {
  const [tab, setTab] = useState<Tab>('applications');
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);

  const apps = useSellerApplications();
  const listings = useListings();

  const appColumns: ColumnDef<SellerApplication>[] = [
    {
      id: 'applicant',
      header: 'Applicant',
      cell: ({ row }) => {
        const a = row.original.applicant;
        return <span className="text-sm font-medium">{a.firstName} {a.lastName}</span>;
      },
    },
    { accessorKey: 'businessName', header: 'Business' },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ getValue }) => (
        <span className="text-sm text-foreground-secondary capitalize">{(getValue() as string).toLowerCase()}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const s = getValue() as SellerApplicationStatus;
        return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getSellerAppStatusColor(s)}`}>{s}</span>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Applied',
      cell: ({ getValue }) => (
        <span className="text-xs text-foreground-secondary">{formatRelativeTime(getValue() as string)}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const app = row.original;
        if (app.status !== SellerApplicationStatus.PENDING) return null;
        return (
          <div className="flex gap-2">
            <button
              data-testid={`approve-${app.id}`}
              onClick={(e) => { e.stopPropagation(); apps.approve.mutate(app.id); }}
              disabled={apps.approve.isPending}
              className="px-2 py-1 rounded text-xs bg-success-light text-success font-medium hover:bg-success/20 disabled:opacity-50"
            >
              Approve
            </button>
            <button
              data-testid={`reject-${app.id}`}
              onClick={(e) => { e.stopPropagation(); setRejectTarget(app.id); }}
              className="px-2 py-1 rounded text-xs bg-error-light text-error font-medium hover:bg-error/20"
            >
              Reject
            </button>
          </div>
        );
      },
    },
  ];

  const listingColumns: ColumnDef<Listing>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ getValue }) => <span className="text-sm font-medium line-clamp-1">{getValue() as string}</span>,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ getValue }) => (
        <span className="text-sm text-foreground-secondary capitalize">{(getValue() as string).toLowerCase()}</span>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ getValue }) => {
        const p = getValue() as number | null;
        return <span className="text-sm">{p != null ? formatCurrency(p) : 'Free'}</span>;
      },
    },
    {
      id: 'seller',
      header: 'Seller',
      cell: ({ row }) => {
        const s = row.original.seller;
        return <span className="text-sm text-foreground-secondary">{s.firstName} {s.lastName}</span>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const s = getValue() as ListingStatus;
        return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getListingStatusColor(s)}`}>{s}</span>;
      },
    },
    {
      accessorKey: 'viewCount',
      header: 'Views',
      cell: ({ getValue }) => (
        <span className="text-sm text-foreground-secondary">{(getValue() as number).toLocaleString()}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const listing = row.original;
        if (listing.status === ListingStatus.REMOVED) return null;
        return (
          <button
            data-testid={`remove-${listing.id}`}
            onClick={(e) => { e.stopPropagation(); setRemoveTarget(listing.id); }}
            className="px-2 py-1 rounded text-xs bg-error-light text-error font-medium hover:bg-error/20"
          >
            Remove
          </button>
        );
      },
    },
  ];

  return (
    <div data-testid="marketplace-page" className="space-y-4">
      <h1 className="text-lg font-semibold text-foreground">Marketplace</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-alt rounded-lg p-1 w-fit" data-testid="marketplace-tabs">
        {(['applications', 'listings'] as Tab[]).map((t) => (
          <button
            key={t}
            data-testid={`tab-${t}`}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === t ? 'bg-white shadow-sm text-foreground' : 'text-foreground-secondary hover:text-foreground'
            }`}
          >
            {t === 'applications' ? 'Seller Applications' : 'Listings'}
          </button>
        ))}
      </div>

      {/* Applications Tab */}
      {tab === 'applications' && (
        <div data-testid="applications-tab-content">
          <FilterBar
            filters={[{
              key: 'status',
              label: 'Status',
              options: APP_STATUS_OPTIONS,
              value: apps.statusFilter,
              onChange: apps.setStatusFilter,
            }]}
            onClear={() => apps.setStatusFilter('')}
          />
          <DataTable
            columns={appColumns}
            data={apps.data?.data ?? []}
            loading={apps.isLoading}
            emptyTitle="No applications found"
            emptyDescription="No seller applications match the current filters."
          />
          <Pagination hasPrev={apps.hasPrev} hasMore={apps.hasNext} onPrev={apps.goPrev} onNext={apps.goNext} loading={apps.isLoading} />
        </div>
      )}

      {/* Listings Tab */}
      {tab === 'listings' && (
        <div data-testid="listings-tab-content">
          <FilterBar
            search={{ value: listings.search, onChange: listings.setSearch, placeholder: 'Search listings…' }}
            filters={[{
              key: 'status',
              label: 'Status',
              options: LISTING_STATUS_OPTIONS,
              value: listings.statusFilter,
              onChange: listings.setStatusFilter,
            }]}
            onClear={() => { listings.setSearch(''); listings.setStatusFilter(''); }}
          />
          <DataTable
            columns={listingColumns}
            data={listings.data?.data ?? []}
            loading={listings.isLoading}
            emptyTitle="No listings found"
            emptyDescription="No listings match the current filters."
          />
          <Pagination hasPrev={listings.hasPrev} hasMore={listings.hasNext} onPrev={listings.goPrev} onNext={listings.goNext} loading={listings.isLoading} />
        </div>
      )}

      <ConfirmModal
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={() => {
          if (rejectTarget) apps.reject.mutate({ appId: rejectTarget, reason: 'Does not meet requirements' });
          setRejectTarget(null);
        }}
        title="Reject Application"
        description="This seller application will be rejected. The applicant will be notified."
        confirmLabel="Reject"
        variant="danger"
        loading={apps.reject.isPending}
      />

      <ConfirmModal
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={() => {
          if (removeTarget) listings.remove.mutate(removeTarget);
          setRemoveTarget(null);
        }}
        title="Remove Listing"
        description="This listing will be removed from the marketplace."
        confirmLabel="Remove"
        variant="danger"
        loading={listings.remove.isPending}
      />
    </div>
  );
}
