import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { styles as ui } from '@/components/Ui';

export type IntegrityStatus = 'Verified' | 'Needs review' | 'Missing';

export interface MappingItem {
  id: string;
  source: string;
  field: string;
  value: string;
  status: IntegrityStatus;
}

const statusIcon: Record<IntegrityStatus, keyof typeof Ionicons.glyphMap> = {
  Verified: 'checkmark-circle',
  'Needs review': 'alert-circle',
  Missing: 'close-circle',
};

export function IntegrityStatusPill({ status }: { status: IntegrityStatus }) {
  const colors = useColors();
  const tone = status === 'Verified' ? colors.teal : status === 'Needs review' ? colors.warning : colors.destructive;
  return (
    <View style={[styles.statusPill, { backgroundColor: `${tone}16` }]}>
      <Ionicons name={statusIcon[status]} size={13} color={tone} />
      <Text style={[styles.statusText, { color: tone }]}>{status}</Text>
    </View>
  );
}

export function MappingReview({ items, onAction }: { items: MappingItem[]; onAction: (item: MappingItem) => void }) {
  const colors = useColors();
  const { width, fontScale } = useWindowDimensions();
  const stackMapping = width <= 340 || fontScale >= 1.25;
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {items.map((item, index) => (
        <View key={item.id} style={[styles.mappingItem, index > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
          <View style={styles.mappingHeader}>
            <IntegrityStatusPill status={item.status} />
            <Pressable onPress={() => onAction(item)} hitSlop={8} accessibilityRole="button">
              <Text style={[ui.link, { color: colors.teal }]}>{item.status === 'Verified' ? 'Edit' : item.status === 'Missing' ? 'Resolve' : 'Confirm'}</Text>
            </Pressable>
          </View>
          <View style={[styles.mappingFlow, stackMapping && styles.stackedMappingFlow]}>
            <View style={styles.mappingColumn}>
              <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>SOURCE</Text>
              <Text style={[ui.small, styles.flexibleText, { color: colors.foreground }]}>{item.source}</Text>
            </View>
            <Ionicons name={stackMapping ? 'arrow-down' : 'arrow-forward'} size={15} color={colors.mutedForeground} />
            <View style={styles.mappingColumn}>
              <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>MAPPED FIELD</Text>
              <Text style={[ui.small, styles.flexibleText, { color: colors.foreground }]}>{item.field}</Text>
            </View>
          </View>
          <View style={[styles.valueBox, { backgroundColor: colors.muted }]}>
            <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>VALUE</Text>
            <Text style={[ui.body, styles.flexibleText, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>{item.value || 'No value provided'}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export function ApplicationIntegrityCheck({ incomeConfirmed }: { incomeConfirmed: boolean }) {
  const colors = useColors();
  const checks = [
    { text: 'Required fields completed', ok: true },
    { text: 'Household information appears consistent', ok: true },
    { text: incomeConfirmed ? 'Income value reviewed by user' : 'Income value should be reviewed', ok: incomeConfirmed },
    { text: 'No obvious duplicate entries detected', ok: true },
  ];
  return (
    <View style={[styles.card, styles.checkCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {checks.map((check) => (
        <View key={check.text} style={styles.checkRow}>
          <Ionicons name={check.ok ? 'checkmark-circle' : 'warning'} size={19} color={check.ok ? colors.teal : colors.warning} />
          <Text style={[ui.body, styles.flexibleText, { color: colors.foreground, fontSize: 14 }]}>{check.text}</Text>
        </View>
      ))}
      <Text style={[ui.small, { color: colors.mutedForeground, lineHeight: 18 }]}>Demo integrity signals can flag review needs; they do not guarantee legal or factual correctness.</Text>
    </View>
  );
}

export function ReviewChecklist({ checked, onChange, children }: { checked: boolean; onChange: () => void; children: React.ReactNode }) {
  const colors = useColors();
  return (
    <Pressable onPress={onChange} accessibilityRole="checkbox" accessibilityState={{ checked }} style={[styles.checklistRow, { borderColor: checked ? colors.teal : colors.border, backgroundColor: checked ? colors.secondary : colors.card }]}>
      <View style={[styles.checkbox, { borderColor: checked ? colors.teal : colors.input, backgroundColor: checked ? colors.teal : colors.card }]}>
        {checked ? <Ionicons name="checkmark" size={16} color={colors.primaryForeground} /> : null}
      </View>
      <Text style={[ui.body, styles.flexibleText, { color: colors.foreground, fontSize: 14 }]}>{children}</Text>
    </Pressable>
  );
}

export function AssistancePrinciple() {
  const colors = useColors();
  const items = [
    ['sparkles-outline', 'AI suggests', 'Information is prepared for review.'],
    ['eye-outline', 'You review', 'You verify every mapped field.'],
    ['shield-checkmark-outline', 'You authorize', 'Nothing is submitted without you.'],
  ] as const;
  return (
    <View style={[styles.principleCard, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
      {items.map(([icon, title, detail]) => (
        <View key={title} style={styles.principleItem}>
          <View style={[styles.principleIcon, { backgroundColor: colors.card }]}><Ionicons name={icon} size={18} color={colors.teal} /></View>
          <View style={styles.flexibleContent}>
            <Text style={[ui.small, { color: colors.teal, fontFamily: 'Inter_700Bold', textTransform: 'uppercase' }]}>{title}</Text>
            <Text style={[ui.small, { color: colors.foreground, marginTop: 2 }]}>{detail}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 20, overflow: 'hidden' },
  mappingItem: { padding: 16, gap: 12 },
  mappingHeader: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  mappingFlow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stackedMappingFlow: { flexDirection: 'column', alignItems: 'flex-start' },
  mappingColumn: { flex: 1, minWidth: 0, gap: 2 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.7 },
  valueBox: { borderRadius: 12, padding: 11, gap: 2 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 5, flexShrink: 1 },
  statusText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, flexShrink: 1 },
  flexibleText: { flexShrink: 1, minWidth: 0 },
  flexibleContent: { flex: 1, minWidth: 0 },
  checkCard: { padding: 16, gap: 12 },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 9 },
  checklistRow: { minHeight: 58, borderWidth: 1, borderRadius: 16, padding: 13, flexDirection: 'row', alignItems: 'flex-start', gap: 11 },
  checkbox: { width: 24, height: 24, borderWidth: 1.5, borderRadius: 7, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  principleCard: { borderWidth: 1, borderRadius: 20, padding: 16, gap: 14 },
  principleItem: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  principleIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
});
