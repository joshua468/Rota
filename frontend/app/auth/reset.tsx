import { useLocalSearchParams, Redirect } from 'expo-router';

export default function AuthReset() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  return <Redirect href={`/(auth)/reset-password?token=${token ?? ''}`} />;
}
