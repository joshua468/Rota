import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import type { Persister } from '@tanstack/react-query-persist-client';
import { Platform } from 'react-native';

export const PERSIST_KEY = 'rota.queryCache.v1';
export const PERSIST_BUSTER = 'rota-v1';
export const PERSIST_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const ALLOW_LIST = new Set(['me', 'settings', 'members', 'roster', 'shifts']);

type AsyncStorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const memory = new Map<string, string>();
const memoryAdapter: AsyncStorageLike = {
  getItem: async (key) => memory.get(key) ?? null,
  setItem: async (key, value) => {
    memory.set(key, value);
  },
  removeItem: async (key) => {
    memory.delete(key);
  },
};

/**
 * Web uses localStorage; React Native has no such global, so native uses
 * AsyncStorage (the non-sensitive cache store). Tokens never go here: they live
 * in expo-secure-store (Rule 03). Falling back to memory keeps tests hermetic,
 * but native persistence works across app restarts.
 */
function resolveStorage(): AsyncStorageLike {
  if (Platform.OS === 'web') {
    try {
      const candidate = (globalThis as { localStorage?: Storage }).localStorage;
      if (candidate) {
        candidate.getItem(PERSIST_KEY);
        return {
          getItem: async (key) => candidate.getItem(key),
          setItem: async (key, value) => {
            candidate.setItem(key, value);
          },
          removeItem: async (key) => {
            candidate.removeItem(key);
          },
        };
      }
    } catch {
      return memoryAdapter;
    }
  }
  return AsyncStorage as unknown as AsyncStorageLike;
}

/**
 * Persisted offline cache is an allow-list: identity, roster, settings and
 * upcoming shifts (docs/STATE.md). Swaps, activity, subscription, ledger and
 * payment state are never written to disk.
 */
export function isAllowListed(queryKey: unknown): boolean {
  if (!Array.isArray(queryKey) || queryKey.length === 0) return false;
  return ALLOW_LIST.has(String(queryKey[0]));
}

/**
 * Persist only queries that have already resolved AND are allow-listed.
 * Without the `success` guard, a pending query is dehydrated with its promise;
 * if it later rejects (e.g. an unauthenticated fetch), React Query logs
 * "A query that was dehydrated as pending ended up rejecting".
 */
export function shouldDehydrateQuery(query: {
  queryKey: unknown;
  state: { status: string };
}): boolean {
  return query.state?.status === 'success' && isAllowListed(query.queryKey);
}

export function createCachePersister(): Persister {
  const inner = createAsyncStoragePersister({
    storage: resolveStorage(),
    key: PERSIST_KEY,
  });
  return {
    persistClient: inner.persistClient,
    removeClient: inner.removeClient,
    // A truncated/corrupt cache must never crash startup: treat it as a miss.
    restoreClient: async () => {
      try {
        const restored = await inner.restoreClient();
        if (
          !restored ||
          typeof restored !== 'object' ||
          typeof restored.timestamp !== 'number' ||
          typeof restored.clientState !== 'object' ||
          restored.clientState === null
        ) {
          return undefined;
        }
        return restored;
      } catch {
        return undefined;
      }
    },
  };
}

export async function clearPersistedCache(): Promise<void> {
  await createCachePersister().removeClient();
}
