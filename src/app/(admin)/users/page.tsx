'use client';

import { useRouter } from 'next/navigation';
import type { ColumnDef } from '@tanstack/react-table';
import { useUsers } from '@/hooks/useUsers';
import { DataTable, FilterBar, Pagination, Badge, Avatar } from '@/components/ui';
import { formatRelativeTime, getLevelColor, getSubscriptionColor } from '@/lib/utils';
import type { UserListItem } from '@/types/models';
import { UserStatus, SubscriptionTier, UserLevel } from '@/types/enums';

const STATUS_OPTIONS = [
  { label: 'Active', value: UserStatus.ACTIVE },
  { label: 'Suspended', value: UserStatus.SUSPENDED },
];

const TIER_OPTIONS = [
  { label: 'Free', value: SubscriptionTier.FREE },
  { label: 'Premium', value: SubscriptionTier.PREMIUM },
];

const LEVEL_OPTIONS = [
  { label: 'Otondo', value: UserLevel.OTONDO },
  { label: 'Kopa', value: UserLevel.KOPA },
  { label: 'Corper', value: UserLevel.CORPER },
];

const COLUMNS: ColumnDef<UserListItem>[] = [
  {
    id: 'user',
    header: 'User',
    cell: ({ row }) => {
      const u = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar
            src={u.profilePicture ?? null}
            firstName={u.firstName}
            lastName={u.lastName}
            size="sm"
          />
          <div>
            <p className="font-medium text-foreground text-sm">
              {u.firstName} {u.lastName}
            </p>
            <p className="text-xs text-foreground-secondary">{u.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'stateCode',
    header: 'Code',
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-foreground-secondary">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'servingState',
    header: 'State',
  },
  {
    accessorKey: 'level',
    header: 'Level',
    cell: ({ getValue }) => {
      const level = getValue() as UserLevel;
      return (
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(level)}`}>
          {level}
        </span>
      );
    },
  },
  {
    accessorKey: 'subscriptionTier',
    header: 'Tier',
    cell: ({ getValue }) => {
      const tier = getValue() as SubscriptionTier;
      return (
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getSubscriptionColor(tier)}`}>
          {tier}
        </span>
      );
    },
  },
  {
    accessorKey: 'isVerified',
    header: 'Verified',
    cell: ({ getValue }) =>
      getValue() ? (
        <Badge variant="success">Yes</Badge>
      ) : (
        <Badge variant="neutral">No</Badge>
      ),
  },
  {
    accessorKey: 'isSuspended',
    header: 'Status',
    cell: ({ getValue }) =>
      getValue() ? (
        <Badge variant="error">Suspended</Badge>
      ) : (
        <Badge variant="success">Active</Badge>
      ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: ({ getValue }) => (
      <span className="text-xs text-foreground-secondary whitespace-nowrap">
        {formatRelativeTime(getValue() as string)}
      </span>
    ),
  },
];

export default function UsersPage() {
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
  } = useUsers();

  return (
    <div data-testid="users-page" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Users</h1>
          {data?.total != null && (
            <p className="text-sm text-foreground-secondary mt-0.5">{data.total.toLocaleString()} total users</p>
          )}
        </div>
      </div>

      <FilterBar
        search={{
          value: filters.search,
          onChange: (v) => updateFilters({ search: v }),
          placeholder: 'Search by name, email, or state code…',
        }}
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: STATUS_OPTIONS,
            value: filters.status,
            onChange: (v) => updateFilters({ status: v }),
          },
          {
            key: 'tier',
            label: 'Tier',
            options: TIER_OPTIONS,
            value: filters.subscriptionTier,
            onChange: (v) => updateFilters({ subscriptionTier: v }),
          },
          {
            key: 'level',
            label: 'Level',
            options: LEVEL_OPTIONS,
            value: filters.level,
            onChange: (v) => updateFilters({ level: v }),
          },
        ]}
        onClear={clearFilters}
      />

      <DataTable
        columns={COLUMNS}
        data={data?.data ?? []}
        loading={isLoading}
        emptyTitle="No users found"
        emptyDescription="Try adjusting your filters or search query."
        onRowClick={(user) => router.push(`/users/${user.id}`)}
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
