import { apiClient } from './client';
import type { Report, ReportDetail, PaginatedResponse } from '@/types/models';
import type { ReportAction } from '@/types/enums';

type RawReport = {
  id: string; entityType: string; entityId: string; reason: string;
  details?: string | null; status: string;
  reporter: { id: string; firstName: string; lastName: string; email?: string; stateCode?: string; profilePicture?: string | null };
  reviewedBy?: string | null; reviewedAt?: string | null; reviewNote?: string | null;
  createdAt: string;
};

function mapReport(r: RawReport): Report {
  return {
    id: r.id,
    entityType: r.entityType as Report['entityType'],
    entityId: r.entityId,
    reason: r.reason,
    details: r.details ?? null,
    status: r.status as Report['status'],
    reporter: {
      id: r.reporter.id,
      firstName: r.reporter.firstName,
      lastName: r.reporter.lastName,
      stateCode: r.reporter.stateCode ?? '',
      profilePicture: r.reporter.profilePicture ?? null,
    },
    reportedUser: null,
    reviewedBy: r.reviewedBy ?? null,
    reviewedAt: r.reviewedAt ?? null,
    actionTaken: r.reviewNote ?? null,
    createdAt: r.createdAt,
  };
}

export async function getReports(params?: {
  cursor?: string; status?: string; entityType?: string; from?: string; to?: string; limit?: number;
}): Promise<PaginatedResponse<Report>> {
  const res = await apiClient.get('/admin/reports', { params });
  const raw = res.data.data as { items?: RawReport[]; hasMore?: boolean };
  const items = raw?.items ?? [];
  return {
    data: items.map(mapReport),
    hasMore: raw?.hasMore ?? false,
    nextCursor: raw?.hasMore && items.length > 0 ? items[items.length - 1].id : null,
  };
}

export async function getReportDetail(reportId: string): Promise<ReportDetail> {
  const res = await apiClient.get(`/admin/reports/${reportId}`);
  return mapReport(res.data.data as RawReport) as ReportDetail;
}

export async function reviewReport(reportId: string, action: ReportAction, reason?: string) {
  // Backend expects { status, reviewNote } not { action, reason }
  const statusMap: Record<string, string> = {
    DISMISS: 'DISMISSED',
    WARN: 'REVIEWED',
    REMOVE_CONTENT: 'REVIEWED',
    SUSPEND_USER: 'REVIEWED',
    ESCALATE: 'REVIEWED',
  };
  const res = await apiClient.patch(`/admin/reports/${reportId}`, {
    status: statusMap[action] ?? 'REVIEWED',
    reviewNote: reason,
  });
  return res.data;
}
