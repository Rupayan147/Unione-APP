import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DemoPill, ProgressBar, StatusPill, styles as ui } from '@/components/Ui';
import { getBenefit } from '@/data/mockData';
import { useUnione } from '@/context/UnioneContext';
import { useColors } from '@/hooks/useColors';

export default function ApplicationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { applications } = useUnione();

  const actionRequiredCount = applications.filter((a) => a.status === 'Action required').length;
  const underReviewCount = applications.filter((a) => a.status === 'Under review').length;
  const submittedCount = applications.filter((a) => a.status === 'Submitted').length;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        ui.content,
        { paddingTop: Math.max(insets.top + 16, 48), paddingBottom: Math.max(insets.bottom + 110, 130) },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <View style={styles.headerTagRow}>
            <Text style={[ui.small, { color: colors.teal, letterSpacing: 1.3 }]}>CASE TRACKER</Text>
            <DemoPill />
          </View>
          <Text style={[ui.h1, { color: colors.foreground, marginTop: 6 }]}>Your applications</Text>
        </View>
      </View>

      <Text style={[ui.body, { color: colors.mutedForeground, marginTop: 6 }]}>
        Keep track of your active programs and next steps in one place.
      </Text>

      {/* STAT SUMMARY PILLS */}
      <View style={styles.statsRow}>
        <View style={[styles.statChip, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[ui.h3, { color: colors.foreground }]}>{applications.length}</Text>
          <Text style={[ui.small, { color: colors.mutedForeground }]}>Total active</Text>
        </View>

        <View style={[styles.statChip, { backgroundColor: `${colors.warning}15`, borderColor: `${colors.warning}35` }]}>
          <Text style={[ui.h3, { color: colors.warning }]}>{actionRequiredCount}</Text>
          <Text style={[ui.small, { color: colors.warning }]}>Action needed</Text>
        </View>

        <View style={[styles.statChip, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Text style={[ui.h3, { color: colors.teal }]}>{underReviewCount + submittedCount}</Text>
          <Text style={[ui.small, { color: colors.teal }]}>In progress</Text>
        </View>
      </View>

      {/* DEMO NOTICE BANNER */}
      <View style={[styles.noticeCard, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
        <Ionicons name="information-circle-outline" size={18} color={colors.teal} />
        <Text style={[ui.small, { color: colors.foreground, flex: 1, lineHeight: 18 }]}>
          Demo tracking mode · Unione provides step-by-step guidance to help you prepare applications for official state agencies.
        </Text>
      </View>

      {/* ACTIVE APPLICATIONS LIST */}
      <View style={{ marginTop: 24 }}>
        <Text style={[ui.h3, { color: colors.foreground, marginBottom: 14 }]}>Active progress</Text>

        {applications.map((application) => {
          const benefit = getBenefit(application.benefitId);
          if (!benefit) return null;

          const isAction = application.status === 'Action required';

          return (
            <Pressable
              key={application.id}
              onPress={() => router.push(`/application/${application.id}` as any)}
              accessibilityRole="button"
              accessibilityLabel={`View ${benefit.name} application`}
              style={({ pressed }) => [
                styles.appCard,
                { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.appIconBox, { backgroundColor: colors.secondary }]}>
                  <Ionicons name="document-text-outline" size={20} color={colors.teal} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[ui.h3, { color: colors.foreground }]}>{benefit.name}</Text>
                  <Text style={[ui.small, { color: colors.mutedForeground, marginTop: 2 }]}>
                    {benefit.fullName}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
              </View>

              <View style={styles.statusRow}>
                <StatusPill status={application.status} />
                <Text style={[ui.small, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
                  {application.progress}% complete
                </Text>
              </View>

              <ProgressBar
                value={application.progress}
                color={isAction ? colors.warning : colors.teal}
              />

              {/* ACTION NEEDED ALERT BOX */}
              {isAction ? (
                <View style={[styles.actionNeededBox, { backgroundColor: `${colors.warning}15`, borderColor: `${colors.warning}30` }]}>
                  <Ionicons name="alert-circle-outline" size={16} color={colors.warning} />
                  <View style={{ flex: 1 }}>
                    <Text style={[ui.small, { color: colors.warning, fontFamily: 'Inter_700Bold' }]}>
                      ACTION NEEDED
                    </Text>
                    <Text style={[ui.small, { color: colors.foreground, marginTop: 2 }]}>
                      {application.nextStep}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={[styles.nextStepBox, { borderTopColor: colors.border }]}>
                  <Text style={[ui.small, { color: colors.mutedForeground }]}>CURRENT STAGE</Text>
                  <Text style={[ui.small, { color: colors.foreground, marginTop: 2, fontFamily: 'Inter_600SemiBold' }]}>
                    {application.nextStep}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerTagRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 18 },
  statChip: { flex: 1, borderWidth: 1, borderRadius: 16, padding: 12, alignItems: 'center', gap: 2 },
  noticeCard: { borderWidth: 1, borderRadius: 16, padding: 14, flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 18 },
  appCard: { borderWidth: 1, borderRadius: 20, padding: 18, marginBottom: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  appIconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, marginBottom: 10 },
  actionNeededBox: { borderRadius: 14, borderWidth: 1, padding: 12, flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 16 },
  nextStepBox: { borderTopWidth: 1, marginTop: 16, paddingTop: 12 },
});