import { apiClient } from './client';
import type { Opportunity, PaginatedResponse } from '@/types/models';

export async function getOpportunities(params?: {
  cursor?: string;
  type?: string;
  search?: string;
  limit?: number;
}): Promise<PaginatedResponse<Opportunity>> {
  const res = await apiClient.get('/opportunities', { params });
  return res.data.data;
}

export async function featureOpportunity(opportunityId: string, isFeatured: boolean) {
  const res = await apiClient.patch(`/opportunities/${opportunityId}`, { isFeatured });
  return res.data;
}

export async function removeOpportunity(opportunityId: string) {
  const res = await apiClient.delete(`/opportunities/${opportunityId}`);
  return res.data;
}
