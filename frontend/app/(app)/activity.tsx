import { FlashList } from '@shopify/flash-list';
import type { ActivityItem } from '@rota/contract';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useMemo, useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useActivityFeed, useSettings } from '@/api/queries';
import {
  BackButton,
  Banner,
  Card,
  EmptyState,
  ErrorState,
  IconButton,
  ListFooter,
  Screen,
  SectionLabel,
  SegmentedControl,
  Skeleton,
  type ListFooterState,
} from '@/components';
import { TAB_BAR_CLEARANCE } from '@/components/home/AppTabBar';
import { t, type TranslationKey } from '@/i18n';
import { formatDateTime, formatTime } from '@/lib/format';
import { resolveProfileZone } from '@/lib/timezone';
import { go } from '@/lib/nav';
import { addDays, dayKey, isScheduler, relativeTime } from '@/lib/rota';
import { useNetStore } from '@/stores/net';
import { useSessionStore } from '@/stores/session';
import { createStyles, useTheme, type Theme } from '@/theme';

type FilterId = 'all' | 'shifts' | 'swaps' | 'team';

const FILTERS: { value: FilterId; labelKey: TranslationKey }[] = [
  { value: 'all', labelKey: 'activity.filter.all' },
  { value: 'shifts', labelKey: 'activity.filter.shifts' },
  { value: 'swaps', labelKey: 'activity.filter.swaps' },
  { value: 'team', labelKey: 'activity.filter.team' },
];

const GROUP_KEYS: Record<'today' | 'yesterday' | 'earlier', TranslationKey> = {
  today: 'activity.group.today',
  yesterday: 'activity.group.yesterday',
  earlier: 'activity.group.earlier',
};

type Group = 'today' | 'yesterday' | 'earlier';

type Row =
  | { kind: 'header'; key: string; label: string }
  | { kind: 'item'; key: string; createdAt: string; item: ActivityItem };

type BucketMeta = {
  icon: keyof typeof Ionicons.glyphMap;
  color: keyof Theme['color'];
  container: keyof Theme['color'];
};

const ACTIVITY_META: Record<FilterId, BucketMeta> = {
  all: { icon: 'pulse-outline', color: 'textSecondary', container: 'surfaceMuted' },
  shifts: { icon: 'calendar-outline', color: 'primary', container: 'primaryContainer' },
  swaps: { icon: 'swap-horizontal-outline', color: 'success', container: 'successContainer' },
  team: { icon: 'people-outline', color: 'link', container: 'surfaceMuted' },
};

/** Exact-type icons so each row reads at a glance, not just by bucket. */
const TYPE_ICONS: Record<string, BucketMeta> = {
  'shift.created': { icon: 'calendar-outline', color: 'primary', container: 'primaryContainer' },
  'shift.updated': { icon: 'create-outline', color: 'primary', container: 'primaryContainer' },
  'shift.deleted': { icon: 'trash-outline', color: 'error', container: 'errorContainer' },
  'swap.requested': { icon: 'swap-horizontal-outline', color: 'success', container: 'successContainer' },
  'swap.approved': { icon: 'checkmark-done-outline', color: 'success', container: 'successContainer' },
  'swap.decided': { icon: 'checkmark-done-outline', color: 'success', container: 'successContainer' },
  'swap.rejected': { icon: 'close-circle-outline', color: 'error', container: 'errorContainer' },
  'member.joined': { icon: 'person-add-outline', color: 'link', container: 'surfaceMuted' },
  'member.removed': { icon: 'person-remove-outline', color: 'error', container: 'errorContainer' },
  'invite.sent': { icon: 'mail-outline', color: 'link', container: 'surfaceMuted' },
  'team.created': { icon: 'people-outline', color: 'link', container: 'surfaceMuted' },
};

function metaFor(type: string, bucket: FilterId): BucketMeta {
  return TYPE_ICONS[type] ?? ACTIVITY_META[bucket];
}

function isShiftType(type: string): boolean {
  return type.startsWith('shift.');
}

/** Last-resort row copy when the server stored an empty summary. */
function fallbackHeadline(item: ActivityItem): string {
  const name = item.actor?.name;
  const verb = item.type.includes('created') || item.type.includes('joined')
    ? 'created'
    : item.type.includes('deleted') || item.type.includes('removed')
      ? 'removed'
      : item.type.includes('swap')
        ? 'requested a swap'
        : 'updated';
  return name ? `${name} ${verb}` : verb;
}

function targetOf(bucket: FilterId) {
  return bucket === 'swaps' ? '/swap' : bucket === 'team' ? '/settings/team' : '/';
}

const useStyles = createStyles((t) => ({
  filled: {
    flex: 1,
    gap: t.space[3],
  },
  list: {
    flex: 1,
  },
  groupHeader: {
    paddingTop: t.space[3],
    paddingBottom: t.space[2],
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[3],
  },
  pressArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[3],
  },
  grow: {
    flex: 1,
    gap: t.space[1],
  },
  listContent: {
    paddingBottom: t.space[6] + TAB_BAR_CLEARANCE,
  },
  itemWrap: {
    marginBottom: t.space[3],
  },
  summary: {
    ...t.type.bodyLarge,
    color: t.color.textPrimary,
  },
  meta: {
    ...t.type.bodySmall,
    color: t.color.textMuted,
  },
  iconWrap: {
    width: t.space[9],
    height: t.space[9],
    borderRadius: t.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWrap: {
    paddingTop: t.space[4],
  },
  updated: {
    ...t.type.bodySmall,
    color: t.color.textMuted,
  },
}));

function bucketOf(type: string): FilterId {
  const value = type.toLowerCase();
  if (value.includes('swap')) return 'swaps';
  if (value.includes('shift') || value.includes('rota') || value.includes('schedule')) return 'shifts';
  if (value.includes('member') || value.includes('team') || value.includes('invite') || value.includes('role')) {
    return 'team';
  }
  return 'all';
}

function groupOf(iso: string): Group {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'earlier';
  const now = new Date();
  const key = dayKey(date);
  if (key === dayKey(now)) return 'today';
  if (key === dayKey(addDays(now, -1))) return 'yesterday';
  return 'earlier';
}

export default function ActivityScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const status = useSessionStore((state) => state.status);
  const team = useSessionStore((state) => state.team);
  const canSchedule = isScheduler(team?.role);
  const isOnline = useNetStore((state) => state.isOnline);
  const settings = useSettings();
  const timeZone = resolveProfileZone(settings.data?.values.time_zone);
  const feed = useActivityFeed();

  const [filter, setFilter] = useState<FilterId>('all');

  const items = useMemo(() => feed.data?.pages.flatMap((page) => page.items) ?? [], [feed.data]);

  const refreshedAt = feed.dataUpdatedAt > 0 ? new Date(feed.dataUpdatedAt).toISOString() : null;

  const rows = useMemo<Row[]>(() => {
    const visible = items.filter((item) => filter === 'all' || bucketOf(item.type) === filter);
    const built: Row[] = [];
    let lastGroup: Group | null = null;
    for (const item of visible) {
      const group = groupOf(item.createdAt);
      if (group !== lastGroup) {
        built.push({ kind: 'header', key: `header-${group}-${built.length}`, label: t(GROUP_KEYS[group]) });
        lastGroup = group;
      }
      built.push({ kind: 'item', key: item.id, createdAt: item.createdAt, item });
    }
    return built;
  }, [filter, items]);

  const footerState: ListFooterState = feed.isFetchingNextPage
    ? 'loading'
    : feed.isError && items.length > 0
      ? 'error'
      : feed.hasNextPage
        ? 'hidden'
        : rows.length > 0
          ? 'end'
          : 'hidden';

  if (status !== 'signedIn') {
    return <Redirect href="/(auth)/sign-in" />;
  }

  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(app)');
  };

  let body: ReactNode;
  if (feed.isLoading && !feed.data) {
    body = (
      <View style={styles.emptyWrap}>
        <Skeleton height={76} />
        <Skeleton height={76} />
        <Skeleton height={76} />
        <Skeleton height={76} />
      </View>
    );
  } else if (feed.isError && !feed.data) {
    body = <ErrorState error={feed.error} onRetry={() => void feed.refetch()} />;
  } else if (rows.length === 0) {
    body = (
      <EmptyState
        icon={
          <Ionicons name="pulse-outline" size={theme.size.iconLg} color={theme.color.primary} />
        }
        title={t('activity.empty.title')}
        body={t('activity.empty.body')}
      />
    );
  } else {
    body = (
      <FlashList
        style={styles.list}
        data={rows}
        keyExtractor={(row) => row.key}
        getItemType={(row) => row.kind}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (feed.hasNextPage && !feed.isFetchingNextPage) void feed.fetchNextPage();
        }}
        refreshing={feed.isRefetching && !feed.isFetchingNextPage}
        onRefresh={() => void feed.refetch()}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <ListFooter state={footerState} onRetry={() => void feed.fetchNextPage()} />
        }
        renderItem={({ item: row }) => {
          if (row.kind === 'header') {
            return (
              <View style={styles.groupHeader}>
                <SectionLabel label={row.label} />
              </View>
            );
          }
          const relative = relativeTime(row.createdAt);
          const bucket = bucketOf(row.item.type);
          const meta = metaFor(row.item.type, bucket);
          const shiftId =
            typeof row.item.data?.shiftId === 'string' ? row.item.data.shiftId : undefined;
          const canEditShift = shiftId != null && isShiftType(row.item.type) && canSchedule;
          // Prefer the server summary (it already carries real names and a
          // specific verb); fall back to the actor + a verb from the type.
          const headline = row.item.summary || fallbackHeadline(row.item);
          return (
            <View style={styles.itemWrap}>
              <Card>
                <View style={styles.itemRow}>
                  <Pressable
                    onPress={() => go(targetOf(bucket))}
                    accessibilityRole="button"
                    accessibilityLabel={`${row.item.actor?.name ? `${row.item.actor.name}. ` : ''}${headline}`}
                    style={styles.pressArea}
                  >
                    <View style={[styles.iconWrap, { backgroundColor: theme.color[meta.container] }]}>
                      <Ionicons name={meta.icon} size={theme.size.iconMd} color={theme.color[meta.color]} />
                    </View>
                    <View style={styles.grow}>
                      <Text
                        style={styles.summary}
                        maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
                      >
                        {headline}
                      </Text>
                      <Text
                        style={styles.meta}
                        maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
                      >
                        {t(relative.key, relative.params)} · {formatDateTime(row.createdAt, timeZone)}
                      </Text>
                    </View>
                  </Pressable>
                  {canEditShift ? (
                    <IconButton
                      icon={<Ionicons name="create-outline" size={theme.size.iconMd} color={theme.color.primary} />}
                      label={t('shift.edit')}
                      onPress={() => go(`/shift/new?editId=${shiftId}`)}
                      testID={`activity-edit-${shiftId}`}
                    />
                  ) : null}
                </View>
              </Card>
            </View>
          );
        }}
      />
    );
  }

  return (
    <Screen
      title={t('activity.title')}
      headerLeft={<BackButton label={t('common.back')} onPress={back} testID="activity-back" />}
      scroll={false}
    >
      <View style={[styles.filled]}>
        {!isOnline ? <Banner tone="offline" message={t('offline.banner')} /> : null}
        <SegmentedControl
          options={FILTERS.map((option) => ({ value: option.value, label: t(option.labelKey) }))}
          value={filter}
          onChange={(value) => setFilter(value as FilterId)}
          accessibilityLabel={t('activity.filterLabel')}
          testID="activity-filter"
        />
        {refreshedAt ? (
          <Text
            style={styles.updated}
            maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
            testID="activity-last-updated"
          >
            {t('offline.lastUpdated', { time: formatTime(refreshedAt, timeZone) })}
          </Text>
        ) : null}
        {body}
      </View>
    </Screen>
  );
}
