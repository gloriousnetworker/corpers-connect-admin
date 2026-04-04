import { apiClient } from './client';
import type { DashboardStats, SystemSetting, AuditLog } from '@/types/models';

export async function getDashboard(): Promise<DashboardStats> {
  const res = await apiClient.get('/admin/dashboard');
  const raw = res.data.data as {
    totalUsers: number;
    activeUsers: number;
    premiumUsers: number;
    totalPosts: number;
    pendingReports: number;
    pendingSellerApps: number;
    activeSubscriptions: number;
    newUsersThisWeek: number;
    newThisWeekChange: number;
    revenue30d: number;
    revenueChange: number;
    charts: {
      userGrowth: Array<{ date: string; count: number }>;
      revenue: Array<{ date: string; amount: number }>;
      contentActivity: Array<{ date: string; posts: number; stories: number; reels: number }>;
    };
    recentReports: DashboardStats['recentReports'];
    recentRegistrations: DashboardStats['recentRegistrations'];
  };

  return {
    users: {
      total: raw.totalUsers ?? 0,
      activeToday: raw.activeUsers ?? 0,
      newThisWeek: raw.newUsersThisWeek ?? 0,
      newThisWeekChange: raw.newThisWeekChange ?? 0,
    },
    subscriptions: {
      premium: raw.premiumUsers ?? 0,
      revenue30d: raw.revenue30d ?? 0,
      revenueChange: raw.revenueChange ?? 0,
    },
    moderation: {
      pendingReports: raw.pendingReports ?? 0,
      pendingSellerApps: raw.pendingSellerApps ?? 0,
    },
    charts: {
      userGrowth: raw.charts?.userGrowth ?? [],
      revenue: raw.charts?.revenue ?? [],
      contentActivity: raw.charts?.contentActivity ?? [],
      subscriptionMix: {
        free: (raw.totalUsers ?? 0) - (raw.premiumUsers ?? 0),
        premium: raw.premiumUsers ?? 0,
      },
    },
    recentReports: raw.recentReports ?? [],
    recentRegistrations: raw.recentRegistrations ?? [],
  };
}

export async function getSettings(): Promise<SystemSetting[]> {
  const res = await apiClient.get('/admin/settings');
  return res.data.data ?? [];
}

export async function updateSetting(key: string, value: string): Promise<SystemSetting> {
  const res = await apiClient.put(`/admin/settings/${key}`, { value });
  return res.data.data;
}

export async function getAuditLogs(params?: {
  cursor?: string;
  adminId?: string;
  action?: string;
  from?: string;
  to?: string;
  limit?: number;
}): Promise<{ data: AuditLog[]; nextCursor?: string | null; hasMore: boolean }> {
  const res = await apiClient.get('/admin/audit-logs', { params });
  const raw = res.data.data as {
    items: Array<{
      id: string;
      adminId: string;
      admin: { id: string; firstName: string; lastName: string; email: string };
      action: string;
      entityType?: string | null;
      entityId?: string | null;
      details?: Record<string, unknown> | null;
      ipAddress?: string | null;
      createdAt: string;
    }>;
    hasMore: boolean;
  };

  const items = raw?.items ?? [];
  return {
    data: items.map((item) => ({
      id: item.id,
      adminId: item.adminId,
      admin: item.admin,
      action: item.action,
      targetType: item.entityType ?? null,
      targetId: item.entityId ?? null,
      targetLabel: item.entityId ?? null,
      details: item.details ?? null,
      ipAddress: item.ipAddress ?? null,
      createdAt: item.createdAt,
    })),
    hasMore: raw?.hasMore ?? false,
    nextCursor: raw?.hasMore && items.length > 0 ? items[items.length - 1].id : null,
  };
}

export type AdminLoginResult =
  | { requires2FA: true; challengeToken: string }
  | { requires2FA: false; token: string; admin: import('@/types/models').AdminUser };

export async function adminLogin(email: string, password: string): Promise<AdminLoginResult> {
  const res = await apiClient.post('/admin/auth/login', { email, password });
  const data = res.data.data as
    | { requires2FA: true; challengeToken: string }
    | {
        requires2FA: false;
        accessToken: string;
        admin: { id: string; email: string; firstName: string; lastName: string; role: string };
      };

  if (data.requires2FA) {
    return { requires2FA: true, challengeToken: data.challengeToken };
  }

  const admin: import('@/types/models').AdminUser = {
    id: data.admin.id,
    email: data.admin.email,
    firstName: data.admin.firstName,
    lastName: data.admin.lastName,
    role: data.admin.role as import('@/types/models').AdminUser['role'],
    isActive: true,
    lastLoginAt: null,
    createdAt: new Date().toISOString(),
  };
  return { requires2FA: false, token: data.accessToken, admin };
}

export async function adminComplete2FAChallenge(
  challengeToken: string,
  code: string,
): Promise<{ token: string; admin: import('@/types/models').AdminUser }> {
  const res = await apiClient.post('/admin/auth/2fa/challenge', { challengeToken, code });
  const data = res.data.data as {
    accessToken: string;
    admin: { id: string; email: string; firstName: string; lastName: string; role: string };
  };
  const admin: import('@/types/models').AdminUser = {
    id: data.admin.id,
    email: data.admin.email,
    firstName: data.admin.firstName,
    lastName: data.admin.lastName,
    role: data.admin.role as import('@/types/models').AdminUser['role'],
    isActive: true,
    lastLoginAt: null,
    createdAt: new Date().toISOString(),
  };
  return { token: data.accessToken, admin };
}

export async function adminInitiate2FA(): Promise<{ secret: string; qrCode: string }> {
  const res = await apiClient.post('/admin/auth/2fa/initiate');
  return res.data.data as { secret: string; qrCode: string };
}

export async function adminConfirm2FA(code: string): Promise<void> {
  await apiClient.post('/admin/auth/2fa/confirm', { code });
}

export async function adminDisable2FA(code: string): Promise<void> {
  await apiClient.delete('/admin/auth/2fa', { data: { code } });
}

export async function adminLogout(): Promise<void> {
  await apiClient.post('/admin/auth/logout');
}
