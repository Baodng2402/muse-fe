import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { authApi } from '../api/api.auth';
import { useAuthStore } from '@/src/shared/store/store.auth';
import { ROUTES } from '@/src/core/config/routes';
import type { LoginPayload, RegisterPayload } from '@/src/core/api/types';

/**
 * Hook for login mutation. Automatically updates Zustand Auth Store on success.
 */
export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (result) => {
      setAuth({
        user: result.user,
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
      });
      // Invalidate relevant queries (e.g. saved posts, user profile)
      queryClient.invalidateQueries();
      router.push(ROUTES.home);
    },
  });
}

/**
 * Hook for registration mutation. Automatically updates Zustand Auth Store on success.
 */
export function useRegisterMutation() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (result) => {
      setAuth({
        user: result.user,
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
      });
      router.push(ROUTES.home);
    },
  });
}

/**
 * Hook to perform clean logout.
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router = useRouter();

  return useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // In case server is unreachable or token expired, still clean client state
    } finally {
      clearAuth();
      // Clear all cached server queries
      queryClient.clear();
      router.push(ROUTES.auth.login);
    }
  }, [clearAuth, queryClient, router]);
}
