'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActionModal } from '@/components/ui';
import { suspendUserSchema, type SuspendUserInput } from '@/lib/validations';
import { cn } from '@/lib/utils';

interface SuspendModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string, duration?: string) => void;
  isPending: boolean;
  userName: string;
}

const DURATION_OPTIONS = [
  { value: '', label: 'Indefinite' },
  { value: '1d', label: '1 day' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
];

export function SuspendModal({ open, onClose, onConfirm, isPending, userName }: SuspendModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SuspendUserInput>({ resolver: zodResolver(suspendUserSchema) });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: SuspendUserInput) => {
    onConfirm(data.reason, data.duration || undefined);
  };

  return (
    <ActionModal
      open={open}
      onClose={handleClose}
      title={`Suspend ${userName}`}
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground-secondary hover:bg-surface-alt disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="suspend-form"
            disabled={isPending}
            data-testid="suspend-confirm-btn"
            className="px-4 py-2 rounded-lg bg-error text-white text-sm font-semibold hover:bg-error/90 disabled:opacity-50"
          >
            {isPending ? 'Suspending…' : 'Suspend User'}
          </button>
        </div>
      }
    >
      <form id="suspend-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Reason <span className="text-error">*</span>
          </label>
          <textarea
            {...register('reason')}
            data-testid="suspend-reason"
            rows={3}
            placeholder="Describe why this user is being suspended…"
            className={cn(
              'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none',
              errors.reason ? 'border-error' : 'border-border'
            )}
          />
          {errors.reason && (
            <p data-testid="suspend-reason-error" className="mt-1 text-xs text-error">
              {errors.reason.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Duration</label>
          <select
            {...register('duration')}
            data-testid="suspend-duration"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {DURATION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </form>
    </ActionModal>
  );
}
