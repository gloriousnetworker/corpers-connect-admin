import { apiClient } from './client';
import type { SubscriptionRecord, PaginatedResponse } from '@/types/models';

export async function getSubscriptions(params?: {
  cursor?: string;
  status?: string;
  plan?: string;
  limit?: number;
}): Promise<PaginatedResponse<SubscriptionRecord>> {
  const res = await apiClient.get('/admin/users', {
    params: { ...params, subscriptionTier: 'PREMIUM' },
  });
  return res.data.data;
}
