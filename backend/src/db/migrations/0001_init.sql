-- 0001_init.sql
-- Applied to the global database and to every shard (docs/SHARDING.md).
-- Global: identity, sessions, settings, plans, idempotency, webhook events.
-- Sharded: teams, roster, invites, shifts, swaps, activity, billing.

-- ------------------------------------------------------------------ global

CREATE TABLE IF NOT EXISTS users (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email          text NOT NULL,
  name           text NOT NULL,
  password_hash  text,
  token_version  integer NOT NULL DEFAULT 0,
  timezone       text NOT NULL DEFAULT 'UTC',
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON users (lower(email));

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id    uuid NOT NULL,
  user_id      uuid NOT NULL,
  device_id    text NOT NULL,
  token_hash   text NOT NULL,
  used_at      timestamptz,
  revoked_at   timestamptz,
  expires_at   timestamptz NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS refresh_tokens_hash_key ON refresh_tokens (token_hash);
CREATE INDEX IF NOT EXISTS refresh_tokens_family_idx ON refresh_tokens (family_id);
CREATE INDEX IF NOT EXISTS refresh_tokens_user_idx ON refresh_tokens (user_id);

CREATE TABLE IF NOT EXISTS one_time_tokens (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid,
  purpose      text NOT NULL CHECK (purpose IN ('magic', 'reset')),
  token_hash   text NOT NULL,
  expires_at   timestamptz NOT NULL,
  used_at      timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS one_time_tokens_hash_key ON one_time_tokens (token_hash);

CREATE TABLE IF NOT EXISTS devices (
  device_id    text PRIMARY KEY,
  user_id      uuid NOT NULL,
  push_token   text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS devices_user_idx ON devices (user_id);

CREATE TABLE IF NOT EXISTS user_settings (
  user_id                 uuid PRIMARY KEY,
  quiet_start             text NOT NULL DEFAULT '22:00',
  quiet_start_updated_at  timestamptz NOT NULL DEFAULT now(),
  quiet_end               text NOT NULL DEFAULT '07:00',
  quiet_end_updated_at    timestamptz NOT NULL DEFAULT now(),
  time_zone               text NOT NULL DEFAULT 'UTC',
  time_zone_updated_at    timestamptz NOT NULL DEFAULT now(),
  notif_shifts            boolean NOT NULL DEFAULT true,
  notif_shifts_updated_at timestamptz NOT NULL DEFAULT now(),
  notif_swaps             boolean NOT NULL DEFAULT true,
  notif_swaps_updated_at  timestamptz NOT NULL DEFAULT now(),
  notif_billing           boolean NOT NULL DEFAULT true,
  notif_billing_updated_at timestamptz NOT NULL DEFAULT now(),
  language                text NOT NULL DEFAULT 'en',
  language_updated_at     timestamptz NOT NULL DEFAULT now(),
  theme                   text NOT NULL DEFAULT 'system',
  theme_updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS plans (
  key              text PRIMARY KEY,
  name             text NOT NULL,
  price_cents      integer NOT NULL CHECK (price_cents >= 0),
  currency         text NOT NULL DEFAULT 'USD',
  included_seats   integer NOT NULL CHECK (included_seats > 0),
  extra_seat_cents integer CHECK (extra_seat_cents IS NULL OR extra_seat_cents >= 0),
  max_seats        integer NOT NULL CHECK (max_seats > 0),
  active           boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS idempotency_keys (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL,
  key             text NOT NULL,
  request_hash    text NOT NULL,
  state           text NOT NULL DEFAULT 'in_flight' CHECK (state IN ('in_flight', 'finished')),
  response_status integer,
  response_body   jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  expires_at      timestamptz NOT NULL,
  UNIQUE (user_id, key)
);

CREATE INDEX IF NOT EXISTS idempotency_keys_expiry_idx ON idempotency_keys (expires_at);

CREATE TABLE IF NOT EXISTS webhook_events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider     text NOT NULL,
  event_key    text NOT NULL,
  payload      jsonb NOT NULL,
  status       text NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'processed', 'rejected')),
  note         text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  UNIQUE (provider, event_key)
);

-- ------------------------------------------------------------------- shard

CREATE TABLE IF NOT EXISTS teams (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_members (
  team_id   uuid NOT NULL,
  user_id   uuid NOT NULL,
  role      text NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'member')),
  active    boolean NOT NULL DEFAULT true,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (team_id, user_id)
);

CREATE INDEX IF NOT EXISTS team_members_user_idx ON team_members (user_id);

CREATE TABLE IF NOT EXISTS invites (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id     uuid NOT NULL,
  email       text NOT NULL,
  role        text NOT NULL CHECK (role IN ('admin', 'manager', 'member')),
  token_hash  text NOT NULL,
  invited_by  uuid NOT NULL,
  expires_at  timestamptz NOT NULL,
  accepted_at timestamptz,
  revoked_at  timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS invites_token_key ON invites (token_hash);
CREATE INDEX IF NOT EXISTS invites_team_email_idx ON invites (team_id, lower(email));

CREATE TABLE IF NOT EXISTS shifts (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id    uuid NOT NULL,
  user_id    uuid NOT NULL,
  starts_at  timestamptz NOT NULL,
  ends_at    timestamptz NOT NULL,
  role       text,
  location   text,
  notes      text,
  version    integer NOT NULL DEFAULT 1,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);

CREATE INDEX IF NOT EXISTS shifts_team_window_idx ON shifts (team_id, starts_at, ends_at);
CREATE INDEX IF NOT EXISTS shifts_team_user_idx ON shifts (team_id, user_id, starts_at);

CREATE TABLE IF NOT EXISTS swap_requests (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id     uuid NOT NULL,
  shift_id    uuid NOT NULL REFERENCES shifts (id) ON DELETE CASCADE,
  from_user_id uuid NOT NULL,
  to_user_id  uuid,
  note        text,
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'canceled')),
  decided_by  uuid,
  decided_at  timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS swap_requests_team_cursor_idx ON swap_requests (team_id, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS swap_requests_shift_idx ON swap_requests (shift_id, status);
CREATE INDEX IF NOT EXISTS swap_requests_to_user_idx ON swap_requests (to_user_id, status);

CREATE TABLE IF NOT EXISTS activity (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id    uuid NOT NULL,
  type       text NOT NULL,
  actor_id   uuid,
  summary    text NOT NULL,
  data       jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS activity_team_cursor ON activity (team_id, created_at DESC, id DESC);

CREATE TABLE IF NOT EXISTS subscriptions (
  team_id          uuid PRIMARY KEY,
  plan_key         text NOT NULL REFERENCES plans (key),
  status           text NOT NULL CHECK (status IN ('trialing', 'active', 'past_due', 'restricted', 'canceled')),
  seats            integer NOT NULL CHECK (seats > 0),
  extra_seats      integer NOT NULL DEFAULT 0 CHECK (extra_seats >= 0),
  period_start     timestamptz NOT NULL,
  period_end       timestamptz NOT NULL,
  next_amount_cents integer NOT NULL CHECK (next_amount_cents >= 0),
  grace_until      timestamptz,
  pending_plan_key text REFERENCES plans (key),
  pending_seats    integer,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ledger_entries (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id      uuid NOT NULL,
  kind         text NOT NULL CHECK (kind IN ('charge', 'credit', 'refund', 'adjustment')),
  amount_cents integer NOT NULL,
  currency     text NOT NULL DEFAULT 'USD',
  ref          text NOT NULL,
  reason       text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS ledger_entries_ref_key ON ledger_entries (ref);
CREATE INDEX IF NOT EXISTS ledger_entries_team_cursor ON ledger_entries (team_id, created_at DESC, id DESC);

CREATE OR REPLACE FUNCTION ledger_immutable() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'ledger is append-only';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ledger_no_update ON ledger_entries;
CREATE TRIGGER ledger_no_update BEFORE UPDATE OR DELETE ON ledger_entries
  FOR EACH ROW EXECUTE FUNCTION ledger_immutable();

CREATE TABLE IF NOT EXISTS payment_intents (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id          uuid NOT NULL,
  reference        text NOT NULL,
  amount_cents     integer NOT NULL CHECK (amount_cents >= 0),
  currency         text NOT NULL DEFAULT 'USD',
  plan_key         text NOT NULL,
  seats            integer NOT NULL,
  status           text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  authorization_url text,
  created_by       uuid,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS payment_intents_reference_key ON payment_intents (reference);
CREATE INDEX IF NOT EXISTS payment_intents_team_idx ON payment_intents (team_id, created_at DESC);

CREATE TABLE IF NOT EXISTS outbox (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id        uuid,
  user_id        uuid NOT NULL,
  category       text NOT NULL CHECK (category IN ('shifts', 'swaps', 'billing')),
  urgency        text NOT NULL DEFAULT 'normal' CHECK (urgency IN ('normal', 'urgent')),
  title          text NOT NULL,
  body           text NOT NULL,
  data           jsonb NOT NULL DEFAULT '{}'::jsonb,
  status         text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  attempts       integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS outbox_pending_idx ON outbox (status, next_attempt_at);

-- reference data (plans are never hardcoded in the app — Rule 02)
INSERT INTO plans (key, name, price_cents, currency, included_seats, extra_seat_cents, max_seats) VALUES
  ('starter', 'Starter', 2000, 'USD', 5, NULL, 5),
  ('team',    'Team',    5000, 'USD', 15, 300, 100),
  ('business','Business',12000,'USD', 40, 200, 500)
ON CONFLICT (key) DO NOTHING;
