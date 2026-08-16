import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { IconButton, PrimaryButton, ProgressBar, StatusPill, styles as ui } from '@/components/Ui';
import { getApplication, getBenefit, type Application } from '@/data/mockData';
import { useUnione } from '@/context/UnioneContext';
import { useColors } from '@/hooks/useColors';
import { SectionIllustration, APP_IMAGES } from '@/components/SectionIllustration';
import { AssistancePrinciple } from '@/components/ApplicationIntegrity';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

export default function ApplicationDetailScreen() {
  const colors = useColors();
  const { pagePadding, detailTopPadding, stickyActionBottomPadding, stickyActionScrollPadding } = useResponsiveLayout();
  const { id, benefitId } = useLocalSearchParams<{ id: string; benefitId?: string }>();
  const { applications } = useUnione();

  const existing = id && id !== 'new' ? getApplication(id) ?? applications.find((item) => item.id === id) : undefined;
  const application: Application = existing ?? {
    id: 'new',
    benefitId: benefitId ?? 'snap',
    status: 'Action required',
    progress: 20,
    nextStep: 'Review program requirements',
    timeline: [
      { label: 'Profile information', status: 'complete' },
      { label: 'Eligibility verification', status: 'action' },
      { label: 'Document upload', status: 'pending' },
      { label: 'Review & Attest', status: 'pending' },
      { label: 'Official application', status: 'pending' },
      { label: 'Track updates', status: 'pending' },
    ],
  };

  const benefit = getBenefit(application.benefitId);
  if (!benefit) return null;

  const isAction = application.status === 'Action required';

  const handleAction = () => {
    Alert.alert(
      'Document Upload Demo',
      'Select a document from your phone (e.g. proof of income or residency) to complete this step.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Upload Demo File',
          onPress: () => Alert.alert('File Attached', 'Your demo document has been received for review.'),
        },
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={[
          ui.content,
          { paddingHorizontal: pagePadding, paddingTop: detailTopPadding, paddingBottom: stickyActionScrollPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* NAV HEADER */}
        <View style={styles.nav}>
          <IconButton
            name="arrow-back"
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            background={colors.card}
          />
          <View style={[styles.demoBadge, { backgroundColor: colors.accent }]}>
            <Text style={[ui.small, { color: colors.teal, fontFamily: 'Inter_700Bold' }]}>CASE TRACKER</Text>
          </View>
          <IconButton
            name="ellipsis-horizontal"
            onPress={() => Alert.alert('Application options', 'Demo application management actions.')}
            accessibilityLabel="More options"
            background={colors.card}
          />
        </View>

        {isAction ? (
          <Pressable
            onPress={handleAction}
            accessibilityRole="button"
            style={({ pressed }) => [styles.uploadAction, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.78 : 1 }]}
          >
            <Ionicons name="cloud-upload-outline" size={19} color={colors.teal} />
            <Text style={[ui.small, styles.flexibleText, { color: colors.teal, fontFamily: 'Inter_600SemiBold' }]}>Attach the requested demo document</Text>
          </Pressable>
        ) : null}

        {/* HERO TITLE */}
        <Text style={[ui.h1, { color: colors.foreground, marginTop: 22 }]}>{benefit.name}</Text>
        <Text style={[ui.body, { color: colors.mutedForeground, marginTop: 4 }]}>
          {benefit.fullName}
        </Text>

        {/* STATUS BAR & PROGRESS */}
        <View style={styles.statusHeader}>
          <StatusPill status={application.status} />
          <Text style={[ui.small, { color: colors.foreground, fontFamily: 'Inter_700Bold' }]}>
            {application.progress}% complete
          </Text>
        </View>

        <ProgressBar
          value={application.progress}
          color={isAction ? colors.warning : colors.teal}
        />

        {/* NEXT STEP ACTION ALERT BANNER */}
        <View
          style={[
            styles.nextBanner,
            {
              backgroundColor: isAction ? `${colors.warning}15` : colors.secondary,
              borderColor: isAction ? `${colors.warning}35` : colors.border,
            },
          ]}
        >
          <Ionicons
            name={isAction ? 'alert-circle' : 'time-outline'}
            size={22}
            color={isAction ? colors.warning : colors.teal}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={[
                ui.small,
                {
                  color: isAction ? colors.warning : colors.teal,
                  fontFamily: 'Inter_700Bold',
                  letterSpacing: 0.8,
                },
              ]}
            >
              {isAction ? 'ACTION REQUIRED' : 'CURRENT STATUS'}
            </Text>
            <Text style={[ui.body, { color: colors.foreground, marginTop: 4, fontFamily: 'Inter_600SemiBold' }]}>
              {application.nextStep}
            </Text>
          </View>
        </View>

        {/* PROCESS VISUAL */}
        <SectionIllustration
          source={isAction ? APP_IMAGES.documentProcessing : APP_IMAGES.applicationSteps}
          aspectRatio={2.4}
          badgeText={isAction ? 'VERIFICATION PROCESS' : 'STEP-BY-STEP GUIDANCE'}
          style={{ marginTop: 18 }}
        />

        <View style={styles.assistanceSection}>
          <Text style={[ui.h3, { color: colors.foreground, marginBottom: 12 }]}>UNIONE assistance</Text>
          <AssistancePrinciple />
        </View>

        {/* TIMELINE PROGRESS NODES */}
        <View style={styles.timelineSection}>
          <Text style={[ui.h3, { color: colors.foreground, marginBottom: 18 }]}>
            Application timeline
          </Text>

          {application.timeline.map((item, index) => {
            const isComplete = item.status === 'complete';
            const isStepAction = item.status === 'action';

            return (
              <View key={item.label} style={styles.timelineRow}>
                <View style={styles.lineWrap}>
                  <View
                    style={[
                      styles.timelineDot,
                      {
                        backgroundColor: isComplete
                          ? colors.teal
                          : isStepAction
                            ? colors.warning
                            : colors.card,
                        borderColor: isComplete
                          ? colors.teal
                          : isStepAction
                            ? colors.warning
                            : colors.border,
                      },
                    ]}
                  >
                    {isComplete ? (
                      <Ionicons name="checkmark" size={12} color={colors.primaryForeground} />
                    ) : isStepAction ? (
                      <View style={[styles.innerDot, { backgroundColor: colors.primaryForeground }]} />
                    ) : null}
                  </View>
                  {index < application.timeline.length - 1 ? (
                    <View
                      style={[
                        styles.verticalLine,
                        { backgroundColor: isComplete ? colors.teal : colors.border },
                      ]}
                    />
                  ) : null}
                </View>

                <View style={{ paddingBottom: 22, flex: 1 }}>
                  <Text
                    style={[
                      ui.body,
                      {
                        color: colors.foreground,
                        fontFamily: isComplete || isStepAction ? 'Inter_600SemiBold' : 'Inter_400Regular',
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={[
                      ui.small,
                      {
                        color: isStepAction
                          ? colors.warning
                          : isComplete
                            ? colors.teal
                            : colors.mutedForeground,
                        marginTop: 3,
                      },
                    ]}
                  >
                    {isComplete
                      ? 'Completed'
                      : isStepAction
                        ? 'Action required'
                        : 'Upcoming'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <Text style={[ui.small, { color: colors.mutedForeground, textAlign: 'center', marginTop: 12 }]}>
          Demo tracking mode · No official government submission was made
        </Text>
      </ScrollView>

      {/* STICKY BOTTOM ACTION BAR */}
      <View
        style={[
          styles.ctaBar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingHorizontal: pagePadding,
            paddingBottom: stickyActionBottomPadding,
          },
        ]}
      >
        <PrimaryButton
          onPress={() => router.push(`/application/review/${application.id}?benefitId=${application.benefitId}` as any)}
          icon="shield-checkmark-outline"
        >
          Review & Attest
        </PrimaryButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  demoBadge: { borderRadius: 99, paddingHorizontal: 12, paddingVertical: 6, flexShrink: 1, maxWidth: '55%' },
  statusHeader: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between', alignItems: 'center', marginTop: 22, marginBottom: 10 },
  nextBanner: { borderRadius: 18, borderWidth: 1, padding: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 20 },
  uploadAction: { minHeight: 48, borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10 },
  flexibleText: { flexShrink: 1, minWidth: 0 },
  assistanceSection: { marginTop: 24 },
  timelineSection: { marginTop: 28 },
  timelineRow: { flexDirection: 'row', gap: 14 },
  lineWrap: { alignItems: 'center', width: 24 },
  timelineDot: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  innerDot: { width: 8, height: 8, borderRadius: 4 },
  verticalLine: { width: 2, flex: 1, minHeight: 26, marginVertical: 3 },
  ctaBar: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});
