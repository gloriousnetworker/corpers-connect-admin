'use client';

import { useState } from 'react';
import { ActionModal } from '@/components/ui';
import { ReportAction } from '@/types/enums';
import { cn } from '@/lib/utils';

interface ReviewReportModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (action: ReportAction, reason?: string) => void;
  isPending: boolean;
}

const ACTION_OPTIONS: { value: ReportAction; label: string; description: string; color: string }[] = [
  {
    value: ReportAction.DISMISS,
    label: 'Dismiss',
    description: 'No action needed — report is unfounded.',
    color: 'border-border text-foreground-secondary',
  },
  {
    value: ReportAction.WARN,
    label: 'Warn User',
    description: 'Send a warning to the reported user.',
    color: 'border-warning text-warning',
  },
  {
    value: ReportAction.REMOVE,
    label: 'Remove Content',
    description: 'Remove the reported content from the platform.',
    color: 'border-error text-error',
  },
  {
    value: ReportAction.SUSPEND,
    label: 'Suspend User',
    description: "Suspend the reported user's account.",
    color: 'border-error text-error',
  },
  {
    value: ReportAction.ESCALATE,
    label: 'Escalate',
    description: 'Flag for superadmin review.',
    color: 'border-info text-info',
  },
];

export function ReviewReportModal({ open, onClose, onConfirm, isPending }: ReviewReportModalProps) {
  const [selectedAction, setSelectedAction] = useState<ReportAction | null>(null);
  const [reason, setReason] = useState('');

  const handleClose = () => {
    setSelectedAction(null);
    setReason('');
    onClose();
  };

  const handleConfirm = () => {
    if (!selectedAction) return;
    onConfirm(selectedAction, reason || undefined);
  };

  return (
    <ActionModal
      open={open}
      onClose={handleClose}
      title="Review Report"
      size="md"
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
            data-testid="review-confirm-btn"
            onClick={handleConfirm}
            disabled={!selectedAction || isPending}
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-50"
          >
            {isPending ? 'Submitting…' : 'Submit Review'}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-foreground-secondary">Select an action to take on this report:</p>

        <div className="space-y-2" data-testid="action-options">
          {ACTION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              data-testid={`action-${opt.value}`}
              onClick={() => setSelectedAction(opt.value)}
              className={cn(
                'w-full text-left px-4 py-3 rounded-lg border-2 transition-colors',
                selectedAction === opt.value
                  ? `${opt.color} bg-opacity-10`
                  : 'border-border text-foreground hover:bg-surface-alt'
              )}
            >
              <p className="text-sm font-medium">{opt.label}</p>
              <p className="text-xs text-foreground-secondary mt-0.5">{opt.description}</p>
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Note <span className="text-foreground-secondary font-normal">(optional)</span>
          </label>
          <textarea
            data-testid="review-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            placeholder="Add a note about this decision…"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>
      </div>
    </ActionModal>
  );
}
