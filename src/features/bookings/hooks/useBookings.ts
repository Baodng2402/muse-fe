'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../api/api.bookings';
import { bookingKeys } from '../api/keys.bookings';
import type { CreateBookingCommand } from '@/src/core/api/types';
import { useAuthStore } from '@/src/shared/store/store.auth';

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingCommand) => bookingsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
}

export function useClientBookingsQuery() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: bookingKeys.list({ role: 'client' }),
    queryFn: () => bookingsApi.listClient(),
    enabled: isAuthenticated,
    retry: false,
  });
}

export function useProviderBookingsQuery() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: bookingKeys.list({ role: 'provider' }),
    queryFn: () => bookingsApi.listProvider(),
    enabled: isAuthenticated,
    retry: false,
  });
}

export function useUpdateBookingStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      bookingsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}

