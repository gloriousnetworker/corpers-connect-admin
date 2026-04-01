import { apiClient } from './client';
import type { User, UserListItem, PaginatedResponse } from '@/types/models';

type RawUser = {
  id: string; email: string; firstName: string; lastName: string;
  stateCode: string; servingState: string; level: string; subscriptionTier: string;
  isActive: boolean; isVerified: boolean; isOnboarded?: boolean;
  bio?: string | null; phone?: string | null; profilePicture?: string | null;
  lga?: string | null; ppa?: string | null; batch?: string | null;
  createdAt: string; updatedAt?: string; lastActiveAt?: string | null;
  _count?: { posts?: number; followers?: number; following?: number; subscriptions?: number };
};

function mapUser(u: RawUser): User {
  return {
    id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName,
    stateCode: u.stateCode, servingState: u.servingState,
    level: u.level as User['level'], subscriptionTier: u.subscriptionTier as User['subscriptionTier'],
    isVerified: u.isVerified, isSuspended: !u.isActive, isOnboarded: u.isOnboarded ?? true,
    bio: u.bio, phone: u.phone ?? undefined, profilePicture: u.profilePicture,
    lga: u.lga, ppa: u.ppa, batch: u.batch,
    followersCount: u._count?.followers ?? 0, followingCount: u._count?.following ?? 0,
    postsCount: u._count?.posts ?? 0, storiesCount: 0,
    createdAt: u.createdAt, updatedAt: u.updatedAt ?? u.createdAt,
    lastActiveAt: u.lastActiveAt, suspendedReason: undefined, suspendedAt: undefined,
  };
}

export async function getUsers(params?: {
  cursor?: string; search?: string; status?: string; subscriptionTier?: string;
  level?: string; servingState?: string; isVerified?: boolean; limit?: number;
}): Promise<PaginatedResponse<UserListItem>> {
  const p: Record<string, unknown> = { ...params };
  if (params?.status === 'suspended') p.isActive = false;
  else if (params?.status === 'active') p.isActive = true;
  delete p.status;

  const res = await apiClient.get('/admin/users', { params: p });
  const raw = res.data.data as { items?: RawUser[]; hasMore?: boolean };
  const items = raw?.items ?? [];
  return {
    data: items.map((u) => ({
      id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName,
      stateCode: u.stateCode, servingState: u.servingState,
      level: u.level as UserListItem['level'],
      subscriptionTier: u.subscriptionTier as UserListItem['subscriptionTier'],
      isVerified: u.isVerified, isSuspended: !u.isActive,
      profilePicture: u.profilePicture ?? null, createdAt: u.createdAt,
      lastActiveAt: u.lastActiveAt ?? null,
    })),
    hasMore: raw?.hasMore ?? false,
    nextCursor: raw?.hasMore && items.length > 0 ? items[items.length - 1].id : null,
  };
}

export async function getUserDetail(userId: string): Promise<User> {
  const res = await apiClient.get(`/admin/users/${userId}`);
  return mapUser(res.data.data as RawUser);
}

export async function suspendUser(userId: string, reason: string, duration?: string) {
  return (await apiClient.patch(`/admin/users/${userId}/suspend`, { reason, duration })).data;
}
export async function reactivateUser(userId: string) {
  return (await apiClient.patch(`/admin/users/${userId}/reactivate`)).data;
}
export async function verifyUser(userId: string) {
  return (await apiClient.patch(`/admin/users/${userId}/verify`)).data;
}
export async function deleteUser(userId: string) {
  return (await apiClient.delete(`/admin/users/${userId}`)).data;
}
export async function grantPremium(userId: string, plan: string, durationMonths: number) {
  return (await apiClient.post(`/admin/users/${userId}/subscription`, { plan, durationMonths })).data;
}
export async function revokePremium(userId: string) {
  return (await apiClient.delete(`/admin/users/${userId}/subscription`)).data;
}
