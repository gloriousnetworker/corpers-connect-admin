'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { useBroadcasts } from '@/hooks/useBroadcasts';
import { DataTable, Pagination, Spinner } from '@/components/ui';
import { formatRelativeTime, cn } from '@/lib/utils';
import { broadcastSchema, type BroadcastInput } from '@/lib/validations';
import { BroadcastTarget } from '@/types/enums';
import type { Broadcast } from '@/types/models';

const TARGET_OPTIONS = [
  { value: BroadcastTarget.ALL, label: 'All Users' },
  { value: BroadcastTarget.FREE, label: 'Free Users' },
  { value: BroadcastTarget.PREMIUM, label: 'Premium Users' },
  { value: BroadcastTarget.STATE, label: 'By State' },
  { value: BroadcastTarget.OTONDO, label: 'Otondo Level' },
  { value: BroadcastTarget.KOPA, label: 'Kopa Level' },
  { value: BroadcastTarget.CORPER, label: 'Corper Level' },
];

const COLUMNS: ColumnDef<Broadcast>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ getValue }) => <span className="text-sm font-medium">{getValue() as string}</span>,
  },
  {
    accessorKey: 'message',
    header: 'Message',
    cell: ({ getValue }) => (
      <span className="text-sm text-foreground-secondary line-clamp-1 max-w-[200px]">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'target',
    header: 'Target',
    cell: ({ getValue }) => (
      <span className="text-xs bg-info-light text-info px-2 py-0.5 rounded-full font-medium">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'recipientCount',
    header: 'Recipients',
    cell: ({ getValue }) => (
      <span className="text-sm text-foreground-secondary">{(getValue() as number).toLocaleString()}</span>
    ),
  },
  {
    id: 'sentBy',
    header: 'Sent By',
    cell: ({ row }) => {
      const b = row.original;
      return (
        <span className="text-sm text-foreground-secondary">
          {b.sentByAdmin.firstName} {b.sentByAdmin.lastName}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Sent',
    cell: ({ getValue }) => (
      <span className="text-xs text-foreground-secondary whitespace-nowrap">
        {formatRelativeTime(getValue() as string)}
      </span>
    ),
  },
];

export default function BroadcastsPage() {
  const { data, isLoading, hasPrev, hasNext, goNext, goPrev, create } = useBroadcasts();
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BroadcastInput>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: { target: BroadcastTarget.ALL },
  });

  const targetValue = watch('target');

  const onSubmit = async (formData: BroadcastInput) => {
    await create.mutateAsync(formData);
    reset();
    setShowForm(false);
  };

  return (
    <div data-testid="broadcasts-page" className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Broadcasts</h1>
        <button
          data-testid="new-broadcast-btn"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Send size={15} />
          New Broadcast
        </button>
      </div>

      {showForm && (
        <div data-testid="broadcast-form-card" className="bg-white rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Compose Broadcast</h2>
          <form data-testid="broadcast-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Title</label>
              <input
                {...register('title')}
                data-testid="broadcast-title"
                placeholder="Broadcast title"
                className={cn(
                  'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary',
                  errors.title ? 'border-error' : 'border-border'
                )}
              />
              {errors.title && <p className="mt-1 text-xs text-error">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Message</label>
              <textarea
                {...register('message')}
                data-testid="broadcast-message"
                rows={3}
                placeholder="Write your message…"
                className={cn(
                  'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none',
                  errors.message ? 'border-error' : 'border-border'
                )}
              />
              {errors.message && <p className="mt-1 text-xs text-error">{errors.message.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Target Audience</label>
                <select
                  {...register('target')}
                  data-testid="broadcast-target"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {TARGET_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {targetValue === BroadcastTarget.STATE && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">State</label>
                  <input
                    {...register('targetState')}
                    data-testid="broadcast-target-state"
                    placeholder="e.g. Lagos"
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { reset(); setShowForm(false); }}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground-secondary hover:bg-surface-alt"
              >
                Cancel
              </button>
              <button
                type="submit"
                data-testid="broadcast-submit"
                disabled={isSubmitting || create.isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-50"
              >
                {(isSubmitting || create.isPending) ? <Spinner size="sm" centered={false} /> : <Send size={14} />}
                Send Broadcast
              </button>
            </div>
          </form>
        </div>
      )}

      <DataTable
        columns={COLUMNS}
        data={data?.data ?? []}
        loading={isLoading}
        emptyTitle="No broadcasts yet"
        emptyDescription="Send your first broadcast to users."
      />

      <Pagination hasPrev={hasPrev} hasMore={hasNext} onPrev={goPrev} onNext={goNext} loading={isLoading} />
    </div>
  );
}
