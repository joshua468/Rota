import type { ReactNode } from 'react';
import { View } from 'react-native';
import { createStyles } from '@/theme';

/**
 * The body of a flush card: the content owns its padding, so a footer can sit
 * on the card edge with a divider that runs the full width.
 */
export function CardBody({ children, style }: { children: ReactNode; style?: object }) {
  const styles = useStyles();
  return <View style={[styles.body, style]}>{children}</View>;
}

/**
 * A card footer: actions separated from the content by a hairline, aligned to
 * the trailing edge. Buttons in a footer read as card actions instead of
 * floating inside the frame.
 */
export function CardFooter({ children, style }: { children: ReactNode; style?: object }) {
  const styles = useStyles();
  return <View style={[styles.footer, style]}>{children}</View>;
}

const useStyles = createStyles((t) => ({
  body: {
    padding: t.space[5],
    gap: t.space[3],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: t.space[2],
    borderTopWidth: t.size.hairline,
    borderTopColor: t.color.divider,
    paddingHorizontal: t.space[4],
    paddingVertical: t.space[3],
  },
}));
