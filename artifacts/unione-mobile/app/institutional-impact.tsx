import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BulletList, InfoScreen, InfoSection } from '@/components/InfoScreen';
import { styles as ui } from '@/components/Ui';
import { useColors } from '@/hooks/useColors';

const institutionalSegments = [
  'Federal benefit-administering agencies',
  'State government benefit agencies',
  'County and municipal social-service agencies',
  'Workforce-development agencies',
  'Housing authorities',
  'Public health and Medicaid-support organizations',
  'Nonprofits and community benefit navigators',
  'Universities and student-support organizations',
  'Healthcare systems and patient-assistance teams',
  'Employers, HR teams, and employee-assistance programs',
  'Community action organizations',
  'Benefits-navigation service providers',
];

export default function InstitutionalImpactScreen() {
  const colors = useColors();
  return (
    <InfoScreen
      eyebrow="INSTITUTIONAL IMPACT"
      title={'Better access.\nBetter data.\nFewer preventable errors.'}
      subtitle="UNIONE is designed to help reduce avoidable application errors that can contribute to improper payments—while keeping people in control."
      badge="PROSPECTIVE USE"
    >
      <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
        <Ionicons name="git-network-outline" size={25} color={colors.primaryForeground} />
        <View style={styles.flexibleContent}>
          <Text style={[ui.h3, { color: colors.primaryForeground }]}>Human review is part of the architecture</Text>
          <Text style={[ui.small, { color: colors.primaryForeground, opacity: 0.86, marginTop: 5, lineHeight: 18 }]}>AI suggests. The user reviews. The user authorizes.</Text>
        </View>
      </View>

      <InfoSection title="Payment integrity by design" detail="The prototype concept could help institutions improve application quality through:">
        <BulletList items={[
          'Structured eligibility pre-screening',
          'Field validation',
          'Duplicate and inconsistent-data detection',
          'Source-aware data mapping',
          'Missing-field detection',
          'Human review before submission',
          'Audit trails and user-authorization records',
          'Evidence and document readiness',
          'Policy-aware rules',
          'Clear applicant guidance',
        ]} />
      </InfoSection>

      <View style={[styles.policyNote, { backgroundColor: colors.accent, borderColor: colors.border }]}>
        <Text style={[styles.noteLabel, { color: colors.teal }]}>POLICY CONTEXT</Text>
        <Text style={[ui.body, { color: colors.foreground, marginTop: 7, fontSize: 14 }]}>The Payment Integrity Information Act of 2019 (Public Law 116-117) focuses federal attention on identifying and reducing improper payments. UNIONE’s prototype is positioned as a potential application-quality and process-support layer; it does not claim compliance, certification, or measured savings.</Text>
      </View>

      <InfoSection title="Who UNIONE can serve">
        <View style={[styles.audienceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.audienceIcon, { backgroundColor: colors.secondary }]}><Ionicons name="people-outline" size={22} color={colors.teal} /></View>
          <Text style={[styles.noteLabel, { color: colors.teal }]}>INDIVIDUAL USERS</Text>
          <Text style={[ui.h3, { color: colors.foreground, marginTop: 6 }]}>People and families seeking benefits</Text>
          <Text style={[ui.small, { color: colors.mutedForeground, marginTop: 5, lineHeight: 18 }]}>Discover potential programs, prepare information, understand requirements, and stay in control of next steps.</Text>
        </View>

        <View style={[styles.audienceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.audienceIcon, { backgroundColor: colors.accent }]}><Ionicons name="business-outline" size={22} color={colors.teal} /></View>
          <Text style={[styles.noteLabel, { color: colors.teal }]}>POTENTIAL INSTITUTIONAL USERS</Text>
          <Text style={[ui.h3, { color: colors.foreground, marginTop: 6 }]}>Prospective customer segments</Text>
          <Text style={[ui.small, { color: colors.mutedForeground, marginTop: 5, marginBottom: 13, lineHeight: 18 }]}>These are prospective categories only. No contract, partnership, or agency endorsement is implied.</Text>
          {institutionalSegments.map((segment) => (
            <View key={segment} style={styles.segmentRow}>
              <Ionicons name="checkmark-circle-outline" size={17} color={colors.teal} />
              <Text style={[ui.small, styles.flexibleText, { color: colors.foreground, lineHeight: 18 }]}>{segment}</Text>
            </View>
          ))}
        </View>
      </InfoSection>
    </InfoScreen>
  );
}

const styles = StyleSheet.create({
  heroCard: { borderRadius: 20, padding: 17, marginTop: 22, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  policyNote: { borderWidth: 1, borderRadius: 18, padding: 16, marginTop: 28 },
  noteLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.8 },
  audienceCard: { borderWidth: 1, borderRadius: 20, padding: 17 },
  audienceIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
  segmentRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, marginTop: 10 },
  flexibleContent: { flex: 1, minWidth: 0 },
  flexibleText: { flex: 1, minWidth: 0 },
});
