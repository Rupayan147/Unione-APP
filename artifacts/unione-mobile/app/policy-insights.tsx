import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BulletList, InfoScreen, InfoSection } from '@/components/InfoScreen';
import { PolicyInsightCard, VerticalPipeline } from '@/components/InstitutionalCards';
import { styles as ui } from '@/components/Ui';
import { useColors } from '@/hooks/useColors';

export default function PolicyInsightsScreen() {
  const colors = useColors();
  return (
    <InfoScreen
      eyebrow="POLICY INSIGHTS LAYER"
      title="See where systems create friction."
      subtitle="An aggregated, privacy-preserving concept for helping institutions understand where people struggle across the benefits journey."
      badge="DEMO POLICY INSIGHTS"
    >
      <View style={[styles.demoNotice, { backgroundColor: colors.accent, borderColor: colors.border }]}>
        <Ionicons name="flask-outline" size={20} color={colors.teal} />
        <View style={styles.flexibleContent}>
          <Text style={[ui.small, { color: colors.teal, fontFamily: 'Inter_700Bold' }]}>ILLUSTRATIVE DATA — NOT LIVE GOVERNMENT ANALYTICS</Text>
          <Text style={[ui.small, { color: colors.foreground, marginTop: 4, lineHeight: 18 }]}>No personally identifiable information is displayed on this page.</Text>
        </View>
      </View>

      <InfoSection title="Two connected layers" detail="Individual guidance and institutional learning serve different purposes.">
        <LayerCard icon="person-outline" title="Applicant Layer" detail="Helps one person discover programs, understand requirements, and prepare information for review." />
        <LayerCard icon="analytics-outline" title="Policy Insights Layer" detail="Helps institutions identify aggregated friction patterns and process-improvement opportunities." />
      </InfoSection>

      <InfoSection title="Illustrative signals" detail="These demo cards show the kind of de-identified patterns the layer could surface.">
        <PolicyInsightCard icon="alert-circle-outline" label="Application friction" insight="Income verification creates the most review requests" />
        <PolicyInsightCard icon="document-outline" label="Document readiness" insight="Proof of income is the most commonly missing document" />
        <PolicyInsightCard icon="help-circle-outline" label="Eligibility confusion" insight="Users frequently ask about household-size definitions" />
        <PolicyInsightCard icon="search-outline" label="Program discovery gap" insight="Housing assistance receives high search activity but low application progression" />
        <PolicyInsightCard icon="exit-outline" label="Drop-off signal" insight="Users commonly exit during document preparation" />
      </InfoSection>

      <InfoSection title="How the layer could work" detail="Privacy filtering and aggregation come before institutional analysis.">
        <VerticalPipeline steps={[
          { icon: 'phone-portrait-outline', title: 'User interactions', detail: 'Searches, questions, validation events, and journey steps' },
          { icon: 'eye-off-outline', title: 'Privacy filtering / de-identification', detail: 'Remove direct identifiers and apply production privacy controls' },
          { icon: 'stats-chart-outline', title: 'Aggregated behavioral signals' },
          { icon: 'bulb-outline', title: 'Policy Insights Engine' },
          { icon: 'business-outline', title: 'Operational / policy intelligence' },
        ]} />
      </InfoSection>

      <InfoSection title="Patterns, not people" detail="Potential aggregate inputs include:">
        <BulletList items={[
          'Benefits frequently searched and categories with unmet demand',
          'Programs or steps with high abandonment',
          'Common missing-document categories',
          'Frequently misunderstood eligibility rules and policy language',
          'Validation failures and duplicate or inconsistent-data patterns',
          'Geographic or service gaps at an appropriately aggregated level',
        ]} />
      </InfoSection>

      <InfoSection title="Potential outputs">
        <BulletList items={['Friction hotspots', 'Rule-clarity issues', 'Service demand', 'Document bottlenecks', 'Outreach opportunities', 'Process-improvement opportunities']} />
      </InfoSection>
    </InfoScreen>
  );
}

function LayerCard({ icon, title, detail }: { icon: keyof typeof Ionicons.glyphMap; title: string; detail: string }) {
  const colors = useColors();
  return (
    <View style={[styles.layerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.layerIcon, { backgroundColor: colors.secondary }]}><Ionicons name={icon} size={21} color={colors.teal} /></View>
      <View style={styles.flexibleContent}>
        <Text style={[ui.h3, { color: colors.foreground }]}>{title}</Text>
        <Text style={[ui.small, { color: colors.mutedForeground, marginTop: 4, lineHeight: 18 }]}>{detail}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  demoNotice: { borderWidth: 1, borderRadius: 18, padding: 15, marginTop: 22, flexDirection: 'row', alignItems: 'flex-start', gap: 11 },
  layerCard: { borderWidth: 1, borderRadius: 18, padding: 15, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  layerIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  flexibleContent: { flex: 1, minWidth: 0 },
});
