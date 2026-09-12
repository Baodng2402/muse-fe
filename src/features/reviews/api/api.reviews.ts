import { httpClient } from '@/src/core/api/client';
import { API_ENDPOINTS } from '@/src/core/config/endpoints';
import type { Review, CreateReviewCommand } from '@/src/core/api/types';

export const reviewsApi = {
  create: async (bookingId: string, data: CreateReviewCommand): Promise<Review> => {
    return httpClient.post<Review>(API_ENDPOINTS.reviews.create(bookingId), data);
  },
  listByUser: async (userId: string): Promise<Review[]> => {
    return httpClient.get<Review[]>(API_ENDPOINTS.reviews.userList(userId));
  },
};
