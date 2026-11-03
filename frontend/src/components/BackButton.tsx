import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { IconButton } from './IconButton';

export type BackButtonProps = {
  label: string;
  onPress?: () => void;
  testID?: string;
};

export function BackButton({ label, onPress, testID }: BackButtonProps) {
  const theme = useTheme();

  return (
    <IconButton
      icon={
        <Ionicons name="chevron-back" size={theme.size.iconLg} color={theme.color.textPrimary} />
      }
      label={label}
      onPress={onPress}
      testID={testID}
    />
  );
}
