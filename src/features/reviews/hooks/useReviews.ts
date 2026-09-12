import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '../api/api.reviews';
import { reviewKeys } from '../api/keys.reviews';
import { bookingKeys } from '@/src/features/bookings/api/keys.bookings';
import type { CreateReviewCommand } from '@/src/core/api/types';

export function useUserReviewsQuery(userId?: string) {
  return useQuery({
    queryKey: reviewKeys.userList(userId || ''),
    queryFn: () => reviewsApi.listByUser(userId!),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateReviewMutation(bookingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReviewCommand) => reviewsApi.create(bookingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}
