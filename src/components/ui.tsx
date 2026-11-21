import { Ionicons } from '@expo/vector-icons';
import type { ReactNode, Ref } from 'react';
import type { ScrollViewInstance } from 'react-native';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/lib/constants';

export function Screen({
  children,
  footer,
  safeTop = false,
  inTabs = false,
  scrollRef,
}: {
  children: ReactNode;
  footer?: ReactNode;
  safeTop?: boolean;
  /** タブ画面の中ではタブバーが下の余白を持つので、フッターに下のセーフエリアを足さない */
  inTabs?: boolean;
  scrollRef?: Ref<ScrollViewInstance>;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.content,
          { paddingTop: safeTop ? insets.top + 16 : 16 },
        ]}
      >
        {children}
      </ScrollView>
      {footer ? (
        <View style={[styles.footer, { paddingBottom: inTabs ? 12 : Math.max(insets.bottom, 12) }]}>{footer}</View>
      ) : null}
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, onPress, variant = 'primary', disabled, icon, style }: ButtonProps) {
  const bg =
    variant === 'primary' ? colors.orange : variant === 'secondary' ? colors.navy : 'transparent';
  const fg = variant === 'primary' ? colors.navy : variant === 'secondary' ? '#fff' : colors.navy;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, opacity: disabled ? 0.4 : pressed ? 0.8 : 1 },
        variant === 'ghost' && { borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff' },
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={18} color={fg} style={{ marginRight: 6 }} /> : null}
      <Text style={[styles.buttonText, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && { backgroundColor: colors.navy, borderColor: colors.navy }]}
    >
      <Text style={[styles.chipText, selected && { color: '#fff' }]}>{label}</Text>
    </Pressable>
  );
}

export function ProgressBar({ value, color = colors.orange }: { value: number; color?: string }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <View style={styles.barTrack}>
      <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
  );
}

export function ListRow({
  icon,
  title,
  sub,
  right,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  sub?: string;
  right?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={20} color={colors.navy} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {sub ? <Text style={styles.rowSub}>{sub}</Text> : null}
      </View>
      {right ? <Text style={styles.rowRight}>{right}</Text> : null}
      {onPress ? <Ionicons name="chevron-forward" size={18} color={colors.sub} /> : null}
    </Pressable>
  );
}

/** 解説用の簡易Markdown（**太字**、`コード`、段落） */
export function RichText({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/);
  return (
    <View style={{ gap: 10 }}>
      {paragraphs.map((p, i) => (
        <Text key={i} style={styles.body}>
          {p.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**'))
              return (
                <Text key={j} style={{ fontWeight: '700' }}>
                  {part.slice(2, -2)}
                </Text>
              );
            if (part.startsWith('`') && part.endsWith('`'))
              return (
                <Text key={j} style={styles.code}>
                  {part.slice(1, -1)}
                </Text>
              );
            return <Text key={j}>{part}</Text>;
          })}
        </Text>
      ))}
    </View>
  );
}

export const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32, gap: 14 },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    gap: 8,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 4 },
  button: {
    minHeight: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontSize: 16, fontWeight: '700' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
  },
  chipText: { fontSize: 14, color: colors.text, fontWeight: '600' },
  barTrack: { height: 8, borderRadius: 4, backgroundColor: '#E8ECF2', overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.orangeSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  rowSub: { fontSize: 12.5, color: colors.sub, marginTop: 2 },
  rowRight: { fontSize: 15, fontWeight: '700', color: colors.navy, marginRight: 2 },
  body: { fontSize: 15, lineHeight: 24, color: colors.text },
  code: {
    fontFamily: 'Courier',
    backgroundColor: '#EEF1F6',
    color: colors.navy,
  },
});
