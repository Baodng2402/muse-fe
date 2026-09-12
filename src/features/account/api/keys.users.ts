export const userKeys = {
  all: ['users'] as const,
  me: () => [...userKeys.all, 'me'] as const,
  profile: (id: string) => [...userKeys.all, 'profile', id] as const,
  byId: (id: string) => [...userKeys.all, 'detail', id] as const,
};
