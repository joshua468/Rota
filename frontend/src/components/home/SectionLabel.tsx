import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { font } from '@/theme/tokens';

const META = {
  morning: { icon: 'sun', label: 'Morning', tint: 'primary' },
  afternoon: { icon: 'cloud', label: 'Afternoon', tint: 'ink' },
  evening: { icon: 'moon', label: 'Evening', tint: 'ink' },
} as const;

export function SectionLabel({ kind, first }: { kind: 'morning' | 'afternoon' | 'evening'; first?: boolean }) {
  const t = useTheme();
  const m = META[kind];
  const color = m.tint === 'primary' ? t.primary : t.ink;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, height: 24,
      marginTop: first ? 28 : 24, marginBottom: 12 }}>
      <Feather name={m.icon} size={20} color={color} />
      <Text style={{ fontFamily: font.bold, fontSize: 17, lineHeight: 24, color: t.ink }}>
        {m.label}
      </Text>
    </View>
  );
}
