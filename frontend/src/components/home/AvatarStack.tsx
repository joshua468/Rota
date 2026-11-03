import { View, Text } from 'react-native';
import { font } from '@/theme/tokens';
import { Avatar } from '@/components/Avatar';

export function AvatarStack({ people, bg, moreBg, moreColor, max = 3 }:
  { people: { name: string; photo?: string | null }[]; bg: string; moreBg: string; moreColor: string; max?: number }) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  const base = {
    width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: bg,
    alignItems: 'center' as const, justifyContent: 'center' as const, overflow: 'hidden' as const,
  };
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {shown.map((p, i) => (
        <View key={i} style={[base, { marginLeft: i ? -8 : 0 }]}>
          <Avatar name={p.name} photo={p.photo} size="sm" style={{ width: 28, height: 28, borderRadius: 14 }} />
        </View>
      ))}
      {extra > 0 && (
        <View style={[base, { marginLeft: -8, backgroundColor: moreBg }]}>
          <Text style={{ fontFamily: font.bold, fontSize: 12, color: moreColor }}>+{extra}</Text>
        </View>
      )}
    </View>
  );
}
