import { apiClient } from './client';
import type { SubscriptionRecord, PaginatedResponse } from '@/types/models';

type RawSub = {
  id: string; userId: string; tier: string; plan: string; amountKobo: number;
  status: string; startDate: string; endDate: string | null;
  cancelledAt?: string | null; createdAt: string;
  user?: { id: string; firstName: string; lastName: string; stateCode: string; profilePicture?: string | null };
};

export async function getSubscriptions(params?: {
  cursor?: string; status?: string; plan?: string; limit?: number;
}): Promise<PaginatedResponse<SubscriptionRecord>> {
  const res = await apiClient.get('/admin/subscriptions', { params }).catch(() =>
    ({ data: { data: { items: [], hasMore: false } } })
  );
  const raw = res.data.data as { items?: RawSub[]; hasMore?: boolean };
  const items = raw?.items ?? [];
  return {
    data: items.map((s) => ({
      id: s.id,
      user: s.user ?? { id: s.userId, firstName: '—', lastName: '', stateCode: '', profilePicture: null },
      plan: s.plan as SubscriptionRecord['plan'],
      amount: Math.round((s.amountKobo ?? 0) / 100),
      status: s.status as SubscriptionRecord['status'],
      startDate: s.startDate,
      endDate: s.endDate,
      cancelledAt: s.cancelledAt ?? null,
      createdAt: s.createdAt,
    })),
    hasMore: raw?.hasMore ?? false,
    nextCursor: raw?.hasMore && items.length > 0 ? items[items.length - 1].id : null,
  };
}
