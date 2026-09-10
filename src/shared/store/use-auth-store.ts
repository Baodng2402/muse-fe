import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserDTO } from '@/src/core/api/types';
import { STORAGE_KEYS } from '@/src/core/config/storage-keys';

export interface AuthState {
  user: UserDTO | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
}

export interface AuthActions {
  setAuth: (payload: { user: UserDTO; accessToken: string; refreshToken: string }) => void;
  setTokens: (payload: { accessToken: string; refreshToken?: string }) => void;
  updateUser: (updates: Partial<UserDTO>) => void;
  clearAuth: () => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setAuth: ({ user, accessToken, refreshToken }) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      setTokens: ({ accessToken, refreshToken }) =>
        set((state) => ({
          accessToken,
          refreshToken: refreshToken ?? state.refreshToken,
          isAuthenticated: true,
        })),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),
    }),
    {
      name: STORAGE_KEYS.AUTH,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

/**
 * Senior Atomic Selectors to avoid unnecessary re-renders.
 */
export const useCurrentUser = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useAuthHydrated = () => useAuthStore((s) => s._hasHydrated);
export const useAccessToken = () => useAuthStore((s) => s.accessToken);
