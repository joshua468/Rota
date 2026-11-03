import { z } from 'zod';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Config (Rule 03) — exactly three `EXPO_PUBLIC_*` names are allowed, they are
 * validated once with Zod, and anything else in the prefix is rejected so a
 * stray secret can never be bundled into the app.
 *
 * Values are read through static `process.env.EXPO_PUBLIC_*` member access so
 * Expo/Metro inlines them at build time (dynamic lookups are not inlined).
 */
const ALLOWED = ['EXPO_PUBLIC_API_URL', 'EXPO_PUBLIC_SENTRY_DSN', 'EXPO_PUBLIC_APP_SCHEME'] as const;

/**
 * Keys Expo/Metro inject into the bundle at dev time (e.g. the dev server sets
 * `EXPO_PUBLIC_PROJECT_ROOT` to the project path). They are not app config and
 * never carry a secret, so they must not trip the strict allowlist scan.
 */
const TOOLING_ONLY = ['EXPO_PUBLIC_PROJECT_ROOT'] as const;

const EnvSchema = z
  .object({
    EXPO_PUBLIC_API_URL: z.string().url(),
    EXPO_PUBLIC_SENTRY_DSN: z.union([z.literal(''), z.string().url()]).default(''),
    EXPO_PUBLIC_APP_SCHEME: z
      .string()
      .min(1)
      .regex(/^[a-z][a-z0-9+\-.]*$/, 'scheme must be lowercase and URL-safe'),
  })
  .strict();

export interface AppEnv {
  apiUrl: string;
  sentryDsn: string;
  appScheme: string;
}

let cached: AppEnv | null = null;

function unexpectedEnvKeys(): string[] {
  const env: Record<string, string | undefined> =
    typeof process !== 'undefined' && process.env ? process.env : {};
  return Object.keys(env).filter(
    (key) =>
      key.startsWith('EXPO_PUBLIC_') &&
      !(ALLOWED as readonly string[]).includes(key) &&
      !(TOOLING_ONLY as readonly string[]).includes(key),
  );
}

function resolveApiUrl(fallback: string | undefined): string | undefined {
  // Keep tests/simple Node contexts deterministic
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
    return fallback;
  }
  if (typeof Platform.OS !== 'undefined' && Platform.OS === 'web') {
    return fallback;
  }
  try {
    const hostUri = Constants.expoConfig?.hostUri ?? Constants.manifest2?.extra?.expoClient?.hostUri;
    if (hostUri) {
      const host = hostUri.split(':')[0];
      if (host && host !== 'localhost' && host !== '127.0.0.1') {
        return `http://${host}:4000`;
      }
      if (host === 'localhost' || host === '127.0.0.1') {
        // dev server on same machine; keep fallback or map android case below
        // but hostUri gives localhost in web dev; handle via Platform
      }
    }
  } catch {
    // ignore
  }
  if (typeof Platform.OS !== 'undefined' && Platform.OS === 'android') {
    return fallback?.replace('localhost', '10.0.2.2') ?? fallback;
  }
  return fallback;
}

export function getEnv(): AppEnv {
  if (cached) return cached;
  const foreign = unexpectedEnvKeys();
  if (foreign.length > 0) {
    throw new Error(
      `Refusing to start: unexpected EXPO_PUBLIC_* variable(s): ${foreign.join(', ')}. ` +
        'Only EXPO_PUBLIC_API_URL, EXPO_PUBLIC_SENTRY_DSN and EXPO_PUBLIC_APP_SCHEME are allowed (Rule 03).',
    );
  }
  const configured = process.env.EXPO_PUBLIC_API_URL;
  const isProduction = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';
  const resolvedApiUrl =
    resolveApiUrl(configured) ?? (isProduction ? undefined : 'http://localhost:4000');
  if (!resolvedApiUrl) {
    throw new Error(
      'Refusing to start: EXPO_PUBLIC_API_URL is required for production builds (no localhost fallback).',
    );
  }
  const parsed = EnvSchema.parse({
    EXPO_PUBLIC_API_URL: resolvedApiUrl,
    EXPO_PUBLIC_SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN || '',
    EXPO_PUBLIC_APP_SCHEME: process.env.EXPO_PUBLIC_APP_SCHEME || 'rota',
  });
  cached = {
    apiUrl: parsed.EXPO_PUBLIC_API_URL.replace(/\/+$/, ''),
    sentryDsn: parsed.EXPO_PUBLIC_SENTRY_DSN,
    appScheme: parsed.EXPO_PUBLIC_APP_SCHEME,
  };
  return cached;
}

/** Test seam: lets a suite assert the validation without leaking module state. */
export function resetEnv(): void {
  cached = null;
}
