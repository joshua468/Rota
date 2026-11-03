import type { Logger } from 'pino';
import { randomSecret } from '../lib/crypto';

/**
 * Distributed locks for work that must run on exactly one node at a time
 * (ADR-0008). The store lives in Redis when `REDIS_URL` is set (Upstash free
 * tier is enough — a single `SET NX PX` and a Lua release) and in-process
 * otherwise, so tests and local dev behave identically.
 *
 * A lock is best-effort and time-boxed: the holder must finish (or renew)
 * within `ttlMs` or the lock expires, so a crashed node never blocks the sweep
 * forever. Callers therefore combine the lock with idempotent operations.
 */
export type LockHandle = () => Promise<void>;

export interface Lock {
  /** Acquire exclusivity for `key`; returns a release fn, or null if held. */
  acquire(key: string, ttlMs: number): Promise<LockHandle | null>;
  close(): Promise<void>;
}

export class MemoryLock implements Lock {
  private readonly held = new Map<string, { token: string; expiresAt: number }>();

  async acquire(key: string, ttlMs: number): Promise<LockHandle | null> {
    const now = Date.now();
    const current = this.held.get(key);
    if (current && current.expiresAt > now) return null;
    const token = randomSecret(16);
    this.held.set(key, { token, expiresAt: now + ttlMs });
    return async () => {
      const latest = this.held.get(key);
      if (latest && latest.token === token) this.held.delete(key);
    };
  }

  async close(): Promise<void> {
    this.held.clear();
  }
}

/** Atomic compare-and-delete so a holder can never release someone else's lock. */
const RELEASE_SCRIPT =
  'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end';

export class RedisLock implements Lock {
  private client: import('ioredis').Redis | null = null;

  constructor(private readonly url: string) {}

  private async conn(): Promise<import('ioredis').Redis> {
    if (!this.client) {
      const { default: Redis } = await import('ioredis');
      this.client = new Redis(this.url, { maxRetriesPerRequest: 2 });
    }
    return this.client;
  }

  async acquire(key: string, ttlMs: number): Promise<LockHandle | null> {
    const client = await this.conn();
    const token = randomSecret(16);
    const result = await client.set(key, token, 'PX', ttlMs, 'NX');
    if (result !== 'OK') return null;
    return async () => {
      await client.eval(RELEASE_SCRIPT, 1, key, token).catch(() => undefined);
    };
  }

  async close(): Promise<void> {
    if (!this.client) return;
    const client = this.client;
    this.client = null;
    await client.quit();
  }
}

export async function createLock(redisUrl: string, log: Logger, required = false): Promise<Lock> {
  if (redisUrl) {
    try {
      const { default: Redis } = await import('ioredis');
      const probe = new Redis(redisUrl, { maxRetriesPerRequest: 1, lazyConnect: true, connectTimeout: 5_000 });
      try {
        await probe.connect();
        await probe.ping();
      } finally {
        await probe.quit().catch(() => undefined);
      }
      return new RedisLock(redisUrl);
    } catch (error) {
      if (required) {
        throw new Error(`Refusing to start: Redis lock store is unavailable (${(error as Error).message})`);
      }
      log.error({ err: error }, 'redis unavailable for locks — using in-memory locks');
    }
  }
  if (required) throw new Error('Refusing to start: REDIS_URL is required in production');
  return new MemoryLock();
}
