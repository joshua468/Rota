/** Team scope carried into every team-scoped query (Rule 05). */
export interface TeamScope {
  readonly teamId: string;
  /** index of the shard this team lives on: fnv1a(teamId) % SHARD_COUNT */
  readonly shard: number;
}

export function fnv1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

export function shardFor(teamId: string, shardCount: number): number {
  return fnv1a(teamId) % shardCount;
}

export interface Queryable {
  query<T = Record<string, unknown>>(sql: string, params?: readonly unknown[]): Promise<T[]>;
  one<T = Record<string, unknown>>(sql: string, params?: readonly unknown[]): Promise<T | undefined>;
  /** multi-statement DDL (migrations), never used with input */
  exec(sql: string): Promise<void>;
  tx<T>(fn: (tx: Queryable) => Promise<T>): Promise<T>;
}

export interface DatabaseHandle extends Queryable {
  close(): Promise<void>;
}
