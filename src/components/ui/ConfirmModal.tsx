'use client';

import { useEffect, useRef } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  loading?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  loading = false,
}: ConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Focus confirm button when opened; close on Escape
  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      data-testid="confirm-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        data-testid="confirm-modal"
        className="relative z-10 bg-surface rounded-2xl shadow-modal w-full max-w-sm p-6 animate-fade-in"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-foreground-muted hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon + Title */}
        <div className="flex items-start gap-3 mb-3">
          {variant === 'danger' && (
            <div className="w-10 h-10 rounded-xl bg-error-light flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-error" aria-hidden />
            </div>
          )}
          <div>
            <h2 id="confirm-title" className="text-base font-semibold text-foreground">
              {title}
            </h2>
            <p id="confirm-desc" className="text-sm text-foreground-secondary mt-1">
              {description}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end mt-5">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-foreground-secondary bg-surface-alt hover:bg-border rounded-lg transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            disabled={loading}
            data-testid="confirm-modal-confirm-btn"
            className={cn(
              'px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2',
              variant === 'danger'
                ? 'bg-error hover:bg-red-600'
                : 'bg-primary hover:bg-primary-dark',
            )}
          >
            {loading && <Spinner size="sm" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
