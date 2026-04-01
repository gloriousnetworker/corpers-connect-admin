'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSubscriptions } from '@/lib/api/subscriptions';
import { queryKeys } from '@/lib/query-keys';

export function useSubscriptions() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');

  const params = {
    cursor,
    status: statusFilter || undefined,
    plan: planFilter || undefined,
    limit: 20,
  };

  const query = useQuery({
    queryKey: queryKeys.subscriptions(params),
    queryFn: () => getSubscriptions(params),
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
    statusFilter,
    setStatusFilter: (v: string) => { setStatusFilter(v); setCursor(undefined); setPrevCursors([]); },
    planFilter,
    setPlanFilter: (v: string) => { setPlanFilter(v); setCursor(undefined); setPrevCursors([]); },
    hasPrev: prevCursors.length > 0,
    hasNext: !!query.data?.hasMore,
    goNext,
    goPrev,
  };
}
