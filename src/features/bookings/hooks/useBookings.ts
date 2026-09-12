'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookings.api';
import { bookingKeys } from '../api/bookings.keys';
import type { CreateBookingCommand } from '@/src/core/api/types';

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingCommand) => bookingsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
}
