import { apiClient } from './client';
import type { User, UserListItem, PaginatedResponse } from '@/types/models';

export async function getUsers(params?: {
  cursor?: string;
  search?: string;
  status?: string;
  subscriptionTier?: string;
  level?: string;
  servingState?: string;
  isVerified?: boolean;
  limit?: number;
}): Promise<PaginatedResponse<UserListItem>> {
  const res = await apiClient.get('/admin/users', { params });
  return res.data.data;
}

export async function getUserDetail(userId: string): Promise<User> {
  const res = await apiClient.get(`/admin/users/${userId}`);
  return res.data.data;
}

export async function suspendUser(userId: string, reason: string, duration?: string) {
  const res = await apiClient.patch(`/admin/users/${userId}/suspend`, { reason, duration });
  return res.data;
}

export async function reactivateUser(userId: string) {
  const res = await apiClient.patch(`/admin/users/${userId}/reactivate`);
  return res.data;
}

export async function verifyUser(userId: string) {
  const res = await apiClient.patch(`/admin/users/${userId}/verify`);
  return res.data;
}

export async function deleteUser(userId: string) {
  const res = await apiClient.delete(`/admin/users/${userId}`);
  return res.data;
}

export async function grantPremium(userId: string, plan: string, durationMonths: number) {
  const res = await apiClient.post(`/admin/users/${userId}/subscription`, { plan, durationMonths });
  return res.data;
}

export async function revokePremium(userId: string) {
  const res = await apiClient.delete(`/admin/users/${userId}/subscription`);
  return res.data;
}
