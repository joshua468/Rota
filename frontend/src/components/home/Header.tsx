import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { shadow, font } from '@/theme/tokens';
import { fmtTitle, relLabel } from './dates';

export function Header({ date, unread, onBell, onTitle }:
  { date: Date; unread: boolean; onBell: () => void; onTitle: () => void; onToday?: () => void }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 56 }}>
      <Pressable onPress={onTitle} accessibilityLabel="Open month picker" testID="header-date">
        <Text testID="header-caption" style={{ fontFamily: font.regular, fontSize: 14, color: t.muted }}>{relLabel(date)}</Text>
        <Text testID="header-date-text" style={{ fontFamily: font.black, fontSize: 28, lineHeight: 34, color: t.ink, marginTop: 2 }}>
          {fmtTitle(date)}
        </Text>
      </Pressable>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Pressable onPress={onBell} accessibilityLabel="Notifications"
          style={[{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.card,
            alignItems: 'center', justifyContent: 'center' }, shadow(4, 12, 'rgba(47,36,32,0.08)')]}>
          <Feather name="bell" size={20} color={t.ink} />
          {unread && <View style={{ position: 'absolute', top: 10, right: 11, width: 8, height: 8,
            borderRadius: 4, backgroundColor: t.primary, borderWidth: 1.5, borderColor: t.card }} />}
        </Pressable>
      </View>
    </View>
  );
}
