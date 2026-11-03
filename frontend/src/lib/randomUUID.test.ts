import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRandomUUID, randomUUID } from './randomUUID';

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('randomUUID', () => {
  it('uses the native module when it is available', () => {
    expect(createRandomUUID(() => ({ randomUUID: () => 'device-1' }))).toBe('device-1');
  });

  it('falls back when the native ExpoCrypto module cannot be loaded', () => {
    vi.stubGlobal('crypto', undefined);

    const id = createRandomUUID(() => {
      throw new Error("Cannot find native module 'ExpoCrypto'");
    });

    expect(id).toMatch(UUID_V4);
  });

  it('does not repeat fallback ids', () => {
    vi.stubGlobal('crypto', undefined);

    const ids = new Set(
      Array.from({ length: 100 }, () =>
        createRandomUUID(() => {
          throw new Error("Cannot find native module 'ExpoCrypto'");
        }),
      ),
    );

    expect(ids.size).toBe(100);
  });

  it('exposes a production entry point', () => {
    expect(randomUUID()).toMatch(UUID_V4);
  });
});
