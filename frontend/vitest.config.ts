import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'react-native': fileURLToPath(new URL('./src/test/rn-stub.ts', import.meta.url)),
      'expo-constants': fileURLToPath(new URL('./src/test/expo-constants-stub.ts', import.meta.url)),
      '@react-native-async-storage/async-storage': fileURLToPath(
        new URL('./src/test/async-storage-stub.ts', import.meta.url),
      ),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    env: {
      EXPO_PUBLIC_API_URL: 'http://localhost:4000',
      EXPO_PUBLIC_APP_SCHEME: 'rota',
      EXPO_PUBLIC_SENTRY_DSN: '',
    },
  },
});
