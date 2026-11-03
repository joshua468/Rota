import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PERSIST_BUSTER,
  PERSIST_KEY,
  clearPersistedCache,
  createCachePersister,
  isAllowListed,
  shouldDehydrateQuery,
} from './persister';

type MemoryStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  map: Map<string, string>;
};

function memoryStorage(): MemoryStorage {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    },
    map,
  };
}

let storage: MemoryStorage;

const sample = {
  timestamp: 1_700_000_000_000,
  buster: PERSIST_BUSTER,
  clientState: {
    mutations: [],
    queries: [
      {
        queryKey: ['shifts', 'team-1', { from: 'a', to: 'b' }],
        queryHash: 'shifts-1',
        state: { data: { items: [], nextCursor: null }, dataUpdatedAt: 1, status: 'success' },
      },
    ],
  },
};

beforeEach(() => {
  storage = memoryStorage();
  vi.stubGlobal('localStorage', storage);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('isAllowListed', () => {
  it('accepts identity, roster, settings and shifts keys', () => {
    expect(isAllowListed(['me'])).toBe(true);
    expect(isAllowListed(['settings'])).toBe(true);
    expect(isAllowListed(['members', 'team-1'])).toBe(true);
    expect(isAllowListed(['shifts', 'team-1', { from: 'a', to: 'b' }])).toBe(true);
  });

  it('refuses billing, swaps, feed and anything outside the allow-list', () => {
    expect(isAllowListed(['subscription', 'team-1'])).toBe(false);
    expect(isAllowListed(['ledger', 'team-1'])).toBe(false);
    expect(isAllowListed(['swaps', 'team-1', 'all'])).toBe(false);
    expect(isAllowListed(['feed', 'team-1'])).toBe(false);
    expect(isAllowListed([])).toBe(false);
    expect(isAllowListed('me')).toBe(false);
    expect(isAllowListed(undefined)).toBe(false);
  });
});

describe('shouldDehydrateQuery', () => {
  it('persists allow-listed queries that have resolved', () => {
    expect(
      shouldDehydrateQuery({
        queryKey: ['shifts', 'team-1', { from: 'a', to: 'b' }],
        state: { status: 'success' },
      }),
    ).toBe(true);
  });

  it('never persists a pending query, even an allow-listed one', () => {
    expect(
      shouldDehydrateQuery({
        queryKey: ['shifts', 'team-1', { from: 'a', to: 'b' }],
        state: { status: 'pending' },
      }),
    ).toBe(false);
  });

  it('never persists an errored query', () => {
    expect(
      shouldDehydrateQuery({ queryKey: ['me'], state: { status: 'error' } }),
    ).toBe(false);
  });

  it('refuses resolved queries outside the allow-list', () => {
    expect(
      shouldDehydrateQuery({ queryKey: ['subscription', 'team-1'], state: { status: 'success' } }),
    ).toBe(false);
  });
});

describe('createCachePersister', () => {
  it('round-trips a persisted client with its buster', async () => {
    const persister = createCachePersister();
    await persister.persistClient(sample as never);
    expect(storage.map.has(PERSIST_KEY)).toBe(true);
    const restored = await persister.restoreClient();
    expect(restored).toEqual(sample);
    expect(restored?.buster).toBe(PERSIST_BUSTER);
  });

  it('returns undefined when nothing is stored', async () => {
    const persister = createCachePersister();
    expect(await persister.restoreClient()).toBeUndefined();
  });

  it('returns undefined instead of throwing on a corrupt payload', async () => {
    const persister = createCachePersister();
    storage.setItem(PERSIST_KEY, 'not-json');
    expect(await persister.restoreClient()).toBeUndefined();
    storage.setItem(PERSIST_KEY, JSON.stringify({ nope: true }));
    expect(await persister.restoreClient()).toBeUndefined();
  });

  it('clearPersistedCache removes the stored client', async () => {
    const persister = createCachePersister();
    await persister.persistClient(sample as never);
    await clearPersistedCache();
    expect(storage.map.has(PERSIST_KEY)).toBe(false);
    expect(await persister.restoreClient()).toBeUndefined();
  });
});
