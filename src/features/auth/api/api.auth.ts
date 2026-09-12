import { apiClient } from '@/src/core/api/client';
import { API_ENDPOINTS } from '@/src/core/config/endpoints';
import type {
  AuthResult,
  LoginPayload,
  RegisterPayload,
} from '@/src/core/api/types';

export const authApi = {
  /**
   * Log in user with email/phone & password.
   */
  login(payload: LoginPayload): Promise<AuthResult> {
    return apiClient.post<AuthResult>(API_ENDPOINTS.auth.login, payload, { skipAuth: true });
  },

  /**
   * Register a new user account.
   */
  register(payload: RegisterPayload): Promise<AuthResult> {
    return apiClient.post<AuthResult>(API_ENDPOINTS.auth.register, payload, { skipAuth: true });
  },

  /**
   * Log out user from session.
   */
  logout(): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.auth.logout);
  },
};
