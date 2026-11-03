import { Ionicons } from '@expo/vector-icons';
import type { Role, SwapRequest } from '@rota/contract';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useDecideSwap, useSettings, useSwaps } from '@/api/queries';
import {
  Avatar,
  BackButton,
  Badge,
  Banner,
  Button,
  Card,
  CardBody,
  CardFooter,
  EmptyState,
  ErrorState,
  Screen,
  SegmentedControl,
  Skeleton,
  Toast,
  type BadgeTone,
} from '@/components';
import { errorMessage } from '@/components/ErrorState';
import { t } from '@/i18n';
import { formatDateTime, formatTimeRange } from '@/lib/format';
import { resolveProfileZone } from '@/lib/timezone';
import { go } from '@/lib/nav';
import { canRespondToSwap, SWAP_STATUS_KEYS, swapStatusTone } from '@/lib/rota';
import { useNetStore } from '@/stores/net';
import { useSessionStore } from '@/stores/session';
import { createStyles, useTheme } from '@/theme';

type SwapTab = 'pending' | 'available' | 'mine' | 'history';

const TABS: { value: SwapTab; label: string }[] = [
  { value: 'pending', label: t('swaps.tab.pending') },
  { value: 'available', label: t('swaps.tab.available') },
  { value: 'mine', label: t('swaps.tab.mine') },
  { value: 'history', label: t('swaps.tab.history') },
];

const EMPTY: Record<SwapTab, { title: string; body: string }> = {
  pending: { title: t('swaps.empty.pending.title'), body: t('swaps.empty.pending.body') },
  available: { title: t('swaps.empty.available.title'), body: t('swaps.empty.available.body') },
  mine: { title: t('swaps.empty.mine.title'), body: t('swaps.empty.mine.body') },
  history: { title: t('swaps.empty.history.title'), body: t('swaps.empty.history.body') },
};

const useStyles = createStyles((t) => ({
  stack: {
    gap: t.space[4],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
  },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: t.space[2],
  },
  grow: {
    flex: 1,
    gap: t.space[1],
  },
  people: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
    flex: 1,
  },
  arrow: {
    marginHorizontal: t.space[1],
  },
  person: {
    ...t.type.bodyLarge,
    color: t.color.textPrimary,
  },
  time: {
    ...t.type.titleSmall,
    color: t.color.textPrimary,
  },
  meta: {
    ...t.type.bodySmall,
    color: t.color.textMuted,
  },
  note: {
    ...t.type.bodyLarge,
    color: t.color.textSecondary,
  },
  highlight: {
    borderWidth: t.size.ring,
    borderColor: t.color.primary,
  },
}));

function SwapCard({
  swap,
  timeZone,
  meId,
  role,
  online,
  highlighted,
  onApprove,
  onDecline,
  busy,
}: {
  swap: SwapRequest;
  timeZone?: string;
  meId: string | undefined;
  role: Role | null | undefined;
  online: boolean;
  highlighted: boolean;
  onApprove: () => void;
  onDecline: () => void;
  busy: boolean;
}) {
  const styles = useStyles();
  const theme = useTheme();
  const statusLabel = t(SWAP_STATUS_KEYS[swap.status]);
  const tone: BadgeTone = swapStatusTone(swap.status);
  const actionable = canRespondToSwap(swap, meId, role);

  return (
    <Card flush style={highlighted ? styles.highlight : undefined}>
      <Pressable
        onPress={() => go(`/swap/${swap.id}`)}
        accessibilityRole="button"
        accessibilityLabel={`${swap.fromUser.name} ${statusLabel}`}
      >
        <CardBody>
          <View style={styles.between}>
            <View style={styles.people}>
              <Avatar name={swap.fromUser.name} photo={swap.fromUser.avatarUrl} size="sm" />
              <Ionicons
                name="arrow-forward"
                size={theme.size.iconSm}
                color={theme.color.textMuted}
                style={styles.arrow}
              />
              {swap.toUser ? (
                <Avatar name={swap.toUser.name} photo={swap.toUser.avatarUrl} size="sm" />
              ) : (
                <Badge label={t('swaps.anyone')} tone="neutral" />
              )}
            </View>
            <Badge label={statusLabel} tone={tone} />
          </View>

          <View style={styles.grow}>
            <Text style={styles.time} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
              {formatDateTime(swap.shift.startsAt, timeZone)}
            </Text>
            <Text style={styles.meta} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
              {[swap.shift.role, swap.shift.location].filter(Boolean).join(' · ') ||
                formatTimeRange(swap.shift.startsAt, swap.shift.endsAt, timeZone)}
            </Text>
          </View>

          {swap.note ? (
            <Text style={styles.note} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
              {swap.note}
            </Text>
          ) : null}

          <Text style={styles.meta} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
            {formatDateTime(swap.createdAt, timeZone)}
          </Text>
        </CardBody>
      </Pressable>

      {actionable ? (
        <CardFooter>
          <Button
            label={t('swaps.decline')}
            variant="ghost"
            disabled={!online || busy}
            onPress={onDecline}
            testID={`swap-decline-${swap.id}`}
          />
          <Button
            label={t('swaps.approve')}
            disabled={!online || busy}
            loading={busy}
            onPress={onApprove}
            testID={`swap-approve-${swap.id}`}
          />
        </CardFooter>
      ) : null}
    </Card>
  );
}

export default function SwapsScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const status = useSessionStore((state) => state.status);
  const meId = useSessionStore((state) => state.user?.id);
  const teamRole = useSessionStore((state) => state.team?.role);
  const isOnline = useNetStore((state) => state.isOnline);
  const settings = useSettings();
  const timeZone = resolveProfileZone(settings.data?.values.time_zone);
  const params = useLocalSearchParams<{ highlight?: string }>();
  const highlight = typeof params.highlight === 'string' ? params.highlight : undefined;

  const [tab, setTab] = useState<SwapTab>('pending');
  const [toast, setToast] = useState<string | null>(null);
  const swaps = useSwaps();
  const decide = useDecideSwap();

  if (status !== 'signedIn') {
    return <Redirect href="/(auth)/sign-in" />;
  }

  const all = swaps.data?.items ?? [];
  const buckets: Record<SwapTab, SwapRequest[]> = {
    pending: all.filter((swap) => swap.status === 'pending'),
    available: all.filter(
      (swap) => swap.status === 'pending' && swap.toUser == null && swap.fromUser.id !== meId,
    ),
    mine: all.filter((swap) => swap.fromUser.id === meId),
    history: all.filter((swap) => swap.status !== 'pending'),
  };
  const items = buckets[tab];
  const pendingCount = buckets.pending.length;

  const decideOn = (swapId: string, decision: 'approve' | 'reject') =>
    decide.mutate(
      { swapId, decision },
      {
        onSuccess: () =>
          setToast(decision === 'approve' ? t('swap.approved') : t('swap.rejected')),
        onError: () => setToast(errorMessage(decide.error)),
      },
    );

  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(app)');
  };

  let content: ReactNode;
  if (swaps.isLoading && !swaps.data) {
    content = (
      <View style={styles.stack}>
        <Skeleton height={120} />
        <Skeleton height={120} />
        <Skeleton height={120} />
      </View>
    );
  } else if (swaps.isError && !swaps.data) {
    content = <ErrorState error={swaps.error} onRetry={() => void swaps.refetch()} />;
  } else if (items.length === 0) {
    content = (
      <EmptyState
        icon={<Ionicons name="swap-horizontal-outline" size={theme.size.iconLg} color={theme.color.primary} />}
        title={EMPTY[tab].title}
        body={EMPTY[tab].body}
        action={
          <Button
            label={t('swaps.emptyBrowse')}
            onPress={() => go('/(app)', 'navigate')}
            testID="swaps-empty-action"
          />
        }
      />
    );
  } else {
    content = (
      <View style={styles.stack}>
        {items.map((swap) => (
          <SwapCard
            key={swap.id}
            swap={swap}
            timeZone={timeZone}
            meId={meId}
            role={teamRole}
            online={isOnline}
            highlighted={swap.id === highlight}
            busy={decide.isPending}
            onApprove={() => decideOn(swap.id, 'approve')}
            onDecline={() => decideOn(swap.id, 'reject')}
          />
        ))}
      </View>
    );
  }

  return (
    <Screen
      title={t('swaps.title')}
      headerLeft={<BackButton label={t('common.back')} onPress={back} testID="swaps-back" />}
      headerRight={
        pendingCount > 0 ? (
          <Badge label={t('swaps.pendingBadge', { n: pendingCount })} tone="warning" testID="swaps-pending-badge" />
        ) : undefined
      }
      scroll
      refreshing={swaps.isRefetching}
      onRefresh={() => void swaps.refetch()}
    >
      {!isOnline ? <Banner tone="offline" message={t('offline.banner')} /> : null}
      {decide.isError ? (
        <Banner tone="error" message={errorMessage(decide.error)} onDismiss={() => decide.reset()} />
      ) : null}
      <SegmentedControl
        options={TABS}
        value={tab}
        onChange={(value) => setTab(value as SwapTab)}
        accessibilityLabel={t('swaps.title')}
        testID="swaps-filter"
      />
      {content}
      <Toast message={toast} tone="success" onDismiss={() => setToast(null)} />
    </Screen>
  );
}
