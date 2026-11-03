import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Easing, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createStyles, useTheme } from '@/theme';
import { USE_NATIVE_DRIVER, useReducedMotion } from '@/lib/usePressScale';

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
  description?: string;
  leading?: ReactNode;
  disabled?: boolean;
};

export type SelectFieldProps<T extends string = string> = {
  label: string;
  placeholder?: string;
  value: T | null;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
  searchable?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  testID?: string;
};

const useStyles = createStyles((t) => ({
  field: {
    gap: t.space[1],
  },
  label: {
    ...t.type.labelLarge,
    color: t.color.textPrimary,
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
    backgroundColor: t.color.surface,
    borderWidth: t.size.hairline,
    borderColor: t.color.border,
    borderRadius: t.radius.md,
    paddingHorizontal: t.space[3],
    paddingVertical: t.space[2],
    minHeight: t.size.controlMin,
  },
  controlOpen: {
    borderColor: t.color.focus,
  },
  controlError: {
    borderColor: t.color.error,
  },
  controlDisabled: {
    backgroundColor: t.color.disabled,
  },
  value: {
    ...t.type.bodyLarge,
    color: t.color.textPrimary,
    flex: 1,
  },
  placeholder: {
    ...t.type.bodyLarge,
    color: t.color.textMuted,
    flex: 1,
  },
  panel: {
    ...t.shadow.medium,
    marginTop: t.space[1],
    backgroundColor: t.color.surface,
    borderWidth: t.size.hairline,
    borderColor: t.color.border,
    borderRadius: t.radius.md,
    overflow: 'hidden',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
    paddingHorizontal: t.space[3],
    paddingVertical: t.space[2],
    borderBottomWidth: t.size.hairline,
    borderBottomColor: t.color.divider,
  },
  searchInput: {
    ...t.type.bodyLarge,
    color: t.color.textPrimary,
    flex: 1,
    paddingVertical: t.space[1],
    minHeight: t.size.touchMin,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
    minHeight: t.size.touchMin,
    paddingHorizontal: t.space[3],
    paddingVertical: t.space[2],
  },
  optionDivider: {
    borderTopWidth: t.size.hairline,
    borderTopColor: t.color.divider,
  },
  optionSelected: {
    backgroundColor: t.color.primaryContainer,
  },
  optionPressed: {
    backgroundColor: t.color.surfaceMuted,
  },
  optionText: {
    flex: 1,
    gap: t.space[0],
  },
  optionLabel: {
    ...t.type.bodyLarge,
    color: t.color.textPrimary,
  },
  optionDescription: {
    ...t.type.bodySmall,
    color: t.color.textSecondary,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[2],
    minHeight: t.size.touchMin,
    paddingHorizontal: t.space[3],
    paddingVertical: t.space[2],
    borderTopWidth: t.size.hairline,
    borderTopColor: t.color.divider,
  },
  actionLabel: {
    ...t.type.labelLarge,
    color: t.color.primary,
  },
  empty: {
    ...t.type.bodySmall,
    color: t.color.textSecondary,
    padding: t.space[4],
  },
  message: {
    ...t.type.bodySmall,
    color: t.color.textSecondary,
  },
  error: {
    ...t.type.bodySmall,
    color: t.color.error,
  },
}));

export function SelectField<T extends string = string>({
  label,
  placeholder = 'Select an option',
  value,
  options,
  onChange,
  open,
  onOpenChange,
  error,
  hint,
  disabled,
  searchable,
  actionLabel,
  onAction,
  testID,
}: SelectFieldProps<T>) {
  const styles = useStyles();
  const theme = useTheme();
  const reduced = useReducedMotion();
  const [query, setQuery] = useState('');
  const progress = useRef(new Animated.Value(open ? 1 : 0)).current;

  useEffect(() => {
    if (reduced) {
      progress.setValue(open ? 1 : 0);
      return;
    }
    Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: theme.motion.duration.fast,
      easing: Easing.bezier(...(theme.motion.easing.standard as [number, number, number, number])),
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }, [open, progress, reduced, theme.motion]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const selected = options.find((option) => option.value === value) ?? null;
  const visible =
    searchable && query.trim()
      ? options.filter((option) => option.label.toLowerCase().includes(query.trim().toLowerCase()))
      : options;

  return (
    <View style={styles.field}>
      <Text style={styles.label} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
        {label}
      </Text>
      <Pressable
        onPress={() => !disabled && onOpenChange(!open)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ expanded: open, disabled: !!disabled }}
        testID={testID}
        style={[styles.control, open && styles.controlOpen, !!error && styles.controlError, disabled && styles.controlDisabled]}
      >
        {selected?.leading}
        <Text style={selected ? styles.value : styles.placeholder} numberOfLines={1} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
          {selected ? selected.label : placeholder}
        </Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Feather name="chevron-down" size={theme.size.iconMd} color={theme.color.textSecondary} />
        </Animated.View>
      </Pressable>

      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite" maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
          {error}
        </Text>
      ) : hint ? (
        <Text style={styles.message} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
          {hint}
        </Text>
      ) : null}

      {open ? (
        <View style={styles.panel} testID={testID ? `${testID}-panel` : undefined}>
          {searchable ? (
            <View style={styles.search}>
              <Feather name="search" size={theme.size.iconSm} color={theme.color.textSecondary} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search"
                placeholderTextColor={theme.color.textMuted}
                accessibilityLabel={`Search ${label}`}
                style={[
                  styles.searchInput,
                  Platform.select({
                    web: { outlineWidth: 0, outlineStyle: 'none', boxShadow: 'none' } as any,
                  }),
                ]}
                maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}
              />
            </View>
          ) : null}

          <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 264 }}>
            {visible.length === 0 ? (
              <Text style={styles.empty} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
                No matches
              </Text>
            ) : (
              visible.map((option, index) => {
                const isSelected = option.value === value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      onChange(option.value);
                      onOpenChange(false);
                    }}
                    disabled={option.disabled}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected, disabled: !!option.disabled }}
                    accessibilityLabel={option.description ? `${option.label}, ${option.description}` : option.label}
                    testID={testID ? `${testID}-option-${option.value}` : undefined}
                    style={({ pressed }) => [
                      styles.option,
                      index > 0 && styles.optionDivider,
                      isSelected && styles.optionSelected,
                      pressed && styles.optionPressed,
                    ]}
                  >
                    {option.leading}
                    <View style={styles.optionText}>
                      <Text style={styles.optionLabel} numberOfLines={1} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
                        {option.label}
                      </Text>
                      {option.description ? (
                        <Text style={styles.optionDescription} numberOfLines={1} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
                          {option.description}
                        </Text>
                      ) : null}
                    </View>
                    {isSelected ? <Feather name="check" size={theme.size.iconMd} color={theme.color.primary} /> : null}
                  </Pressable>
                );
              })
            )}
          </ScrollView>

          {actionLabel && onAction ? (
            <Pressable
              onPress={onAction}
              accessibilityRole="button"
              accessibilityLabel={actionLabel}
              testID={testID ? `${testID}-action` : undefined}
              style={({ pressed }) => [styles.action, pressed && styles.optionPressed]}
            >
              <Feather name="plus-circle" size={theme.size.iconMd} color={theme.color.primary} />
              <Text style={styles.actionLabel} maxFontSizeMultiplier={theme.textScale.maxFontSizeMultiplier}>
                {actionLabel}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
