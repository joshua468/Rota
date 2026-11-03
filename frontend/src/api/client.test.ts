import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, apiRequest, DEFAULT_TIMEOUT_MS } from './client';
import { useSessionStore } from '@/stores/session';

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

vi.mock('@/lib/randomUUID', () => ({
  randomUUID: vi.fn(() => 'device-1'),
}));

type Route = (url: string, init?: RequestInit) => Response | Promise<Response>;

const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
  const handler = currentRoute;
  if (!handler) throw new Error('no route configured');
  return handler(String(input), init);
});

let currentRoute: Route | null = null;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function envelope(code: string, status: number, reqId = 'req-1'): Response {
  return jsonResponse({ error: { code, message: 'boom', reqId } }, status);
}

function headersOf(init?: RequestInit): Record<string, string> {
  return (init?.headers ?? {}) as Record<string, string>;
}

beforeEach(() => {
  currentRoute = null;
  fetchMock.mockClear();
  secure.store.clear();
  secure.getItem.mockClear();
  secure.setItem.mockClear();
  secure.deleteItem.mockClear();
  useSessionStore.setState({ status: 'signedOut', user: null, team: null, accessToken: null });
  vi.stubGlobal('fetch', fetchMock);
});

describe('apiRequest', () => {
  it('parses a successful JSON response and builds the URL from env', async () => {
    currentRoute = () => jsonResponse({ ok: true });

    const result = await apiRequest<{ ok: boolean }>('/v1/me');

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe('http://localhost:4000/v1/me');
  });

  it('serialises query parameters', async () => {
    currentRoute = () => jsonResponse({ items: [] });

    await apiRequest('/v1/teams/t1/shifts', {
      query: { from: '2026-01-01T00:00:00.000Z', mine: '1', skip: undefined },
    });

    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
      'http://localhost:4000/v1/teams/t1/shifts?from=2026-01-01T00%3A00%3A00.000Z&mine=1',
    );
  });

  it('turns an error envelope into an ApiError with code, status and reqId', async () => {
    currentRoute = () => envelope('VALIDATION_FAILED', 400);

    const error = await apiRequest('/v1/auth/login', { method: 'POST', body: {} }).catch(
      (caught: unknown) => caught,
    );

    expect(error).toBeInstanceOf(ApiError);
    const apiError = error as ApiError;
    expect(apiError.code).toBe('VALIDATION_FAILED');
    expect(apiError.status).toBe(400);
    expect(apiError.reqId).toBe('req-1');
    expect(apiError.message).toBe('boom');
  });

  it('maps a failed fetch to NETWORK without touching the session', async () => {
    currentRoute = () => Promise.reject(new Error('offline'));
    useSessionStore.setState({ status: 'signedIn' });

    const error = await apiRequest('/v1/plans', { auth: false }).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).code).toBe('NETWORK');
    expect((error as ApiError).status).toBe(0);
    expect(useSessionStore.getState().status).toBe('signedIn');
  });

  it('aborts a hanging request and reports NETWORK so the UI cannot spin forever', async () => {
    vi.useFakeTimers();
    try {
      currentRoute = (_url, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(Object.assign(new Error('Aborted'), { name: 'AbortError' })),
          );
        });

      const pending = apiRequest('/v1/auth/login', { method: 'POST', body: {} }).catch(
        (caught: unknown) => caught,
      );
      await vi.advanceTimersByTimeAsync(DEFAULT_TIMEOUT_MS);

      const error = await pending;
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).code).toBe('NETWORK');
      expect((error as ApiError).message).toBe('Request timed out');
    } finally {
      vi.useRealTimers();
    }
  });

  it('refreshes once on a cold start for concurrent authenticated requests', async () => {
    secure.store.set('rota.refreshToken', 'refresh-token-1');
    const seen: string[] = [];
    currentRoute = (url, init) => {
      seen.push(url);
      if (url.endsWith('/v1/auth/refresh')) {
        const body = JSON.parse(String(init?.body)) as { refreshToken: string; deviceId: string };
        expect(body.refreshToken).toBe('refresh-token-1');
        expect(body.deviceId).toBe('device-1');
        return jsonResponse({
          accessToken: 'access-token-new',
          refreshToken: 'refresh-token-2',
          expiresIn: 900,
        });
      }
      return jsonResponse({ ok: true });
    };

    const [first, second] = await Promise.all([
      apiRequest('/v1/me', { auth: true }),
      apiRequest('/v1/me/settings', { auth: true }),
    ]);

    expect(first).toEqual({ ok: true });
    expect(second).toEqual({ ok: true });
    expect(seen.filter((url) => url.endsWith('/v1/auth/refresh'))).toHaveLength(1);
    expect(useSessionStore.getState().accessToken).toBe('access-token-new');
    expect(secure.store.get('rota.refreshToken')).toBe('refresh-token-2');

    const meCall = fetchMock.mock.calls.find(([url]) => String(url).endsWith('/v1/me'));
    expect(headersOf(meCall?.[1]).Authorization).toBe('Bearer access-token-new');
  });

  it('refreshes a single time when a stale access token gets a 401', async () => {
    secure.store.set('rota.refreshToken', 'refresh-token-1');
    useSessionStore.setState({ accessToken: 'stale', status: 'signedIn' });
    let meAttempts = 0;
    currentRoute = (url) => {
      if (url.endsWith('/v1/auth/refresh')) {
        return jsonResponse({
          accessToken: 'access-token-new',
          refreshToken: 'refresh-token-2',
          expiresIn: 900,
        });
      }
      meAttempts += 1;
      if (meAttempts === 1) return envelope('UNAUTHORIZED', 401);
      return jsonResponse({ ok: true });
    };

    const result = await apiRequest<{ ok: boolean }>('/v1/me', { auth: true });

    expect(result).toEqual({ ok: true });
    expect(meAttempts).toBe(2);
    expect(
      fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/v1/auth/refresh')),
    ).toHaveLength(1);
    expect(useSessionStore.getState().accessToken).toBe('access-token-new');
  });

  it('signs the user out when the server rejects the refresh token', async () => {
    secure.store.set('rota.refreshToken', 'refresh-token-dead');
    useSessionStore.setState({ status: 'signedIn' });
    currentRoute = (url) =>
      url.endsWith('/v1/auth/refresh') ? envelope('UNAUTHORIZED', 401) : jsonResponse({});

    const error = await apiRequest('/v1/me', { auth: true }).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).code).toBe('UNAUTHORIZED');
    expect(useSessionStore.getState().status).toBe('signedOut');
    expect(secure.store.has('rota.refreshToken')).toBe(false);
  });

  it('sends the Idempotency-Key header when one is provided', async () => {
    currentRoute = () => jsonResponse({ id: 'shift-1' });

    await apiRequest('/v1/teams/t1/shifts', {
      method: 'POST',
      body: { userId: 'u1' },
      idempotencyKey: 'key-123',
    });

    const headers = headersOf(fetchMock.mock.calls[0]?.[1]);
    expect(headers['Idempotency-Key']).toBe('key-123');
    expect(headers['Content-Type']).toBe('application/json');
    expect(String(fetchMock.mock.calls[0]?.[1]?.body)).toBe('{"userId":"u1"}');
  });

  it('omits the Authorization header for unauthenticated requests', async () => {
    useSessionStore.setState({ accessToken: 'access-1', status: 'signedIn' });
    currentRoute = () => jsonResponse({ ok: true });

    await apiRequest('/v1/plans', { auth: false });

    const headers = headersOf(fetchMock.mock.calls[0]?.[1]);
    expect(headers.Authorization).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
