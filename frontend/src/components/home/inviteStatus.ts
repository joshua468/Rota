/**
 * What the assignee step says once an invite has been sent.
 *
 * A pending invite is not a team member: the server only creates the member
 * when the invite is accepted (Rule 01). So the wizard has to say what happens
 * next instead of leaving a silent dead end on the "Next" button.
 */
export type InviteWaitState = {
  title: string;
  body: string;
  hint: string;
  canContinue: boolean;
};

const ACCEPT_COPY = 'They join the team as soon as they accept the invite in their inbox.';

export function inviteWaitState(pendingEmails: string[], memberCount: number): InviteWaitState {
  const pending = pendingEmails.filter((email) => email.trim().length > 0);
  const canContinue = memberCount > 0;

  if (pending.length === 0) {
    if (memberCount > 0) {
      return { title: '', body: '', hint: '', canContinue: true };
    }
    return {
      title: 'No team members yet',
      body: 'Invite a teammate first. They join the team as soon as they accept the invite, then you can assign their shifts.',
      hint: 'Invite someone to get started.',
      canContinue: false,
    };
  }

  const who = pending.length === 1 ? pending[0] : `${pending.length} people`;
  return {
    title: pending.length === 1 ? `Invite sent to ${who}` : `Invites sent to ${who}`,
    body: canContinue
      ? `${ACCEPT_COPY} Once they have joined they appear in the list above.`
      : `${ACCEPT_COPY} Come back once they have joined to assign their first shift.`,
    hint: canContinue ? '' : 'Waiting for the invite to be accepted.',
    canContinue,
  };
}
