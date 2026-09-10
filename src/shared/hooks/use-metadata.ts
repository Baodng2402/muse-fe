import { useQuery } from '@tanstack/react-query';
import { metadataKeys } from '../api/metadata.keys';
import { metadataApi } from '../api/metadata.api';

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
