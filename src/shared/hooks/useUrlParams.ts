'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export interface SetParamOptions {
  /**
   * If true, uses router.replace instead of router.push.
   * Default is true to avoid spamming the browser history stack.
   */
  replace?: boolean;
  /**
   * Whether to scroll to the top of the page on update. Default is false.
   */
  scroll?: boolean;
}

export type ParamValue = string | number | boolean | null | undefined;

/**
 * Senior hook for type-safe and performant URL Search Params management in Next.js App Router.
 * Synchronizes client-side filter and pagination state with the URL query string.
 */
export function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create a mutable copy of URLSearchParams
  const currentParams = useMemo(() => {
    return new URLSearchParams(searchParams.toString());
  }, [searchParams]);

  /**
   * Reads a single query param by key with an optional fallback.
   */
  const getParam = useCallback(
    <T extends string = string>(key: string, defaultValue?: T): T | undefined => {
      const val = searchParams.get(key);
      if (val === null || val === '') {
        return defaultValue;
      }
      return val as T;
    },
    [searchParams]
  );

  /**
   * Reads all current search parameters as a plain Record<string, string>.
   */
  const getAllParams = useCallback((): Record<string, string> => {
    const result: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      result[key] = val;
    });
    return result;
  }, [searchParams]);

  /**
   * Updates multiple query parameters in a single batch navigation.
   */
  const setParams = useCallback(
    (updates: Record<string, ParamValue>, options: SetParamOptions = {}) => {
      const { replace = true, scroll = false } = options;
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;

      if (replace) {
        router.replace(targetUrl, { scroll });
      } else {
        router.push(targetUrl, { scroll });
      }
    },
    [pathname, router, searchParams]
  );

  /**
   * Updates a single query parameter.
   */
  const setParam = useCallback(
    (key: string, value: ParamValue, options: SetParamOptions = {}) => {
      setParams({ [key]: value }, options);
    },
    [setParams]
  );

  /**
   * Removes specified query parameters or all except preserved keys.
   */
  const clearParams = useCallback(
    (preserveKeys: string[] = [], options: SetParamOptions = {}) => {
      const { replace = true, scroll = false } = options;
      const params = new URLSearchParams();

      preserveKeys.forEach((key) => {
        const existingVal = searchParams.get(key);
        if (existingVal !== null) {
          params.set(key, existingVal);
        }
      });

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;

      if (replace) {
        router.replace(targetUrl, { scroll });
      } else {
        router.push(targetUrl, { scroll });
      }
    },
    [pathname, router, searchParams]
  );

  return {
    getParam,
    getAllParams,
    setParam,
    setParams,
    clearParams,
    searchParams: currentParams,
  };
}
