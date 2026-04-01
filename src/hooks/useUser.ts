'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getUserDetail,
  suspendUser,
  reactivateUser,
  verifyUser,
  deleteUser,
  grantPremium,
  revokePremium,
} from '@/lib/api/users';
import { queryKeys } from '@/lib/query-keys';

export function useUser(userId: string) {
  return useQuery({
    queryKey: queryKeys.user(userId),
    queryFn: () => getUserDetail(userId),
    staleTime: 30_000,
    enabled: !!userId,
  });
}

export function useUserMutations(userId: string) {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: queryKeys.user(userId) });
    qc.invalidateQueries({ queryKey: ['users'] });
  };

  const suspend = useMutation({
    mutationFn: ({ reason, duration }: { reason: string; duration?: string }) =>
      suspendUser(userId, reason, duration),
    onSuccess: () => {
      invalidate();
      toast.success('User suspended');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const reactivate = useMutation({
    mutationFn: () => reactivateUser(userId),
    onSuccess: () => {
      invalidate();
      toast.success('User reactivated');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const verify = useMutation({
    mutationFn: () => verifyUser(userId),
    onSuccess: () => {
      invalidate();
      toast.success('User verified');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const remove = useMutation({
    mutationFn: () => deleteUser(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const grantPrem = useMutation({
    mutationFn: ({ plan, durationMonths }: { plan: string; durationMonths: number }) =>
      grantPremium(userId, plan, durationMonths),
    onSuccess: () => {
      invalidate();
      toast.success('Premium granted');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const revokePrem = useMutation({
    mutationFn: () => revokePremium(userId),
    onSuccess: () => {
      invalidate();
      toast.success('Premium revoked');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { suspend, reactivate, verify, remove, grantPrem, revokePrem };
}
