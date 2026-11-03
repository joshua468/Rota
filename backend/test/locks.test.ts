import { describe, expect, it } from 'vitest';
import { MemoryLock, createLock } from '../src/locks/locks';
import { createLogger } from '../src/lib/logger';

/**
 * Distributed lock (ADR-0008): one holder at a time, a token-guarded release
 * that can never free someone else's lock, and an in-memory driver when
 * `REDIS_URL` is empty.
 */
describe('MemoryLock', () => {
  it('grants exclusivity until released', async () => {
    const lock = new MemoryLock();
    const first = await lock.acquire('billing:renewals', 1_000);
    expect(first).not.toBeNull();

    const second = await lock.acquire('billing:renewals', 1_000);
    expect(second).toBeNull();

    await first!();
    const third = await lock.acquire('billing:renewals', 1_000);
    expect(third).not.toBeNull();
    await third!();
    await lock.close();
  });

  it('scopes locks per key', async () => {
    const lock = new MemoryLock();
    const a = await lock.acquire('a', 1_000);
    const b = await lock.acquire('b', 1_000);
    expect(a).not.toBeNull();
    expect(b).not.toBeNull();
    await a!();
    await b!();
    await lock.close();
  });

  it('lets the lock expire so a crashed holder cannot block forever', async () => {
    const lock = new MemoryLock();
    const held = await lock.acquire('k', 5);
    expect(held).not.toBeNull();
    await new Promise((resolve) => setTimeout(resolve, 15));
    const reacquired = await lock.acquire('k', 1_000);
    expect(reacquired).not.toBeNull();
    await reacquired!();
    await lock.close();
  });

  it('never releases a lock that was re-acquired after expiry', async () => {
    const lock = new MemoryLock();
    const stale = await lock.acquire('k', 5);
    await new Promise((resolve) => setTimeout(resolve, 15));
    const fresh = await lock.acquire('k', 1_000);
    expect(fresh).not.toBeNull();

    await stale!(); // must not delete the fresh holder's lock
    expect(await lock.acquire('k', 1_000)).toBeNull();

    await fresh!();
    await lock.close();
  });
});

describe('createLock', () => {
  it('uses the in-memory driver when REDIS_URL is empty', async () => {
    const lock = await createLock('', createLogger('silent'));
    expect(lock).toBeInstanceOf(MemoryLock);
    await lock.close();
  });
});
