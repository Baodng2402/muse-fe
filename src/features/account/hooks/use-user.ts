import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userKeys } from '../api/users.keys';
import { usersApi } from '../api/users.api';
import { useAuthStore } from '@/src/shared/store/use-auth-store';
import type { UpdateUserProfileDTO } from '@/src/core/api/types';

/**
 * Hook to fetch the current authenticated user's profile from the backend.
 */
export function useCurrentUserQuery() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const updateUser = useAuthStore((s) => s.updateUser);

  return useQuery({
    queryKey: userKeys.me(),
    queryFn: async () => {
      const profile = await usersApi.getMe();
      if (profile) {
        updateUser(profile);
      }
      return profile;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to update user profile with automatic cache and Zustand store update.
 */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: (dto: UpdateUserProfileDTO) => usersApi.updateProfile(dto),
    onSuccess: (updatedUser) => {
      // Update global Zustand store immediately
      updateUser(updatedUser);
      // Update React Query cache
      queryClient.setQueryData(userKeys.me(), updatedUser);
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
