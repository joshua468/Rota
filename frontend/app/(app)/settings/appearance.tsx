import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { usePatchSettings, useSettings } from '@/api/queries';
import { BackButton, Banner, Card, Screen, SegmentedControl, Skeleton, Toast } from '@/components';
import { errorMessage } from '@/components/ErrorState';
import { t } from '@/i18n';
import { useNetStore } from '@/stores/net';
import { useSessionStore } from '@/stores/session';
import { createStyles } from '@/theme';

const THEMES = [
  { value: 'system', label: t('settings.theme.system') },
  { value: 'light', label: t('settings.theme.light') },
  { value: 'dark', label: t('settings.theme.dark') },
  { value: 'sage', label: t('settings.theme.sage') },
];

const useStyles = createStyles((t) => ({
  stack: {
    gap: t.space[4],
  },
}));

export default function AppearanceSettingsScreen() {
  const styles = useStyles();
  const status = useSessionStore((state) => state.status);
  const isOnline = useNetStore((state) => state.isOnline);
  const settings = useSettings();
  const patch = usePatchSettings();
  const [toast, setToast] = useState<string | null>(null);

  if (status !== 'signedIn') {
    return <Redirect href="/(auth)/sign-in" />;
  }

  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/settings');
  };

  const envelope = settings.data;
  const value = envelope?.values.theme ?? 'system';

  const select = (next: string) => {
    if (next !== 'system' && next !== 'light' && next !== 'dark' && next !== 'sage') return;
    const base = envelope?.updatedAt.theme;
    patch.mutate(
      {
        changes: { theme: next },
        baseUpdatedAt: base ? { theme: base } : undefined,
      },
      { onSuccess: () => setToast(t('settings.saved')) },
    );
  };

  return (
    <Screen
      title={t('settings.appearance')}
      headerLeft={
        <BackButton label={t('common.back')} onPress={back} testID="settings-appearance-back" />
      }
      scroll
    >
      <View style={styles.stack}>
        {!isOnline ? <Banner tone="offline" message={t('settings.offlineHint')} /> : null}
        {patch.isError ? (
          <Banner tone="error" message={errorMessage(patch.error)} onDismiss={() => patch.reset()} />
        ) : null}
        {!envelope && settings.isLoading ? (
          <Skeleton height={72} />
        ) : (
          <Card>
            <SegmentedControl
              options={THEMES}
              value={value}
              onChange={select}
              accessibilityLabel={t('settings.appearance')}
              testID="appearance-theme"
            />
          </Card>
        )}
      </View>
      <Toast message={toast} tone="success" onDismiss={() => setToast(null)} />
    </Screen>
  );
}
