'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  ShieldOff,
  ShieldCheck,
  Crown,
  Trash2,
} from 'lucide-react';
import { useUser, useUserMutations } from '@/hooks/useUser';
import { Avatar, Badge, ConfirmModal, Spinner } from '@/components/ui';
import { SuspendModal } from '../SuspendModal';
import { GrantPremiumModal } from '../GrantPremiumModal';
import {
  formatDate,
  formatRelativeTime,
  getLevelColor,
  getSubscriptionColor,
} from '@/lib/utils';
import { SubscriptionTier } from '@/types/enums';

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-border last:border-0">
      <span className="text-sm text-foreground-secondary w-40 flex-shrink-0">{label}</span>
      <span className="text-sm text-foreground text-right">{children}</span>
    </div>
  );
}

export default function UserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const router = useRouter();
  const { data: user, isLoading, isError } = useUser(userId);
  const mutations = useUserMutations(userId);

  const [suspendOpen, setSuspendOpen] = useState(false);
  const [grantOpen, setGrantOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const userName = user ? `${user.firstName} ${user.lastName}` : 'this user';

  if (isLoading) {
    return (
      <div data-testid="user-detail-loading" className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div data-testid="user-detail-error" className="flex flex-col items-center justify-center h-64 gap-2">
        <p className="text-foreground font-medium">User not found</p>
        <button
          onClick={() => router.back()}
          className="text-sm text-primary hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div data-testid="user-detail-page" className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          data-testid="back-button"
          onClick={() => router.back()}
          className="text-foreground-secondary hover:text-foreground transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-4 flex-1">
          <Avatar
            src={user.profilePicture ?? null}
            firstName={user.firstName}
            lastName={user.lastName}
            size="xl"
          />
          <div>
            <h1 className="text-xl font-semibold text-foreground">{userName}</h1>
            <p className="text-sm text-foreground-secondary">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap gap-2">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(user.level)}`}>
          {user.level}
        </span>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getSubscriptionColor(user.subscriptionTier)}`}>
          {user.subscriptionTier}
        </span>
        {user.isVerified ? (
          <Badge variant="success">Verified</Badge>
        ) : (
          <Badge variant="neutral">Unverified</Badge>
        )}
        {user.isSuspended ? (
          <Badge variant="error">Suspended</Badge>
        ) : (
          <Badge variant="success">Active</Badge>
        )}
      </div>

      {/* Profile info */}
      <div className="bg-white rounded-xl border border-border p-4">
        <p className="text-sm font-semibold text-foreground mb-2">Profile</p>
        <InfoRow label="State Code">{user.stateCode}</InfoRow>
        <InfoRow label="Serving State">{user.servingState}</InfoRow>
        {user.lga && <InfoRow label="LGA">{user.lga}</InfoRow>}
        {user.ppa && <InfoRow label="PPA">{user.ppa}</InfoRow>}
        {user.batch && <InfoRow label="Batch">{user.batch}</InfoRow>}
        <InfoRow label="Phone">{user.phone ?? '—'}</InfoRow>
        <InfoRow label="Joined">{formatDate(user.createdAt)}</InfoRow>
        {user.lastActiveAt && (
          <InfoRow label="Last Active">{formatRelativeTime(user.lastActiveAt)}</InfoRow>
        )}
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl border border-border p-4">
        <p className="text-sm font-semibold text-foreground mb-2">Activity</p>
        <InfoRow label="Followers">{user.followersCount.toLocaleString()}</InfoRow>
        <InfoRow label="Following">{user.followingCount.toLocaleString()}</InfoRow>
        <InfoRow label="Posts">{user.postsCount.toLocaleString()}</InfoRow>
        <InfoRow label="Stories">{user.storiesCount.toLocaleString()}</InfoRow>
      </div>

      {/* Suspension info */}
      {user.isSuspended && user.suspendedReason && (
        <div className="bg-error-light rounded-xl border border-error/20 p-4">
          <p className="text-sm font-semibold text-error mb-1">Suspension Reason</p>
          <p className="text-sm text-foreground">{user.suspendedReason}</p>
          {user.suspendedAt && (
            <p className="text-xs text-foreground-secondary mt-1">
              Suspended {formatRelativeTime(user.suspendedAt)}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="bg-white rounded-xl border border-border p-4">
        <p className="text-sm font-semibold text-foreground mb-3">Actions</p>
        <div className="flex flex-wrap gap-2">
          {/* Verify / Unverify */}
          {!user.isVerified && (
            <button
              data-testid="verify-btn"
              onClick={() => mutations.verify.mutate()}
              disabled={mutations.verify.isPending}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-surface-alt disabled:opacity-50"
            >
              <CheckCircle size={15} />
              Verify User
            </button>
          )}

          {/* Suspend / Reactivate */}
          {user.isSuspended ? (
            <button
              data-testid="reactivate-btn"
              onClick={() => mutations.reactivate.mutate()}
              disabled={mutations.reactivate.isPending}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-success text-sm text-success hover:bg-success-light disabled:opacity-50"
            >
              <ShieldCheck size={15} />
              Reactivate
            </button>
          ) : (
            <button
              data-testid="suspend-btn"
              onClick={() => setSuspendOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-warning text-sm text-warning hover:bg-warning-light"
            >
              <ShieldOff size={15} />
              Suspend
            </button>
          )}

          {/* Grant / Revoke Premium */}
          {user.subscriptionTier === SubscriptionTier.PREMIUM ? (
            <button
              data-testid="revoke-premium-btn"
              onClick={() => mutations.revokePrem.mutate()}
              disabled={mutations.revokePrem.isPending}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-foreground-secondary hover:bg-surface-alt disabled:opacity-50"
            >
              <Crown size={15} className="opacity-40" />
              Revoke Premium
            </button>
          ) : (
            <button
              data-testid="grant-premium-btn"
              onClick={() => setGrantOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gold text-sm text-gold hover:bg-gold-light"
            >
              <Crown size={15} />
              Grant Premium
            </button>
          )}

          {/* Delete */}
          <button
            data-testid="delete-btn"
            onClick={() => setDeleteOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-error text-sm text-error hover:bg-error-light ml-auto"
          >
            <Trash2 size={15} />
            Delete User
          </button>
        </div>
      </div>

      {/* Modals */}
      <SuspendModal
        open={suspendOpen}
        onClose={() => setSuspendOpen(false)}
        onConfirm={(reason, duration) => {
          mutations.suspend.mutate({ reason, duration });
          setSuspendOpen(false);
        }}
        isPending={mutations.suspend.isPending}
        userName={userName}
      />

      <GrantPremiumModal
        open={grantOpen}
        onClose={() => setGrantOpen(false)}
        onConfirm={(plan, durationMonths) => {
          mutations.grantPrem.mutate({ plan, durationMonths });
          setGrantOpen(false);
        }}
        isPending={mutations.grantPrem.isPending}
        userName={userName}
      />

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          mutations.remove.mutate();
          router.push('/users');
        }}
        title="Delete User"
        description={`Are you sure you want to permanently delete ${userName}? This cannot be undone.`}
        confirmLabel="Delete"
        loading={mutations.remove.isPending}
        variant="danger"
      />
    </div>
  );
}
