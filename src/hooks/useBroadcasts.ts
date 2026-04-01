'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getBroadcasts, createBroadcast, type CreateBroadcastPayload } from '@/lib/api/broadcasts';
import { queryKeys } from '@/lib/query-keys';

export function useBroadcasts() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);

  const params = { cursor, limit: 20 };

  const query = useQuery({
    queryKey: queryKeys.broadcasts(params),
    queryFn: () => getBroadcasts(params),
    staleTime: 30_000,
  });

  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: (payload: CreateBroadcastPayload) => createBroadcast(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['broadcasts'] });
      toast.success('Broadcast sent');
    },
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
    hasPrev: prevCursors.length > 0,
    hasNext: !!query.data?.hasMore,
    goNext,
    goPrev,
    create,
  };
}
