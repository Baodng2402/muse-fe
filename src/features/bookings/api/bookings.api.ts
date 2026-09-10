import { httpClient } from '@/src/core/api/client';
import { API_ENDPOINTS } from '@/src/core/config/endpoints';
import type { Booking, CreateBookingCommand } from '@/src/core/api/types';

export const bookingsApi = {
  create: async (data: CreateBookingCommand): Promise<Booking> => {
    return httpClient.post<Booking>(API_ENDPOINTS.bookings.create, data);
  },
};
