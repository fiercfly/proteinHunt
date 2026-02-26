import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';

export const DEFAULT_FILTERS = {
  sort:        'newest',
  category:    '',
  source:      '',
  minDiscount: '',
  maxPrice:    '',
};

/**
 * useFilters — manages all filter state
 *
 * Syncs to URL search params so filters survive refresh
 * and users can share filtered URLs.
 * Also persists to localStorage as fallback.
 *
 * Returns:
 *   filters   — current filter values
 *   setFilter — update one filter key
 *   setFilters— replace all filters at once
 *   reset     — back to defaults
 *   activeCount — how many filters are non-default (for badge display)
 *   params    — ready-to-use object for API calls
 */
export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stored, setStored]             = useLocalStorage('dp_filters', DEFAULT_FILTERS);

  // Read from URL first, fall back to localStorage
  const filters = useMemo(() => {
    const fromUrl = {
      sort:        searchParams.get('sort')        || stored.sort        || DEFAULT_FILTERS.sort,
      category:    searchParams.get('category')    || stored.category    || DEFAULT_FILTERS.category,
      source:      searchParams.get('source')      || stored.source      || DEFAULT_FILTERS.source,
      minDiscount: searchParams.get('minDiscount') || stored.minDiscount || DEFAULT_FILTERS.minDiscount,
      maxPrice:    searchParams.get('maxPrice')    || stored.maxPrice    || DEFAULT_FILTERS.maxPrice,
    };
    return fromUrl;
  }, [searchParams, stored]);

  // Write to both URL and localStorage
  const setFilters = useCallback((next) => {
    const updated = typeof next === 'function' ? next(filters) : next;
    // Build URL params — omit defaults to keep URL clean
    const params = {};
    Object.entries(updated).forEach(([k, v]) => {
      if (v && v !== DEFAULT_FILTERS[k]) params[k] = v;
    });
    setSearchParams(params, { replace: true });
    setStored(updated);
  }, [filters, setSearchParams, setStored]);

  const setFilter = useCallback((key, value) => {
    setFilters({ ...filters, [key]: value });
  }, [filters, setFilters]);

  const reset = useCallback(() => {
    setSearchParams({}, { replace: true });
    setStored(DEFAULT_FILTERS);
  }, [setSearchParams, setStored]);

  // Count how many filters differ from default
  const activeCount = useMemo(() =>
    Object.entries(filters).filter(([k, v]) =>
      v && v !== DEFAULT_FILTERS[k]
    ).length,
  [filters]);

  // Clean params for API — omit empty strings
  const params = useMemo(() => {
    const clean = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) clean[k] = v; });
    return clean;
  }, [filters]);

  return { filters, setFilter, setFilters, reset, activeCount, params };
}