import { apiClient } from './client';
import type { Report, ReportDetail, PaginatedResponse } from '@/types/models';
import type { ReportAction } from '@/types/enums';

export async function getReports(params?: {
  cursor?: string;
  status?: string;
  entityType?: string;
  from?: string;
  to?: string;
  limit?: number;
}): Promise<PaginatedResponse<Report>> {
  const res = await apiClient.get('/admin/reports', { params });
  return res.data.data;
}

export async function getReportDetail(reportId: string): Promise<ReportDetail> {
  const res = await apiClient.get(`/admin/reports/${reportId}`);
  return res.data.data;
}

export async function reviewReport(reportId: string, action: ReportAction, reason?: string) {
  const res = await apiClient.patch(`/admin/reports/${reportId}`, { action, reason });
  return res.data;
}
