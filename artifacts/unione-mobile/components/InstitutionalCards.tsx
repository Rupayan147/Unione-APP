import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { styles as ui } from '@/components/Ui';

export function SecurityArchitectureCard({ icon, title, detail }: { icon: keyof typeof Ionicons.glyphMap; title: string; detail: string }) {
  const colors = useColors();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.iconBox, { backgroundColor: colors.secondary }]}><Ionicons name={icon} size={20} color={colors.teal} /></View>
      <View style={styles.content}>
        <Text style={[ui.h3, { color: colors.foreground }]}>{title}</Text>
        <Text style={[ui.small, { color: colors.mutedForeground, marginTop: 4, lineHeight: 18 }]}>{detail}</Text>
      </View>
    </View>
  );
}

export function PolicyInsightCard({ icon, label, insight }: { icon: keyof typeof Ionicons.glyphMap; label: string; insight: string }) {
  const colors = useColors();
  return (
    <View style={[styles.insightCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.insightHeader}>
        <View style={[styles.smallIcon, { backgroundColor: colors.accent }]}><Ionicons name={icon} size={17} color={colors.teal} /></View>
        <Text style={[styles.label, { color: colors.teal }]}>{label}</Text>
      </View>
      <Text style={[ui.body, { color: colors.foreground, fontFamily: 'Inter_600SemiBold', marginTop: 11 }]}>{insight}</Text>
    </View>
  );
}

export function VerticalPipeline({ steps }: { steps: { icon: keyof typeof Ionicons.glyphMap; title: string; detail?: string }[] }) {
  const colors = useColors();
  return (
    <View style={[styles.pipeline, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {steps.map((step, index) => (
        <React.Fragment key={step.title}>
          <View style={styles.pipelineRow}>
            <View style={[styles.pipelineIcon, { backgroundColor: colors.secondary }]}><Ionicons name={step.icon} size={18} color={colors.teal} /></View>
            <View style={styles.content}>
              <Text style={[ui.small, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>{step.title}</Text>
              {step.detail ? <Text style={[ui.small, { color: colors.mutedForeground, marginTop: 2, lineHeight: 18 }]}>{step.detail}</Text> : null}
            </View>
          </View>
          {index < steps.length - 1 ? <View style={[styles.pipelineLine, { backgroundColor: colors.border }]}><Ionicons name="arrow-down" size={12} color={colors.teal} /></View> : null}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 18, padding: 15, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  insightCard: { borderWidth: 1, borderRadius: 18, padding: 16 },
  iconBox: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  smallIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  content: { flex: 1, minWidth: 0 },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  label: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', flexShrink: 1 },
  pipeline: { borderWidth: 1, borderRadius: 20, padding: 16 },
  pipelineRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  pipelineIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  pipelineLine: { width: 2, minHeight: 28, marginLeft: 18, alignItems: 'center', justifyContent: 'center' },
});
