/**
 * Centralized Route Registry for the Client Application.
 * Prevents typos and dead links across navigation elements.
 */
export const ROUTES = {
  home: '/',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  posts: {
    list: '/posts',
    detail: (id: string) => `/posts/${encodeURIComponent(id)}`,
    create: '/posts/new',
  },
  search: '/search',
  profile: {
    detail: (userId: string) => `/profile/${encodeURIComponent(userId)}`,
    me: '/profile/me',
  },
  account: '/account',
} as const;
