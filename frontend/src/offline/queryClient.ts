import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/api/client';

/**
 * One QueryClient for the whole app (Rule 05): reads work offline-first so the
 * persisted allow-listed cache renders before the network answers; a server
 * error envelope is deterministic, so it is never retried blindly — only
 * transport failures are.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 7 * 24 * 60 * 60 * 1000,
        staleTime: 30_000,
        networkMode: 'offlineFirst',
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.code === 'UNAUTHORIZED') return false;
          return failureCount < 2;
        },
      },
      mutations: {
        networkMode: 'online',
      },
    },
  });
}

export const queryClient = createQueryClient();
