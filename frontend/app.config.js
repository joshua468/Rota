const base = require('./app.json').expo;

/**
 * Expo config with release metadata that cannot live in app.json:
 * - `EAS_PROJECT_ID` is written by `eas init` / `eas project:init` and is
 *   required for EAS Update. Keeping it in the environment means a fork can
 *   point at its own project without editing committed JSON.
 * - `runtimeVersion` is tied to the app version, so an OTA update can never
 *   land on a binary with an incompatible native layer.
 * - `expo-image-picker` declares the iOS photo-library permission string.
 */
module.exports = ({ config }) => {
  const projectId = process.env.EAS_PROJECT_ID;
  const channel = process.env.EAS_CHANNEL || 'production';
  const plugins = [
    ...(base.plugins || []),
    [
      'expo-image-picker',
      {
        photosPermission: 'Rota uses your photo library so you can choose a profile picture.',
        cameraPermission: false,
      },
    ],
  ];

  return {
    ...base,
    ...config,
    owner: process.env.EAS_OWNER || base.owner,
    runtimeVersion: { policy: 'appVersion' },
    plugins,
    extra: {
      ...(base.extra || {}),
      ...(projectId ? { eas: { projectId } } : {}),
    },
    ...(projectId
      ? {
          updates: {
            url: `https://u.expo.dev/${projectId}`,
            enabled: true,
            checkAutomatically: 'ON_LOAD',
            fallbackToCacheTimeout: 0,
            requestHeaders: { 'expo-channel-name': channel },
          },
        }
      : {}),
  };
};
