import { Ionicons } from '@expo/vector-icons';
import type { SwapRequest } from '@rota/contract';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { useDecideSwap, useSettings, useSwap } from '@/api/queries';
import {
  Avatar,
  Badge,
  Banner,
  BackButton,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Screen,
  Skeleton,
  Toast,
} from '@/components';
import { errorMessage } from '@/components/ErrorState';
import { t } from '@/i18n';
import { formatDateTime, formatTimeRange } from '@/lib/format';
import { resolveProfileZone } from '@/lib/timezone';
import { SWAP_STATUS_KEYS, canRespondToSwap, swapStatusTone } from '@/lib/rota';
import { useNetStore } from '@/stores/net';
import { useSessionStore } from '@/stores/session';
import { createStyles, useTheme } from '@/theme';

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
  people: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[3],
  },
  arrow: {
    marginHorizontal: t.space[1],
  },
  time: {
    ...t.type.titleMedium,
    color: t.color.textPrimary,
  },
  label: {
    ...t.type.bodySmall,
    color: t.color.textSecondary,
  },
  value: {
    ...t.type.bodyLarge,
    color: t.color.textPrimary,
  },
  meta: {
    ...t.type.bodySmall,
    color: t.color.textMuted,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: t.space[2],
  },
}));

export default function SwapDetailScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const params = useLocalSearchParams<{ id: string }>();
  const swapId = typeof params.id === 'string' ? params.id : undefined;
  const query = useSwap(swapId);
  const settings = useSettings();
  const timeZone = resolveProfileZone(settings.data?.values.time_zone);
  const decide = useDecideSwap();
  const meId = useSessionStore((state) => state.user?.id);
  const teamRole = useSessionStore((state) => state.team?.role);
  const status = useSessionStore((state) => state.status);
  const isOnline = useNetStore((state) => state.isOnline);
  const [toast, setToast] = useState<string | null>(null);

  if (status !== 'signedIn') {
    return <Redirect href="/(auth)/sign-in" />;
  }

  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/swap');
  };

  const header = (
    <BackButton
      label={t('common.back')}
      onPress={back}
      testID="swap-back"
    />
  );

  if (query.isLoading && !query.data) {
    return (
      <Screen title={t('swap.title')} headerLeft={header}>
        <View style={styles.stack}>
          <Skeleton height={120} />
          <Skeleton height={80} />
        </View>
      </Screen>
    );
  }

  if (query.isError && !query.data) {
    return (
      <Screen title={t('swap.title')} headerLeft={header}>
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      </Screen>
    );
  }

  const swap: SwapRequest | undefined = query.data;
  if (!swap) {
    return (
      <Screen title={t('swap.title')} headerLeft={header}>
        <EmptyState title={t('error.notFound')} />
      </Screen>
    );
  }

  const canDecide =
    swap.status === 'pending' && canRespondToSwap(swap, meId ?? '', teamRole) && isOnline;

  const decideOn = (decision: 'approve' | 'reject') => {
    decide.mutate(
      { swapId: swap.id, decision },
      {
        onSuccess: () =>
          setToast(decision === 'approve' ? t('swap.approved') : t('swap.rejected')),
      },
    );
  };

  const shiftMeta = [swap.shift.role, swap.shift.location].filter(Boolean).join(' · ');

  return (
    <Screen title={t('swap.title')} headerLeft={header} scroll>
      <View style={styles.stack}>
        {!isOnline ? <Banner tone="offline" message={t('offline.swapBlocked')} /> : null}
        {decide.isError ? (
          <Banner tone="error" message={errorMessage(decide.error)} onDismiss={() => decide.reset()} />
        ) : null}

        <Card>
          <View style={styles.between}>
            <Badge label={t(SWAP_STATUS_KEYS[swap.status])} tone={swapStatusTone(swap.status)} />
            {swap.decidedAt ? (
              <Text style={styles.meta} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
                {t('swap.decidedAt', { time: formatDateTime(swap.decidedAt, timeZone) })}
              </Text>
            ) : null}
          </View>

          <View style={styles.people}>
            <Avatar name={swap.fromUser.name} photo={swap.fromUser.avatarUrl} size="md" />
            <Ionicons
              name="arrow-forward"
              size={theme.size.iconSm}
              color={theme.color.textMuted}
              style={styles.arrow}
            />
            {swap.toUser ? (
              <Avatar name={swap.toUser.name} photo={swap.toUser.avatarUrl} size="md" />
            ) : (
              <Badge label={t('swaps.anyone')} tone="neutral" />
            )}
          </View>

          <View>
            <Text style={styles.time} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
              {formatDateTime(swap.shift.startsAt, timeZone)}
            </Text>
            <Text style={styles.meta} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
              {formatTimeRange(swap.shift.startsAt, swap.shift.endsAt, timeZone)}
            </Text>
          </View>
        </Card>

        <Card>
          <View>
            <Text style={styles.label} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
              {t('swap.from')}
            </Text>
            <Text style={styles.value} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
              {swap.fromUser.name}
            </Text>
          </View>
          <View>
            <Text style={styles.label} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
              {t('swap.to')}
            </Text>
            <Text style={styles.value} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
              {swap.toUser?.name ?? t('swaps.anyone')}
            </Text>
          </View>
          {shiftMeta ? (
            <View>
              <Text style={styles.label} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
                {t('swap.shift')}
              </Text>
              <Text style={styles.value} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
                {shiftMeta}
              </Text>
            </View>
          ) : null}
          {swap.note ? (
            <View>
              <Text style={styles.label} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
                {t('swap.note')}
              </Text>
              <Text style={styles.value} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
                {swap.note}
              </Text>
            </View>
          ) : null}
        </Card>

        {swap.status === 'pending' && !canDecide ? (
          <Banner tone="info" message={t('swap.needDecision')} />
        ) : null}

        <View style={styles.actions}>
          <Button
            label={t('swap.reject')}
            variant="ghost"
            loading={decide.isPending && decide.variables?.decision === 'reject'}
            disabled={!canDecide}
            onPress={() => decideOn('reject')}
            testID="swap-reject"
          />
          <Button
            label={t('swap.approve')}
            loading={decide.isPending && decide.variables?.decision === 'approve'}
            disabled={!canDecide}
            onPress={() => decideOn('approve')}
            testID="swap-approve"
          />
        </View>
      </View>
      <Toast message={toast} tone="success" onDismiss={() => setToast(null)} />
    </Screen>
  );
}
