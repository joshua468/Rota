import { Role } from '@rota/contract';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { z } from 'zod';
import { useAcceptInvite, useInvite } from '@/api/queries';
import { ApiError } from '@/api/client';
import { Badge, Card, EmptyState, ErrorState, Skeleton } from '@/components';
import { AuthScreen, FormBanner, PrimaryButton } from '@/components/auth';
import { errorMessage } from '@/components/ErrorState';
import { t, type TranslationKey } from '@/i18n';
import { savePendingInviteToken, useSessionStore } from '@/stores/session';
import { createStyles, useTheme } from '@/theme';

const InviteToken = z.string().min(10).max(200);

const ROLE_KEYS: Record<Role, TranslationKey> = {
  owner: 'role.owner',
  admin: 'role.admin',
  manager: 'role.manager',
  member: 'role.member',
};

const useStyles = createStyles((t) => ({
  teamName: {
    ...t.type.titleMedium,
    color: t.color.textPrimary,
  },
  meta: {
    ...t.type.bodyLarge,
    color: t.color.textSecondary,
  },
  body: {
    ...t.type.bodyLarge,
    color: t.color.textSecondary,
  },
  linkRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: t.space[2],
  },
  link: {
    ...t.type.labelLarge,
    color: t.color.link,
  },
  tap: {
    minHeight: t.size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: t.space[2],
  },
}));

export default function InviteScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const params = useLocalSearchParams<{ token: string }>();
  const parsed = InviteToken.safeParse(params.token);
  const token = parsed.success ? parsed.data : undefined;
  const invite = useInvite(token);
  const status = useSessionStore((state) => state.status);
  const accept = useAcceptInvite();
  const max = theme.textScale.maxFontSizeMultiplier;

  useEffect(() => {
    if (token && status === 'signedOut') {
      void savePendingInviteToken(token);
    }
  }, [token, status]);

  if (!parsed.success) {
    return (
      <AuthScreen title={t('invite.title')} subtitle={t('invite.subtitle')}>
        <EmptyState title={t('invite.expired')} body={t('invite.body')} />
      </AuthScreen>
    );
  }

  if (invite.isLoading) {
    return (
      <AuthScreen title={t('invite.title')} subtitle={t('invite.subtitle')}>
        <Skeleton height={80} />
        <Skeleton height={40} />
      </AuthScreen>
    );
  }

  if (invite.isError) {
    const notFound = invite.error instanceof ApiError && invite.error.code === 'NOT_FOUND';
    return (
      <AuthScreen title={t('invite.title')} subtitle={t('invite.subtitle')}>
        {notFound ? (
          <EmptyState title={t('invite.expired')} body={t('invite.body')} />
        ) : (
          <ErrorState error={invite.error} onRetry={() => void invite.refetch()} />
        )}
      </AuthScreen>
    );
  }

  const info = invite.data;
  if (!info) {
    return (
      <AuthScreen title={t('invite.title')} subtitle={t('invite.subtitle')}>
        <EmptyState title={t('invite.expired')} body={t('invite.body')} />
      </AuthScreen>
    );
  }

  const footer =
    status === 'signedIn' ? undefined : (
      <View style={styles.linkRow}>
        <Pressable
          onPress={() => router.push('/(auth)/sign-in')}
          accessibilityRole="link"
          accessibilityLabel={t('auth.signIn')}
          hitSlop={theme.size.touchMin}
          style={styles.tap}
        >
          <Text style={styles.link} maxFontSizeMultiplier={max}>
            {t('auth.signIn')}
          </Text>
        </Pressable>
      </View>
    );

  return (
    <AuthScreen title={t('invite.title')} subtitle={t('invite.subtitle')} footer={footer}>
      <Card>
        <Text style={styles.teamName} maxFontSizeMultiplier={max}>
          {info.teamName}
        </Text>
        <Badge label={t(ROLE_KEYS[info.role])} tone="brand" />
        <Text style={styles.meta} maxFontSizeMultiplier={max}>
          {info.emailMasked}
        </Text>
      </Card>
      <Text style={styles.body} maxFontSizeMultiplier={max}>
        {t('invite.body')}
      </Text>
      {status === 'signedIn' ? (
        <>
          {accept.isError ? (
            <FormBanner
              tone="error"
              message={errorMessage(accept.error)}
              onDismiss={() => accept.reset()}
            />
          ) : null}
          <PrimaryButton
            label={accept.isPending ? t('invite.accepting') : t('invite.accept')}
            onPress={() =>
              accept.mutate(parsed.data, { onSuccess: () => router.replace('/(app)') })
            }
            loading={accept.isPending}
            testID="invite-accept"
          />
        </>
      ) : (
        <PrimaryButton
          label={t('auth.signUp')}
          onPress={() => router.push('/(auth)/sign-up')}
          testID="invite-sign-up"
        />
      )}
    </AuthScreen>
  );
}
