import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from '../env';
import { createLogger } from '../lib/logger';
import { createTopology, type Topology } from './topology';

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), 'migrations');

export function migrationFiles(): { version: string; sql: string }[] {
  return readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort()
    .map((file) => ({ version: file.replace(/\.sql$/, ''), sql: readFileSync(join(migrationsDir, file), 'utf8') }));
}

/**
 * Applies every pending migration to the global database and to every shard,
 * tracked separately per database (docs/SHARDING.md). Runs inside a
 * transaction per file, so a failure never leaves a half-applied schema.
 */
export async function runMigrations(topology: Topology): Promise<string[]> {
  const files = migrationFiles();
  const targets: { name: string; db: Topology['global'] }[] = [
    { name: 'global', db: topology.global },
    ...topology.shards.map((db, i) => ({ name: `shard_${i}`, db })),
  ];
  const applied: string[] = [];

  for (const target of targets) {
    await target.db.exec(
      'CREATE TABLE IF NOT EXISTS schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())',
    );
    const done = new Set(
      (await target.db.query<{ version: string }>('SELECT version FROM schema_migrations')).map((r) => r.version),
    );
    for (const file of files) {
      if (done.has(file.version)) continue;
      await target.db.tx(async (tx) => {
        await tx.exec(file.sql);
        await tx.query('INSERT INTO schema_migrations (version) VALUES ($1)', [file.version]);
      });
      applied.push(`${target.name}:${file.version}`);
    }
  }
  return applied;
}

async function main(): Promise<void> {
  const { loadDotEnv } = await import('../lib/dotenv');
  loadDotEnv();
  const env = loadEnv();
  const log = createLogger(env.NODE_ENV === 'test' ? 'silent' : 'info');
  const topology = await createTopology(env);
  try {
    const applied = await runMigrations(topology);
    log.info({ applied: applied.length, files: applied }, 'migrations complete');
    if (applied.length === 0) log.info('schema already up to date');
  } finally {
    await topology.close();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
