import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface CacheConfig {
  key: string[];
  ttl?: number; // Time to live in milliseconds
  staleTime?: number;
  onError?: (error: unknown) => void;
}

export const useDataCache = () => {
  const queryClient = useQueryClient();

  const setCache = useCallback(<T>(
    key: string[],
    data: T,
    config?: Omit<CacheConfig, 'key'>
  ) => {
    queryClient.setQueryData(key, data);

    if (config?.ttl) {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: key });
      }, config.ttl);
    }
  }, [queryClient]);

  const getCache = useCallback(<T>(
    key: string[]
  ): T | undefined => {
    return queryClient.getQueryData<T>(key);
  }, [queryClient]);

  const invalidateCache = useCallback(
    (key: string[]) => {
      queryClient.invalidateQueries({ queryKey: key });
    },
    [queryClient]
  );

  const prefetchData = useCallback(
    async <T>(
      key: string[],
      fetcher: () => Promise<T>,
      config?: Omit<CacheConfig, 'key'>
    ) => {
      try {
        await queryClient.prefetchQuery({
          queryKey: key,
          queryFn: fetcher,
          staleTime: config?.staleTime ?? 5 * 60 * 1000, // 5 minutes par défaut
        });
      } catch (error) {
        config?.onError?.(error);
      }
    },
    [queryClient]
  );

  return {
    setCache,
    getCache,
    invalidateCache,
    prefetchData,
  };
};
