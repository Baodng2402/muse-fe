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

  createRegion(data: { name: string; slug: string }): Promise<Region> {
    return apiClient.post<Region>(API_ENDPOINTS.regions.create, data);
  },

  updateRegion(id: string, data: { name: string; slug: string }): Promise<Region> {
    return apiClient.put<Region>(API_ENDPOINTS.regions.update(id), data);
  },

  toggleRegionStatus(id: string): Promise<Region> {
    return apiClient.patch<Region>(API_ENDPOINTS.regions.toggleStatus(id));
  },

  /**
   * Fetches all active specialties (makeup, nail, photo, etc.).
   */
  getSpecialties(): Promise<Specialty[]> {
    return apiClient.get<Specialty[]>(API_ENDPOINTS.specialties.list);
  },

  createSpecialty(data: { name: string; slug: string }): Promise<Specialty> {
    return apiClient.post<Specialty>(API_ENDPOINTS.specialties.create, data);
  },

  updateSpecialty(id: string, data: { name: string; slug: string }): Promise<Specialty> {
    return apiClient.put<Specialty>(API_ENDPOINTS.specialties.update(id), data);
  },

  toggleSpecialtyStatus(id: string): Promise<Specialty> {
    return apiClient.patch<Specialty>(API_ENDPOINTS.specialties.toggleStatus(id));
  },
};
