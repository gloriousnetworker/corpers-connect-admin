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
  };

  // Map flat backend shape → nested DashboardStats shape the UI expects
  return {
    users: {
      total: raw.totalUsers ?? 0,
      activeToday: raw.activeUsers ?? 0,
      newThisWeek: 0,
      newThisWeekChange: 0,
    },
    subscriptions: {
      premium: raw.premiumUsers ?? 0,
      revenue30d: 0,
      revenueChange: 0,
    },
    moderation: {
      pendingReports: raw.pendingReports ?? 0,
      pendingSellerApps: raw.pendingSellerApps ?? 0,
    },
    charts: {
      userGrowth: [],
      revenue: [],
      contentActivity: [],
      subscriptionMix: {
        free: (raw.totalUsers ?? 0) - (raw.premiumUsers ?? 0),
        premium: raw.premiumUsers ?? 0,
      },
    },
    recentReports: [],
    recentRegistrations: [],
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

export async function adminLogin(email: string, password: string) {
  const res = await apiClient.post('/admin/auth/login', { email, password });
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
