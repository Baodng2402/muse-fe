import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { metadataKeys } from '../api/keys.metadata';
import { metadataApi } from '../api/api.metadata';

// Metadata changes infrequently: cache for 10 minutes, garbage collect after 30 minutes
const METADATA_STALE_TIME = 10 * 60 * 1000;
const METADATA_GC_TIME = 30 * 60 * 1000;

/**
 * Hook to fetch regions (cities/provinces) with long-lived client caching.
 */
export function useRegionsQuery() {
  return useQuery({
    queryKey: metadataKeys.regions(),
    queryFn: () => metadataApi.getRegions(),
    staleTime: METADATA_STALE_TIME,
    gcTime: METADATA_GC_TIME,
  });
}

export function useCreateRegionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; slug: string }) => metadataApi.createRegion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: metadataKeys.regions() });
    },
  });
}

export function useUpdateRegionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; slug: string } }) =>
      metadataApi.updateRegion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: metadataKeys.regions() });
    },
  });
}

export function useToggleRegionStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => metadataApi.toggleRegionStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: metadataKeys.regions() });
    },
  });
}

/**
 * Hook to fetch specialties with long-lived client caching.
 */
export function useSpecialtiesQuery() {
  return useQuery({
    queryKey: metadataKeys.specialties(),
    queryFn: () => metadataApi.getSpecialties(),
    staleTime: METADATA_STALE_TIME,
    gcTime: METADATA_GC_TIME,
  });
}

export function useCreateSpecialtyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; slug: string }) => metadataApi.createSpecialty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: metadataKeys.specialties() });
    },
  });
}

export function useToggleSpecialtyStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => metadataApi.toggleSpecialtyStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: metadataKeys.specialties() });
    },
  });
}
