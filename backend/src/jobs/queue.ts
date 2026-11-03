import type { Logger } from 'pino';
import { newId } from '../lib/ids';

/**
 * Background work (Rule 01): push, email, webhook processing and renewals are
 * queued here and executed by a worker — never inline in a request.
 *
 * Two drivers behind the same interface (ADR-0008): BullMQ when REDIS_URL is
 * configured, and an in-process driver with the same retry/backoff semantics
 * for hermetic tests and local development.
 */
export interface JobContext {
  queue: string;
  jobId: string;
  attempt: number;
  log: Logger;
}

export type JobHandler = (payload: unknown, ctx: JobContext) => Promise<void>;

export interface JobOptions {
  delayMs?: number;
  attempts?: number;
}

export interface Queue {
  add(queue: string, payload: unknown, options?: JobOptions): Promise<string>;
  register(queue: string, handler: JobHandler): void;
  /** jobs accepted but not finished — tests assert handlers never run inline */
  inFlight(): number;
  /** resolves once every accepted job has finished (tests, graceful shutdown) */
  drain(timeoutMs?: number): Promise<void>;
  /** readiness probe: false when the durable backend is unreachable */
  healthy?(): Promise<boolean>;
  close(): Promise<void>;
}

const DEFAULT_ATTEMPTS = 5;
const BASE_BACKOFF_MS = 500;
const MAX_BACKOFF_MS = 60_000;

export function backoffMs(attempt: number): number {
  return Math.min(BASE_BACKOFF_MS * 2 ** attempt, MAX_BACKOFF_MS);
}

interface PendingJob {
  queue: string;
  jobId: string;
  payload: unknown;
  runAt: number;
  attempts: number;
  attempt: number;
}

export class MemoryQueue implements Queue {
  private readonly handlers = new Map<string, JobHandler>();
  private readonly queue: PendingJob[] = [];
  private readonly timers = new Set<NodeJS.Timeout>();
  private active = 0;
  private idleWaiters: (() => void)[] = [];

  constructor(private readonly log: Logger) {}

  register(queue: string, handler: JobHandler): void {
    this.handlers.set(queue, handler);
  }

  async add(queue: string, payload: unknown, options: JobOptions = {}): Promise<string> {
    const job: PendingJob = {
      queue,
      jobId: newId(),
      payload,
      runAt: Date.now() + (options.delayMs ?? 0),
      attempts: options.attempts ?? DEFAULT_ATTEMPTS,
      attempt: 0,
    };
    this.queue.push(job);
    this.schedule();
    return job.jobId;
  }

  inFlight(): number {
    return this.queue.length + this.active;
  }

  async drain(timeoutMs = 10_000): Promise<void> {
    if (this.inFlight() === 0) return;
    await new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, timeoutMs);
      this.idleWaiters.push(() => {
        clearTimeout(timer);
        resolve();
      });
    });
  }

  async healthy(): Promise<boolean> {
    return true;
  }

  async close(): Promise<void> {
    for (const timer of this.timers) clearTimeout(timer);
    this.timers.clear();
    this.queue.length = 0;
    this.settleIdle();
  }

  private schedule(): void {
    const now = Date.now();
    const next = this.queue.filter((job) => job.runAt <= now);
    if (next.length === 0) return;
    for (const job of next) this.queue.splice(this.queue.indexOf(job), 1);
    for (const job of next) void this.run(job);
    if (this.queue.length > 0) {
      const timer = setTimeout(() => {
        this.timers.delete(timer);
        this.schedule();
      }, Math.max(0, this.queue[0]!.runAt - Date.now()));
      this.timers.add(timer);
    }
  }

  private async run(job: PendingJob): Promise<void> {
    const handler = this.handlers.get(job.queue);
    const started = Date.now();
    this.active += 1;
    job.attempt += 1;
    if (!handler) {
      this.log.error({ queue: job.queue, jobId: job.jobId }, 'no handler registered');
      this.finish();
      return;
    }
    try {
      await handler(job.payload, {
        queue: job.queue,
        jobId: job.jobId,
        attempt: job.attempt,
        log: this.log,
      });
      this.log.info(
        { queue: job.queue, jobId: job.jobId, attempt: job.attempt, result: 'ok', ms: Date.now() - started },
        'job finished',
      );
    } catch (error) {
      const result = job.attempt >= job.attempts ? 'failed' : 'retry';
      this.log.warn(
        { queue: job.queue, jobId: job.jobId, attempt: job.attempt, result, ms: Date.now() - started, err: error },
        'job failed',
      );
      if (job.attempt < job.attempts) {
        job.runAt = Date.now() + backoffMs(job.attempt);
        this.queue.push(job);
        this.schedule();
      }
    } finally {
      this.finish();
    }
  }

  private finish(): void {
    this.active -= 1;
    if (this.inFlight() === 0) this.settleIdle();
  }

  private settleIdle(): void {
    const waiters = this.idleWaiters;
    this.idleWaiters = [];
    for (const wake of waiters) wake();
  }
}

/**
 * BullMQ driver — used in production where REDIS_URL is set. Same `register`
 * / `add` contract, so request code never knows which driver is running.
 */
export class BullMqQueue implements Queue {
  private readonly queues = new Map<string, import('bullmq').Queue>();
  private readonly workers: import('bullmq').Worker[] = [];
  private readonly handlers = new Map<string, JobHandler>();
  private readonly connection: { url: string };

  constructor(
    redisUrl: string,
    private readonly log: Logger,
  ) {
    this.connection = { url: redisUrl };
  }

  register(queue: string, handler: JobHandler): void {
    this.handlers.set(queue, handler);
    void this.ensureWorker(queue);
  }

  async add(queue: string, payload: unknown, options: JobOptions = {}): Promise<string> {
    const { Queue: BullQueue } = await import('bullmq');
    let q = this.queues.get(queue);
    if (!q) {
      q = new BullQueue(queue, { connection: { url: this.connection.url } });
      this.queues.set(queue, q);
    }
    const job = await q.add(queue, payload, {
      delay: options.delayMs,
      attempts: options.attempts ?? DEFAULT_ATTEMPTS,
      backoff: { type: 'exponential', delay: BASE_BACKOFF_MS },
      removeOnComplete: 1000,
      removeOnFail: 5000,
    });
    return String(job.id);
  }

  inFlight(): number {
    return 0;
  }

  async drain(): Promise<void> {
    /* BullMQ workers are durable; draining is the worker's concern */
  }

  async healthy(): Promise<boolean> {
    try {
      const { default: Redis } = await import('ioredis');
      const client = new Redis(this.connection.url, {
        maxRetriesPerRequest: 1,
        lazyConnect: true,
        connectTimeout: 3_000,
      });
      try {
        await client.connect();
        await client.ping();
        return true;
      } finally {
        await client.quit().catch(() => undefined);
      }
    } catch {
      return false;
    }
  }

  async close(): Promise<void> {
    await Promise.all([...this.workers.map((w) => w.close()), ...[...this.queues.values()].map((q) => q.close())]);
  }

  private async ensureWorker(queue: string): Promise<void> {
    if (this.workers.some((w) => w.name === queue)) return;
    const { Worker } = await import('bullmq');
    const handler = this.handlers.get(queue);
    if (!handler) return;
    const worker = new Worker(
      queue,
      async (job) => {
        const started = Date.now();
        try {
          await handler(job.data, { queue, jobId: String(job.id), attempt: job.attemptsMade + 1, log: this.log });
          this.log.info(
            { queue, jobId: job.id, attempt: job.attemptsMade + 1, result: 'ok', ms: Date.now() - started },
            'job finished',
          );
        } catch (error) {
          this.log.warn(
            { queue, jobId: job.id, attempt: job.attemptsMade + 1, result: 'retry', ms: Date.now() - started, err: error },
            'job failed',
          );
          throw error;
        }
      },
      { connection: { url: this.connection.url } },
    );
    this.workers.push(worker);
  }
}

export async function createQueue(redisUrl: string, log: Logger, required = false): Promise<Queue> {
  if (redisUrl) {
    try {
      await import('bullmq');
      const { default: Redis } = await import('ioredis');
      const probe = new Redis(redisUrl, { maxRetriesPerRequest: 1, lazyConnect: true, connectTimeout: 5_000 });
      try {
        await probe.connect();
        await probe.ping();
      } finally {
        await probe.quit().catch(() => undefined);
      }
      return new BullMqQueue(redisUrl, log);
    } catch (error) {
      if (required) {
        throw new Error(`Refusing to start: Redis queue is unavailable (${(error as Error).message})`);
      }
      log.error({ err: error }, 'bullmq unavailable �?" falling back to in-process queue');
    }
  }
  if (required) throw new Error('Refusing to start: REDIS_URL is required in production');
  return new MemoryQueue(log);
}
