'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getSellerApplications,
  approveSellerApplication,
  rejectSellerApplication,
  getListings,
  removeListing,
} from '@/lib/api/marketplace';
import { queryKeys } from '@/lib/query-keys';

export type MarketplaceTab = 'applications' | 'listings';

export function useSellerApplications() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState('');

  const params = { cursor, status: statusFilter || undefined, limit: 20 };

  const query = useQuery({
    queryKey: queryKeys.sellerApplications(params),
    queryFn: () => getSellerApplications(params),
    staleTime: 30_000,
  });

  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['seller-applications'] });

  const approve = useMutation({
    mutationFn: (appId: string) => approveSellerApplication(appId),
    onSuccess: () => { invalidate(); toast.success('Application approved'); },
    onError: (err: Error) => toast.error(err.message),
  });

  const reject = useMutation({
    mutationFn: ({ appId, reason }: { appId: string; reason: string }) =>
      rejectSellerApplication(appId, reason),
    onSuccess: () => { invalidate(); toast.success('Application rejected'); },
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
    statusFilter,
    setStatusFilter: (v: string) => { setStatusFilter(v); setCursor(undefined); setPrevCursors([]); },
    hasPrev: prevCursors.length > 0,
    hasNext: !!query.data?.hasMore,
    goNext,
    goPrev,
    approve,
    reject,
  };
}

export function useListings() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const params = { cursor, search: search || undefined, status: statusFilter || undefined, limit: 20 };

  const query = useQuery({
    queryKey: queryKeys.listings(params),
    queryFn: () => getListings(params),
    staleTime: 30_000,
  });

  const qc = useQueryClient();

  const remove = useMutation({
    mutationFn: (listingId: string) => removeListing(listingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['listings'] });
      toast.success('Listing removed');
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
    search,
    setSearch: (v: string) => { setSearch(v); setCursor(undefined); setPrevCursors([]); },
    statusFilter,
    setStatusFilter: (v: string) => { setStatusFilter(v); setCursor(undefined); setPrevCursors([]); },
    hasPrev: prevCursors.length > 0,
    hasNext: !!query.data?.hasMore,
    goNext,
    goPrev,
    remove,
  };
}
