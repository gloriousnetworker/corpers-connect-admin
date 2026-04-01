'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { useAdmins } from '@/hooks/useAdmins';
import { Avatar, Badge, ConfirmModal, Spinner } from '@/components/ui';
import { formatDate, getAdminRoleColor, cn } from '@/lib/utils';
import { createAdminSchema, type CreateAdminInput } from '@/lib/validations';
import { AdminRole } from '@/types/enums';
import type { AdminUser } from '@/types/models';

export default function AdminsPage() {
  const { data: admins, isLoading, isError, create, deactivate } = useAdmins();
  const [showForm, setShowForm] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState<AdminUser | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateAdminInput>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: { role: AdminRole.ADMIN },
  });

  const onSubmit = async (data: CreateAdminInput) => {
    await create.mutateAsync(data);
    reset();
    setShowForm(false);
  };

  return (
    <div data-testid="admins-page" className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Admin Accounts</h1>
        <button
          data-testid="new-admin-btn"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90"
        >
          <UserPlus size={15} />
          New Admin
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div data-testid="create-admin-form-card" className="bg-white rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Create Admin Account</h2>
          <form data-testid="create-admin-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
                <input
                  {...register('firstName')}
                  data-testid="admin-firstName"
                  className={cn('w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary', errors.firstName ? 'border-error' : 'border-border')}
                />
                {errors.firstName && <p className="mt-1 text-xs text-error">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
                <input
                  {...register('lastName')}
                  data-testid="admin-lastName"
                  className={cn('w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary', errors.lastName ? 'border-error' : 'border-border')}
                />
                {errors.lastName && <p className="mt-1 text-xs text-error">{errors.lastName.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <input
                {...register('email')}
                type="email"
                data-testid="admin-email"
                className={cn('w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary', errors.email ? 'border-error' : 'border-border')}
              />
              {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <input
                {...register('password')}
                type="password"
                data-testid="admin-password"
                className={cn('w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary', errors.password ? 'border-error' : 'border-border')}
              />
              {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Role</label>
              <select
                {...register('role')}
                data-testid="admin-role"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={AdminRole.ADMIN}>Admin</option>
                <option value={AdminRole.SUPERADMIN}>Superadmin</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => { reset(); setShowForm(false); }} className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground-secondary hover:bg-surface-alt">
                Cancel
              </button>
              <button type="submit" data-testid="create-admin-submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-50">
                {isSubmitting ? 'Creating…' : 'Create Admin'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading && <div className="flex justify-center h-32"><Spinner size="lg" /></div>}
      {isError && <p data-testid="admins-error" className="text-sm text-error">Failed to load admins.</p>}

      {admins && (
        <div className="bg-white rounded-xl border border-border divide-y divide-border" data-testid="admins-list">
          {admins.length === 0 && (
            <p className="text-sm text-foreground-secondary p-4">No admin accounts found.</p>
          )}
          {admins.map((admin) => (
            <div key={admin.id} data-testid={`admin-row-${admin.id}`} className="flex items-center gap-4 px-4 py-3">
              <Avatar src={null} firstName={admin.firstName} lastName={admin.lastName} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{admin.firstName} {admin.lastName}</p>
                <p className="text-xs text-foreground-secondary">{admin.email}</p>
                <p className="text-xs text-foreground-muted mt-0.5">Joined {formatDate(admin.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getAdminRoleColor(admin.role)}`}>
                  {admin.role}
                </span>
                <Badge variant={admin.isActive ? 'success' : 'neutral'}>
                  {admin.isActive ? 'Active' : 'Inactive'}
                </Badge>
                {admin.isActive && (
                  <button
                    data-testid={`deactivate-${admin.id}`}
                    onClick={() => setDeactivateTarget(admin)}
                    className="px-2 py-1 rounded text-xs bg-error-light text-error font-medium hover:bg-error/20"
                  >
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={() => {
          if (deactivateTarget) deactivate.mutate(deactivateTarget.id);
          setDeactivateTarget(null);
        }}
        title="Deactivate Admin"
        description={`Deactivate ${deactivateTarget ? `${deactivateTarget.firstName} ${deactivateTarget.lastName}` : 'this admin'}? They will lose access immediately.`}
        confirmLabel="Deactivate"
        variant="danger"
        loading={deactivate.isPending}
      />
    </div>
  );
}
