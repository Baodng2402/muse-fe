import { apiClient } from '@/src/core/api/client';
import { API_ENDPOINTS } from '@/src/core/config/endpoints';
import type { Region, Specialty } from '@/src/core/api/types';

export const metadataApi = {
  /**
   * Fetches all active regions (provinces/cities).
   */
  getRegions(): Promise<Region[]> {
    return apiClient.get<Region[]>(API_ENDPOINTS.regions.list);
  },

  /**
   * Fetches all active specialties (makeup, nail, photo, etc.).
   */
  getSpecialties(): Promise<Specialty[]> {
    return apiClient.get<Specialty[]>(API_ENDPOINTS.specialties.list);
  },
};
