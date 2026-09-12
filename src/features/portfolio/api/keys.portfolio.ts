export const portfolioKeys = {
  all: ['portfolio'] as const,
  userLists: () => [...portfolioKeys.all, 'user'] as const,
  userList: (userId: string) => [...portfolioKeys.userLists(), userId] as const,
};
