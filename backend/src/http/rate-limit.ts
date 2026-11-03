import { createHash } from 'node:crypto';
import type { Logger } from 'pino';
import type { Env } from '../env';
import { rateLimited } from '../lib/errors';

/**
 * Rate limiting (Rule 06): the store lives in Redis when REDIS_URL is set and
 * in-process otherwise (dev/test — ADR-0008). Auth and billing buckets fail
 * closed when the configured Redis is unreachable; read buckets fail open and
 * log it.
 */
export interface RateDecision {
  allowed: boolean;
  remaining: number;
}

export interface RateStore {
  hit(key: string, windowMs: number, limit: number): Promise<RateDecision>;
  healthy(): boolean;
  /** test helper: drop every counter */
  clear?(): void;
  close(): Promise<void>;
}

export class MemoryRateStore implements RateStore {
  private readonly hits = new Map<string, number[]>();

  clear(): void {
    this.hits.clear();
  }

  async hit(key: string, windowMs: number, limit: number): Promise<RateDecision> {
    const now = Date.now();
    const window = (this.hits.get(key) ?? []).filter((t) => now - t < windowMs);
    window.push(now);
    this.hits.set(key, window);
    return { allowed: window.length <= limit, remaining: Math.max(0, limit - window.length) };
  }

  healthy(): boolean {
    return true;
  }

  async close(): Promise<void> {
    this.hits.clear();
  }
}

export class RedisRateStore implements RateStore {
  private broken = false;

  constructor(
    private readonly redis: {
      incr(key: string): Promise<number>;
      pexpire(key: string, ms: number): Promise<number>;
      quit(): Promise<string>;
    },
  ) {}

  async hit(key: string, windowMs: number, limit: number): Promise<RateDecision> {
    try {
      const count = await this.redis.incr(key);
      if (count === 1) await this.redis.pexpire(key, windowMs);
      this.broken = false;
      return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
    } catch {
      this.broken = true;
      throw new Error('rate limit store unavailable');
    }
  }

  healthy(): boolean {
    return !this.broken;
  }

  async close(): Promise<void> {
    try {
      await this.redis.quit();
    } catch {
      /* already gone */
    }
  }
}

export interface RateLimitRule {
  bucket: string;
  limit: number;
  windowMs: number;
  /** auth and billing deny when the store is down (fail closed) */
  failClosed: boolean;
}

export const RATE_RULES = {
  login: { bucket: 'auth:login', limit: 10, windowMs: 60_000, failClosed: true },
  signup: { bucket: 'auth:signup', limit: 5, windowMs: 60_000, failClosed: true },
  magic: { bucket: 'auth:magic', limit: 5, windowMs: 60_000, failClosed: true },
  forgot: { bucket: 'auth:forgot', limit: 5, windowMs: 300_000, failClosed: true },
  reset: { bucket: 'auth:reset', limit: 10, windowMs: 300_000, failClosed: true },
  refresh: { bucket: 'auth:refresh', limit: 60, windowMs: 60_000, failClosed: true },
  checkout: { bucket: 'billing:checkout', limit: 10, windowMs: 60_000, failClosed: true },
  swapSuggest: { bucket: 'swap:suggest', limit: 30, windowMs: 60_000, failClosed: false },
  read: { bucket: 'read', limit: 600, windowMs: 60_000, failClosed: false },
} as const satisfies Record<string, RateLimitRule>;

export class RateLimiter {
  constructor(
    private readonly store: RateStore,
    private readonly log: Logger,
  ) {}

  /**
   * Throws the contract's RATE_LIMITED error when the caller is over budget or
   * when a fail-closed bucket cannot reach its store.
   */
  async enforce(rule: RateLimitRule, identity: string): Promise<void> {
    const key = `${rule.bucket}:${identity}`;
    try {
      const decision = await this.store.hit(key, rule.windowMs, rule.limit);
      if (!decision.allowed) throw rateLimited();
    } catch (error) {
      if (error instanceof Error && error.name === 'ApiError') throw error;
      if (rule.failClosed) {
        this.log.error({ bucket: rule.bucket }, 'rate limit store down — failing closed');
        throw rateLimited('Service temporarily unavailable');
      }
      this.log.error({ bucket: rule.bucket, err: error }, 'rate limit store down — failing open');
    }
  }

  healthy(): boolean {
    return this.store.healthy();
  }

  close(): Promise<void> {
    return this.store.close();
  }

  clearLimits(): void {
    this.store.clear?.();
  }
}

export function hashKey(...parts: string[]): string {
  return createHash('sha256').update(parts.join(':')).digest('hex').slice(0, 32);
}

export async function createRateLimiter(env: Env, log: Logger): Promise<RateLimiter> {
  const required = env.NODE_ENV === 'production';
  if (env.REDIS_URL) {
    try {
      const { default: Redis } = await import('ioredis');
      const client = new Redis(env.REDIS_URL, { maxRetriesPerRequest: 1, lazyConnect: true, connectTimeout: 5_000 });
      await client.connect();
      await client.ping();
      return new RateLimiter(new RedisRateStore(client), log);
    } catch (error) {
      if (required) {
        throw new Error(`Refusing to start: Redis rate-limit store is unavailable (${(error as Error).message})`);
      }
      log.error({ err: error }, 'redis unavailable at boot �?" rate limits run in-process');
    }
  }
  if (required) throw new Error('Refusing to start: REDIS_URL is required in production');
  return new RateLimiter(new MemoryRateStore(), log);
}
