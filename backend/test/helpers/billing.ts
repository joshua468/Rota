import { RequestBodies, SessionPayload, type PlanKey, type Role, type SubscriptionStatus } from '@rota/contract';
import type { AppDeps } from '../../src/app';
import type { DatabaseHandle, TeamScope } from '../../src/db/types';
import { newId } from '../../src/lib/ids';
import type { TestContext } from './app';

/**
 * Billing test fixtures. Teams and memberships are inserted with SQL because
 * the team routes are stubs; every user is created through the real signup
 * endpoint so tokens, settings and rate-limit state behave like production.
 */

export interface TestUser {
  id: string;
  email: string;
  /** `Bearer <accessToken>` ready for an authorization header */
  token: string;
}

const DAY_MS = 86_400_000;

export function depsOf(ctx: TestContext): AppDeps {
  return { env: ctx.env, topology: ctx.topology, queue: ctx.queue, cache: ctx.cache, rateLimiter: ctx.rateLimiter, lock: ctx.lock };
}

export function scopeOf(ctx: TestContext, teamId: string): TeamScope {
  return ctx.topology.scopeFor(teamId);
}

export function shardOf(ctx: TestContext, teamId: string): DatabaseHandle {
  return ctx.topology.shardDb(ctx.topology.scopeFor(teamId));
}

export async function signUp(ctx: TestContext, email: string): Promise<TestUser> {
  const res = await ctx.app.inject({
    method: 'POST',
    url: '/v1/auth/signup',
    payload: RequestBodies.signup.parse({ email, password: 'correct-horse-battery', name: email.split('@')[0] ?? 'User' }),
  });
  if (res.statusCode !== 200) throw new Error(`signup ${email} failed: ${res.statusCode} ${res.body}`);
  const session = SessionPayload.parse(res.json());
  return { id: session.user.id, email, token: `Bearer ${session.tokens.accessToken}` };
}

export async function createTeam(ctx: TestContext, name = 'Billing Tests'): Promise<string> {
  const id = newId();
  const db = ctx.topology.shardDb(ctx.topology.scopeFor(id));
  await db.query('INSERT INTO teams (id, name) VALUES ($1, $2)', [id, name]);
  return id;
}

export async function addMember(ctx: TestContext, teamId: string, userId: string, role: Role): Promise<void> {
  await shardOf(ctx, teamId).query('INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, $3)', [
    teamId,
    userId,
    role,
  ]);
}

export interface TeamFixture {
  teamId: string;
  owner: TestUser;
}

export async function createTeamWithOwner(ctx: TestContext, email = 'owner@rota.test'): Promise<TeamFixture> {
  const owner = await signUp(ctx, email);
  const teamId = await createTeam(ctx);
  await addMember(ctx, teamId, owner.id, 'owner');
  return { teamId, owner };
}

export interface SubscriptionSeed {
  planKey?: PlanKey;
  status?: SubscriptionStatus;
  seats?: number;
  extraSeats?: number;
  /** defaults to 10 days ago — 20 days remaining in a 30-day period */
  periodStart?: Date;
  /** defaults to 20 days from now */
  periodEnd?: Date;
  nextAmountCents?: number;
  graceUntil?: Date | null;
  pendingPlanKey?: PlanKey | null;
  pendingSeats?: number | null;
}

export async function seedSubscription(
  ctx: TestContext,
  teamId: string,
  seed: SubscriptionSeed = {},
): Promise<void> {
  const now = Date.now();
  const periodStart = seed.periodStart ?? new Date(now - 10 * DAY_MS);
  const periodEnd = seed.periodEnd ?? new Date(now + 20 * DAY_MS);
  await shardOf(ctx, teamId).query(
    `INSERT INTO subscriptions (
       team_id, plan_key, status, seats, extra_seats, period_start, period_end,
       next_amount_cents, grace_until, pending_plan_key, pending_seats
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     ON CONFLICT (team_id) DO UPDATE SET
       plan_key = EXCLUDED.plan_key, status = EXCLUDED.status, seats = EXCLUDED.seats,
       extra_seats = EXCLUDED.extra_seats, period_start = EXCLUDED.period_start,
       period_end = EXCLUDED.period_end, next_amount_cents = EXCLUDED.next_amount_cents,
       grace_until = EXCLUDED.grace_until, pending_plan_key = EXCLUDED.pending_plan_key,
       pending_seats = EXCLUDED.pending_seats, updated_at = now()`,
    [
      teamId,
      seed.planKey ?? 'starter',
      seed.status ?? 'active',
      seed.seats ?? 5,
      seed.extraSeats ?? 0,
      periodStart.toISOString(),
      periodEnd.toISOString(),
      seed.nextAmountCents ?? 0,
      seed.graceUntil ? seed.graceUntil.toISOString() : null,
      seed.pendingPlanKey ?? null,
      seed.pendingSeats ?? null,
    ],
  );
}

export interface IntentSeed {
  reference: string;
  amountCents: number;
  planKey: PlanKey;
  seats: number;
  currency?: string;
  createdBy?: string;
}

export async function seedIntent(ctx: TestContext, teamId: string, seed: IntentSeed): Promise<void> {
  await shardOf(ctx, teamId).query(
    `INSERT INTO payment_intents (team_id, reference, amount_cents, currency, plan_key, seats, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      teamId,
      seed.reference,
      seed.amountCents,
      seed.currency ?? 'USD',
      seed.planKey,
      seed.seats,
      seed.createdBy ?? null,
    ],
  );
}

export interface LedgerSeed {
  kind?: 'charge' | 'credit' | 'refund' | 'adjustment';
  amountCents: number;
  ref: string;
  reason?: string;
  createdAt?: Date;
}

export async function seedLedger(ctx: TestContext, teamId: string, seed: LedgerSeed): Promise<void> {
  await shardOf(ctx, teamId).query(
    `INSERT INTO ledger_entries (id, team_id, kind, amount_cents, currency, ref, reason, created_at)
     VALUES ($1, $2, $3, $4, 'USD', $5, $6, $7)`,
    [
      newId(),
      teamId,
      seed.kind ?? 'charge',
      seed.amountCents,
      seed.ref,
      seed.reason ?? 'seeded test entry',
      (seed.createdAt ?? new Date()).toISOString(),
    ],
  );
}

/** An open (unexpired, unaccepted) invite — counts against seat usage. */
export async function seedInvite(ctx: TestContext, teamId: string): Promise<void> {
  await shardOf(ctx, teamId).query(
    `INSERT INTO invites (id, team_id, email, role, token_hash, invited_by, expires_at)
     VALUES ($1, $2, $3, 'member', $4, $5, now() + interval '1 day')`,
    [newId(), teamId, `invitee-${newId()}@rota.test`, newId(), newId()],
  );
}

export interface CheckoutRequest {
  token?: string | undefined;
  teamId: string;
  body: { planKey: PlanKey; seats: number; callbackUrl?: string | undefined };
  key?: string | undefined;
}

export async function checkout(ctx: TestContext, req: CheckoutRequest) {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (req.token) headers.authorization = req.token;
  if (req.key !== undefined) headers['idempotency-key'] = req.key;
  return ctx.app.inject({
    method: 'POST',
    url: `/v1/teams/${req.teamId}/billing/checkout`,
    headers,
    payload: req.body,
  });
}

/** HTTP status shorthand for an error envelope assertion. */
export function errorCode(body: unknown): string {
  const envelope = body as { error?: { code?: string } };
  return envelope.error?.code ?? 'NOT_AN_ERROR_ENVELOPE';
}
