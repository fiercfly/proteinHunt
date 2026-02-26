import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { dealsApi } from '../utils/api';

// Infinite-scroll feed — re-fetches when filters change
export function useDeals(params) {
  return useInfiniteQuery({
    queryKey: ['deals', params],
    queryFn: ({ pageParam = 1 }) => dealsApi.getAll({ ...params, page: pageParam, limit: 20 }),
    getNextPageParam: (last) => last.pagination?.hasMore ? last.pagination.page + 1 : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000,   // 10 minutes to garbage collection
  });
}

// Single deal by ID
export function useDeal(id) {
  return useQuery({
    queryKey: ['deal', id],
    queryFn: () => dealsApi.getOne(id),
    enabled: !!id,
  });
}

// Distinct brands with counts — for sidebar
export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: dealsApi.getBrands,
    staleTime: 300_000,
  });
}

// Post type counts — for filter chips
export function usePostTypes() {
  return useQuery({
    queryKey: ['posttypes'],
    queryFn: dealsApi.getPostTypes,
    staleTime: 120_000,
  });
}

// Latest posts for the ticker strip
export function useTicker() {
  return useQuery({
    queryKey: ['ticker'],
    queryFn: () => dealsApi.getAll({ sort: 'newest', limit: 15 }),
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}

// Flatten pages array from useInfiniteQuery into a flat deals array
export function flatDeals(data) {
  return data?.pages?.flatMap(p => p.deals) ?? [];
}
