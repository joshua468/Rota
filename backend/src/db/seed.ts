import { fileURLToPath } from 'node:url';
import { loadEnv } from '../env';
import { runMigrations } from './migrate';
import { createTopology, type Topology } from './topology';
import { hashPassword } from '../lib/crypto';
import { loadDotEnv } from '../lib/dotenv';
import { newId } from '../lib/ids';

/**
 * Demo data for local development and screenshots (`pnpm seed`). Everything is
 * idempotent: running it twice leaves the same dataset. The team id is fixed so
 * it always lands on the same shard.
 */
const TEAM_ID = '11111111-1111-4111-8111-111111111111';
const TEAM_NAME = 'Northwind Cafe';
const DEMO_PASSWORD = 'rota-demo-pass';

const PEOPLE = [
  { key: 'ada', email: 'ada@rota.demo', name: 'Ada Okafor', role: 'owner' },
  { key: 'ben', email: 'ben@rota.demo', name: 'Ben Alvarez', role: 'manager' },
  { key: 'cleo', email: 'cleo@rota.demo', name: 'Cleo Mensah', role: 'member' },
  { key: 'dana', email: 'dana@rota.demo', name: 'Dana Petrov', role: 'member' },
] as const;

function iso(daysFromNow: number, hour: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + daysFromNow);
  date.setUTCHours(hour, 0, 0, 0);
  return date.toISOString();
}

async function seed(): Promise<void> {
  loadDotEnv();
  const env = loadEnv();
  const log = console;
  const topology: Topology = await createTopology(env);
  try {
    await runMigrations(topology);

    const existingTeam = await topology.global.one<{ id: string }>('SELECT id FROM users WHERE lower(email) = $1', [
      PEOPLE[0].email,
    ]);
    if (existingTeam) {
      log.log('seed: demo data already present — nothing to do');
      return;
    }

    const passwordHash = await hashPassword(DEMO_PASSWORD);
    const userIds = new Map<string, string>();
    for (const person of PEOPLE) {
      const id = newId();
      userIds.set(person.key, id);
      await topology.global.query(
        'INSERT INTO users (id, email, name, password_hash, timezone) VALUES ($1, $2, $3, $4, $5)',
        [id, person.email, person.name, passwordHash, 'Europe/London'],
      );
      await topology.global.query('INSERT INTO user_settings (user_id, time_zone) VALUES ($1, $2)', [
        id,
        'Europe/London',
      ]);
    }

    const scope = topology.scopeFor(TEAM_ID);
    const shard = topology.shardDb(scope);
    await shard.query('INSERT INTO teams (id, name) VALUES ($1, $2)', [TEAM_ID, TEAM_NAME]);
    for (const person of PEOPLE) {
      await shard.query('INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, $3)', [
        TEAM_ID,
        userIds.get(person.key),
        person.role,
      ]);
    }

    // Three shifts a week for the next three weeks, rotating through the roster.
    const roster = ['ada', 'ben', 'cleo', 'dana'] as const;
    const shiftIds: string[] = [];
    for (let week = 0; week < 3; week += 1) {
      for (let day = 0; day < 7; day += 2) {
        for (let slot = 0; slot < 2; slot += 1) {
          const key = roster[(week * 7 + day + slot) % roster.length]!;
          const startHour = slot === 0 ? 7 : 15;
          const id = newId();
          shiftIds.push(id);
          await shard.query(
            `INSERT INTO shifts (id, team_id, user_id, starts_at, ends_at, role, location, notes, created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              id,
              TEAM_ID,
              userIds.get(key),
              iso(week * 7 + day, startHour),
              iso(week * 7 + day, startHour + 8),
              startHour === 7 ? 'Opening' : 'Closing',
              'Main floor',
              '',
              userIds.get('ada'),
            ],
          );
        }
      }
    }

    await shard.query(
      `INSERT INTO swap_requests (id, team_id, shift_id, from_user_id, to_user_id, note, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')`,
      [newId(), TEAM_ID, shiftIds[1], userIds.get('cleo'), userIds.get('ben'), 'Dentist appointment, can anyone cover?'],
    );

    const activityRows = [
      { type: 'team.created', actor: 'ada', summary: `${PEOPLE[0].name} created ${TEAM_NAME}` },
      { type: 'member.joined', actor: 'ben', summary: `${PEOPLE[1].name} joined the team` },
      { type: 'swap.requested', actor: 'cleo', summary: `${PEOPLE[2].name} asked to swap a shift` },
    ];
    for (const row of activityRows) {
      await shard.query('INSERT INTO activity (id, team_id, type, actor_id, summary) VALUES ($1, $2, $3, $4, $5)', [
        newId(),
        TEAM_ID,
        row.type,
        userIds.get(row.actor),
        row.summary,
      ]);
    }

    // Bulk activity so the cursor-paginated feed has realistic depth for the
    // k6 200-VU run (load-tests/feed-200vu.js). Batched to keep the parameter
    // count well under Postgres' limit and to avoid 10k round-trips.
    const bulkActivity = 10_000;
    const activityTypes = ['shift.created', 'shift.updated', 'swap.requested', 'swap.decided', 'member.joined'];
    const rosterKeys = ['ada', 'ben', 'cleo', 'dana'] as const;
    const bulkBase = Date.now();
    const batchSize = 500;
    for (let start = 0; start < bulkActivity; start += batchSize) {
      const tuples: string[] = [];
      const values: unknown[] = [];
      const end = Math.min(start + batchSize, bulkActivity);
      for (let index = start; index < end; index += 1) {
        const key = rosterKeys[index % rosterKeys.length]!;
        const offset = values.length;
        tuples.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7})`);
        values.push(
          newId(),
          TEAM_ID,
          activityTypes[index % activityTypes.length],
          userIds.get(key),
          `Shift ${index + 1} scheduled for ${key}`,
          JSON.stringify({ seed: true, n: index }),
          new Date(bulkBase - index * 60_000).toISOString(),
        );
      }
      await shard.query(
        `INSERT INTO activity (id, team_id, type, actor_id, summary, data, created_at)
         VALUES ${tuples.join(', ')}`,
        values,
      );
    }

    const now = new Date();
    const periodEnd = new Date(now.getTime() + 30 * 86_400_000);
    await shard.query(
      `INSERT INTO subscriptions (team_id, plan_key, status, seats, extra_seats, period_start, period_end, next_amount_cents)
       VALUES ($1, 'team', 'active', 15, 0, $2, $3, 5000)
       ON CONFLICT (team_id) DO NOTHING`,
      [TEAM_ID, now.toISOString(), periodEnd.toISOString()],
    );
    await shard.query(
      `INSERT INTO ledger_entries (id, team_id, kind, amount_cents, ref, reason)
       VALUES ($1, $2, 'charge', 5000, 'inv_seed_team_0001', 'Team plan — first month')`,
      [newId(), TEAM_ID],
    );

    log.log(`seed: ${TEAM_NAME} with ${PEOPLE.length} members, ${shiftIds.length} shifts, ${bulkActivity} activity rows`);
    log.log(`seed: sign in as ${PEOPLE[0].email} / ${DEMO_PASSWORD}`);
  } finally {
    await topology.close();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  seed().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export { seed };
