import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { IconButton, PrimaryButton, styles as ui } from '@/components/Ui';
import { ApplicationIntegrityCheck, AssistancePrinciple, MappingReview, ReviewChecklist, type MappingItem } from '@/components/ApplicationIntegrity';
import { getApplication, getBenefit, type Application } from '@/data/mockData';
import { useUnione } from '@/context/UnioneContext';
import { useColors } from '@/hooks/useColors';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

export default function ReviewApplicationScreen() {
  const colors = useColors();
  const { width, fontScale, pagePadding, detailTopPadding, safeBottom } = useResponsiveLayout();
  const compactRows = width <= 340 || fontScale >= 1.2;
  const compactJourney = width <= 380 || fontScale >= 1.15;
  const stackJourney = fontScale >= 1.4;
  const { id, benefitId } = useLocalSearchParams<{ id: string; benefitId?: string }>();
  const { applications, profile, reviewRecords, recordApplicationReview } = useUnione();
  const foundApplication = applications.find((item) => item.id === id) ?? getApplication(id ?? '');
  const application: Application | undefined = foundApplication ?? (benefitId ? {
    id: id ?? 'new',
    benefitId,
    status: 'Preparing',
    progress: 30,
    nextStep: 'Review mapped application information',
    timeline: [],
  } : undefined);
  const benefit = getBenefit(application?.benefitId ?? 'snap');
  const reviewId = id ?? application?.id ?? 'demo-application';
  const existingRecord = reviewRecords[reviewId];

  const initialMappings = useMemo<MappingItem[]>(() => [
    { id: 'household', source: 'Profile', field: 'Household Size', value: profile.householdSize, status: 'Verified' },
    { id: 'employment', source: 'Profile', field: 'Employment Status', value: profile.employment, status: 'Verified' },
    { id: 'income', source: 'Uploaded Document', field: 'Annual Income', value: profile.income, status: 'Needs review' },
    { id: 'residency', source: 'Supporting Document', field: 'Residency Evidence', value: '', status: 'Missing' },
  ], [profile]);

  const [mappings, setMappings] = useState(initialMappings);
  const [accuracyChecked, setAccuracyChecked] = useState(false);
  const [responsibilityChecked, setResponsibilityChecked] = useState(false);
  const [signedName, setSignedName] = useState(existingRecord?.signedName ?? '');

  if (!application || !benefit) {
    return (
      <View style={[styles.missing, { backgroundColor: colors.background }]}>
        <Text style={[ui.h3, { color: colors.foreground }]}>Application not found</Text>
        <PrimaryButton onPress={() => router.back()}>Go back</PrimaryButton>
      </View>
    );
  }

  const allMappingsReviewed = mappings.every((item) => item.status === 'Verified');
  const normalizedName = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase();
  const nameMatches = normalizedName(signedName) === normalizedName(profile.name);
  const canSign = allMappingsReviewed && accuracyChecked && responsibilityChecked && nameMatches;
  const record = reviewRecords[reviewId];

  const handleMappingAction = (item: MappingItem) => {
    if (item.status === 'Verified') {
      Alert.alert('Edit source information', 'Critical source information should be edited in the profile or source document, then reviewed again.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open profile', onPress: () => router.push('/(tabs)/profile') },
      ]);
      return;
    }
    if (item.status === 'Needs review') {
      Alert.alert('Confirm mapped value?', `${item.field}: ${item.value}\n\nConfirm only after comparing this value with the source.`, [
        { text: 'Keep reviewing', style: 'cancel' },
        { text: 'Confirm', onPress: () => setMappings((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: 'Verified' } : entry)) },
      ]);
      return;
    }
    Alert.alert('Resolve missing information', 'This prototype will attach a demo residency document. A production flow would require the user to choose and review the actual source.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Attach demo document', onPress: () => setMappings((current) => current.map((entry) => entry.id === item.id ? { ...entry, value: 'Demo residency document', status: 'Verified' } : entry)) },
    ]);
  };

  const handleSign = () => {
    if (!canSign) return;
    recordApplicationReview(reviewId, signedName);
  };

  const handleContinue = () => {
    Alert.alert(
      'Demo application flow',
      'Your review and authorization are recorded locally for this prototype. UNIONE has not submitted anything to a government agency. A production flow could now open the official application.',
    );
  };

  const summary = [
    ['Full name', profile.name],
    ['Date of birth', 'May 14, 1994 (demo)'],
    ['Location', `${profile.state} · ${profile.zip}`],
    ['Household size', `${profile.householdSize} people`],
    ['Income', `${profile.income} annually`],
    ['Employment status', profile.employment],
    ['Selected program', `${benefit.name} — ${benefit.fullName}`],
  ];

  return (
    <KeyboardAwareScrollViewCompat
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingHorizontal: pagePadding, paddingTop: detailTopPadding, paddingBottom: safeBottom + 28 }}
      bottomOffset={90}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.nav}>
        <IconButton name="arrow-back" onPress={() => router.back()} accessibilityLabel="Go back" background={colors.card} />
        <View style={[styles.demoBadge, { backgroundColor: colors.accent }]}>
          <Text style={[styles.demoText, { color: colors.teal }]}>DEMO APPLICATION FLOW</Text>
        </View>
      </View>

      <Text style={[ui.h1, width <= 340 && styles.compactTitle, { color: colors.foreground, marginTop: 22 }]}>Review before submission</Text>
      <Text style={[ui.body, { color: colors.mutedForeground, marginTop: 8 }]}>UNIONE will never submit an application without your explicit approval.</Text>

      <View style={styles.journeyWrap}>
        {['Discover', 'Understand', 'Prepare', 'Review & Attest', 'Submit', 'Track'].map((step) => (
            <View key={step} style={[styles.journeyPill, compactJourney && styles.compactJourneyPill, stackJourney && styles.stackedJourneyPill, { backgroundColor: step === 'Review & Attest' ? colors.primary : colors.secondary }]}>
              <Text style={[styles.journeyText, { color: step === 'Review & Attest' ? colors.primaryForeground : colors.teal }]}>{step}</Text>
            </View>
        ))}
      </View>

      <SectionHeading number="1" title="Application summary" />
      <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {summary.map(([label, value], index) => (
          <View key={label} style={[styles.summaryRow, compactRows && styles.stackedSummaryRow, index > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
            <Text style={[ui.small, styles.summaryLabel, { color: colors.mutedForeground }]}>{label}</Text>
            <Text style={[ui.small, styles.summaryValue, compactRows && styles.stackedSummaryValue, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>{value}</Text>
          </View>
        ))}
      </View>

      <SectionHeading number="2" title="Data Mapping Review" />
      <Text style={[ui.small, { color: colors.mutedForeground, lineHeight: 18, marginTop: -6, marginBottom: 12 }]}>Compare every source, mapped form field, and value. Critical information is never silently guessed.</Text>
      <MappingReview items={mappings} onAction={handleMappingAction} />

      <SectionHeading number="3" title="Potential issue detection" />
      <ApplicationIntegrityCheck incomeConfirmed={mappings.find((item) => item.id === 'income')?.status === 'Verified'} />

      <SectionHeading number="4" title="User attestation" />
      <View style={styles.checklistStack}>
        <ReviewChecklist checked={accuracyChecked} onChange={() => setAccuracyChecked((value) => !value)}>I have reviewed the information above and confirm that it is accurate to the best of my knowledge.</ReviewChecklist>
        <ReviewChecklist checked={responsibilityChecked} onChange={() => setResponsibilityChecked((value) => !value)}>I understand that I am responsible for reviewing information before submission.</ReviewChecklist>
      </View>
      <View style={[styles.legalNote, { backgroundColor: colors.muted, borderColor: colors.border }]}>
        <Ionicons name="information-circle-outline" size={18} color={colors.teal} />
        <Text style={[ui.small, styles.flexibleText, { color: colors.foreground, lineHeight: 18 }]}>Providing false information on government forms may have legal consequences. UNIONE assists with preparation and does not replace official agency guidance or legal advice. This is not legal advice.</Text>
      </View>

      <SectionHeading number="5" title="Digital Signature Prototype" />
      <View style={[styles.signatureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.prototypeNote, { backgroundColor: colors.accent }]}>
          <Text style={[ui.small, { color: colors.teal, fontFamily: 'Inter_700Bold' }]}>DEMO ATTESTATION</Text>
          <Text style={[ui.small, { color: colors.foreground, marginTop: 3, lineHeight: 18 }]}>This interaction is not production-grade, legally binding e-signature infrastructure.</Text>
        </View>
        <Text style={[ui.small, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>Type your full legal name</Text>
        <TextInput
          value={signedName}
          onChangeText={setSignedName}
          placeholder={profile.name}
          placeholderTextColor={colors.mutedForeground}
          editable={!record}
          autoCapitalize="words"
          style={[styles.signatureInput, { color: colors.foreground, backgroundColor: record ? colors.muted : colors.background, borderColor: colors.border }]}
        />
        {!nameMatches && signedName.length > 0 && !record ? <Text style={[ui.small, { color: colors.warning }]}>Enter the full name shown in the application summary.</Text> : null}
        {record ? (
          <View style={[styles.signedBox, { backgroundColor: colors.secondary }]}>
            <Ionicons name="checkmark-circle" size={22} color={colors.teal} />
            <View style={styles.flexibleContent}>
              <Text style={[ui.h3, { color: colors.foreground }]}>Review complete</Text>
              <Text style={[ui.small, { color: colors.foreground, marginTop: 3 }]}>User authorization recorded</Text>
              <Text style={[ui.small, { color: colors.mutedForeground, marginTop: 7 }]}>Signed by {record.signedName}</Text>
              <Text style={[ui.small, { color: colors.mutedForeground }]}>Timestamp {new Date(record.signedAt).toLocaleString()}</Text>
              <Text style={[ui.small, { color: colors.mutedForeground }]}>Reference {record.reference}</Text>
            </View>
          </View>
        ) : (
          <PrimaryButton onPress={handleSign} disabled={!canSign} icon="create-outline">Confirm & Sign</PrimaryButton>
        )}
      </View>

      <SectionHeading number="" title="Human-in-the-loop safety" />
      <AssistancePrinciple />

      <View style={[styles.finalCard, { backgroundColor: colors.primary }]}>
        <Text style={[ui.h3, { color: colors.primaryForeground }]}>Ready only after your authorization</Text>
        <Text style={[ui.small, { color: colors.primaryForeground, opacity: 0.86, marginTop: 5, lineHeight: 18 }]}>This prototype does not connect to or submit information to a government system.</Text>
        <PrimaryButton onPress={handleContinue} disabled={!record} icon="open-outline" style={{ marginTop: 14, backgroundColor: colors.card }}>
          <Text style={{ color: colors.teal }}>Continue to official application</Text>
        </PrimaryButton>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

function SectionHeading({ number, title }: { number: string; title: string }) {
  const colors = useColors();
  return (
    <View style={styles.sectionHeading}>
      {number ? <View style={[styles.sectionNumber, { backgroundColor: colors.secondary }]}><Text style={[styles.sectionNumberText, { color: colors.teal }]}>{number}</Text></View> : null}
      <Text style={[ui.h3, styles.flexibleText, { color: colors.foreground }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  demoBadge: { maxWidth: '75%', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 6, flexShrink: 1 },
  demoText: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.7, flexShrink: 1 },
  compactTitle: { fontSize: 27, lineHeight: 33 },
  journeyWrap: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'stretch', gap: 7, marginTop: 18 },
  journeyPill: { flexGrow: 1, flexBasis: '30%', minWidth: 0, minHeight: 34, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 7, alignItems: 'center', justifyContent: 'center' },
  compactJourneyPill: { flexBasis: '46%' },
  stackedJourneyPill: { flexBasis: '100%' },
  journeyText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, lineHeight: 14, textAlign: 'center', flexShrink: 1 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 28, marginBottom: 12 },
  sectionNumber: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  sectionNumberText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  summaryCard: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 16 },
  summaryRow: { minHeight: 54, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 12 },
  stackedSummaryRow: { flexDirection: 'column', alignItems: 'flex-start', gap: 4 },
  summaryLabel: { flex: 0.8, minWidth: 0 },
  summaryValue: { flex: 1.2, minWidth: 0, textAlign: 'right' },
  stackedSummaryValue: { flex: 0, textAlign: 'left', width: '100%' },
  checklistStack: { gap: 10 },
  legalNote: { borderWidth: 1, borderRadius: 16, padding: 13, flexDirection: 'row', alignItems: 'flex-start', gap: 9, marginTop: 12 },
  flexibleText: { flex: 1, minWidth: 0, flexShrink: 1 },
  flexibleContent: { flex: 1, minWidth: 0 },
  signatureCard: { borderWidth: 1, borderRadius: 20, padding: 16, gap: 12 },
  prototypeNote: { borderRadius: 14, padding: 12 },
  signatureInput: { minHeight: 52, borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontFamily: 'Inter_500Medium', fontSize: 15 },
  signedBox: { borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  finalCard: { borderRadius: 22, padding: 18, marginTop: 26 },
});
