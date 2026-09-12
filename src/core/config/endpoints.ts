/**
 * Centralized API endpoints registry.
 * Zero hardcoded path strings anywhere in feature logic or UI.
 */
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
  },
  users: {
    me: '/users/me',
    update: '/users/me',
    byId: (id: string) => `/users/${encodeURIComponent(id)}`,
  },
  posts: {
    list: '/posts',
    detail: (id: string) => `/posts/${encodeURIComponent(id)}`,
    create: '/posts',
    update: (id: string) => `/posts/${encodeURIComponent(id)}`,
    delete: (id: string) => `/posts/${encodeURIComponent(id)}`,
    save: (id: string) => `/posts/${encodeURIComponent(id)}/save`,
    unsave: (id: string) => `/posts/${encodeURIComponent(id)}/save`,
  },
  savedPosts: {
    list: '/saved-posts',
  },
  regions: {
    list: '/regions',
    create: '/regions',
    update: (id: string) => `/regions/${encodeURIComponent(id)}`,
    toggleStatus: (id: string) => `/regions/${encodeURIComponent(id)}/status`,
  },
  specialties: {
    list: '/specialties',
    create: '/specialties',
    update: (id: string) => `/specialties/${encodeURIComponent(id)}`,
    toggleStatus: (id: string) => `/specialties/${encodeURIComponent(id)}/status`,
  },
  portfolio: {
    userList: (userId: string) => `/users/${encodeURIComponent(userId)}/portfolio`,
    create: '/portfolio',
    update: (id: string) => `/portfolio/${encodeURIComponent(id)}`,
    delete: (id: string) => `/portfolio/${encodeURIComponent(id)}`,
    addImage: (id: string) => `/portfolio/${encodeURIComponent(id)}/images`,
    like: (id: string) => `/portfolio/${encodeURIComponent(id)}/like`,
    unlike: (id: string) => `/portfolio/${encodeURIComponent(id)}/like`,
  },
  bookings: {
    create: '/bookings',
    listClient: '/bookings/client',
    listProvider: '/bookings/provider',
    get: (id: string) => `/bookings/${encodeURIComponent(id)}`,
    updateStatus: (id: string) => `/bookings/${encodeURIComponent(id)}/status`,
  },
  reviews: {
    create: (bookingId: string) => `/bookings/${encodeURIComponent(bookingId)}/reviews`,
    userList: (userId: string) => `/users/${encodeURIComponent(userId)}/reviews`,
  },
  reports: {
    list: '/reports',
    create: '/reports',
    updateStatus: (id: string) => `/reports/${encodeURIComponent(id)}/status`,
    delete: (id: string) => `/reports/${encodeURIComponent(id)}`,
  },
  system: {
    health: '/health',
  },
} as const;
