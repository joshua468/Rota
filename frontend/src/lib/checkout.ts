/**
 * Hosted checkout hand-off differs by platform. On native the app can register
 * a custom scheme, so the provider sends the browser back with `rota://billing`.
 * A desktop browser cannot do that: navigating to a custom scheme leaves the
 * hosted page and never returns to the tab. There we keep the app open and open
 * checkout in a new tab instead, and the hosted page signals completion over a
 * BroadcastChannel (same origin) so the in-memory web session survives.
 */
export const CHECKOUT_CHANNEL = 'rota-checkout';
export const CHECKOUT_COMPLETE = 'rota-checkout-complete';

export interface CheckoutLaunch {
  /** Open a new tab and point it at the URL once the server returns it. */
  usePopup: boolean;
  /** Deep link passed to the provider; omitted on web. */
  callbackUrl: string | undefined;
}

export function checkoutLaunch(platform: string, deepLink: string): CheckoutLaunch {
  if (platform === 'web') return { usePopup: true, callbackUrl: undefined };
  return { usePopup: false, callbackUrl: deepLink };
}
