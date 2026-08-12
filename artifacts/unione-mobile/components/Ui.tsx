import React, { type PropsWithChildren } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

export function Screen({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  const colors = useColors();
  return <View style={[styles.screen, { backgroundColor: colors.background }, style]}>{children}</View>;
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return (
    <View style={styles.sectionTitle}>
      <Text style={[styles.h3, { color: colors.foreground }]}>{title}</Text>
      {action && onAction ? (
        <Pressable onPress={onAction} accessibilityRole="button" hitSlop={10}>
          <Text style={[styles.link, { color: colors.teal }]}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function PrimaryButton({ children, icon, loading, style, ...props }: Omit<PressableProps, 'style'> & { children: React.ReactNode; icon?: keyof typeof Ionicons.glyphMap; loading?: boolean; style?: StyleProp<ViewStyle> }) {
  const colors = useColors();
  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      disabled={props.disabled || loading}
      style={({ pressed }) => [
        styles.primaryButton,
        { backgroundColor: colors.primary, opacity: pressed || props.disabled || loading ? 0.72 : 1 },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={colors.primaryForeground} /> : null}
      <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>{children}</Text>
      {icon ? <Ionicons name={icon} size={17} color={colors.primaryForeground} /> : null}
    </Pressable>
  );
}

export function IconButton({ name, onPress, accessibilityLabel, color, background }: { name: keyof typeof Ionicons.glyphMap; onPress: () => void; accessibilityLabel: string; color?: string; background?: string }) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={10}
      style={({ pressed }) => [styles.iconButton, { backgroundColor: background ?? colors.card, opacity: pressed ? 0.65 : 1 }]}
    >
      <Ionicons name={name} size={20} color={color ?? colors.foreground} />
    </Pressable>
  );
}

export function DemoPill() {
  const colors = useColors();
  return (
    <View style={[styles.demoPill, { backgroundColor: colors.accent }]}>
      <View style={[styles.demoDot, { backgroundColor: colors.teal }]} />
      <Text style={[styles.demoPillText, { color: colors.accentForeground }]}>DEMO MODE · NOT LIVE DATA</Text>
    </View>
  );
}

export function ProgressBar({ value, color }: { value: number; color?: string }) {
  const colors = useColors();
  return (
    <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
      <View style={[styles.progressFill, { width: `${Math.min(value, 100)}%`, backgroundColor: color ?? colors.teal }]} />
    </View>
  );
}

export function StatusPill({ status }: { status: string }) {
  const colors = useColors();
  const isAction = status === 'Action required';
  const isSubmitted = status === 'Submitted';
  return (
    <View style={[styles.statusPill, { backgroundColor: isAction ? `${colors.warning}22` : isSubmitted ? `${colors.teal}18` : colors.secondary }]}>
      <Text style={[styles.statusText, { color: isAction ? colors.warning : isSubmitted ? colors.teal : colors.secondaryForeground }]}>{status}</Text>
    </View>
  );
}

export function EmptyState({ title, detail, icon = 'search-outline' }: { title: string; detail: string; icon?: keyof typeof Ionicons.glyphMap }) {
  const colors = useColors();
  return (
    <View style={[styles.emptyState, { borderColor: colors.border }]}>
      <Ionicons name={icon} size={26} color={colors.mutedForeground} />
      <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.emptyDetail, { color: colors.mutedForeground }]}>{detail}</Text>
    </View>
  );
}

export function MatchBar({ score }: { score: number }) {
  const colors = useColors();
  return (
    <View style={styles.matchRow}>
      <ProgressBar value={score} />
      <Text style={[styles.small, { color: colors.teal, minWidth: 73, textAlign: 'right' }]}>{score}% potential match</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 120 },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  h1: { fontFamily: 'Inter_700Bold', fontSize: 31, lineHeight: 37, letterSpacing: -0.7 },
  h2: { fontFamily: 'Inter_700Bold', fontSize: 25, lineHeight: 31, letterSpacing: -0.5 },
  h3: { fontFamily: 'Inter_600SemiBold', fontSize: 17, lineHeight: 23 },
  body: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22 },
  small: { fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 17, letterSpacing: 0.1 },
  link: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  primaryButton: { minHeight: 54, borderRadius: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  primaryButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  iconButton: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  demoPill: { alignSelf: 'flex-start', borderRadius: 99, paddingHorizontal: 9, paddingVertical: 6, flexDirection: 'row', gap: 6, alignItems: 'center' },
  demoDot: { width: 6, height: 6, borderRadius: 3 },
  demoPillText: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.6 },
  progressTrack: { height: 6, borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 99 },
  statusPill: { borderRadius: 99, paddingHorizontal: 9, paddingVertical: 5, alignSelf: 'flex-start' },
  statusText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  emptyState: { borderWidth: 1, borderRadius: 16, padding: 28, alignItems: 'center', gap: 7 },
  emptyTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 16, marginTop: 3 },
  emptyDetail: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, textAlign: 'center' },
  matchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});