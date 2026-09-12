'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { portfolioApi, CreatePortfolioDTO, AddPortfolioImageDTO } from '../api/portfolio.api';
import { portfolioKeys } from '../api/portfolio.keys';

export function useUserPortfolioQuery(userId?: string) {
  return useQuery({
    queryKey: portfolioKeys.userList(userId ?? ''),
    queryFn: () => portfolioApi.listByUser(userId!),
    enabled: !!userId,
  });
}

export function useCreatePortfolioMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePortfolioDTO) => portfolioApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all });
    },
  });
}

export function useAddPortfolioImageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddPortfolioImageDTO }) =>
      portfolioApi.addImage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all });
    },
  });
}

export function useDeletePortfolioMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => portfolioApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all });
    },
  });
}

export function useLikePortfolioMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => portfolioApi.like(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all });
    },
  });
}
