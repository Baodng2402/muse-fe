export const metadataKeys = {
  all: ['metadata'] as const,
  regions: () => [...metadataKeys.all, 'regions'] as const,
  specialties: () => [...metadataKeys.all, 'specialties'] as const,
};
