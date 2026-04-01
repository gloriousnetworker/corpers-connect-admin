'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/lib/api/users';
import { queryKeys } from '@/lib/query-keys';

export interface UsersFilters {
  search: string;
  status: string;
  subscriptionTier: string;
  level: string;
}

const DEFAULT_FILTERS: UsersFilters = {
  search: '',
  status: '',
  subscriptionTier: '',
  level: '',
};

export function useUsers() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);
  const [filters, setFilters] = useState<UsersFilters>(DEFAULT_FILTERS);

  const params = {
    cursor,
    search: filters.search || undefined,
    status: filters.status || undefined,
    subscriptionTier: filters.subscriptionTier || undefined,
    level: filters.level || undefined,
    limit: 20,
  };

  const query = useQuery({
    queryKey: queryKeys.users(params),
    queryFn: () => getUsers(params),
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

  const updateFilters = (next: Partial<UsersFilters>) => {
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
