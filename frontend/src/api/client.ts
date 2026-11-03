import { AuthTokens, ErrorEnvelope, type ErrorCode } from '@rota/contract';
import {
  getDeviceId,
  getRefreshToken,
  saveRefreshToken,
  useSessionStore,
} from '@/stores/session';
import { SEED } from '@/lib/demo';
import { getEnv } from './env';

export type ClientErrorCode = ErrorCode | 'NETWORK';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type QueryValue = string | number | boolean | undefined;

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  query?: Record<string, QueryValue>;
  /** attach the in-memory access token (refreshing first if there is none) */
  auth?: boolean;
  allowRefresh?: boolean;
  /** sent as `Idempotency-Key`; required by the server for money/creating POSTs */
  idempotencyKey?: string;
  /** abort the request after this many ms so a dead connection cannot hang the UI */
  timeoutMs?: number;
}

/** Default transport timeout: long enough for a cold API, short enough to fail visibly. */
export const DEFAULT_TIMEOUT_MS = 15_000;

function errorFromFetch(cause: unknown): ApiError {
  if (cause instanceof Error && cause.name === 'AbortError') {
    return new ApiError('NETWORK', 0, 'Request timed out');
  }
  return new ApiError('NETWORK', 0, cause instanceof Error ? cause.message : 'network error');
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * ApiError — every failure the UI can see is one of these: either a contract
 * `ErrorCode` from the server's error envelope, or `NETWORK` when the request
 * never got a response (Rule 06: the envelope is the only error shape).
 */
export class ApiError extends Error {
  readonly code: ClientErrorCode;
  readonly status: number;
  readonly reqId: string;
  /** true when the body was the server's error envelope, so `message` is user-facing */
  readonly fromEnvelope: boolean;

  constructor(
    code: ClientErrorCode,
    status: number,
    message: string,
    reqId = '',
    fromEnvelope = true,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.reqId = reqId;
    this.fromEnvelope = fromEnvelope;
  }
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const base = (getEnv().apiUrl || 'http://localhost:4000') + path;
  if (!query) return base;
  const parts = Object.entries(query)
    .filter((entry): entry is [string, string | number | boolean] => entry[1] !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  return parts.length > 0 ? `${base}?${parts.join('&')}` : base;
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

function errorFromResponse(response: Response, json: unknown): ApiError {
  const parsed = ErrorEnvelope.safeParse(json);
  if (parsed.success) {
    const { code, message, reqId } = parsed.data.error;
    return new ApiError(code, response.status, message, reqId, true);
  }
  const fallback: ErrorCode | 'NETWORK' =
    response.status === 401
      ? 'UNAUTHORIZED'
      : response.status === 403
        ? 'FORBIDDEN'
        : response.status === 404
          ? 'NOT_FOUND'
          : response.status === 409
            ? 'CONFLICT'
            : response.status === 429
              ? 'RATE_LIMITED'
              : 'INTERNAL';
  return new ApiError(fallback, response.status, `Request failed with ${response.status}`, '', false);
}

let refreshInFlight: Promise<string> | null = null;

/** Single-flight refresh: concurrent 401s (or cold starts) share one round trip. */
export function refreshAccessToken(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = performRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function performRefresh(): Promise<string> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    useSessionStore.getState().clear();
    throw new ApiError('UNAUTHORIZED', 401, 'No refresh token');
  }
  const deviceId = await getDeviceId();
  const url = buildUrl('/v1/auth/refresh');

  let response: Response;
  try {
    response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken, deviceId }),
      },
      DEFAULT_TIMEOUT_MS,
    );
  } catch (cause) {
    throw errorFromFetch(cause);
  }

  const json = await readJson(response);
  if (!response.ok) {
    useSessionStore.getState().clear();
    throw errorFromResponse(response, json);
  }

  const tokens = AuthTokens.parse(json);
  await saveRefreshToken(tokens.refreshToken);
  useSessionStore.getState().setAccessToken(tokens.accessToken);
  return tokens.accessToken;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = false, allowRefresh = true } = options;
  if (auth && !useSessionStore.getState().accessToken) {
    await refreshAccessToken();
  }
  return execute<T>(path, options, allowRefresh);
}

async function execute<T>(
  path: string,
  options: RequestOptions,
  allowRefresh: boolean,
): Promise<T> {
  const { method = 'GET', body, query, auth = false, idempotencyKey } = options;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = useSessionStore.getState().accessToken;
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;

  // Resolve config/URL errors before the try so only a genuine transport
  // failure is reported as NETWORK (Rule 03/06).
  const url = buildUrl(path, query);

  if (SEED && (path.includes('/me/settings') || path.includes('/settings'))) {
    if (method === 'GET') {
      return { values: { notif_shifts: true, notif_swaps: true, notif_billing: true, quiet_start: null, quiet_end: null, time_zone: null, language: 'en', theme: 'system' }, updatedAt: new Date().toISOString(), conflicts: [] } as T;
    }
    if (method === 'PATCH') {
      const b: any = body || {};
      const changes = b.changes || {};
      return { values: { notif_shifts: true, notif_swaps: true, notif_billing: true, quiet_start: null, quiet_end: null, time_zone: null, language: 'en', theme: 'system', ...changes }, updatedAt: new Date().toISOString(), conflicts: [] } as T;
    }
  }

  let response: Response;
  try {
    response = await fetchWithTimeout(
      url,
      {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      },
      timeoutMs,
    );
  } catch (cause) {
    if (SEED && path.includes('/me/settings')) {
      return { values: { notif_shifts: true, notif_swaps: true, notif_billing: true, quiet_start: null, quiet_end: null, time_zone: null, language: 'en', theme: 'system' }, updatedAt: new Date().toISOString(), conflicts: [] } as T;
    }
    throw errorFromFetch(cause);
  }

  if (response.status === 401 && auth) {
    if (allowRefresh) {
      await refreshAccessToken();
      return execute<T>(path, options, false);
    }
    useSessionStore.getState().clear();
    throw errorFromResponse(response, await readJson(response));
  }

  const json = await readJson(response);
  if (!response.ok) {
    throw errorFromResponse(response, json);
  }
  return json as T;
}
