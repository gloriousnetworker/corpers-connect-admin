import { apiClient } from './client';
import type { DashboardStats, SystemSetting, AuditLog } from '@/types/models';

export async function getDashboard(): Promise<DashboardStats> {
  const res = await apiClient.get('/admin/dashboard');
  return res.data.data;
}

export async function getSettings(): Promise<SystemSetting[]> {
  const res = await apiClient.get('/admin/settings');
  return res.data.data;
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
  return res.data.data;
}

export async function adminLogin(email: string, password: string) {
  const res = await apiClient.post('/admin/auth/login', { email, password });
  return res.data.data as { token: string; admin: import('@/types/models').AdminUser };
}
