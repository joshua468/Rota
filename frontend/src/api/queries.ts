import { useEffect, useMemo } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import {
  ActivityItem,
  LedgerEntry,
  PagedResponse,
  Plan,
  PublicUser,
  RequestBodies,
  Role,
  SelfUser,
  SessionPayload,
  SettingsEnvelope,
  Shift,
  SwapRequest,
  Subscription,
  type PlanKey,
  type Settings,
  type SwapStatus,
} from '@rota/contract';
import { z } from 'zod';
import { randomUUID } from '@/lib/randomUUID';
import { clearPersistedCache } from '@/offline/persister';
import { DEMO_MEMBERS, SEED } from '@/lib/demo';
import { optimisticSwapStatus } from '@/lib/rota';
import {
  consumePendingInviteToken,
  getDeviceId,
  getPendingInviteToken,
  getRefreshToken,
  useSessionStore,
} from '@/stores/session';
import { ApiError, apiRequest } from './client';

const TeamMeta = z.object({ id: z.string().min(1), name: z.string(), role: Role });
const InviteAccepted = z.object({ teamId: z.string().min(1), teamName: z.string(), role: Role });

export const MeResponse = z.object({ user: SelfUser, team: TeamMeta.nullable() });
export type MeResponse = z.infer<typeof MeResponse>;

/**
 * Decide what identity to adopt from a `/v1/me` result. When the data was only
 * restored from the persisted cache (`isFetchedAfterMount === false`) the user
 * is kept for display but the team is withheld: a cached team can belong to a
 * previous session and every team-scoped request against it would 404. The team
 * is adopted only once a live response has landed.
 *
 * A cached response also never drops a team the session already knows: a fresh
 * observer mounts with `isFetchedAfterMount === false`, and wiping the team
 * there would drop the role of a signed-in user for a single render.
 */
export function adoptIdentity(
  data: MeResponse | undefined,
  isFetchedAfterMount: boolean,
  currentTeam: MeResponse['team'] = null,
): { user: SelfUser; team: MeResponse['team'] } | null {
  if (!data) return null;
  const team = isFetchedAfterMount ? data.team : currentTeam;
  return { user: data.user, team };
}

export const InviteInfo = z.object({
  teamName: z.string(),
  role: Role,
  emailMasked: z.string(),
  expiresAt: z.string(),
});
export type InviteInfo = z.infer<typeof InviteInfo>;

const CheckoutResponse = z
  .union([z.object({ url: z.string().min(1) }), z.object({ checkoutUrl: z.string().min(1) })])
  .transform((value) => ('url' in value ? value.url : value.checkoutUrl));

type Page<T> = { items: T[]; nextCursor: string | null };

export type ShiftWindow = { from: string; to: string; mine?: boolean };

export const queryKeys = {
  me: () => ['me'] as const,
  settings: () => ['settings'] as const,
  plans: () => ['plans'] as const,
  subscription: (teamId: string) => ['subscription', teamId] as const,
  shifts: (teamId: string, window: ShiftWindow) => ['shifts', teamId, window] as const,
  members: (teamId: string) => ['members', teamId] as const,
  swaps: (teamId: string, status?: SwapStatus) => ['swaps', teamId, status ?? 'all'] as const,
  feed: (teamId: string) => ['feed', teamId] as const,
  ledger: (teamId: string) => ['ledger', teamId] as const,
  invite: (token: string) => ['invite', token] as const,
};

export function useTeamId(): string | null {
  return useSessionStore((state) => state.team?.id ?? null);
}

/**
 * The seeded demo runs without a backend: its session is a fiction, so every
 * authenticated query stays off. Otherwise the demo would fire real requests,
 * get 401s, sign itself out and bounce the user back to the sign-in screen.
 */
function useSignedIn(): boolean {
  const signedIn = useSessionStore((state) => state.status === 'signedIn');
  return signedIn && !SEED;
}

export function useMe() {
  const enabled = useSignedIn();
  const query = useQuery({
    queryKey: queryKeys.me(),
    enabled,
    staleTime: 0,
    networkMode: 'offlineFirst',
    queryFn: async () => MeResponse.parse(await apiRequest('/v1/me', { auth: true })),
  });
  const data = query.data;
  // Adopt identity only from a response fetched in this session. On cold start
  // the persisted React Query cache can restore a `/v1/me` payload that belongs
  // to a previous account; trusting its team would point every team-scoped
  // request at a team the current user cannot see, which the server answers with
  // NOT_FOUND (e.g. the billing screen).
  const isFetched = query.isFetchedAfterMount;
  useEffect(() => {
    const identity = adoptIdentity(data, isFetched, useSessionStore.getState().team);
    if (!identity) return;
    useSessionStore.getState().setIdentity(identity.user, identity.team, isFetched);
  }, [data, isFetched]);
  return query;
}

export function useSettings() {
  const enabled = useSignedIn() || SEED;
  return useQuery({
    queryKey: queryKeys.settings(),
    enabled,
    staleTime: 0,
    networkMode: 'offlineFirst',
    queryFn: async () => {
      if (SEED) {
        return {
          values: { notif_shifts: true, notif_swaps: true, notif_billing: true, quiet_start: null, quiet_end: null, time_zone: null, language: 'en', theme: 'system' },
          updatedAt: new Date().toISOString(),
          conflicts: [],
        } as any;
      }
      return SettingsEnvelope.parse(await apiRequest('/v1/me/settings', { auth: true }));
    },
  });
}

export function usePlans() {
  const enabled = useSignedIn();
  return useQuery({
    queryKey: queryKeys.plans(),
    enabled,
    staleTime: 5 * 60_000,
    queryFn: async () => z.array(Plan).parse(await apiRequest('/v1/plans', { auth: true })),
  });
}

export function useSubscription() {
  const teamId = useTeamId();
  const signedIn = useSignedIn();
  return useQuery({
    queryKey: queryKeys.subscription(teamId ?? ''),
    enabled: signedIn && !!teamId,
    staleTime: 0,
    networkMode: 'online',
    queryFn: async () => {
      try {
        const json = await apiRequest(`/v1/teams/${teamId}/billing/subscription`, {
          auth: true,
        });
        return Subscription.nullable().parse(json);
      } catch (error) {
        if (error instanceof ApiError && error.code === 'NOT_FOUND') return null;
        throw error;
      }
    },
  });
}

export function useLedger() {
  const teamId = useTeamId();
  const signedIn = useSignedIn();
  return useQuery({
    queryKey: queryKeys.ledger(teamId ?? ''),
    enabled: signedIn && !!teamId,
    staleTime: 0,
    networkMode: 'online',
    queryFn: async () => {
      const json = await apiRequest(`/v1/teams/${teamId}/billing/ledger`, {
        auth: true,
        query: { limit: 50 },
      });
      return PagedResponse(LedgerEntry).parse(json) as Page<LedgerEntry>;
    },
  });
}

export function useLedgerInfinite(options: { enabled?: boolean } = {}) {
  const teamId = useTeamId();
  const signedIn = useSignedIn();
  return useInfiniteQuery({
    queryKey: [...queryKeys.ledger(teamId ?? ''), 'infinite'] as const,
    enabled: signedIn && !!teamId && (options.enabled ?? true),
    staleTime: 0,
    networkMode: 'online',
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const json = await apiRequest(`/v1/teams/${teamId}/billing/ledger`, {
        auth: true,
        query: { cursor: pageParam, limit: 20 },
      });
      return PagedResponse(LedgerEntry).parse(json) as Page<LedgerEntry>;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useShifts(window: ShiftWindow, options: { enabled?: boolean } = {}) {
  const teamId = useTeamId();
  const signedIn = useSignedIn();
  const enabled = signedIn && !!teamId && (options.enabled ?? true);
  return useQuery({
    queryKey: queryKeys.shifts(teamId ?? '', window),
    enabled,
    staleTime: 30_000,
    networkMode: 'offlineFirst',
    queryFn: async () => {
      const json = await apiRequest(`/v1/teams/${teamId}/shifts`, {
        auth: true,
        query: {
          from: window.from,
          to: window.to,
          mine: window.mine ? '1' : undefined,
        },
      });
      return PagedResponse(Shift).parse(json) as Page<Shift>;
    },
  });
}

export function useShift(shiftId: string | undefined) {
  const window = useMemo<ShiftWindow>(() => {
    const now = Date.now();
    return {
      from: new Date(now - 30 * 86_400_000).toISOString(),
      to: new Date(now + 90 * 86_400_000).toISOString(),
    };
  }, [shiftId]);
  const query = useShifts(window, { enabled: !!shiftId });
  return {
    data: query.data?.items.find((item) => item.id === shiftId),
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useMembers() {
  const teamId = useTeamId();
  const signedIn = useSignedIn();
  return useQuery({
    queryKey: queryKeys.members(teamId ?? ''),
    enabled: signedIn && !!teamId,
    initialData: SEED ? DEMO_MEMBERS : undefined,
    staleTime: 60_000,
    networkMode: 'offlineFirst',
    queryFn: async () =>
      z.array(PublicUser).parse(await apiRequest(`/v1/teams/${teamId}/members`, { auth: true })),
  });
}

export function useSwaps(status?: SwapStatus) {
  const teamId = useTeamId();
  const signedIn = useSignedIn();
  return useQuery({
    queryKey: queryKeys.swaps(teamId ?? '', status),
    enabled: signedIn && !!teamId,
    staleTime: 0,
    networkMode: 'offlineFirst',
    queryFn: async () => {
      const json = await apiRequest(`/v1/teams/${teamId}/swaps`, {
        auth: true,
        query: { status, limit: 50 },
      });
      return PagedResponse(SwapRequest).parse(json) as Page<SwapRequest>;
    },
  });
}

export function useSwap(swapId: string | undefined) {
  const query = useSwaps();
  return {
    data: query.data?.items.find((item) => item.id === swapId),
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useActivityFeed() {
  const teamId = useTeamId();
  const signedIn = useSignedIn();
  return useInfiniteQuery({
    queryKey: queryKeys.feed(teamId ?? ''),
    enabled: signedIn && !!teamId,
    staleTime: 0,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const json = await apiRequest(`/v1/teams/${teamId}/activity`, {
        auth: true,
        query: { cursor: pageParam, limit: 20 },
      });
      return PagedResponse(ActivityItem).parse(json) as Page<ActivityItem>;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useInvite(token: string | undefined) {
  const queryToken = token ?? '';
  return useQuery({
    queryKey: queryKeys.invite(queryToken),
    enabled: !!token,
    staleTime: 0,
    networkMode: 'online',
    queryFn: async () =>
      InviteInfo.parse(await apiRequest(`/v1/invites/${encodeURIComponent(queryToken)}`)),
  });
}

async function establishSession(queryClient: QueryClient, session: SessionPayload): Promise<void> {
  queryClient.clear();
  await clearPersistedCache();
  await useSessionStore.getState().setSession(session);
  const pending = await getPendingInviteToken();
  if (!pending) return;
  try {
    await apiRequest(`/v1/invites/${encodeURIComponent(pending)}/accept`, {
      method: 'POST',
      auth: true,
      body: RequestBodies.acceptInvite.parse({ token: pending }),
    });
  } catch {
    return;
  }
  await consumePendingInviteToken();
  await queryClient.invalidateQueries({ queryKey: queryKeys.me() });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    networkMode: 'offlineFirst',
    mutationFn: async (vars: { email: string; password: string }) => {
      const body = RequestBodies.login.parse({ ...vars, deviceId: await getDeviceId() });
      return SessionPayload.parse(await apiRequest('/v1/auth/login', { method: 'POST', body }));
    },
    onSuccess: async (session) => {
      await establishSession(queryClient, session);
    },
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  return useMutation({
    networkMode: 'offlineFirst',
    mutationFn: async (vars: { email: string; password: string; name: string }) => {
      const inviteToken = (await getPendingInviteToken()) ?? undefined;
      const body = RequestBodies.signup.parse({ ...vars, inviteToken });
      return SessionPayload.parse(
        await apiRequest('/v1/auth/signup', { method: 'POST', body }),
      );
    },
    onSuccess: async (session) => {
      await establishSession(queryClient, session);
    },
  });
}

export function useMagicStart() {
  return useMutation({
    networkMode: 'offlineFirst',
    mutationFn: async (vars: { email: string }) => {
      const body = RequestBodies.magicStart.parse(vars);
      await apiRequest('/v1/auth/magic', { method: 'POST', body });
    },
  });
}

export function useMagicConsume() {
  const queryClient = useQueryClient();
  return useMutation({
    networkMode: 'offlineFirst',
    mutationFn: async (vars: { token: string }) => {
      const body = RequestBodies.magicConsume.parse({
        token: vars.token,
        deviceId: await getDeviceId(),
      });
      return SessionPayload.parse(
        await apiRequest('/v1/auth/magic/consume', { method: 'POST', body }),
      );
    },
    onSuccess: async (session) => {
      await establishSession(queryClient, session);
    },
  });
}

export function useForgot() {
  return useMutation({
    networkMode: 'offlineFirst',
    mutationFn: async (vars: { email: string }) => {
      const body = RequestBodies.forgot.parse(vars);
      await apiRequest('/v1/auth/forgot', { method: 'POST', body });
    },
  });
}

export function useReset() {
  return useMutation({
    networkMode: 'offlineFirst',
    mutationFn: async (vars: { token: string; password: string }) => {
      const body = RequestBodies.reset.parse(vars);
      await apiRequest('/v1/auth/reset', { method: 'POST', body });
    },
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { name: string }) => {
      const body = RequestBodies.createTeam.parse(vars);
      return TeamMeta.parse(await apiRequest('/v1/teams', { method: 'POST', auth: true, body }));
    },
    onSuccess: async (created) => {
      // Adopt the new team (and the owner role) straight away: the app has to
      // know the access level of the signed-in user before the first team-scoped
      // request goes out, and `/v1/me` may still be in flight.
      const { user } = useSessionStore.getState();
      if (user) useSessionStore.getState().setIdentity(user, created);
      await queryClient.invalidateQueries({ queryKey: queryKeys.me() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.settings() });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) return;
      try {
        await apiRequest('/v1/auth/logout', {
          method: 'POST',
          body: RequestBodies.logout.parse({ refreshToken }),
        });
      } catch {
        return;
      }
    },
    onSettled: async () => {
      useSessionStore.getState().clear();
      queryClient.clear();
      await clearPersistedCache();
    },
  });
}

export function useLogoutAll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        await apiRequest('/v1/auth/logout-all', {
          method: 'POST',
          auth: true,
        });
      } catch {
        return;
      }
    },
    onSettled: async () => {
      useSessionStore.getState().clear();
      queryClient.clear();
      await clearPersistedCache();
    },
  });
}

export function useAcceptInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (token: string) => {
      const body = RequestBodies.acceptInvite.parse({ token });
      return InviteAccepted.parse(
        await apiRequest(`/v1/invites/${encodeURIComponent(token)}/accept`, {
          method: 'POST',
          auth: true,
          body,
        }),
      );
    },
    onSuccess: async (accepted) => {
      // The role comes from the invite, never from the client (Rule 01); adopt it
      // now so the app knows the access level before `/v1/me` lands.
      const { user } = useSessionStore.getState();
      if (user) {
        useSessionStore
          .getState()
          .setIdentity(user, { id: accepted.teamId, name: accepted.teamName, role: accepted.role });
      }
      await queryClient.invalidateQueries({ queryKey: queryKeys.me() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.settings() });
    },
  });
}

export function usePatchSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      changes: Partial<Settings>;
      baseUpdatedAt?: Record<string, string>;
    }) => {
      if (SEED) {
        const previous = queryClient.getQueryData<any>(queryKeys.settings());
        return {
          values: { ...(previous?.values || {}), ...vars.changes },
          updatedAt: new Date().toISOString(),
          conflicts: [],
        } as any;
      }
      const body = RequestBodies.patchSettings.parse(vars);
      return SettingsEnvelope.parse(
        await apiRequest('/v1/me/settings', { method: 'PATCH', auth: true, body }),
      );
    },
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.settings() });
      const previous = queryClient.getQueryData<SettingsEnvelope>(queryKeys.settings());
      if (previous) {
        queryClient.setQueryData<SettingsEnvelope>(queryKeys.settings(), {
          ...previous,
          values: { ...previous.values, ...vars.changes },
        });
      }
      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData<SettingsEnvelope>(queryKeys.settings(), context.previous);
      }
    },
    onSuccess: (envelope) => {
      queryClient.setQueryData<SettingsEnvelope>(queryKeys.settings(), envelope);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.settings() });
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      dataBase64: string;
      contentType: 'image/jpeg' | 'image/png' | 'image/webp';
    }) => {
      const body = RequestBodies.putAvatar.parse(vars);
      return apiRequest<{ avatarUrl: string; updatedAt: string }>('/v1/me/avatar', {
        method: 'PUT',
        auth: true,
        body,
      });
    },
    onSuccess: async (result) => {
      // The signed-in user sees their own picture straight away; the roster and
      // the session payload catch up with the next `/v1/me`.
      const { user, team } = useSessionStore.getState();
      if (user) useSessionStore.getState().setIdentity({ ...user, avatarUrl: result.avatarUrl }, team);
      await queryClient.invalidateQueries({ queryKey: queryKeys.me() });
      void queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
}

export function useRemoveAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await apiRequest('/v1/me/avatar', { method: 'DELETE', auth: true });
    },
    onSuccess: async () => {
      const { user, team } = useSessionStore.getState();
      if (user) useSessionStore.getState().setIdentity({ ...user, avatarUrl: null }, team);
      await queryClient.invalidateQueries({ queryKey: queryKeys.me() });
      void queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
}

export function useCheckout() {
  const teamId = useTeamId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { planKey: PlanKey; seats: number; callbackUrl?: string }) => {
      if (!teamId) throw new ApiError('FORBIDDEN', 403, 'No team selected');
      const body = RequestBodies.checkout.parse(vars);
      const json = await apiRequest(`/v1/teams/${teamId}/billing/checkout`, {
        method: 'POST',
        auth: true,
        body,
        idempotencyKey: randomUUID(),
      });
      return CheckoutResponse.parse(json);
    },
    onSuccess: async () => {
      if (teamId) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.subscription(teamId) });
      }
    },
  });
}

export function useCreateInvite() {
  const teamId = useTeamId();
  return useMutation({
    mutationFn: async (vars: { email: string; role: 'admin' | 'manager' | 'member' }) => {
      if (!teamId) throw new ApiError('FORBIDDEN', 403, 'No team selected');
      const body = RequestBodies.createInvite.parse(vars);
      return apiRequest(`/v1/teams/${teamId}/invites`, {
        method: 'POST',
        auth: true,
        body,
        idempotencyKey: randomUUID(),
      });
    },
  });
}

export function useRemoveMember() {
  const teamId = useTeamId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      if (!teamId) throw new ApiError('FORBIDDEN', 403, 'No team selected');
      await apiRequest(`/v1/teams/${teamId}/members/${userId}`, {
        method: 'DELETE',
        auth: true,
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['members'] });
      void queryClient.invalidateQueries({ queryKey: queryKeys.me() });
    },
  });
}

export function useCreateShift() {
  const teamId = useTeamId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: z.infer<typeof RequestBodies.createShift>) => {
      if (!teamId) throw new ApiError('FORBIDDEN', 403, 'No team selected');
      const body = RequestBodies.createShift.parse(vars);
      return Shift.parse(
        await apiRequest(`/v1/teams/${teamId}/shifts`, {
          method: 'POST',
          auth: true,
          body,
          idempotencyKey: randomUUID(),
        }),
      );
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['shifts'] });
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useUpdateShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { shiftId: string } & z.infer<typeof RequestBodies.updateShift>) => {
      const { shiftId, ...changes } = vars;
      const body = RequestBodies.updateShift.parse(changes);
      return Shift.parse(
        await apiRequest(`/v1/shifts/${shiftId}`, { method: 'PATCH', auth: true, body }),
      );
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['shifts'] });
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useDeleteShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (shiftId: string) => {
      await apiRequest(`/v1/shifts/${shiftId}`, { method: 'DELETE', auth: true });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['shifts'] });
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useCreateSwap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      shiftId: string;
      toUserId?: string;
      note?: string;
    }) => {
      const body = RequestBodies.createSwapRequest.parse({
        toUserId: vars.toUserId,
        note: vars.note,
      });
      return SwapRequest.parse(
        await apiRequest(`/v1/shifts/${vars.shiftId}/swap-requests`, {
          method: 'POST',
          auth: true,
          body,
          idempotencyKey: randomUUID(),
        }),
      );
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['swaps'] });
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useDecideSwap() {
  const queryClient = useQueryClient();
  const meId = useSessionStore((state) => state.user?.id);
  return useMutation({
    mutationFn: async (vars: { swapId: string; decision: 'approve' | 'reject' }) => {
      const body = RequestBodies.decideSwap.parse({ decision: vars.decision });
      return SwapRequest.parse(
        await apiRequest(`/v1/swaps/${vars.swapId}/decision`, {
          method: 'POST',
          auth: true,
          body,
          idempotencyKey: randomUUID(),
        }),
      );
    },
    // Optimistic (mobile-engineer standard): flip the swap's status locally so
    // the approve/decline feels instant; roll back the snapshot on error and
    // always reconcile with the server afterwards.
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ['swaps'] });
      const snapshot = queryClient.getQueriesData<Page<SwapRequest>>({ queryKey: ['swaps'] });
      queryClient.setQueriesData<Page<SwapRequest>>({ queryKey: ['swaps'] }, (page) => {
        if (!page) return page;
        return {
          ...page,
          items: page.items.map((swap) => {
            if (swap.id !== vars.swapId) return swap;
            const status = optimisticSwapStatus(swap.fromUser.id, vars.decision, meId);
            return { ...swap, status, decidedAt: new Date().toISOString() };
          }),
        };
      });
      return { snapshot };
    },
    onError: (_error, _vars, context) => {
      if (!context?.snapshot) return;
      for (const [key, data] of context.snapshot) queryClient.setQueryData(key, data);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['swaps'] });
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}
