import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { RequestBodies, type PublicUser } from '@rota/contract';
import { createTestContext, resetDatabases, type TestContext } from './helpers/app';
import { auth, addMember, createTeam, inviteAndJoin, signup, type RosterUser } from './helpers/roster';

let ctx: TestContext;

beforeAll(async () => {
  ctx = await createTestContext();
});

beforeEach(async () => {
  await resetDatabases(ctx);
});

afterAll(async () => {
  await ctx.close();
});

/** The smallest valid PNG (1x1, transparent) — the magic bytes are what matter. */
const PNG_BYTES = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);
const JPEG_BYTES = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);

function upload(user: RosterUser, bytes: Buffer, contentType = 'image/png') {
  return ctx.app.inject({
    method: 'PUT',
    url: '/v1/me/avatar',
    headers: auth(user),
    payload: RequestBodies.putAvatar.parse({ dataBase64: bytes.toString('base64'), contentType }),
  });
}

/** Sends the body as-is, so the server (not the client schema) rejects it. */
function uploadRaw(user: RosterUser, payload: Record<string, unknown>) {
  return ctx.app.inject({
    method: 'PUT',
    url: '/v1/me/avatar',
    headers: auth(user),
    payload,
  });
}

function meOf(user: RosterUser): Promise<{ user: { avatarUrl: string | null } }> {
  return ctx.app.inject({ method: 'GET', url: '/v1/me', headers: auth(user) }).then((res) => {
    expect(res.statusCode).toBe(200);
    return res.json() as { user: { avatarUrl: string | null } };
  });
}

function errorCodeOf(res: { json(): unknown }): string {
  return ((res.json() as { error?: { code?: string } }).error?.code) ?? 'NO_ERROR';
}

describe('avatars', () => {
  it('stores a photo and hands back the path with a version', async () => {
    const { owner } = await createTeam(ctx, 'Cooks', 'owner@avatar.test');

    const res = await upload(owner, PNG_BYTES);
    expect(res.statusCode).toBe(200);
    const body = res.json() as { avatarUrl: string; updatedAt: string };
    expect(body.avatarUrl).toContain(`/v1/users/${owner.id}/avatar`);
    expect(body.avatarUrl).toContain('?v=');
    expect(body.updatedAt).toBeTruthy();

    const me = await meOf(owner);
    expect(me.user.avatarUrl).toBe(body.avatarUrl);
  });

  it('serves the image to a team-mate and hides it from everybody else', async () => {
    const { teamId, owner } = await createTeam(ctx, 'Cooks', 'owner@avatar.test');
    const mate = await inviteAndJoin(ctx, teamId, 'Cooks', 'mate@avatar.test', 'member', owner);
    const outsider = await signup(ctx, 'outsider@avatar.test');

    await upload(owner, PNG_BYTES);

    const read = await ctx.app.inject({
      method: 'GET',
      url: `/v1/users/${owner.id}/avatar`,
      headers: auth(mate),
    });
    expect(read.statusCode).toBe(200);
    expect(read.headers['content-type']).toBe('image/png');
    expect(read.rawPayload.equals(PNG_BYTES)).toBe(true);

    // Cross-team access answers 404, never 403 (SECURITY.md threat 2).
    const hidden = await ctx.app.inject({
      method: 'GET',
      url: `/v1/users/${owner.id}/avatar`,
      headers: auth(outsider),
    });
    expect(hidden.statusCode).toBe(404);
  });

  it('removes the photo and falls back to the initials avatar', async () => {
    const { owner } = await createTeam(ctx, 'Cooks', 'owner@avatar.test');
    await upload(owner, PNG_BYTES);

    const removed = await ctx.app.inject({ method: 'DELETE', url: '/v1/me/avatar', headers: auth(owner) });
    expect(removed.statusCode).toBe(204);

    const me = await meOf(owner);
    expect(me.user.avatarUrl).toBeNull();

    const gone = await ctx.app.inject({
      method: 'GET',
      url: `/v1/users/${owner.id}/avatar`,
      headers: auth(owner),
    });
    expect(gone.statusCode).toBe(404);
  });

  it('rejects a payload that is not the image it claims to be', async () => {
    const { owner } = await createTeam(ctx, 'Cooks', 'owner@avatar.test');

    const html = await upload(owner, Buffer.from('<html>hello</html>'), 'image/png');
    expect(html.statusCode).toBe(400);
    expect(errorCodeOf(html)).toBe('VALIDATION_FAILED');

    const mismatched = await upload(owner, PNG_BYTES, 'image/jpeg');
    expect(mismatched.statusCode).toBe(400);
  });

  it('rejects an oversized image', async () => {
    const { owner } = await createTeam(ctx, 'Cooks', 'owner@avatar.test');
    const tooBig = Buffer.concat([JPEG_BYTES, Buffer.alloc(2 * 1024 * 1024)]);

    const res = await uploadRaw(owner, {
      dataBase64: tooBig.toString('base64'),
      contentType: 'image/jpeg',
    });
    expect(res.statusCode).toBe(400);
  });

  it('refuses an anonymous caller', async () => {
    const res = await ctx.app.inject({ method: 'PUT', url: '/v1/me/avatar', payload: {} });
    expect(res.statusCode).toBe(401);
  });

  it('shows the photo on the team roster', async () => {
    const { teamId, owner } = await createTeam(ctx, 'Cooks', 'owner@avatar.test');
    const mate = await inviteAndJoin(ctx, teamId, 'Cooks', 'mate@avatar.test', 'member', owner);
    await upload(mate, PNG_BYTES);

    const roster = await ctx.app.inject({
      method: 'GET',
      url: `/v1/teams/${teamId}/members`,
      headers: auth(owner),
    });
    expect(roster.statusCode).toBe(200);
    const members = roster.json() as PublicUser[];
    const found = members.find((member) => member.id === mate.id);
    expect(found?.avatarUrl).toContain(`/v1/users/${mate.id}/avatar`);
    const withoutPhoto = members.find((member) => member.id === owner.id);
    expect(withoutPhoto?.avatarUrl).toBeNull();
  });

  it('keeps a direct membership without a team as able to read their own photo', async () => {
    const { teamId, owner } = await createTeam(ctx, 'Cooks', 'owner@avatar.test');
    const stranger = await signup(ctx, 'stranger@avatar.test');
    await addMember(ctx, teamId, stranger.id, 'member');

    await upload(stranger, PNG_BYTES);
    const res = await ctx.app.inject({
      method: 'GET',
      url: `/v1/users/${stranger.id}/avatar`,
      headers: auth(stranger),
    });
    expect(res.statusCode).toBe(200);
  });
});
