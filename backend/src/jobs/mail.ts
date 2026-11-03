import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { Env } from '../env';
import type { Queue } from './queue';

export interface OutgoingMail {
  to: string;
  kind: 'magic' | 'reset' | 'invite';
  subject: string;
  text: string;
}

export const EMAIL_QUEUE = 'email';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

/**
 * Delivers one message. `dev` writes `.mail.jsonl` so local flows are
 * inspectable, `log` only logs, and `resend` posts to the Resend API and throws
 * on failure so the queue retries with backoff. Production requires `resend`
 * (enforced in env.ts), so magic links, resets and invites are deliverable.
 */
export async function deliverMail(
  env: Env,
  mail: OutgoingMail,
  log: { info: (o: unknown, m: string) => void },
): Promise<void> {
  log.info({ to: mail.to, kind: mail.kind, subject: mail.subject }, 'mail');
  if (env.MAIL_DRIVER === 'dev') {
    const mailbox = path.join(process.cwd(), '.mail.jsonl');
    try {
      await mkdir(path.dirname(mailbox), { recursive: true });
      await appendFile(mailbox, `${JSON.stringify({ at: new Date().toISOString(), ...mail })}\n`, 'utf8');
    } catch {
      /* mailbox file is a dev convenience; failures never fail the job */
    }
    return;
  }
  if (env.MAIL_DRIVER === 'log') return;

  const res = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.MAIL_FROM,
      to: [mail.to],
      subject: mail.subject,
      text: mail.text,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`mail provider rejected ${mail.kind} (${res.status}): ${detail.slice(0, 200)}`);
  }
}

export function registerMailJobs(queue: Queue, env: Env, log: { info: (o: unknown, m: string) => void }): void {
  queue.register(EMAIL_QUEUE, async (payload) => {
    await deliverMail(env, payload as OutgoingMail, log);
  });
}

export async function enqueueMail(queue: Queue, mail: OutgoingMail): Promise<void> {
  await queue.add(EMAIL_QUEUE, mail, { attempts: 5 });
}

export function magicLinkMail(to: string, baseUrl: string, token: string, expiresAt: Date): OutgoingMail {
  const link = `rota://auth/magic?token=${encodeURIComponent(token)}`;
  return {
    to,
    kind: 'magic',
    subject: 'Your Rota sign-in link',
    text: [
      'Use this link on the device you signed in from:',
      '',
      link,
      '',
      `Or enter this code in the app: ${token}`,
      '',
      `It expires ${expiresAt.toISOString()}.`,
      'If you did not ask for this, you can ignore this email.',
    ].join('\n'),
  };
}

export function resetMail(to: string, token: string, expiresAt: Date): OutgoingMail {
  return {
    to,
    kind: 'reset',
    subject: 'Reset your Rota password',
    text: [
      'Open this link to choose a new password:',
      '',
      `rota://auth/reset?token=${encodeURIComponent(token)}`,
      '',
      `Or use this code in the app: ${token}`,
      '',
      `It expires ${expiresAt.toISOString()}.`,
      'If you did not ask for this, you can ignore this email.',
    ].join('\n'),
  };
}

export function inviteMail(
  to: string,
  input: { teamName: string; role: string; token: string; expiresAt: Date; baseUrl: string },
): OutgoingMail {
  const link = `${input.baseUrl}/v1/i/${encodeURIComponent(input.token)}`;
  return {
    to,
    kind: 'invite',
    subject: `You have been invited to ${input.teamName} on Rota`,
    text: [
      `Accept your ${input.role} invite to ${input.teamName}:`,
      '',
      link,
      '',
      `Or open rota://invite/${input.token} in the app.`,
      `This invite expires ${input.expiresAt.toISOString()}.`,
    ].join('\n'),
  };
}
