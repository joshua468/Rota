import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/api/client';
import { t } from '@/i18n';
import { errorMessage } from './errorCopy';

const secure = vi.hoisted(() => {
  const store = new Map<string, string>();
  return {
    store,
    getItem: vi.fn(async (key: string) => store.get(key) ?? null),
    setItem: vi.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    deleteItem: vi.fn(async (key: string) => {
      store.delete(key);
    }),
  };
});

vi.mock('expo-secure-store', () => ({
  getItemAsync: secure.getItem,
  setItemAsync: secure.setItem,
  deleteItemAsync: secure.deleteItem,
}));

beforeEach(() => {
  secure.store.clear();
});

describe('errorMessage', () => {
  it('shows the server reason for a conflict that came from the error envelope', () => {
    const error = new ApiError('CONFLICT', 409, 'That member already has a shift in this window.');
    expect(errorMessage(error)).toBe('That member already has a shift in this window.');
  });

  it('falls back to the generic conflict copy when there was no envelope', () => {
    const error = new ApiError('CONFLICT', 409, 'Request failed with 409', '', false);
    expect(errorMessage(error)).toBe(t('error.conflict'));
  });

  it('shows the server reason for a failed sign-in instead of session-expired copy', () => {
    const error = new ApiError('UNAUTHORIZED', 401, 'Email or password is incorrect.');
    expect(errorMessage(error)).toBe('Email or password is incorrect.');
  });

  it('falls back to session-expired copy for a 401 without an envelope', () => {
    const error = new ApiError('UNAUTHORIZED', 401, 'Request failed with 401', '', false);
    expect(errorMessage(error)).toBe(t('error.unauthorized'));
  });

  it('maps other error codes to their i18n copy', () => {
    expect(errorMessage(new ApiError('FORBIDDEN', 403, 'nope'))).toBe(t('error.forbidden'));
  });

  it('reports a network failure with the connection copy', () => {
    expect(errorMessage(new ApiError('NETWORK', 0, 'offline'))).toBe(t('error.network'));
  });

  it('falls back to generic copy for a non-ApiError', () => {
    expect(errorMessage(new Error('boom'))).toBe(t('error.generic'));
  });
});
