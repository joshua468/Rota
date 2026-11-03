import { PGlite } from '@electric-sql/pglite';
import type { DatabaseHandle, Queryable } from './types';

/**
 * Hermetic driver over PGlite — real Postgres in-process (ADR-0006). Used for
 * tests and for local development without a server. SQL, constraints, triggers
 * and transactions behave exactly like production.
 *
 * PGlite owns a single connection, so top-level statements are serialised with
 * a mutex; inside a transaction the callback gets a direct handle so nested
 * queries do not deadlock behind it.
 */
class PgliteQueryable implements Queryable {
  private queue: Promise<unknown> = Promise.resolve();

  constructor(private readonly db: PGlite) {}

  async query<T = Record<string, unknown>>(sql: string, params: readonly unknown[] = []): Promise<T[]> {
    return this.serialise(async () => {
      const res = await this.db.query<T>(sql, params as unknown[]);
      return res.rows;
    });
  }

  async one<T = Record<string, unknown>>(sql: string, params: readonly unknown[] = []): Promise<T | undefined> {
    const rows = await this.query<T>(sql, params);
    return rows[0];
  }

  async exec(sql: string): Promise<void> {
    await this.serialise(() => this.db.exec(sql));
  }

  async tx<T>(fn: (tx: Queryable) => Promise<T>): Promise<T> {
    return this.serialise(async () => {
      await this.db.exec('BEGIN');
      try {
        const result = await fn(this.direct());
        await this.db.exec('COMMIT');
        return result;
      } catch (error) {
        await this.db.exec('ROLLBACK');
        throw error;
      }
    });
  }

  private direct(): Queryable {
    const db = this.db;
    return {
      async query<T>(sql: string, params: readonly unknown[] = []): Promise<T[]> {
        const res = await db.query<T>(sql, params as unknown[]);
        return res.rows;
      },
      async one<T>(sql: string, params: readonly unknown[] = []): Promise<T | undefined> {
        const res = await db.query<T>(sql, params as unknown[]);
        return res.rows[0];
      },
      async exec(sql: string): Promise<void> {
        await db.exec(sql);
      },
      async tx<T>(fn: (tx: Queryable) => Promise<T>): Promise<T> {
        return fn(this);
      },
    };
  }

  private serialise<T>(run: () => Promise<T>): Promise<T> {
    const next = this.queue.then(run, run);
    this.queue = next.catch(() => undefined);
    return next;
  }
}

export function createPgliteDatabase(db: PGlite): DatabaseHandle {
  const queryable = new PgliteQueryable(db);
  return {
    query: (sql, params) => queryable.query(sql, params),
    one: (sql, params) => queryable.one(sql, params),
    exec: (sql) => queryable.exec(sql),
    tx: (fn) => queryable.tx(fn),
    close: () => db.close(),
  };
}

export async function newPgliteDatabase(): Promise<DatabaseHandle> {
  return createPgliteDatabase(new PGlite());
}
