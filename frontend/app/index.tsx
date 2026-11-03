import { Redirect } from 'expo-router';
import { useOnboardingStore } from '@/stores/onboarding';
import { useSessionStore } from '@/stores/session';
import { sessionDestination } from '@/lib/teamSetup';
import { SEED, DEMO_SELF, DEMO_TEAM } from '@/lib/demo';
import { useEffect } from 'react';

export default function RootIndex() {
  const session = useSessionStore((s) => s.status);
  const team = useSessionStore((s) => s.team);
  const identityResolved = useSessionStore((s) => s.identityResolved);
  const onboarding = useOnboardingStore((s) => s.status);

  const isSeed = SEED;
  useEffect(() => {
    if (isSeed) {
      const st = useSessionStore.getState();
      if (st.status !== 'signedIn') {
        useSessionStore.setState({ status: 'signedIn', user: DEMO_SELF, team: DEMO_TEAM, identityResolved: true, accessToken: 'seed' });
      }
      useOnboardingStore.setState({ status: 'done' } as any);
    }
  }, [isSeed]);

  if (isSeed) return <Redirect href="/(app)" />;
  if (onboarding === 'loading' || session === 'loading') return null;
  if (session === 'signedIn') {
    // The team is unknown until `/v1/me` answers; the app layout waits for it.
    if (!identityResolved) return <Redirect href="/(app)" />;
    return <Redirect href={sessionDestination(team)} />;
  }
  if (onboarding === 'fresh') return <Redirect href="/onboarding" />;
  return <Redirect href="/(auth)/sign-up" />;
}

