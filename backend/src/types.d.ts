import type { Role } from '@rota/contract';
import type { TeamScope } from './db/types';
import type { AuthUser } from './http/auth';

declare module 'fastify' {
  interface FastifyRequest {
    reqId: string;
    startedAt: number;
    /** filled by requireUser / requireMembership on the hot path */
    authz?: { userId: string; user: AuthUser };
    team?: { scope: TeamScope; role: Role };
  }
}
