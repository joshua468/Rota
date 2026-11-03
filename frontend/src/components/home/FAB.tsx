import { Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { shadow } from '@/theme/tokens';

export function FAB({ label, onPress, bottom }:
 { label: string; onPress: () => void; bottom: number }) {
  const t = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityLabel={label} testID="fab"
      style={[{ position: 'absolute', right: 20, width: 56, height: 56, borderRadius: 28,
        bottom, backgroundColor: t.primary, alignItems: 'center', justifyContent: 'center' },
        shadow(10, 24, 'rgba(217,105,74,0.4)')]}>
      <Feather name="plus" size={26} color="#FFFFFF" />
    </Pressable>
  );
}
