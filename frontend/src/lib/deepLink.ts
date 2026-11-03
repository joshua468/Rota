import { getEnv } from '@/api/env';

/**
 * Translates an outbox deep link into an in-app route (push-notifications
 * skill). Kept free of `expo-linking`/`expo-router` imports so it is a pure,
 * testable function and a stray payload can never crash the app.
 *
 * Recognised links: `rota://shift/<id>`, `rota://swap/<id>`,
 * `rota://invite/<token>`, `rota://billing`, `rota://activity`.
 */
export function hrefForNotification(url: unknown): string | null {
  if (typeof url !== 'string' || url.length === 0) return null;

  let scheme: string;
  try {
    scheme = getEnv().appScheme;
  } catch {
    return null;
  }

  const match = /^([a-z][a-z0-9+\-.]*):\/\/(.*)$/i.exec(url);
  if (!match || (match[1] ?? '').toLowerCase() !== scheme.toLowerCase()) return null;

  const rest = (match[2] ?? '').replace(/[?#].*$/, '');
  const slash = rest.indexOf('/');
  const host = (slash === -1 ? rest : rest.slice(0, slash)).toLowerCase();
  const path = slash === -1 ? '' : rest.slice(slash + 1);

  if (host === 'shift' && path) return `/shift/${path}`;
  if (host === 'swap' && path) return `/swap/${path}`;
  if (host === 'invite' && path) return `/(auth)/invite/${path}`;
  if (host === 'billing') return '/settings/billing';
  if (host === 'activity') return '/activity';
  return null;
}

/**
 * Builds the app's own deep link for a known host, e.g. `rota://billing`. Used as
 * the checkout `callbackUrl` so paying hands the browser back to the app.
 */
export function appDeepLink(host: string): string {
  return `${getEnv().appScheme}://${host}`;
}
