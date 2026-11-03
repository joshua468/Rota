/**
 * @rota/contract â€” the single source of truth for what the client and server exchange.
 *
 * Rules this file encodes:
 *  - Rule 01: role, team, plan, seat count, payment status are NEVER in a request body.
 *    Nothing in `RequestBodies` carries them either; they are derived server-side.
 *  - Rule 02: every money value is an integer number of cents (`*_cents`).
 *  - Rule 06: every response is either a payload below or the error envelope.
 */
import { z } from 'zod';

/* ------------------------------------------------------------------ */
/* primitives                                                          */
/* ------------------------------------------------------------------ */

export const Id = z.string().uuid();
export type Id = z.infer<typeof Id>;

/** opaque keyset cursor: base64url(JSON {t: iso, i: id}) */
export const Cursor = z.string().min(1).max(512);
export const CursorPayload = z.object({
  t: z.string().datetime(),
  i: Id,
});

export const Role = z.enum(['owner', 'admin', 'manager', 'member']);
export type Role = z.infer<typeof Role>;

export const PlanKey = z.enum(['starter', 'team', 'business']);
export type PlanKey = z.infer<typeof PlanKey>;

export const SubscriptionStatus = z.enum([
  'trialing',
  'active',
  'past_due',
  'restricted',
  'canceled',
]);
export type SubscriptionStatus = z.infer<typeof SubscriptionStatus>;

export const SwapStatus = z.enum(['pending', 'approved', 'rejected', 'canceled']);
export type SwapStatus = z.infer<typeof SwapStatus>;

/**
 * How the assignee has answered an assignment. A shift an admin just assigned
 * starts `pending`; `declined` is only ever stored on a shift that is still
 * assigned (declining clears the assignee outright).
 */
export const AssignmentStatus = z.enum(['pending', 'accepted', 'declined']);
export type AssignmentStatus = z.infer<typeof AssignmentStatus>;

export const IsoDateTime = z.string().datetime({ offset: true });

/* ------------------------------------------------------------------ */
/* error envelope (Rule 06)                                            */
/* ------------------------------------------------------------------ */

export const ErrorCode = z.enum([
  'VALIDATION_FAILED',
  'UNAUTHORIZED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'RATE_LIMITED',
  'PAYMENT_FAILED',
  'SEAT_LIMIT',
  'PLAN_UPGRADE_REQUIRED',
  'IDEMPOTENCY_MISMATCH',
  'IDEMPOTENCY_IN_PROGRESS',
  'SUBSCRIPTION_RESTRICTED',
  'PAYLOAD_TOO_LARGE',
  'INTERNAL',
]);

export type ErrorCode = z.infer<typeof ErrorCode>;

export const ErrorEnvelope = z.object({
  error: z.object({
    code: ErrorCode,
    message: z.string(),
    reqId: z.string(),
  }),
});
export type ErrorEnvelope = z.infer<typeof ErrorEnvelope>;

/* ------------------------------------------------------------------ */
/* auth                                                                */
/* ------------------------------------------------------------------ */

export const Email = z.string().email().max(320);
export const Password = z.string().min(10).max(200);

/**
 * Profile photos are the user's own image â€” the app never serves a stock
 * picture of somebody else. Only raster formats the platform can decode are
 * accepted; SVG is refused because it can carry script.
 */
export const AvatarContentType = z.enum(['image/jpeg', 'image/png', 'image/webp']);
export type AvatarContentType = z.infer<typeof AvatarContentType>;

/** Decoded avatar ceiling (2 MB). The base64 ceiling follows from it. */
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
export const AVATAR_MAX_BASE64 = Math.ceil((AVATAR_MAX_BYTES * 4) / 3) + 4;

export const RequestBodies = {
  signup: z
    .object({
      email: Email,
      password: Password,
      name: z.string().min(1).max(80),
      /** pending invite token from a deep link; consumed after account creation */
      inviteToken: z.string().min(1).max(200).optional(),
    })
    .strict(),
  login: z
    .object({
      email: Email,
      password: Password,
      deviceId: z.string().min(1).max(120),
    })
    .strict(),
  magicStart: z.object({ email: Email }).strict(),
  magicConsume: z.object({ token: z.string().min(10).max(200), deviceId: z.string().min(1).max(120) }).strict(),
  refresh: z.object({ refreshToken: z.string().min(10).max(512), deviceId: z.string().min(1).max(120) }).strict(),
  logout: z.object({ refreshToken: z.string().min(10).max(512) }).strict(),
  forgot: z.object({ email: Email }).strict(),
  reset: z.object({ token: z.string().min(10).max(200), password: Password }).strict(),
  acceptInvite: z.object({ token: z.string().min(10).max(200) }).strict(),
  createTeam: z.object({ name: z.string().min(1).max(80) }).strict(),
  createInvite: z
    .object({ email: Email, role: Role.exclude(['owner']) })
    .strict(),
  createShift: z
    .object({
      userId: Id,
      startsAt: IsoDateTime,
      endsAt: IsoDateTime,
      role: z.string().min(1).max(60).optional(),
      location: z.string().min(1).max(60).optional(),
      meetingUrl: z.string().url().max(500).optional(),
      notes: z.string().max(280).optional(),
    })
    .strict(),
  updateShift: z
    .object({
      /** reassign to another active member (omitted = keep the current assignee) */
      userId: Id.optional(),
      startsAt: IsoDateTime.optional(),
      endsAt: IsoDateTime.optional(),
      role: z.string().min(1).max(60).nullish(),
      location: z.string().min(1).max(60).nullish(),
      meetingUrl: z.string().url().max(500).nullish(),
      notes: z.string().max(280).nullish(),
    })
    .strict(),
  createSwapRequest: z
    .object({
      /** open request = no target; targeted request names the colleague */
      toUserId: Id.optional(),
      note: z.string().max(280).optional(),
    })
    .strict(),
  decideSwap: z.object({ decision: z.enum(['approve', 'reject']) }).strict(),
  /** the assignee answers an assignment: `decline` releases the shift */
  respondToShift: z.object({ action: z.enum(['accept', 'decline']) }).strict(),
  checkout: z
    .object({
      planKey: PlanKey,
      seats: z.number().int().min(1).max(500),
      callbackUrl: z.string().url().max(500).optional(),
    })
    .strict(),
  patchSettings: z
    .object({
      changes: z
        .object({
          quiet_start: z.string().regex(/^\d{2}:\d{2}$/).optional(),
          quiet_end: z.string().regex(/^\d{2}:\d{2}$/).optional(),
          time_zone: z.string().min(1).max(64).optional(),
          notif_shifts: z.boolean().optional(),
          notif_swaps: z.boolean().optional(),
          notif_billing: z.boolean().optional(),
          language: z.enum(['en']).optional(),
          theme: z.enum(['system', 'light', 'dark', 'sage']).optional(),
        })
        .strict(),
      /** per-field server updatedAt the client last saw (settings-sync) */
      baseUpdatedAt: z.record(z.string(), z.string().datetime()).optional(),
    })
    .strict(),
  putPushToken: z
    .object({ pushToken: z.string().min(10).max(400) })
    .strict(),
  /** the user's own profile photo, base64-encoded (no data: prefix) */
  putAvatar: z
    .object({
      dataBase64: z.string().min(1).max(AVATAR_MAX_BASE64),
      contentType: AvatarContentType,
    })
    .strict(),
} as const;

export type SignupBody = z.infer<typeof RequestBodies.signup>;
export type LoginBody = z.infer<typeof RequestBodies.login>;

/* ------------------------------------------------------------------ */
/* query params                                                        */
/* ------------------------------------------------------------------ */

export const QueryParams = {
  feed: z
    .object({
      cursor: Cursor.optional(),
      limit: z.coerce.number().int().min(1).max(50).optional(),
    })
    .strict(),
  shifts: z
    .object({
      mine: z.enum(['0', '1']).optional(),
      from: z.string().datetime({ offset: true }),
      to: z.string().datetime({ offset: true }),
    })
    .strict(),
  swaps: z
    .object({
      status: SwapStatus.optional(),
      cursor: Cursor.optional(),
      limit: z.coerce.number().int().min(1).max(50).optional(),
    })
    .strict(),
  ledger: z
    .object({
      cursor: Cursor.optional(),
      limit: z.coerce.number().int().min(1).max(50).optional(),
    })
    .strict(),
  /** `?v=` is the upload version of the photo (cache busting) */
  avatar: z.object({ v: z.string().max(64).optional() }).strict(),
} as const;

/* ------------------------------------------------------------------ */
/* path params (Rule 06: every param is parsed with Zod .strict())     */
/* ------------------------------------------------------------------ */

export const PathParams = {
  deviceId: z.object({ deviceId: z.string().min(1).max(120) }).strict(),
  userId: z.object({ userId: z.string().uuid() }).strict(),
} as const;

/* ------------------------------------------------------------------ */
/* payloads                                                            */
/* ------------------------------------------------------------------ */

export const PublicUser = z.object({
  id: Id,
  name: z.string(),
  /** masked for privacy: jâ€¢â€¢â€¢@example.com */
  emailMasked: z.string(),
  role: Role,
  active: z.boolean(),
  /** the user's own uploaded photo (API path), null when they have none */
  avatarUrl: z.string().nullable(),
});
export type PublicUser = z.infer<typeof PublicUser>;

export const SelfUser = z.object({
  id: Id,
  name: z.string(),
  email: Email,
  tokenVersion: z.number().int(),
  timezone: z.string(),
  /** the signed-in user's own uploaded photo (API path), null when they have none */
  avatarUrl: z.string().nullable(),
});
export type SelfUser = z.infer<typeof SelfUser>;

export const AuthTokens = z.object({
  accessToken: z.string().min(10),
  refreshToken: z.string().min(10),
  /** access token lifetime, seconds â€” the client refreshes before it expires */
  expiresIn: z.number().int().positive(),
});
export type AuthTokens = z.infer<typeof AuthTokens>;

export const SessionPayload = z.object({
  user: SelfUser,
  tokens: AuthTokens,
  team: z
    .object({ id: Id, name: z.string(), role: Role })
    .nullable(),
});
export type SessionPayload = z.infer<typeof SessionPayload>;

export const Plan = z.object({
  key: PlanKey,
  name: z.string(),
  priceCents: z.number().int().nonnegative(),
  currency: z.literal('USD'),
  includedSeats: z.number().int().positive(),
  extraSeatCents: z.number().int().nonnegative().nullable(),
  maxSeats: z.number().int().positive(),
});
export type Plan = z.infer<typeof Plan>;

export const Subscription = z.object({
  teamId: Id,
  planKey: PlanKey,
  status: SubscriptionStatus,
  seats: z.number().int().positive(),
  extraSeats: z.number().int().nonnegative(),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  /** what the next renewal will cost, integer cents, from the plans table */
  nextAmountCents: z.number().int().nonnegative(),
  graceUntil: z.string().datetime().nullable(),
  pendingPlanKey: PlanKey.nullable(),
  pendingSeats: z.number().int().positive().nullable(),
});
export type Subscription = z.infer<typeof Subscription>;

export const Shift = z.object({
  id: Id,
  teamId: Id,
  /** null when the shift is open / unassigned. */
  userId: Id.nullable(),
  user: PublicUser.pick({ id: true, name: true, avatarUrl: true }).nullable(),
  /** the assignee's answer ï¿½?" absent only on payloads built before the column existed */
  assignmentStatus: AssignmentStatus.optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  role: z.string().nullable(),
  location: z.string().nullable(),
  meetingUrl: z.string().nullable().optional(),
  notes: z.string().nullable(),
  version: z.number().int().positive(),
});
export type Shift = z.infer<typeof Shift>;

export const ActivityItem = z.object({
  id: Id,
  type: z.string(),
  actor: PublicUser.pick({ id: true, name: true, avatarUrl: true }).nullable(),
  summary: z.string(),
  data: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.string().datetime(),
});
export type ActivityItem = z.infer<typeof ActivityItem>;

export const SwapRequest = z.object({
  id: Id,
  shift: Shift,
  fromUser: PublicUser,
  toUser: PublicUser.nullable(),
  status: SwapStatus,
  note: z.string().nullable(),
  createdAt: z.string().datetime(),
  decidedAt: z.string().datetime().nullable(),
});
export type SwapRequest = z.infer<typeof SwapRequest>;

export const LedgerEntry = z.object({
  id: Id,
  kind: z.enum(['charge', 'credit', 'refund', 'adjustment']),
  amountCents: z.number().int(),
  currency: z.literal('USD'),
  ref: z.string(),
  reason: z.string(),
  createdAt: z.string().datetime(),
});
export type LedgerEntry = z.infer<typeof LedgerEntry>;

export const Settings = z.object({
  quiet_start: z.string(),
  quiet_end: z.string(),
  time_zone: z.string(),
  notif_shifts: z.boolean(),
  notif_swaps: z.boolean(),
  notif_billing: z.boolean(),
  language: z.enum(['en']),
  theme: z.enum(['system', 'light', 'dark', 'sage']),
});
export type Settings = z.infer<typeof Settings>;

export const SettingsEnvelope = z.object({
  values: Settings,
  /** per-field server updatedAt, ISO; the client sends its base for conflict detection */
  updatedAt: z.record(z.string(), z.string().datetime()),
  conflicts: z.array(Settings.keyof()).optional(),
});
export type SettingsEnvelope = z.infer<typeof SettingsEnvelope>;

export const PagedResponse = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    nextCursor: z.string().nullable(),
  });

/* ------------------------------------------------------------------ */
/* swap assist (P2, Rule 09)                                           */
/* ------------------------------------------------------------------ */

export const SwapSuggestion = z.object({
  userId: Id,
  name: z.string(),
  score: z.number(),
  eligible: z.boolean(),
  reasons: z.array(z.string()).max(10),
  blockers: z.array(z.string()).max(10),
  /** optional LLM wording; deterministic reasons stay authoritative */
  sentence: z.string().nullable(),
});
export type SwapSuggestion = z.infer<typeof SwapSuggestion>;

export const SwapSuggestionsResponse = z.object({
  shiftId: Id,
  suggestions: z.array(SwapSuggestion).max(3),
  /** always present so the UI can show "why" without the model */
  deterministic: z.literal(true),
});
export type SwapSuggestionsResponse = z.infer<typeof SwapSuggestionsResponse>;

/* ------------------------------------------------------------------ */
/* routes (used by the app client and by permission tests)            */
/* ------------------------------------------------------------------ */

export const Routes = {
  healthz: 'GET /healthz',
  signup: 'POST /v1/auth/signup',
  login: 'POST /v1/auth/login',
  magicStart: 'POST /v1/auth/magic',
  magicConsume: 'POST /v1/auth/magic/consume',
  refresh: 'POST /v1/auth/refresh',
  logout: 'POST /v1/auth/logout',
  logoutAll: 'POST /v1/auth/logout-all',
  forgot: 'POST /v1/auth/forgot',
  reset: 'POST /v1/auth/reset',
  me: 'GET /v1/me',
  settings: 'GET /v1/me/settings',
  patchSettings: 'PATCH /v1/me/settings',
  pushToken: 'PUT /v1/me/devices/:deviceId/push-token',
  putAvatar: 'PUT /v1/me/avatar',
  deleteAvatar: 'DELETE /v1/me/avatar',
  avatar: 'GET /v1/users/:userId/avatar',
  plans: 'GET /v1/plans',
  createTeam: 'POST /v1/teams',
  team: 'GET /v1/teams/:teamId',
  members: 'GET /v1/teams/:teamId/members',
  invites: 'POST /v1/teams/:teamId/invites',
  inviteInfo: 'GET /v1/invites/:token',
  inviteAccept: 'POST /v1/invites/:token/accept',
  removeMember: 'DELETE /v1/teams/:teamId/members/:userId',
  shifts: 'GET /v1/teams/:teamId/shifts',
  createShift: 'POST /v1/teams/:teamId/shifts',
  updateShift: 'PATCH /v1/shifts/:shiftId',
  respondToShift: 'POST /v1/shifts/:shiftId/respond',
  deleteShift: 'DELETE /v1/shifts/:shiftId',
  feed: 'GET /v1/teams/:teamId/activity',
  swaps: 'GET /v1/teams/:teamId/swaps',
  createSwap: 'POST /v1/shifts/:shiftId/swap-requests',
  decideSwap: 'POST /v1/swaps/:swapId/decision',
  swapSuggestions: 'GET /v1/shifts/:shiftId/swap-suggestions',
  subscription: 'GET /v1/teams/:teamId/billing/subscription',
  ledger: 'GET /v1/teams/:teamId/billing/ledger',
  checkout: 'POST /v1/teams/:teamId/billing/checkout',
  flutterwaveWebhook: 'POST /v1/webhooks/flutterwave',
} as const;

export type RouteKey = keyof typeof Routes;

