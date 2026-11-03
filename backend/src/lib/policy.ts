import type { Role } from '@rota/contract';

/**
 * Permission matrix (Rule 01). The server is the authority: every route calls
 * `can(role, action)` with the role derived from the database, never from the
 * request body. Adding a route means adding its action here and a row to the
 * permission test table in the same change.
 */
export const ACTIONS = [
  'me.read',
  'settings.read',
  'settings.write',
  'plans.read',
  'team.read',
  'team.update',
  'team.invite',
  'team.removeMember',
  'member.read',
  'shift.read',
  'shift.create',
  'shift.update',
  'shift.delete',
  'shift.respond',
  'swap.read',
  'swap.request',
  'swap.decide',
  'swap.suggest',
  'feed.read',
  'billing.read',
  'billing.ledger',
  'billing.checkout',
] as const;

export type Action = (typeof ACTIONS)[number];

const ALL: readonly Role[] = ['owner', 'admin', 'manager', 'member'];
const SCHEDULERS: readonly Role[] = ['owner', 'admin', 'manager'];
const ADMINS: readonly Role[] = ['owner', 'admin'];
const OWNER: readonly Role[] = ['owner'];

export const POLICY: Record<Action, readonly Role[]> = {
  'me.read': ALL,
  'settings.read': ALL,
  'settings.write': ALL,
  'plans.read': ALL,
  'team.read': ALL,
  'team.update': ADMINS,
  'team.invite': ADMINS,
  'team.removeMember': ADMINS,
  'member.read': ALL,
  'shift.read': ALL,
  'shift.create': SCHEDULERS,
  'shift.update': SCHEDULERS,
  'shift.delete': SCHEDULERS,
  'shift.respond': ALL,
  'swap.read': ALL,
  'swap.request': ALL,
  // Swaps get manager approval: only schedulers approve or decline someone
  // else's request. The requester withdrawing their own is handled at the
  // route (it never reaches `can`) so every role may cancel their own.
  'swap.decide': SCHEDULERS,
  'swap.suggest': ALL,
  'feed.read': ALL,
  'billing.read': ADMINS,
  'billing.ledger': OWNER,
  'billing.checkout': OWNER,
};

export function can(role: Role, action: Action): boolean {
  const allowed = POLICY[action];
  if (!allowed) throw new Error(`Unknown policy action: ${action}`);
  return allowed.includes(role);
}
