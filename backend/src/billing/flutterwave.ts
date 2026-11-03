import type { Env } from '../env';
import { paymentFailed } from '../lib/errors';

/**
 * Payment provider boundary (ADR-0007): the app talks to Flutterwave through
 * this interface only, and only for hosted-checkout authorisation and (rarely)
 * amount verification. Payment *truth* always comes from the signature-verified
 * webhook processed in a job — never from these calls.
 *
 * `createPaymentProvider` is the single place that branches on
 * `FLUTTERWAVE_SECRET_KEY`: a configured key selects the real Flutterwave
 * driver (test or live mode is a property of the key), an empty key selects the
 * deterministic fake so local dev and hermetic tests exercise the same code
 * path without network.
 *
 * Flutterwave speaks decimal *major* units (e.g. 20.00 USD); every value we
 * store is an integer number of *minor* units (cents, Rule 02), so the boundary
 * converts explicitly in both directions.
 */
export interface AuthorizeInput {
  reference: string;
  amountCents: number;
  email: string;
  callbackUrl?: string;
}

export interface AuthorizeResult {
  authorizationUrl: string;
}

export interface VerifyResult {
  ok: boolean;
  amountCents?: number;
  currency?: string;
}

export interface PaymentProvider {
  readonly name: 'flutterwave' | 'fake';
  authorize(input: AuthorizeInput): Promise<AuthorizeResult>;
  /** Used only when a webhook payload carries no amount to cross-check. */
  verify(reference: string): Promise<VerifyResult>;
}

const FLUTTERWAVE_API = 'https://api.flutterwave.com/v3';
const FLUTTERWAVE_CURRENCY = 'USD';

/** integer minor units → Flutterwave decimal major units */
export function toMajorUnits(amountCents: number): number {
  return amountCents / 100;
}

/** Flutterwave decimal major units → integer minor units (never truncate) */
export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

export class FlutterwaveProvider implements PaymentProvider {
  readonly name = 'flutterwave' as const;

  constructor(
    private readonly secretKey: string,
    private readonly baseUrl = FLUTTERWAVE_API,
  ) {}

  async authorize(input: AuthorizeInput): Promise<AuthorizeResult> {
    const res = await fetch(`${this.baseUrl}/payments`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${this.secretKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref: input.reference,
        amount: toMajorUnits(input.amountCents),
        currency: FLUTTERWAVE_CURRENCY,
        redirect_url: input.callbackUrl,
        customer: { email: input.email },
      }),
    });
    const json = (await res.json().catch(() => null)) as
      | { message?: string; status?: string; data?: { link?: string } }
      | null;
    const url = json?.data?.link;
    if (!res.ok || json?.status === 'error' || !url) {
      throw paymentFailed(`The payment provider did not start checkout (${json?.message ?? res.status}).`);
    }
    return { authorizationUrl: url };
  }

  async verify(reference: string): Promise<VerifyResult> {
    const res = await fetch(
      `${this.baseUrl}/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`,
      { headers: { authorization: `Bearer ${this.secretKey}` } },
    );
    const json = (await res.json().catch(() => null)) as
      | { data?: { status?: string; amount?: number; currency?: string } }
      | null;
    if (!res.ok || !json?.data) return { ok: false };
    return {
      ok: json.data.status === 'successful',
      amountCents: typeof json.data.amount === 'number' ? toMinorUnits(json.data.amount) : undefined,
      currency: json.data.currency,
    };
  }
}

/** Deterministic local driver: no network, stable URL the tests can parse. */
export class FakeFlutterwaveProvider implements PaymentProvider {
  readonly name = 'fake' as const;

  constructor(private readonly baseUrl: string) {}

  async authorize(input: AuthorizeInput): Promise<AuthorizeResult> {
    const params = new URLSearchParams({
      tx_ref: input.reference,
      amount: String(input.amountCents),
    });
    if (input.callbackUrl) params.set('callback', input.callbackUrl);
    return { authorizationUrl: `${this.baseUrl}/flutterwave/authorize?${params.toString()}` };
  }

  async verify(_reference: string): Promise<VerifyResult> {
    // The fake cannot confirm anything on its own; a webhook without an amount
    // is therefore rejected rather than trusted.
    return { ok: false };
  }
}

export function createPaymentProvider(env: Env): PaymentProvider {
  if (env.FLUTTERWAVE_SECRET_KEY) return new FlutterwaveProvider(env.FLUTTERWAVE_SECRET_KEY);
  if (env.NODE_ENV === 'production') {
    // Defence in depth: env.ts already requires the key at boot, but a fake
    // provider in production could record successful charges that never happened.
    throw new Error('Refusing to use the fake payment provider in production');
  }
  return new FakeFlutterwaveProvider(env.PUBLIC_BASE_URL);
}
