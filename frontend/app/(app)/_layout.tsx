import { Redirect, Tabs } from 'expo-router';
import { useSwaps } from '@/api/queries';
import { AppTabBar } from '@/components/home/AppTabBar';
import { needsTeamSetup } from '@/lib/teamSetup';
import { useSessionStore } from '@/stores/session';

type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigateToTab: (routeKey: string) => void;
};

export default function AppLayout() {
  const pendingSwaps = useSwaps('pending');
  const count = pendingSwaps.data?.items.length ?? 0;
  const status = useSessionStore((s) => s.status);
  const team = useSessionStore((s) => s.team);
  const identityResolved = useSessionStore((s) => s.identityResolved);

  // No team means no role, and a role is what the whole app gates on. Send the
  // user to the team step (create = owner, join = the invited role) instead of
  // dropping them into an app that cannot show or change anything. Only once the
  // server confirmed the identity: on a cold start the team is not known yet.
  if (status === 'signedIn' && identityResolved && needsTeamSetup(team)) {
    return <Redirect href="/(auth)/setup-team" />;
  }

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <AppTabBar
          state={props.state as unknown as TabBarProps['state']}
          navigateToTab={props.navigateToTab}
          pendingSwaps={count}
        />
      )}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="swap/index" options={{ title: 'Swaps' }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
      <Tabs.Screen name="swap/[id]" options={{ href: null }} />
      <Tabs.Screen name="shift/[id]" options={{ href: null }} />
      <Tabs.Screen name="shift/new" options={{ href: null }} />
    </Tabs>
  );
}
