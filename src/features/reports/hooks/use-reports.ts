'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reportsApi } from '../api/reports.api';
import { reportKeys } from '../api/reports.keys';
import type { CreateReportDTO } from '@/src/core/api/types';

export function useCreateReportMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReportDTO) => reportsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
  });
}

export function useReportsQuery(status?: string) {
  return useQuery({
    queryKey: reportKeys.list(status),
    queryFn: () => reportsApi.list(status),
  });
}
