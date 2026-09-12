export const reviewKeys = {
  all: ['reviews'] as const,
  userList: (userId: string) => [...reviewKeys.all, 'user', userId] as const,
};
