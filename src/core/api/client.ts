import { ENV } from '../config/env';
import { API_ENDPOINTS } from '../config/endpoints';
import { AppError } from './errors';
import type { ApiResponse, AuthResult } from './types';
import { useAuthStore } from '@/src/shared/store/store.auth';

export interface RequestConfig extends Omit<RequestInit, 'body'> {
  params?: Record<string, unknown>;
  body?: unknown;
  skipAuth?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

/**
 * Builds the full URL with query parameters serialized cleanly.
 */
function buildUrl(endpoint: string, params?: Record<string, unknown>): string {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const baseUrl = ENV.API_BASE_URL.replace(/\/+$/, '');
  const url = new URL(`${baseUrl}${normalizedEndpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Executes a fetch request and standardizes error handling & response unwrapping.
 */
async function executeRequest<T>(
  url: string,
  config: RequestConfig,
  token?: string | null
): Promise<T> {
  const headers = new Headers(config.headers);

  if (!headers.has('Content-Type') && !(config.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !config.skipAuth) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const fetchOptions: RequestInit = {
    ...config,
    headers,
    body:
      config.body !== undefined
        ? config.body instanceof FormData
          ? config.body
          : JSON.stringify(config.body)
        : undefined,
  };

  let response: Response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (err) {
    throw new AppError(
      'Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng.',
      0,
      'NETWORK_ERROR',
      err
    );
  }

  // Parse JSON response body
  let parsedJson: ApiResponse<T> | null = null;
  const contentType = response.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    try {
      parsedJson = (await response.json()) as ApiResponse<T>;
    } catch {
      parsedJson = null;
    }
  }

  // Handle successful response
  if (response.ok) {
    if (parsedJson) {
      if (parsedJson.success) {
        if (parsedJson.pagination !== undefined) {
          return {
            data: parsedJson.data,
            pagination: parsedJson.pagination,
          } as unknown as T;
        }
        return parsedJson.data;
      }
      throw new AppError(
        parsedJson.error || 'Yêu cầu không thành công',
        response.status,
        parsedJson.code || 'API_ERROR'
      );
    }
    // 204 No Content or non-JSON success
    return undefined as unknown as T;
  }

  // Handle 401 Unauthorized token refresh flow (client-side only)
  if (response.status === 401 && !config.skipAuth && typeof window !== 'undefined') {
    const authStore = useAuthStore.getState();
    const currentRefreshToken = authStore.refreshToken;

    if (currentRefreshToken) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshUrl = buildUrl(API_ENDPOINTS.auth.refresh);
          const refreshRes = await fetch(refreshUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: currentRefreshToken }),
          });

          if (refreshRes.ok) {
            const refreshData = (await refreshRes.json()) as ApiResponse<AuthResult>;
            if (refreshData.success && refreshData.data?.access_token) {
              const newAccessToken = refreshData.data.access_token;
              const newRefreshToken = refreshData.data.refresh_token || currentRefreshToken;

              authStore.setTokens({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              });

              onTokenRefreshed(newAccessToken);
              isRefreshing = false;

              // Retry original request with new token
              return executeRequest<T>(url, config, newAccessToken);
            }
          }
          // Refresh failed
          authStore.clearAuth();
          isRefreshing = false;
        } catch (refreshErr) {
          authStore.clearAuth();
          isRefreshing = false;
          throw new AppError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 401, 'UNAUTHORIZED', refreshErr);
        }
      } else {
        // Wait for existing refresh promise
        return new Promise<T>((resolve, reject) => {
          addRefreshSubscriber((newToken) => {
            executeRequest<T>(url, config, newToken).then(resolve).catch(reject);
          });
        });
      }
    }
  }

  const errorMessage =
    parsedJson?.error ||
    (response.status === 401
      ? 'Vui lòng đăng nhập để thực hiện hành động này.'
      : response.status === 403
      ? 'Bạn không có quyền thực hiện hành động này.'
      : response.status === 404
      ? 'Không tìm thấy tài nguyên yêu cầu.'
      : `Lỗi máy chủ (${response.status})`);

  const errorCode = parsedJson?.code || `HTTP_${response.status}`;

  throw new AppError(errorMessage, response.status, errorCode, parsedJson);
}

/**
 * Senior HTTP Client methods.
 */
export const apiClient = {
  get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? useAuthStore.getState().accessToken : null;
    const url = buildUrl(endpoint, config.params);
    return executeRequest<T>(url, { ...config, method: 'GET' }, token);
  },

  post<T>(endpoint: string, body?: unknown, config: RequestConfig = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? useAuthStore.getState().accessToken : null;
    const url = buildUrl(endpoint, config.params);
    return executeRequest<T>(url, { ...config, method: 'POST', body }, token);
  },

  put<T>(endpoint: string, body?: unknown, config: RequestConfig = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? useAuthStore.getState().accessToken : null;
    const url = buildUrl(endpoint, config.params);
    return executeRequest<T>(url, { ...config, method: 'PUT', body }, token);
  },

  patch<T>(endpoint: string, body?: unknown, config: RequestConfig = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? useAuthStore.getState().accessToken : null;
    const url = buildUrl(endpoint, config.params);
    return executeRequest<T>(url, { ...config, method: 'PATCH', body }, token);
  },

  delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? useAuthStore.getState().accessToken : null;
    const url = buildUrl(endpoint, config.params);
    return executeRequest<T>(url, { ...config, method: 'DELETE' }, token);
  },
};

export const httpClient = apiClient;
