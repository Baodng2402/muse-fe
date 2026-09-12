import { httpClient } from '@/src/core/api/client';
import { API_ENDPOINTS } from '@/src/core/config/endpoints';
import type { Booking, CreateBookingCommand } from '@/src/core/api/types';

export const bookingsApi = {
  create: async (data: CreateBookingCommand): Promise<Booking> => {
    return httpClient.post<Booking>(API_ENDPOINTS.bookings.create, data);
  },
  listClient: async (): Promise<Booking[]> => {
    return httpClient.get<Booking[]>(API_ENDPOINTS.bookings.listClient);
  },
  listProvider: async (): Promise<Booking[]> => {
    return httpClient.get<Booking[]>(API_ENDPOINTS.bookings.listProvider);
  },
  getByID: async (id: string): Promise<Booking> => {
    return httpClient.get<Booking>(API_ENDPOINTS.bookings.get(id));
  },
  updateStatus: async (id: string, status: string): Promise<Booking> => {
    return httpClient.patch<Booking>(API_ENDPOINTS.bookings.updateStatus(id), { status });
  },
};
