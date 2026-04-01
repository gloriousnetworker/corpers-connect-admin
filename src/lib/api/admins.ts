import { apiClient } from './client';
import type { AdminUser } from '@/types/models';
import type { AdminRole } from '@/types/enums';

export async function getAdmins(): Promise<AdminUser[]> {
  const res = await apiClient.get('/admin/admins');
  return res.data.data;
}

export async function createAdmin(payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: AdminRole;
}): Promise<AdminUser> {
  const res = await apiClient.post('/admin/admins', payload);
  return res.data.data;
}

export async function deactivateAdmin(adminId: string): Promise<void> {
  await apiClient.patch(`/admin/admins/${adminId}/deactivate`);
}
