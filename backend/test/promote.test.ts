import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { promoteUser } from '../src/db/promote';
import { createTestContext, resetDatabases, type TestContext } from './helpers/app';
import { addMember, createTeam, shardOf, signup } from './helpers/roster';

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

async function roleOf(teamId: string, userId: string): Promise<string | undefined> {
  const row = await shardOf(ctx, teamId).one<{ role: string }>(
    'SELECT role FROM team_members WHERE team_id = $1 AND user_id = $2',
    [teamId, userId],
  );
  return row?.role;
}

describe('promoteUser', () => {
  it('grants a member full access across their teams', async () => {
    const { teamId } = await createTeam(ctx, 'Promote Co');
    const user = await signup(ctx, 'member@promote.test');
    await addMember(ctx, teamId, user.id, 'member');
    expect(await roleOf(teamId, user.id)).toBe('member');

    const result = await promoteUser(ctx.topology, 'member@promote.test', 'owner');
    expect(result?.changes).toEqual([{ teamId, from: 'member', to: 'owner' }]);
    expect(await roleOf(teamId, user.id)).toBe('owner');
  });

  it('is a no-op when the user already holds the role', async () => {
    const { teamId } = await createTeam(ctx, 'Already Co');
    const owner = await signup(ctx, 'owner@already.test');
    await addMember(ctx, teamId, owner.id, 'admin');

    const result = await promoteUser(ctx.topology, 'owner@already.test', 'admin');
    expect(result?.changes).toEqual([]);
    expect(await roleOf(teamId, owner.id)).toBe('admin');
  });

  it('returns null for an unknown email', async () => {
    const result = await promoteUser(ctx.topology, 'nobody@promote.test', 'owner');
    expect(result).toBeNull();
  });

  it('adds a membership when the user belongs to no team', async () => {
    const { teamId } = await createTeam(ctx, 'Demo Co');
    const user = await signup(ctx, 'outsider@promote.test');
    expect(await roleOf(teamId, user.id)).toBeUndefined();

    const result = await promoteUser(ctx.topology, 'outsider@promote.test', 'owner', teamId);
    expect(result?.changes).toEqual([{ teamId, from: '(none)', to: 'owner' }]);
    expect(await roleOf(teamId, user.id)).toBe('owner');
  });
});
