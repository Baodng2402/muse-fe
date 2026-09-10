'use client';

import { useCallback, useMemo } from 'react';
import { useUrlParams } from './use-url-params';
import type { PaginationMeta } from '@/src/core/api/types';

export interface UsePaginationOptions {
  defaultPage?: number;
  defaultPageSize?: number;
  pageParamKey?: string;
  pageSizeParamKey?: string;
}

/**
 * Senior hook for managing pagination synchronized with URL search params.
 * Ensures consistent page numbers across navigation, reload and sharing.
 */
export function usePagination(options: UsePaginationOptions = {}) {
  const {
    defaultPage = 1,
    defaultPageSize = 10,
    pageParamKey = 'page',
    pageSizeParamKey = 'page_size',
  } = options;

  const { getParam, setParams } = useUrlParams();

  // Read current page & pageSize from URL
  const page = useMemo(() => {
    const raw = getParam(pageParamKey);
    const parsed = raw ? parseInt(raw, 10) : defaultPage;
    return isNaN(parsed) || parsed < 1 ? defaultPage : parsed;
  }, [getParam, pageParamKey, defaultPage]);

  const pageSize = useMemo(() => {
    const raw = getParam(pageSizeParamKey);
    const parsed = raw ? parseInt(raw, 10) : defaultPageSize;
    return isNaN(parsed) || parsed < 1 ? defaultPageSize : parsed;
  }, [getParam, pageSizeParamKey, defaultPageSize]);

  // Actions
  const setPage = useCallback(
    (newPage: number) => {
      setParams({
        [pageParamKey]: newPage <= 1 ? null : newPage,
      });
    },
    [pageParamKey, setParams]
  );

  const setPageSize = useCallback(
    (newPageSize: number) => {
      setParams({
        [pageSizeParamKey]: newPageSize === defaultPageSize ? null : newPageSize,
        [pageParamKey]: null, // Reset to page 1 when page size changes
      });
    },
    [defaultPageSize, pageParamKey, pageSizeParamKey, setParams]
  );

  const resetPage = useCallback(() => {
    setParams({
      [pageParamKey]: null,
    });
  }, [pageParamKey, setParams]);

  /**
   * Calculates pagination indicators based on metadata returned by the backend.
   */
  const getPaginationIndicators = useCallback(
    (meta?: PaginationMeta | null) => {
      const totalRecords = meta?.total_records ?? 0;
      const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;
      const fromRecord = totalRecords === 0 ? 0 : (page - 1) * pageSize + 1;
      const toRecord = Math.min(page * pageSize, totalRecords);

      return {
        totalRecords,
        totalPages,
        hasPrevPage,
        hasNextPage,
        fromRecord,
        toRecord,
      };
    },
    [page, pageSize]
  );

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    resetPage,
    getPaginationIndicators,
  };
}
