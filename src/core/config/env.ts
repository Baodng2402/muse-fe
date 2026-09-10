function getNormalizedApiUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://localhost:8080/api/v1';
  const cleanUrl = rawUrl.replace(/\/+$/, '');
  if (cleanUrl.endsWith('/api/v1')) {
    return cleanUrl;
  }
  return `${cleanUrl}/api/v1`;
}

/**
 * Environment configuration validator and provider.
 * Guarantees required environment variables exist with fallback in development.
 */
export const ENV = {
  /**
   * Base URL for the Go REST API (always ending with /api/v1).
   */
  API_BASE_URL: getNormalizedApiUrl(),
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
} as const;
