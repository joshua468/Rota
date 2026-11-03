import type { Queryable } from '../db/types';
import { newId } from '../lib/ids';
import { hashPassword } from '../lib/crypto';

export interface UserRow {
  id: string;
  email: string;
  name: string;
  password_hash: string | null;
  token_version: number;
  timezone: string;
  created_at: Date;
}

const SELECT = 'SELECT id, email, name, password_hash, token_version, timezone, created_at FROM users';

export async function findUserByEmail(db: Queryable, email: string): Promise<UserRow | undefined> {
  return db.one<UserRow>(`${SELECT} WHERE lower(email) = lower($1)`, [email]);
}

export async function findUserById(db: Queryable, id: string): Promise<UserRow | undefined> {
  return db.one<UserRow>(`${SELECT} WHERE id = $1`, [id]);
}

export async function createUser(
  db: Queryable,
  input: { email: string; name: string; password?: string; timezone?: string },
): Promise<UserRow> {
  const passwordHash = input.password ? await hashPassword(input.password) : null;
  const row = await db.one<UserRow>(
    `INSERT INTO users (id, email, name, password_hash, timezone)
     VALUES ($1, lower($2), $3, $4, $5)
     RETURNING id, email, name, password_hash, token_version, timezone, created_at`,
    [newId(), input.email, input.name, passwordHash, input.timezone ?? 'UTC'],
  );
  if (!row) throw new Error('failed to create user');
  await db.query('INSERT INTO user_settings (user_id, time_zone) VALUES ($1, $2) ON CONFLICT (user_id) DO NOTHING', [
    row.id,
    input.timezone ?? 'UTC',
  ]);
  return row;
}

export async function setUserPassword(db: Queryable, userId: string, password: string): Promise<void> {
  const hash = await hashPassword(password);
  await db.query('UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2', [hash, userId]);
}
