import { describe, expect, it } from 'vitest';
import { appDeepLink, hrefForNotification } from './deepLink';

/**
 * Deep-link mapping (push-notifications skill): the outbox `data.url` is the
 * only thing a tap carries, so it must be translated to an in-app route and
 * anything unexpected must be ignored rather than navigating blindly.
 */
describe('hrefForNotification', () => {
  it('routes shift, swap, billing, invite and activity links', () => {
    expect(hrefForNotification('rota://shift/abc-123')).toBe('/shift/abc-123');
    expect(hrefForNotification('rota://swap/s1')).toBe('/swap/s1');
    expect(hrefForNotification('rota://billing')).toBe('/settings/billing');
    expect(hrefForNotification('rota://invite/tok.en')).toBe('/(auth)/invite/tok.en');
    expect(hrefForNotification('rota://activity')).toBe('/activity');
  });

  it('ignores query/fragment params, as Flutterwave appends them on return', () => {
    expect(hrefForNotification('rota://billing?status=successful&tx_ref=co_1&transaction_id=9')).toBe(
      '/settings/billing',
    );
    expect(hrefForNotification('rota://activity#top')).toBe('/activity');
    expect(hrefForNotification('rota://shift/abc-123?from=push')).toBe('/shift/abc-123');
  });

  it('ignores non-app schemes, unknown hosts and non-strings', () => {
    expect(hrefForNotification('https://evil.example/shift/1')).toBeNull();
    expect(hrefForNotification('rota://unknown/1')).toBeNull();
    expect(hrefForNotification('rota://shift')).toBeNull();
    expect(hrefForNotification(undefined)).toBeNull();
    expect(hrefForNotification(42)).toBeNull();
    expect(hrefForNotification('')).toBeNull();
  });
});

describe('appDeepLink', () => {
  it('builds the app scheme deep link used as the checkout callback', () => {
    expect(appDeepLink('billing')).toBe('rota://billing');
    expect(hrefForNotification(appDeepLink('billing'))).toBe('/settings/billing');
  });
});
