'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getReports, getReportDetail, reviewReport } from '@/lib/api/moderation';
import { queryKeys } from '@/lib/query-keys';
import type { ReportAction } from '@/types/enums';

export interface ReportsFilters {
  status: string;
  entityType: string;
}

const DEFAULT_FILTERS: ReportsFilters = { status: '', entityType: '' };

export function useReports() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);
  const [filters, setFilters] = useState<ReportsFilters>(DEFAULT_FILTERS);

  const params = {
    cursor,
    status: filters.status || undefined,
    entityType: filters.entityType || undefined,
    limit: 20,
  };

  const query = useQuery({
    queryKey: queryKeys.reports(params),
    queryFn: () => getReports(params),
    staleTime: 30_000,
  });

  const goNext = () => {
    if (query.data?.nextCursor) {
      setPrevCursors((p) => [...p, cursor ?? '']);
      setCursor(query.data.nextCursor ?? undefined);
    }
  };

  const goPrev = () => {
    const updated = [...prevCursors];
    const prev = updated.pop();
    setPrevCursors(updated);
    setCursor(prev || undefined);
  };

  const updateFilters = (next: Partial<ReportsFilters>) => {
    setFilters((f) => ({ ...f, ...next }));
    setCursor(undefined);
    setPrevCursors([]);
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCursor(undefined);
    setPrevCursors([]);
  };

  return {
    ...query,
    filters,
    updateFilters,
    clearFilters,
    hasPrev: prevCursors.length > 0,
    hasNext: !!query.data?.hasMore,
    goNext,
    goPrev,
  };
}

export function useReport(reportId: string) {
  return useQuery({
    queryKey: queryKeys.report(reportId),
    queryFn: () => getReportDetail(reportId),
    staleTime: 30_000,
    enabled: !!reportId,
  });
}

export function useReviewReport(reportId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ action, reason }: { action: ReportAction; reason?: string }) =>
      reviewReport(reportId, action, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.report(reportId) });
      qc.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Report reviewed');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
