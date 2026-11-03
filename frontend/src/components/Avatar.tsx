import { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  Text,
  View,
  type ImageSourcePropType,
  type ViewStyle,
} from 'react-native';
import { avatarNeedsAuth, avatarSource, initials } from '@/lib/avatar';
import { useSessionStore } from '@/stores/session';
import { createStyles, useTheme } from '@/theme';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export type AvatarProps = {
  name: string;
  size?: AvatarSize;
  /** the person's own uploaded photo (API path or absolute URL) */
  photo?: string | null;
  accessibilityLabel?: string;
  testID?: string;
  style?: ViewStyle;
};

const useStyles = createStyles((t) => ({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.full,
    overflow: 'hidden',
  },
  sm: {
    width: t.size.avatarSm,
    height: t.size.avatarSm,
  },
  md: {
    width: t.size.avatarMd,
    height: t.size.avatarMd,
  },
  lg: {
    width: t.size.avatarLg,
    height: t.size.avatarLg,
  },
  xl: {
    width: t.size.avatarXl,
    height: t.size.avatarXl,
  },
  toneA: {
    backgroundColor: t.color.surfaceWarm,
  },
  toneB: {
    backgroundColor: t.color.tertiaryContainer,
  },
  toneC: {
    backgroundColor: t.color.successContainer,
  },
  toneD: {
    backgroundColor: t.color.warningContainer,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  onToneA: {
    color: t.color.onPrimaryContainer,
  },
  onToneB: {
    color: t.color.onTertiaryContainer,
  },
  onToneC: {
    color: t.color.onSuccessContainer,
  },
  onToneD: {
    color: t.color.onWarningContainer,
  },
  initialsSm: {
    ...t.type.labelMedium,
  },
  initialsMd: {
    ...t.type.labelLarge,
  },
  initialsLg: {
    ...t.type.titleMedium,
  },
  initialsXl: {
    ...t.type.titleLarge,
  },
}));

function useAvatarImageSource(
  source: string | undefined,
  requiresAuth: boolean,
): ImageSourcePropType | undefined {
  const accessToken = useSessionStore((state) => state.accessToken);
  const [authenticatedWebUri, setAuthenticatedWebUri] = useState<string | undefined>(undefined);

  useEffect(() => {
    setAuthenticatedWebUri(undefined);
    if (!source || !requiresAuth || !accessToken || Platform.OS !== 'web') return;

    let objectUrl: string | undefined;
    let cancelled = false;
    const controller = new AbortController();

    void (async () => {
      try {
        const response = await fetch(source, {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: controller.signal,
        });
        if (!response.ok) return;
        const blob = await response.blob();
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setAuthenticatedWebUri(objectUrl);
      } catch {
        return;
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [source, requiresAuth, accessToken]);

  if (!source) return undefined;
  if (!requiresAuth) return { uri: source };
  if (!accessToken) return undefined;
  if (Platform.OS === 'web') {
    return authenticatedWebUri ? { uri: authenticatedWebUri } : undefined;
  }
  return { uri: source, headers: { Authorization: `Bearer ${accessToken}` } };
}

function toneIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash % 4;
}

export function Avatar({
  name,
  size = 'md',
  photo,
  accessibilityLabel,
  testID,
  style,
}: AvatarProps) {
  const styles = useStyles();
  const theme = useTheme();
  const tone = toneIndex(name);

  const container =
    tone === 1
      ? styles.toneB
      : tone === 2
        ? styles.toneC
        : tone === 3
          ? styles.toneD
          : styles.toneA;

  const onTone =
    tone === 1
      ? styles.onToneB
      : tone === 2
        ? styles.onToneC
        : tone === 3
          ? styles.onToneD
          : styles.onToneA;

  const sizeStyle =
    size === 'sm'
      ? styles.sm
      : size === 'xl'
        ? styles.xl
        : size === 'lg'
          ? styles.lg
          : styles.md;

  const initialsStyle =
    size === 'sm'
      ? styles.initialsSm
      : size === 'xl'
        ? styles.initialsXl
        : size === 'lg'
          ? styles.initialsLg
          : styles.initialsMd;

  const source = avatarSource(photo);
  const imageSource = useAvatarImageSource(source, avatarNeedsAuth(photo));

  return (
    <View
      style={[styles.base, sizeStyle, container, style]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? name}
      testID={testID}
    >
      {imageSource ? (
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
      ) : (
        <Text
          style={[initialsStyle, onTone]}
          maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
          allowFontScaling
        >
          {initials(name)}
        </Text>
      )}
    </View>
  );
}
