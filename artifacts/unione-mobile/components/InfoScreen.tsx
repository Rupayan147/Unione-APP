import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { IconButton, styles as ui } from '@/components/Ui';
import { useColors } from '@/hooks/useColors';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

export function InfoScreen({ eyebrow, title, subtitle, badge, children }: { eyebrow: string; title: string; subtitle: string; badge?: string; children: React.ReactNode }) {
  const colors = useColors();
  const { width, pagePadding, detailTopPadding, safeBottom } = useResponsiveLayout();
  return (
    <KeyboardAwareScrollViewCompat
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingHorizontal: pagePadding, paddingTop: detailTopPadding, paddingBottom: safeBottom + 28 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.nav}>
        <IconButton name="arrow-back" onPress={() => router.back()} accessibilityLabel="Go back" background={colors.card} />
        {badge ? <View style={[styles.badge, { backgroundColor: colors.accent }]}><Text style={[styles.badgeText, { color: colors.teal }]}>{badge}</Text></View> : null}
      </View>
      <Text style={[styles.eyebrow, { color: colors.teal }]}>{eyebrow}</Text>
      <Text style={[ui.h1, width <= 340 && styles.compactTitle, { color: colors.foreground, marginTop: 7 }]}>{title}</Text>
      <Text style={[ui.body, { color: colors.mutedForeground, marginTop: 9, lineHeight: 23 }]}>{subtitle}</Text>
      {children}
    </KeyboardAwareScrollViewCompat>
  );
}

export function InfoSection({ title, detail, children }: { title: string; detail?: string; children: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={styles.section}>
      <Text style={[ui.h2, { color: colors.foreground }]}>{title}</Text>
      {detail ? <Text style={[ui.body, { color: colors.mutedForeground, marginTop: 7 }]}>{detail}</Text> : null}
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

export function BulletList({ items }: { items: string[] }) {
  const colors = useColors();
  return (
    <View style={[styles.bulletCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <View style={[styles.bullet, { backgroundColor: colors.teal }]} />
          <Text style={[ui.body, styles.flexibleText, { color: colors.foreground, fontSize: 14 }]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, minWidth: 0 },
  badge: { maxWidth: '75%', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 6, flexShrink: 1 },
  badgeText: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.7, flexShrink: 1 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1.3, marginTop: 22 },
  compactTitle: { fontSize: 27, lineHeight: 33 },
  section: { marginTop: 30 },
  sectionContent: { gap: 10, marginTop: 14 },
  bulletCard: { borderWidth: 1, borderRadius: 20, padding: 16, gap: 12 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bullet: { width: 6, height: 6, borderRadius: 3, marginTop: 8, flexShrink: 0 },
  flexibleText: { flex: 1, minWidth: 0 },
});
