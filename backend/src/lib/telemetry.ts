import type { Logger } from 'pino';
import type { Env } from '../env';

/**
 * Minimal Sentry-compatible error reporter. It speaks the public store API
 * directly so the API has no extra runtime dependency, and it is a no-op when
 * `SENTRY_DSN` is unset (local tests, preview environments).
 */
export interface ErrorReporter {
  capture(error: unknown, context?: Record<string, unknown>): void;
}

interface SentryTarget {
  storeUrl: string;
  auth: string;
}

function parseDsn(dsn: string): SentryTarget | null {
  try {
    const url = new URL(dsn);
    const projectId = url.pathname.replace(/^\/+/, '');
    if (!url.username || !projectId) return null;
    return {
      storeUrl: `${url.protocol}//${url.host}/api/${projectId}/store/`,
      auth: `Sentry sentry_version=7, sentry_key=${url.username}, sentry_client=rota-api/0.1.0`,
    };
  } catch {
    return null;
  }
}

function describe(error: unknown): { type: string; value: string } {
  if (error instanceof Error) return { type: error.name, value: error.message };
  if (typeof error === 'string') return { type: 'Error', value: error };
  try {
    return { type: 'Error', value: JSON.stringify(error) };
  } catch {
    return { type: 'Error', value: 'Unknown error' };
  }
}

export function createErrorReporter(env: Env, log: Logger): ErrorReporter {
  const target = env.SENTRY_DSN ? parseDsn(env.SENTRY_DSN) : null;
  if (!target) return { capture: () => undefined };

  return {
    capture(error, context = {}) {
      const { type, value } = describe(error);
      const stack = error instanceof Error ? error.stack : undefined;
      const event = {
        event_id: crypto.randomUUID().replace(/-/g, ''),
        timestamp: new Date().toISOString(),
        platform: 'node',
        level: 'error',
        environment: env.NODE_ENV,
        exception: { values: [{ type, value, stacktrace: stack ? { frames: [{ filename: 'rota-api' }] } : undefined }] },
        extra: context,
      };
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2_000);
      void fetch(target.storeUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-sentry-auth': target.auth,
        },
        body: JSON.stringify(event),
        signal: controller.signal,
      })
        .catch((err: unknown) => log.debug({ err }, 'sentry capture failed'))
        .finally(() => clearTimeout(timer));
    },
  };
}
