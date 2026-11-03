import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Remote push is unsupported in Expo Go on Android: importing `expo-notifications`
 * throws there at module-evaluation time (its auto-registration side effect calls
 * `warnOfExpoGoPushUsage`). Never touch the module in that environment.
 *
 * `ExecutionEnvironment` is a *named* export of `expo-constants`; it is not a
 * property of the default `Constants` object. Reading `Constants.ExecutionEnvironment`
 * yields `undefined` (the type is `Record<string, any>`, so TypeScript cannot catch
 * it) and `.StoreClient` then throws on every Android build, which takes the whole
 * push registration down with it.
 */
export function pushUnavailable(): boolean {
  return (
    Platform.OS === 'web' ||
    (Platform.OS === 'android' &&
      Constants.executionEnvironment === ExecutionEnvironment.StoreClient)
  );
}
