import { Redirect, router } from 'expo-router';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Linking, Platform, Text, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import {
  queryKeys,
  useCheckout,
  useLedgerInfinite,
  usePlans,
  useSettings,
  useSubscription,
  useTeamId,
} from '@/api/queries';
import {
  Badge,
  Banner,
  BackButton,
  Button,
  Card,
  EmptyState,
  ErrorState,
  ListFooter,
  ListRow,
  ListSection,
  Screen,
  Skeleton,
  type ListFooterState,
} from '@/components';
import { errorMessage } from '@/components/ErrorState';
import { t } from '@/i18n';
import { CHECKOUT_CHANNEL, CHECKOUT_COMPLETE, checkoutLaunch } from '@/lib/checkout';
import { appDeepLink } from '@/lib/deepLink';
import { formatDate, formatMoney } from '@/lib/format';
import { resolveProfileZone } from '@/lib/timezone';
import {
  LEDGER_KIND_KEYS,
  SUBSCRIPTION_STATUS_KEYS,
  isAdmin,
  isOwner,
  ledgerKindTone,
  subscriptionStatusTone,
} from '@/lib/rota';
import { useNetStore } from '@/stores/net';
import { useSessionStore } from '@/stores/session';
import { createStyles, useTheme } from '@/theme';
import type { Plan, PlanKey } from '@rota/contract';

const useStyles = createStyles((t) => ({
  stack: {
    gap: t.space[4],
  },
  label: {
    ...t.type.bodySmall,
    color: t.color.textSecondary,
  },
  value: {
    ...t.type.bodyLarge,
    color: t.color.textPrimary,
  },
  strong: {
    ...t.type.titleMedium,
    color: t.color.textPrimary,
  },
  meta: {
    ...t.type.bodySmall,
    color: t.color.textSecondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: t.space[2],
  },
  seatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
  },
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: t.space[2],
  },
}));

export default function BillingSettingsScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const status = useSessionStore((state) => state.status);
  const team = useSessionStore((state) => state.team);
  const isOnline = useNetStore((state) => state.isOnline);
  // Owner/admin may view billing (`billing.read`); only the owner may see the
  // ledger or run checkout (`billing.ledger`/`billing.checkout`).
  const owner = isOwner(team?.role);
  const admin = isAdmin(team?.role);
  const settings = useSettings();
  const timeZone = resolveProfileZone(settings.data?.values.time_zone);
  const plans = usePlans();
  const subscription = useSubscription();
  const ledger = useLedgerInfinite({ enabled: owner });
  const checkout = useCheckout();
  const teamId = useTeamId();
  const queryClient = useQueryClient();

  const refreshBilling = useCallback(() => {
    if (!teamId) return;
    void queryClient.invalidateQueries({ queryKey: queryKeys.subscription(teamId) });
    void queryClient.invalidateQueries({ queryKey: queryKeys.ledger(teamId) });
  }, [queryClient, teamId]);

  // A web checkout runs in a second tab. The hosted page announces success on
  // the same origin so this tab can refetch without a full reload, which would
  // drop the in-memory web session.
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { type?: unknown } | null;
      if (data?.type === CHECKOUT_COMPLETE) refreshBilling();
    };
    window.addEventListener('message', onMessage);
    const channel =
      typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(CHECKOUT_CHANNEL);
    if (channel) channel.onmessage = onMessage;
    return () => {
      window.removeEventListener('message', onMessage);
      channel?.close();
    };
  }, [refreshBilling]);

  const [seatsByPlan, setSeatsByPlan] = useState<Record<string, number>>({});

  useEffect(() => {
    if (ledger.hasNextPage && !ledger.isFetchingNextPage && !ledger.isFetching) {
      void ledger.fetchNextPage();
    }
  }, [ledger.hasNextPage, ledger.isFetchingNextPage, ledger.isFetching, ledger]);

  if (status !== 'signedIn') {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (!admin) {
    return <Redirect href="/(app)/settings" />;
  }

  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/settings');
  };

  const header = (
    <BackButton
      label={t('common.back')}
      onPress={back}
      testID="billing-back"
    />
  );

  const canBuy = owner;
  const sub = subscription.data;

  // Each plan keeps its own seat count so an owner can size a bigger plan for
  // their whole team before choosing it. Defaults to the team's current size
  // (never below what the plan includes) with the price updating live.
  const defaultSeatsFor = (plan: Plan) =>
    sub?.planKey === plan.key ? sub.seats : Math.max(sub?.seats ?? 0, plan.includedSeats);
  const seatCountFor = (plan: Plan) => seatsByPlan[plan.key] ?? defaultSeatsFor(plan);
  const priceCentsFor = (plan: Plan, seats: number) =>
    plan.priceCents + Math.max(0, seats - plan.includedSeats) * (plan.extraSeatCents ?? 0);
  const setSeatCount = (plan: Plan, next: number) =>
    setSeatsByPlan((prev) => ({ ...prev, [plan.key]: next }));

  const startCheckout = (planKey: PlanKey, seatCount: number) => {
    const launch = checkoutLaunch(Platform.OS, appDeepLink('billing'));
    // Open the tab inside the click so popup blockers allow it; point it at the
    // hosted checkout only once the server returns the URL.
    const popup =
      launch.usePopup && typeof window !== 'undefined' ? window.open('', '_blank') : null;
    checkout.mutate(
      { planKey, seats: seatCount, callbackUrl: launch.callbackUrl },
      {
        onSuccess: (url) => {
          if (popup) popup.location.href = url;
          else void Linking.openURL(url);
        },
        onError: () => popup?.close(),
      },
    );
  };

  const entries = ledger.data?.pages.flatMap((page) => page.items) ?? [];
  const ledgerFooter: ListFooterState = ledger.isFetchingNextPage
    ? 'loading'
    : ledger.isError && entries.length > 0
      ? 'error'
      : ledger.hasNextPage
        ? 'hidden'
        : entries.length > 0
          ? 'end'
          : 'hidden';

  let currentCard: ReactNode;
  if (subscription.isLoading && !subscription.data) {
    currentCard = <Skeleton height={160} />;
  } else if (subscription.isError && !subscription.data) {
    currentCard = <ErrorState error={subscription.error} onRetry={() => void subscription.refetch()} />;
  } else if (!sub) {
    currentCard = <EmptyState title={t('billing.none')} />;
  } else {
    const plan = plans.data?.find((item) => item.key === sub.planKey);
    currentCard = (
      <Card>
        <View style={styles.row}>
          <Text style={styles.strong} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
            {plan?.name ?? sub.planKey}
          </Text>
          <Badge
            label={t(SUBSCRIPTION_STATUS_KEYS[sub.status])}
            tone={subscriptionStatusTone(sub.status)}
          />
        </View>
        <View>
          <Text style={styles.label} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
            {t('billing.nextAmount')}
          </Text>
          <Text style={styles.value} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
            {t('billing.perMonth', { amount: formatMoney(sub.nextAmountCents, 'USD') })}
          </Text>
        </View>
        <View>
          <Text style={styles.label} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
            {t('billing.renewsOn', { date: formatDate(sub.periodEnd, timeZone) })}
          </Text>
          <Text style={styles.meta} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
            {t('billing.seats')}: {sub.seats}
            {sub.extraSeats > 0 ? ` (+${sub.extraSeats})` : ''}
          </Text>
        </View>
        {sub.graceUntil ? (
          <Banner
            tone="warning"
            message={t('billing.grace', { date: formatDate(sub.graceUntil, timeZone) })}
          />
        ) : null}
        {sub.pendingPlanKey ? (
          <Banner
            tone="info"
            message={t('billing.pending', { plan: sub.pendingPlanKey })}
          />
        ) : null}
        {sub.status === 'restricted' ? (
          <Banner tone="error" message={t('billing.restricted.body')} />
        ) : null}
      </Card>
    );
  }

  return (
    <Screen title={t('billing.title')} headerLeft={header} scroll>
      <View style={styles.stack}>
        {!isOnline ? <Banner tone="offline" message={t('offline.billingBlocked')} /> : null}
        {checkout.isError ? (
          <Banner tone="error" message={errorMessage(checkout.error)} onDismiss={() => checkout.reset()} />
        ) : null}
        {!canBuy ? <Banner tone="info" message={t('billing.ownerOnly')} /> : null}

        {currentCard}

        <View style={styles.stack}>
          <Text style={styles.label} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier} accessibilityRole="header">
            {t('billing.plans')}
          </Text>
          {plans.isLoading && !plans.data ? (
            <Skeleton height={180} />
          ) : plans.isError && !plans.data ? (
            <ErrorState error={plans.error} onRetry={() => void plans.refetch()} />
          ) : (
            (plans.data ?? []).map((plan) => {
              const isSelected = sub?.planKey === plan.key;
              const seatCount = seatCountFor(plan);
              const minSeats = Math.max(1, plan.includedSeats);
              const priceCents = priceCentsFor(plan, seatCount);
              return (
                <Card key={plan.key}>
                  <View style={styles.row}>
                    <Text style={styles.strong} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
                      {plan.name}
                    </Text>
                    <Text style={styles.value} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
                      {t('billing.perMonth', { amount: formatMoney(priceCents, plan.currency) })}
                    </Text>
                  </View>
                  <Text style={styles.meta} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
                    {t('billing.includedSeats', { n: plan.includedSeats })}
                  </Text>
                  {plan.extraSeatCents != null ? (
                    <Text style={styles.meta} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
                      {t('billing.extraSeat', { amount: formatMoney(plan.extraSeatCents, plan.currency) })}
                    </Text>
                  ) : null}
                  {canBuy ? (
                    <View style={styles.footerRow}>
                      <View style={styles.seatsRow}>
                        <Text style={styles.label} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
                          {t('billing.seats')}
                        </Text>
                        <Button
                          label="−"
                          variant="ghost"
                          disabled={!isOnline || seatCount <= minSeats}
                          onPress={() => setSeatCount(plan, Math.max(minSeats, seatCount - 1))}
                          accessibilityLabel={`${t('billing.seats')} −`}
                        />
                        <Text style={styles.value} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
                          {seatCount}
                        </Text>
                        <Button
                          label="+"
                          variant="ghost"
                          disabled={!isOnline || seatCount >= plan.maxSeats}
                          onPress={() => setSeatCount(plan, Math.min(plan.maxSeats, seatCount + 1))}
                          accessibilityLabel={`${t('billing.seats')} +`}
                        />
                      </View>
                      <Button
                        label={
                          isSelected ? t('billing.checkout') : t('billing.choose', { plan: plan.name })
                        }
                        variant={isSelected ? 'secondary' : 'primary'}
                        loading={checkout.isPending && checkout.variables?.planKey === plan.key}
                        disabled={!isOnline}
                        onPress={() => startCheckout(plan.key, seatCount)}
                        testID={`billing-choose-${plan.key}`}
                      />
                    </View>
                  ) : null}
                </Card>
              );
            })
          )}
        </View>

        {canBuy ? (
          <View style={styles.stack}>
            <Text style={styles.label} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier} accessibilityRole="header">
              {t('billing.ledger')}
            </Text>
            {ledger.isLoading && !ledger.data ? (
              <Skeleton height={96} />
            ) : ledger.isError && !ledger.data ? (
              <ErrorState error={ledger.error} onRetry={() => void ledger.refetch()} />
            ) : entries.length === 0 ? (
              <EmptyState title={t('billing.ledger.empty')} />
            ) : (
              <View style={styles.stack}>
                <ListSection>
                  {entries.map((entry) => (
                    <ListRow
                      key={entry.id}
                      leading={
                        <Badge label={t(LEDGER_KIND_KEYS[entry.kind])} tone={ledgerKindTone(entry.kind)} />
                      }
                      title={entry.reason}
                      subtitle={formatDate(entry.createdAt, timeZone)}
                      value={formatMoney(entry.amountCents, entry.currency)}
                    />
                  ))}
                </ListSection>
                <ListFooter
                  state={ledgerFooter}
                  onRetry={() => void ledger.fetchNextPage()}
                />
              </View>
            )}
          </View>
        ) : null}
      </View>
    </Screen>
  );
}
