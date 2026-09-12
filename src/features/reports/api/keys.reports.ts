export const reportKeys = {
  all: ['reports'] as const,
  lists: () => [...reportKeys.all, 'list'] as const,
  list: (status?: string) => [...reportKeys.lists(), status] as const,
};
