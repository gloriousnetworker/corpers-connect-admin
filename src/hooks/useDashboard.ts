'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '@/lib/api/admin';
import { queryKeys } from '@/lib/query-keys';

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard(),
    queryFn: getDashboard,
    staleTime: 60_000, // 1 minute
  });
}
