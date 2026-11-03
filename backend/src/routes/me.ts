import { RequestBodies, PathParams, type Settings, type SettingsEnvelope } from '@rota/contract';
import type { FastifyInstance } from 'fastify';
import type { AppDeps } from '../app';
import { requireUser } from '../http/auth';
import { NoQuery, parseWith } from '../http/validate';
import { notFound } from '../lib/errors';
import { membershipsForUser } from '../repos/members';
import { avatarPath, findAvatar } from '../repos/avatars';

interface SettingsRow {
  user_id: string;
  quiet_start: string;
  quiet_start_updated_at: Date;
  quiet_end: string;
  quiet_end_updated_at: Date;
  time_zone: string;
  time_zone_updated_at: Date;
  notif_shifts: boolean;
  notif_shifts_updated_at: Date;
  notif_swaps: boolean;
  notif_swaps_updated_at: Date;
  notif_billing: boolean;
  notif_billing_updated_at: Date;
  language: 'en';
  language_updated_at: Date;
  theme: 'system' | 'light' | 'dark' | 'sage';
  theme_updated_at: Date;
}

const SETTINGS_FIELDS = [
  'quiet_start',
  'quiet_end',
  'time_zone',
  'notif_shifts',
  'notif_swaps',
  'notif_billing',
  'language',
  'theme',
] as const;

type SettingsField = (typeof SETTINGS_FIELDS)[number];

async function loadSettings(deps: AppDeps, userId: string): Promise<SettingsRow> {
  const existing = await deps.topology.global.one<SettingsRow>('SELECT * FROM user_settings WHERE user_id = $1', [
    userId,
  ]);
  if (existing) return existing;
  const created = await deps.topology.global.one<SettingsRow>(
    'INSERT INTO user_settings (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING RETURNING *',
    [userId],
  );
  if (created) return created;
  const row = await deps.topology.global.one<SettingsRow>('SELECT * FROM user_settings WHERE user_id = $1', [
    userId,
  ]);
  if (!row) throw new Error('settings row missing');
  return row;
}

function toEnvelope(row: SettingsRow, conflicts?: SettingsField[]): SettingsEnvelope {
  const values: Settings = {
    quiet_start: row.quiet_start,
    quiet_end: row.quiet_end,
    time_zone: row.time_zone,
    notif_shifts: row.notif_shifts,
    notif_swaps: row.notif_swaps,
    notif_billing: row.notif_billing,
    language: row.language,
    theme: row.theme,
  };
  const updatedAt: Record<string, string> = {};
  for (const field of SETTINGS_FIELDS) {
    const stamp = row[`${field}_updated_at` as keyof SettingsRow] as unknown as Date;
    updatedAt[field] = stamp.toISOString();
  }
  return conflicts && conflicts.length > 0 ? { values, updatedAt, conflicts } : { values, updatedAt };
}

export function registerMeRoutes(app: FastifyInstance, deps: AppDeps): void {
  app.get('/v1/me', async (req) => {
    parseWith(NoQuery, req.query, 'query');
    const user = await requireUser(deps.env, deps.topology, req);
    const memberships = await membershipsForUser(deps.topology.shards, user.id);
    const first = memberships[0];
    const avatar = await findAvatar(deps.topology.global, user.id);
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        tokenVersion: user.token_version,
        timezone: user.timezone,
        avatarUrl: avatar ? avatarPath(user.id, avatar.updated_at) : null,
      },
      team: first ? { id: first.team_id, name: first.teamName, role: first.role } : null,
    };
  });

  app.get('/v1/me/settings', async (req): Promise<SettingsEnvelope> => {
    parseWith(NoQuery, req.query, 'query');
    const user = await requireUser(deps.env, deps.topology, req);
    const row = await loadSettings(deps, user.id);
    return toEnvelope(row);
  });

  app.patch('/v1/me/settings', async (req): Promise<SettingsEnvelope> => {
    const user = await requireUser(deps.env, deps.topology, req);
    const body = RequestBodies.patchSettings.parse(req.body);
    const row = await loadSettings(deps, user.id);

    const conflicts: SettingsField[] = [];
    const assignments: string[] = [];
    const params: unknown[] = [user.id];
    let touchesTimeZone = false;

    for (const [key, value] of Object.entries(body.changes)) {
      const field = key as SettingsField;
      if (!SETTINGS_FIELDS.includes(field)) continue;
      const base = body.baseUpdatedAt?.[field];
      if (base) {
        const server = row[`${field}_updated_at` as keyof SettingsRow] as Date;
        if (new Date(base).getTime() !== server.getTime()) {
          conflicts.push(field);
          continue;
        }
      }
      params.push(value);
      assignments.push(`${field} = $${params.length}, ${field}_updated_at = now()`);
      if (field === 'time_zone') touchesTimeZone = true;
    }

    let updated = row;
    if (assignments.length > 0) {
      const result = await deps.topology.global.one<SettingsRow>(
        `UPDATE user_settings SET ${assignments.join(', ')} WHERE user_id = $1 RETURNING *`,
        params,
      );
      if (result) updated = result;
      if (touchesTimeZone) {
        await deps.topology.global.query('UPDATE users SET timezone = $1, updated_at = now() WHERE id = $2', [
          updated.time_zone,
          user.id,
        ]);
      }
    }
    return toEnvelope(updated, conflicts);
  });

  app.put<{ Params: { deviceId: string } }>('/v1/me/devices/:deviceId/push-token', async (req, reply) => {
    const { deviceId } = parseWith(PathParams.deviceId, req.params, 'params');
    const user = await requireUser(deps.env, deps.topology, req);
    const body = RequestBodies.putPushToken.parse(req.body);
    const owned = await deps.topology.global.one<{ device_id: string }>(
      'SELECT device_id FROM devices WHERE device_id = $1 AND user_id = $2',
      [deviceId, user.id],
    );
    const stray = !owned
      ? await deps.topology.global.one<{ device_id: string }>('SELECT device_id FROM devices WHERE device_id = $1', [
          deviceId,
        ])
      : undefined;
    if (stray) throw notFound('That device belongs to another account.');
    await deps.topology.global.query(
      `INSERT INTO devices (device_id, user_id, push_token) VALUES ($1, $2, $3)
       ON CONFLICT (device_id) DO UPDATE SET push_token = EXCLUDED.push_token, updated_at = now()`,
      [deviceId, user.id, body.pushToken],
    );
    reply.status(204);
    return null;
  });
}
