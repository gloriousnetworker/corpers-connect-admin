'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '@/lib/api/admin';
import { queryKeys } from '@/lib/query-keys';

export function useAuditLogs() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);
  const [adminId, setAdminId] = useState('');
  const [action, setAction] = useState('');

  const params = {
    cursor,
    adminId: adminId || undefined,
    action: action || undefined,
    limit: 20,
  };

  const query = useQuery({
    queryKey: queryKeys.auditLogs(params),
    queryFn: () => getAuditLogs(params),
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

  return {
    ...query,
    adminId, setAdminId: (v: string) => { setAdminId(v); setCursor(undefined); setPrevCursors([]); },
    action, setAction: (v: string) => { setAction(v); setCursor(undefined); setPrevCursors([]); },
    hasPrev: prevCursors.length > 0,
    hasNext: !!query.data?.hasMore,
    goNext,
    goPrev,
  };
}
