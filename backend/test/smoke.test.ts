import { describe, expect, it } from 'vitest';
import { Role, ErrorCode } from '@rota/contract';
import { PGlite } from '@electric-sql/pglite';
import Fastify from 'fastify';

describe('toolchain', () => {
  it('imports the workspace contract', () => {
    expect(Role.options).toContain('owner');
    expect(ErrorCode.options).toContain('NOT_FOUND');
  });

  it('runs pglite with a real query', async () => {
    const db = new PGlite();
    const res = await db.query<{ n: number }>('select 1 as n');
    expect(res.rows[0]?.n).toBe(1);
    await db.close();
  });

  it('injects through fastify', async () => {
    const app = Fastify();
    app.get('/ping', async () => ({ pong: true }));
    const res = await app.inject({ method: 'GET', url: '/ping' });
    expect(res.statusCode).toBe(200);
    await app.close();
  });
});
