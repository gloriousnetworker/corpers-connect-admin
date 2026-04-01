'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getAdmins, createAdmin, deactivateAdmin } from '@/lib/api/admins';
import { queryKeys } from '@/lib/query-keys';
import type { AdminRole } from '@/types/enums';

export function useAdmins() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.admins(),
    queryFn: getAdmins,
    staleTime: 60_000,
  });

  const create = useMutation({
    mutationFn: (payload: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      role: AdminRole;
    }) => createAdmin(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admins() });
      toast.success('Admin created');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deactivate = useMutation({
    mutationFn: (adminId: string) => deactivateAdmin(adminId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admins() });
      toast.success('Admin deactivated');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { ...query, create, deactivate };
}
