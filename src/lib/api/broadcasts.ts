import { apiClient } from './client';
import type { Broadcast } from '@/types/models';
import type { BroadcastTarget } from '@/types/enums';

export interface CreateBroadcastPayload {
  title: string;
  message: string;
  target: BroadcastTarget;
  targetState?: string;
}

export async function createBroadcast(payload: CreateBroadcastPayload): Promise<Broadcast> {
  const res = await apiClient.post('/admin/broadcasts', payload);
  return res.data.data;
}

export async function getBroadcasts(params?: {
  cursor?: string;
  limit?: number;
}): Promise<{ data: Broadcast[]; nextCursor?: string | null; hasMore: boolean }> {
  const res = await apiClient.get('/admin/broadcasts', { params });
  return res.data.data;
}
