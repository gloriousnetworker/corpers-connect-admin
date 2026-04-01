'use client';

import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { Spinner } from '@/components/ui';
import { formatDate } from '@/lib/utils';

function SettingRow({
  settingKey,
  value,
  description,
  updatedAt,
  onSave,
  isPending,
}: {
  settingKey: string;
  value: string;
  description?: string;
  updatedAt: string;
  onSave: (key: string, value: string) => void;
  isPending: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const handleSave = () => {
    onSave(settingKey, draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  return (
    <div className="flex items-start justify-between py-4 border-b border-border last:border-0 gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground font-mono">{settingKey}</p>
        {description && <p className="text-xs text-foreground-secondary mt-0.5">{description}</p>}
        <p className="text-xs text-foreground-muted mt-1">Updated {formatDate(updatedAt)}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {editing ? (
          <>
            <input
              data-testid={`setting-input-${settingKey}`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="border border-border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-48"
              autoFocus
            />
            <button
              data-testid={`setting-save-${settingKey}`}
              onClick={handleSave}
              disabled={isPending}
              className="p-1.5 rounded-md bg-success-light text-success hover:bg-success/20 disabled:opacity-50"
            >
              {isPending ? <Spinner size="sm" centered={false} /> : <Check size={14} />}
            </button>
            <button
              data-testid={`setting-cancel-${settingKey}`}
              onClick={handleCancel}
              className="p-1.5 rounded-md bg-surface-alt text-foreground-secondary hover:bg-border"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <>
            <span
              data-testid={`setting-value-${settingKey}`}
              className="text-sm text-foreground font-mono bg-surface-alt px-2 py-1 rounded"
            >
              {value}
            </span>
            <button
              data-testid={`setting-edit-${settingKey}`}
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-md text-foreground-secondary hover:bg-surface-alt hover:text-foreground"
            >
              <Pencil size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { data: settings, isLoading, isError, update } = useSettings();

  return (
    <div data-testid="settings-page" className="space-y-6 max-w-2xl">
      <h1 className="text-lg font-semibold text-foreground">System Settings</h1>

      {isLoading && (
        <div className="flex items-center justify-center h-32">
          <Spinner size="lg" />
        </div>
      )}

      {isError && (
        <p data-testid="settings-error" className="text-sm text-error">
          Failed to load settings. Please refresh.
        </p>
      )}

      {settings && settings.length > 0 && (
        <div className="bg-white rounded-xl border border-border px-4">
          {settings.map((s) => (
            <SettingRow
              key={s.key}
              settingKey={s.key}
              value={s.value}
              description={s.description}
              updatedAt={s.updatedAt}
              onSave={(key, value) => update.mutate({ key, value })}
              isPending={update.isPending}
            />
          ))}
        </div>
      )}

      {settings && settings.length === 0 && (
        <p data-testid="settings-empty" className="text-sm text-foreground-secondary">
          No settings configured.
        </p>
      )}
    </div>
  );
}
