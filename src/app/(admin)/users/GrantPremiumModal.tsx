'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActionModal } from '@/components/ui';
import { grantPremiumSchema, type GrantPremiumInput } from '@/lib/validations';
import { SubscriptionPlan } from '@/types/enums';
import { cn } from '@/lib/utils';

interface GrantPremiumModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (plan: string, durationMonths: number) => void;
  isPending: boolean;
  userName: string;
}

const PLAN_OPTIONS = [
  { value: SubscriptionPlan.MONTHLY, label: 'Monthly' },
  { value: SubscriptionPlan.QUARTERLY, label: 'Quarterly (3 months)' },
  { value: SubscriptionPlan.ANNUAL, label: 'Annual (12 months)' },
];

export function GrantPremiumModal({ open, onClose, onConfirm, isPending, userName }: GrantPremiumModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GrantPremiumInput>({
    resolver: zodResolver(grantPremiumSchema),
    defaultValues: { plan: SubscriptionPlan.MONTHLY, durationMonths: 1 },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: GrantPremiumInput) => {
    onConfirm(data.plan, data.durationMonths);
  };

  return (
    <ActionModal
      open={open}
      onClose={handleClose}
      title={`Grant Premium — ${userName}`}
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
            form="grant-premium-form"
            disabled={isPending}
            data-testid="grant-confirm-btn"
            className="px-4 py-2 rounded-lg bg-gold text-white text-sm font-semibold hover:bg-gold/90 disabled:opacity-50"
          >
            {isPending ? 'Granting…' : 'Grant Premium'}
          </button>
        </div>
      }
    >
      <form id="grant-premium-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Plan</label>
          <select
            {...register('plan')}
            data-testid="grant-plan"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {PLAN_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Duration (months) <span className="text-error">*</span>
          </label>
          <input
            {...register('durationMonths', { valueAsNumber: true })}
            type="number"
            min={1}
            max={36}
            data-testid="grant-duration"
            className={cn(
              'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary',
              errors.durationMonths ? 'border-error' : 'border-border'
            )}
          />
          {errors.durationMonths && (
            <p data-testid="grant-duration-error" className="mt-1 text-xs text-error">
              {errors.durationMonths.message}
            </p>
          )}
        </div>
      </form>
    </ActionModal>
  );
}
