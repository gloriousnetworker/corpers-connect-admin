'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getSettings, updateSetting } from '@/lib/api/admin';
import { queryKeys } from '@/lib/query-keys';

export function useSettings() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.settings(),
    queryFn: getSettings,
    staleTime: 60_000,
  });

  const update = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => updateSetting(key, value),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.settings() });
      toast.success('Setting updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { ...query, update };
}
