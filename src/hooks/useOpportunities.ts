'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getOpportunities, featureOpportunity, removeOpportunity } from '@/lib/api/opportunities';
import { queryKeys } from '@/lib/query-keys';

export function useOpportunities() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const params = { cursor, search: search || undefined, type: typeFilter || undefined, limit: 20 };

  const query = useQuery({
    queryKey: queryKeys.opportunities(params),
    queryFn: () => getOpportunities(params),
    staleTime: 30_000,
  });

  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['opportunities'] });

  const feature = useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      featureOpportunity(id, isFeatured),
    onSuccess: () => { invalidate(); toast.success('Opportunity updated'); },
    onError: (err: Error) => toast.error(err.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => removeOpportunity(id),
    onSuccess: () => { invalidate(); toast.success('Opportunity removed'); },
    onError: (err: Error) => toast.error(err.message),
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
    search,
    setSearch: (v: string) => { setSearch(v); setCursor(undefined); setPrevCursors([]); },
    typeFilter,
    setTypeFilter: (v: string) => { setTypeFilter(v); setCursor(undefined); setPrevCursors([]); },
    hasPrev: prevCursors.length > 0,
    hasNext: !!query.data?.hasMore,
    goNext,
    goPrev,
    feature,
    remove,
  };
}
