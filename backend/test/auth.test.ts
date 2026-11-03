import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { ErrorEnvelope, RequestBodies, SelfUser, SessionPayload, SettingsEnvelope } from '@rota/contract';
import { createTestContext, resetDatabases, type TestContext } from './helpers/app';
import { latestMailToken } from './helpers/roster';

let ctx: TestContext;

const signupBody = RequestBodies.signup.parse({
  email: 'sam@rota.test',
  password: 'correct-horse-battery',
  name: 'Sam Rivera',
});

async function signup(overrides: Partial<typeof signupBody> = {}) {
  return ctx.app.inject({ method: 'POST', url: '/v1/auth/signup', payload: { ...signupBody, ...overrides } });
}

beforeAll(async () => {
  ctx = await createTestContext();
});

beforeEach(async () => {
  await resetDatabases(ctx);
});

afterAll(async () => {
  await ctx.close();
});

describe('auth', () => {
  it('serves healthz', async () => {
    const res = await ctx.app.inject({ method: 'GET', url: '/healthz' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ok' });
  });

  it('signs up and returns a session', async () => {
    const res = await signup();
    expect(res.statusCode).toBe(200);
    const session = SessionPayload.parse(res.json());
    expect(session.user.email).toBe('sam@rota.test');
    expect(session.team).toBeNull();
    expect(session.tokens.expiresIn).toBe(900);
  });

  it('rejects a duplicate signup with the error envelope', async () => {
    await signup();
    const res = await signup();
    expect(res.statusCode).toBe(409);
    const envelope = ErrorEnvelope.parse(res.json());
    expect(envelope.error.code).toBe('CONFLICT');
    expect(envelope.error.reqId).toBeTruthy();
  });

  it('validates the body strictly', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/signup',
      payload: { ...signupBody, admin: true },
    });
    expect(res.statusCode).toBe(400);
    expect(ErrorEnvelope.parse(res.json()).error.code).toBe('VALIDATION_FAILED');
  });

  it('keeps login failures uniform for unknown email and wrong password', async () => {
    await signup();
    const wrong = await ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/login',
      payload: RequestBodies.login.parse({ email: 'sam@rota.test', password: 'not-the-password', deviceId: 'd1' }),
    });
    const unknown = await ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/login',
      payload: RequestBodies.login.parse({ email: 'nobody@rota.test', password: 'not-the-password', deviceId: 'd1' }),
    });
    expect(wrong.statusCode).toBe(401);
    expect(unknown.statusCode).toBe(401);
    expect(wrong.json().error.message).toBe(unknown.json().error.message);
    expect(wrong.json().error.code).toBe('UNAUTHORIZED');
  });

  it('logs in and reads /v1/me', async () => {
    await signup();
    const login = await ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/login',
      payload: RequestBodies.login.parse({ email: 'sam@rota.test', password: 'correct-horse-battery', deviceId: 'd1' }),
    });
    const session = SessionPayload.parse(login.json());
    const me = await ctx.app.inject({
      method: 'GET',
      url: '/v1/me',
      headers: { authorization: `Bearer ${session.tokens.accessToken}` },
    });
    expect(me.statusCode).toBe(200);
    const payload = me.json() as { user: unknown; team: unknown };
    expect(SelfUser.parse(payload.user).email).toBe('sam@rota.test');
    expect(payload.team).toBeNull();
  });

  it('rejects a missing or malformed bearer token', async () => {
    const bare = await ctx.app.inject({ method: 'GET', url: '/v1/me' });
    const junk = await ctx.app.inject({
      method: 'GET',
      url: '/v1/me',
      headers: { authorization: 'Bearer not-a-token' },
    });
    expect(bare.statusCode).toBe(401);
    expect(junk.statusCode).toBe(401);
    expect(ErrorEnvelope.parse(bare.json()).error.code).toBe('UNAUTHORIZED');
  });

  it('rotates refresh tokens and revokes the family on reuse', async () => {
    await signup();
    const login = await ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/login',
      payload: RequestBodies.login.parse({ email: 'sam@rota.test', password: 'correct-horse-battery', deviceId: 'd1' }),
    });
    const first = SessionPayload.parse(login.json()).tokens;

    const rotated = await ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/refresh',
      payload: RequestBodies.refresh.parse({ refreshToken: first.refreshToken, deviceId: 'd1' }),
    });
    expect(rotated.statusCode).toBe(200);
    const next = rotated.json();
    expect(next.refreshToken).not.toBe(first.refreshToken);

    const reuse = await ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/refresh',
      payload: RequestBodies.refresh.parse({ refreshToken: first.refreshToken, deviceId: 'd1' }),
    });
    expect(reuse.statusCode).toBe(401);

    const afterReuse = await ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/refresh',
      payload: RequestBodies.refresh.parse({ refreshToken: next.refreshToken, deviceId: 'd1' }),
    });
    expect(afterReuse.statusCode).toBe(401);
  });

  it('logout kills the refresh family', async () => {
    await signup();
    const login = await ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/login',
      payload: RequestBodies.login.parse({ email: 'sam@rota.test', password: 'correct-horse-battery', deviceId: 'd1' }),
    });
    const tokens = SessionPayload.parse(login.json()).tokens;
    const logout = await ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/logout',
      payload: RequestBodies.logout.parse({ refreshToken: tokens.refreshToken }),
    });
    expect(logout.statusCode).toBe(204);
    const refresh = await ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/refresh',
      payload: RequestBodies.refresh.parse({ refreshToken: tokens.refreshToken, deviceId: 'd1' }),
    });
    expect(refresh.statusCode).toBe(401);
  });

  it('does not reveal whether an account exists on forgot/reset', async () => {
    const missing = await ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/forgot',
      payload: RequestBodies.forgot.parse({ email: 'ghost@rota.test' }),
    });
    await signup();
    const present = await ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/forgot',
      payload: RequestBodies.forgot.parse({ email: 'sam@rota.test' }),
    });
    expect(missing.statusCode).toBe(200);
    expect(present.statusCode).toBe(200);
    expect(missing.json()).toEqual(present.json());
    await ctx.queue.drain(2_000);
  });
});

describe('magic link', () => {
  function startMagic(email: string) {
    return ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/magic',
      payload: RequestBodies.magicStart.parse({ email }),
    });
  }

  function consumeMagic(token: string, deviceId: string) {
    return ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/magic/consume',
      payload: RequestBodies.magicConsume.parse({ token, deviceId }),
    });
  }

  it('emails a link that signs in exactly once', async () => {
    await signup({ email: 'magic-once@rota.test' });
    const start = await startMagic('magic-once@rota.test');
    expect(start.statusCode).toBe(200);
    expect(start.json()).toEqual({ sent: true });

    const token = await latestMailToken(ctx, 'magic-once@rota.test', 'magic');
    const consume = await consumeMagic(token, 'magic-d1');
    expect(consume.statusCode).toBe(200);
    expect(SessionPayload.parse(consume.json()).user.email).toBe('magic-once@rota.test');

    const again = await consumeMagic(token, 'magic-d1');
    expect(again.statusCode).toBe(401);
    expect(ErrorEnvelope.parse(again.json()).error.code).toBe('UNAUTHORIZED');
    await ctx.queue.drain(2_000);
  });

  it('treats an expired link as invalid', async () => {
    await signup({ email: 'magic-expired@rota.test' });
    await startMagic('magic-expired@rota.test');
    const token = await latestMailToken(ctx, 'magic-expired@rota.test', 'magic');
    await ctx.topology.global.query(
      `UPDATE one_time_tokens SET expires_at = now() - interval '1 minute' WHERE purpose = 'magic'`,
    );
    const consume = await consumeMagic(token, 'magic-d2');
    expect(consume.statusCode).toBe(401);
    expect(ErrorEnvelope.parse(consume.json()).error.code).toBe('UNAUTHORIZED');
    await ctx.queue.drain(2_000);
  });
});

describe('logout-all', () => {
  function loginAs(email: string, password: string, deviceId: string) {
    return ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/login',
      payload: RequestBodies.login.parse({ email, password, deviceId }),
    });
  }

  it('revokes every session and voids already-issued access tokens', async () => {
    await signup();
    const first = SessionPayload.parse((await loginAs('sam@rota.test', 'correct-horse-battery', 'device-a')).json());
    const second = SessionPayload.parse((await loginAs('sam@rota.test', 'correct-horse-battery', 'device-b')).json());

    const out = await ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/logout-all',
      headers: { authorization: `Bearer ${first.tokens.accessToken}` },
    });
    expect(out.statusCode).toBe(204);

    for (const session of [first, second]) {
      const refresh = await ctx.app.inject({
        method: 'POST',
        url: '/v1/auth/refresh',
        payload: RequestBodies.refresh.parse({ refreshToken: session.tokens.refreshToken, deviceId: 'device-a' }),
      });
      expect(refresh.statusCode, 'refresh after logout-all').toBe(401);
      const me = await ctx.app.inject({
        method: 'GET',
        url: '/v1/me',
        headers: { authorization: `Bearer ${session.tokens.accessToken}` },
      });
      expect(me.statusCode, 'access token after logout-all').toBe(401);
    }
  });

  it('needs a signed-in user', async () => {
    const res = await ctx.app.inject({ method: 'POST', url: '/v1/auth/logout-all' });
    expect(res.statusCode).toBe(401);
  });
});

describe('password reset', () => {
  function loginAs(email: string, password: string) {
    return ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/login',
      payload: RequestBodies.login.parse({ email, password, deviceId: 'reset-d1' }),
    });
  }

  function resetWith(token: string, password: string) {
    return ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/reset',
      payload: RequestBodies.reset.parse({ token, password }),
    });
  }

  it('is single-use, swaps the password and signs every session out', async () => {
    await signup();
    const before = SessionPayload.parse((await loginAs('sam@rota.test', 'correct-horse-battery')).json());

    const sent = await ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/forgot',
      payload: RequestBodies.forgot.parse({ email: 'sam@rota.test' }),
    });
    expect(sent.statusCode).toBe(200);

    const token = await latestMailToken(ctx, 'sam@rota.test', 'reset');
    const reset = await resetWith(token, 'a-brand-new-passphrase');
    expect(reset.statusCode).toBe(200);

    expect((await loginAs('sam@rota.test', 'a-brand-new-passphrase')).statusCode).toBe(200);
    expect((await loginAs('sam@rota.test', 'correct-horse-battery')).statusCode).toBe(401);

    const reuse = await resetWith(token, 'another-passphrase-entirely');
    expect(reuse.statusCode).toBe(401);

    const refresh = await ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/refresh',
      payload: RequestBodies.refresh.parse({ refreshToken: before.tokens.refreshToken, deviceId: 'reset-d1' }),
    });
    expect(refresh.statusCode).toBe(401);
    await ctx.queue.drain(2_000);
  });

  it('rejects an expired token and leaves the password alone', async () => {
    await signup({ email: 'reset-expired@rota.test' });
    await ctx.app.inject({
      method: 'POST',
      url: '/v1/auth/forgot',
      payload: RequestBodies.forgot.parse({ email: 'reset-expired@rota.test' }),
    });
    const token = await latestMailToken(ctx, 'reset-expired@rota.test', 'reset');
    await ctx.topology.global.query(
      `UPDATE one_time_tokens SET expires_at = now() - interval '1 minute' WHERE purpose = 'reset'`,
    );

    const expired = await resetWith(token, 'a-brand-new-passphrase');
    expect(expired.statusCode).toBe(401);
    expect((await loginAs('reset-expired@rota.test', 'correct-horse-battery')).statusCode).toBe(200);
    await ctx.queue.drain(2_000);
  });
});

describe('settings', () => {
  async function bearer(): Promise<string> {
    const res = await signup();
    return `Bearer ${SessionPayload.parse(res.json()).tokens.accessToken}`;
  }

  it('returns defaults and applies a patch', async () => {
    const auth = await bearer();
    const get = await ctx.app.inject({ method: 'GET', url: '/v1/me/settings', headers: { authorization: auth } });
    const defaults = SettingsEnvelope.parse(get.json());
    expect(defaults.values.theme).toBe('system');
    expect(defaults.values.quiet_start).toBe('22:00');
    expect(defaults.updatedAt.time_zone).toBeTruthy();

    const patch = await ctx.app.inject({
      method: 'PATCH',
      url: '/v1/me/settings',
      headers: { authorization: auth },
      payload: RequestBodies.patchSettings.parse({ changes: { theme: 'dark', quiet_start: '23:30' } }),
    });
    expect(patch.statusCode).toBe(200);
    const patched = SettingsEnvelope.parse(patch.json());
    expect(patched.values.theme).toBe('dark');
    expect(patched.values.quiet_start).toBe('23:30');
    expect(patched.conflicts).toBeUndefined();
  });

  it('persists the sage theme preference', async () => {
    const auth = await bearer();
    const patch = await ctx.app.inject({
      method: 'PATCH',
      url: '/v1/me/settings',
      headers: { authorization: auth },
      payload: RequestBodies.patchSettings.parse({ changes: { theme: 'sage' } }),
    });
    expect(patch.statusCode).toBe(200);
    const patched = SettingsEnvelope.parse(patch.json());
    expect(patched.values.theme).toBe('sage');
  });

  it('reports a per-field conflict when the base is stale', async () => {
    const auth = await bearer();
    const first = SettingsEnvelope.parse(
      (await ctx.app.inject({ method: 'GET', url: '/v1/me/settings', headers: { authorization: auth } })).json(),
    );
    await ctx.app.inject({
      method: 'PATCH',
      url: '/v1/me/settings',
      headers: { authorization: auth },
      payload: RequestBodies.patchSettings.parse({ changes: { theme: 'dark' } }),
    });

    const stale = await ctx.app.inject({
      method: 'PATCH',
      url: '/v1/me/settings',
      headers: { authorization: auth },
      payload: RequestBodies.patchSettings.parse({
        changes: { theme: 'light', quiet_end: '08:00' },
        baseUpdatedAt: first.updatedAt,
      }),
    });
    const result = SettingsEnvelope.parse(stale.json());
    expect(result.conflicts).toEqual(['theme']);
    expect(result.values.theme).toBe('dark');
    expect(result.values.quiet_end).toBe('08:00');
  });
});

describe('devices', () => {
  it('refuses to attach a push token to a device owned by someone else', async () => {
    const first = SessionPayload.parse((await signup()).json());
    const other = SessionPayload.parse(
      (await signup({ email: 'other@rota.test' })).json(),
    );
    const mine = await ctx.app.inject({
      method: 'PUT',
      url: '/v1/me/devices/device-a/push-token',
      headers: { authorization: `Bearer ${first.tokens.accessToken}` },
      payload: RequestBodies.putPushToken.parse({ pushToken: 'ExponentPushToken[aaaa]' }),
    });
    expect(mine.statusCode).toBe(204);

    const theirs = await ctx.app.inject({
      method: 'PUT',
      url: '/v1/me/devices/device-a/push-token',
      headers: { authorization: `Bearer ${other.tokens.accessToken}` },
      payload: RequestBodies.putPushToken.parse({ pushToken: 'ExponentPushToken[bbbb]' }),
    });
    expect(theirs.statusCode).toBe(404);
    expect(ErrorEnvelope.parse(theirs.json()).error.code).toBe('NOT_FOUND');
  });
});
