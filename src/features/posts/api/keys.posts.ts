import type { PostFilterParams } from '@/src/core/api/types';

/**
 * Standardized Query Key Factory for Posts.
 */
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: PostFilterParams = {}) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
  saved: () => [...postKeys.all, 'saved'] as const,
  regions: () => ['regions'] as const,
  specialties: () => ['specialties'] as const,
};
