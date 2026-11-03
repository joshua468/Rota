import type { Logger } from 'pino';

/**
 * Cache for non-authoritative, read-heavy data only (docs/ARCHITECTURE.md
 * never-cache list). Subscription, payment, ledger, idempotency and webhook
 * records are never cached and never reach this interface. Roster and calendar
 * reads are the only current users.
 *
 * Two drivers behind one interface (mirrors jobs/queue.ts, ADR-0008): Redis when
 * `REDIS_URL` is set, an in-process map otherwise (tests and local dev). Every
 * caller goes through `cached()` / `invalidate()` so a cache outage degrades to
 * "no cache", never a failed request.
 */
export interface Cache {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttlMs: number): Promise<void>;
  del(keys: string[]): Promise<void>;
  /** drop every key under a prefix, e.g. all calendar windows for a team */
  delByPrefix(prefix: string): Promise<void>;
  close(): Promise<void>;
}

export class MemoryCache implements Cache {
  private readonly store = new Map<string, { value: unknown; expiresAt: number }>();

  async get<T>(key: string): Promise<T | undefined> {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlMs: number): Promise<void> {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  async del(keys: string[]): Promise<void> {
    for (const key of keys) this.store.delete(key);
  }

  async delByPrefix(prefix: string): Promise<void> {
    for (const key of [...this.store.keys()]) {
      if (key.startsWith(prefix)) this.store.delete(key);
    }
  }

  async close(): Promise<void> {
    this.store.clear();
  }
}

export class RedisCache implements Cache {
  private client: import('ioredis').Redis | null = null;

  constructor(private readonly url: string) {}

  private async conn(): Promise<import('ioredis').Redis> {
    if (!this.client) {
      const { default: Redis } = await import('ioredis');
      this.client = new Redis(this.url, { maxRetriesPerRequest: 2 });
    }
    return this.client;
  }

  async get<T>(key: string): Promise<T | undefined> {
    const raw = await (await this.conn()).get(key);
    if (raw === null) return undefined;
    return JSON.parse(raw) as T;
  }

  async set<T>(key: string, value: T, ttlMs: number): Promise<void> {
    await (await this.conn()).set(key, JSON.stringify(value), 'PX', ttlMs);
  }

  async del(keys: string[]): Promise<void> {
    if (keys.length === 0) return;
    await (await this.conn()).del(...keys);
  }

  async delByPrefix(prefix: string): Promise<void> {
    const client = await this.conn();
    let cursor = '0';
    do {
      const [next, batch] = await client.scan(cursor, 'MATCH', `${prefix}*`, 'COUNT', 100);
      cursor = next;
      if (batch.length > 0) await client.del(...batch);
    } while (cursor !== '0');
  }

  async close(): Promise<void> {
    if (!this.client) return;
    const client = this.client;
    this.client = null;
    await client.quit();
  }
}

export async function createCache(redisUrl: string, log: Logger): Promise<Cache> {
  if (redisUrl) {
    try {
      await import('ioredis');
      return new RedisCache(redisUrl);
    } catch (error) {
      log.error({ err: error }, 'redis unavailable for cache — using in-memory cache');
    }
  }
  return new MemoryCache();
}

/**
 * Read-through cache. A cache failure (get or set) is swallowed so the request
 * still succeeds from the database — the cache is an optimisation, never a
 * dependency.
 */
export async function cached<T>(
  cache: Cache,
  key: string,
  ttlMs: number,
  load: () => Promise<T>,
): Promise<T> {
  const hit = await cache.get<T>(key).catch(() => undefined);
  if (hit !== undefined) return hit;
  const value = await load();
  await cache.set(key, value, ttlMs).catch(() => undefined);
  return value;
}

/** Invalidate keys after a write; a failure is non-fatal (data is non-authoritative). */
export async function invalidate(cache: Cache, keys: string[]): Promise<void> {
  await cache.del(keys).catch(() => undefined);
}

/** Invalidate a whole key family, e.g. every cached calendar window for a team. */
export async function invalidatePrefix(cache: Cache, prefix: string): Promise<void> {
  await cache.delByPrefix(prefix).catch(() => undefined);
}
