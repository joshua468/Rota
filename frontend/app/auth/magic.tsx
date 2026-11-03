import { useLocalSearchParams, Redirect } from 'expo-router';

export default function AuthMagic() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  return <Redirect href={`/(auth)/magic-link?token=${token ?? ''}`} />;
}
