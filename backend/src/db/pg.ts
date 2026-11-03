import pg from 'pg';
import type { DatabaseHandle, Queryable } from './types';

/**
 * Production/dev driver over `pg`. Pool size is 10 per pool (justified in
 * docs/ARCHITECTURE.md#pool-size-justification) — changing it means updating
 * that section (Rule 05).
 */
export const POOL_SIZE = 10;

class PgQueryable implements Queryable {
  constructor(private readonly acquire: () => Promise<pg.PoolClient>, private readonly release: (c: pg.PoolClient) => void) {}

  async query<T = Record<string, unknown>>(sql: string, params: readonly unknown[] = []): Promise<T[]> {
    const client = await this.acquire();
    try {
      const res = await client.query(sql, params as unknown[]);
      return res.rows as T[];
    } finally {
      this.release(client);
    }
  }

  async one<T = Record<string, unknown>>(sql: string, params: readonly unknown[] = []): Promise<T | undefined> {
    const rows = await this.query<T>(sql, params);
    return rows[0];
  }

  async exec(sql: string): Promise<void> {
    const client = await this.acquire();
    try {
      await client.query(sql);
    } finally {
      this.release(client);
    }
  }

  async tx<T>(fn: (tx: Queryable) => Promise<T>): Promise<T> {
    const client = await this.acquire();
    const tx = new PgQueryable(
      () => Promise.resolve(client),
      () => undefined,
    );
    try {
      await client.query('BEGIN');
      const result = await fn(tx);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      this.release(client);
    }
  }
}

export interface PgOptions {
  ssl?: boolean;
  connectionTimeoutMs?: number;
  statementTimeoutMs?: number;
  applicationName?: string;
}

export function createPgDatabase(url: string, options: PgOptions = {}): DatabaseHandle {
  const pool = new pg.Pool({
    connectionString: url,
    max: POOL_SIZE,
    ssl: options.ssl ? { rejectUnauthorized: true } : undefined,
    connectionTimeoutMillis: options.connectionTimeoutMs ?? 10_000,
    statement_timeout: options.statementTimeoutMs ?? 15_000,
    idle_in_transaction_session_timeout: 30_000,
    query_timeout: (options.statementTimeoutMs ?? 15_000) + 5_000,
    application_name: options.applicationName ?? 'rota-api',
  });
  pool.on('error', (error) => {
    console.error(JSON.stringify({ level: 'error', msg: 'idle postgres client error', err: error.message }));
  });
  const acquire = async (): Promise<pg.PoolClient> => pool.connect();
  const release = (client: pg.PoolClient): void => client.release();
  const queryable = new PgQueryable(acquire, release);
  return {
    query: (sql, params) => queryable.query(sql, params),
    one: (sql, params) => queryable.one(sql, params),
    exec: (sql) => queryable.exec(sql),
    tx: (fn) => queryable.tx(fn),
    close: () => pool.end(),
  };
}
