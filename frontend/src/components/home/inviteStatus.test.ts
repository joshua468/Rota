import { describe, expect, it } from 'vitest';
import { inviteWaitState } from './inviteStatus';

describe('inviteWaitState', () => {
  it('explains the empty team instead of leaving a dead end', () => {
    const state = inviteWaitState([], 0);
    expect(state.canContinue).toBe(false);
    expect(state.title).toBe('No team members yet');
    expect(state.hint).toBe('Invite someone to get started.');
    expect(state.body).toContain('as soon as they accept');
  });

  it('says what happens after the invite is sent', () => {
    const state = inviteWaitState(['new@rota.test'], 0);
    expect(state.canContinue).toBe(false);
    expect(state.title).toBe('Invite sent to new@rota.test');
    expect(state.body).toContain('in their inbox');
    expect(state.body).toContain('Come back once they have joined');
    expect(state.hint).toBe('Waiting for the invite to be accepted.');
  });

  it('lets the wizard continue when the team already has members', () => {
    const state = inviteWaitState(['new@rota.test'], 2);
    expect(state.canContinue).toBe(true);
    expect(state.hint).toBe('');
    expect(state.body).toContain('appear in the list above');
  });

  it('counts every pending invite', () => {
    const state = inviteWaitState(['a@rota.test', 'b@rota.test'], 1);
    expect(state.title).toBe('Invites sent to 2 people');
  });

  it('ignores blank emails', () => {
    const state = inviteWaitState(['  '], 1);
    expect(state.title).toBe('');
    expect(state.canContinue).toBe(true);
  });
});
