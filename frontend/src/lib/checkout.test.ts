import { describe, expect, it } from 'vitest';
import { checkoutLaunch } from './checkout';

describe('checkoutLaunch', () => {
  it('keeps the web app open and omits a custom-scheme callback', () => {
    // A desktop browser cannot follow `rota://billing`, so the app must not send
    // it as the return target; the popup signals completion instead.
    expect(checkoutLaunch('web', 'rota://billing')).toEqual({
      usePopup: true,
      callbackUrl: undefined,
    });
  });

  it('uses the app deep link on native', () => {
    expect(checkoutLaunch('ios', 'rota://billing')).toEqual({
      usePopup: false,
      callbackUrl: 'rota://billing',
    });
    expect(checkoutLaunch('android', 'rota://billing')).toEqual({
      usePopup: false,
      callbackUrl: 'rota://billing',
    });
  });
});
