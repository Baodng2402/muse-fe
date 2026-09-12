import { apiClient } from '@/src/core/api/client';
import { API_ENDPOINTS } from '@/src/core/config/endpoints';
import type { UpdateUserProfileDTO, UserDTO } from '@/src/core/api/types';

export const usersApi = {
  /**
   * Fetch current authenticated user's profile.
   */
  getMe(): Promise<UserDTO> {
    return apiClient.get<UserDTO>(API_ENDPOINTS.users.me);
  },

  /**
   * Fetch public profile of a user by ID.
   */
  getUserById(id: string): Promise<UserDTO> {
    return apiClient.get<UserDTO>(API_ENDPOINTS.users.byId(id));
  },

  /**
   * Update current authenticated user's profile.
   */
  updateProfile(payload: UpdateUserProfileDTO): Promise<UserDTO> {
    return apiClient.put<UserDTO>(API_ENDPOINTS.users.update, payload);
  },
};
