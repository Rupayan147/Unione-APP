import React, { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { IconButton, MatchBar, PrimaryButton, styles as ui } from '@/components/Ui';
import { iconForCategory, getCategoryTheme } from '@/components/BenefitCard';
import { getBenefit } from '@/data/mockData';
import { useUnione } from '@/context/UnioneContext';
import { useColors } from '@/hooks/useColors';
import { SectionIllustration, getCategoryVisual, APP_IMAGES } from '@/components/SectionIllustration';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

export default function BenefitDetailScreen() {
  const colors = useColors();
  const { width, pagePadding, detailTopPadding, stickyActionBottomPadding, stickyActionScrollPadding } = useResponsiveLayout();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { applications } = useUnione();
  const [isSaved, setIsSaved] = useState(false);

  const benefit = getBenefit(id ?? '');

  if (!benefit) {
    return (
      <View style={[styles.missing, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.mutedForeground} />
        <Text style={[ui.h3, { color: colors.foreground, marginTop: 12 }]}>Program not found</Text>
        <Text style={[ui.body, { color: colors.mutedForeground, textAlign: 'center' }]}>
          The program details you requested could not be located in our demo catalog.
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={[ui.link, { color: colors.teal }]}>Go back to benefits</Text>
        </Pressable>
      </View>
    );
  }

  const categoryTheme = getCategoryTheme(benefit.category, colors);
  const application = applications.find((item) => item.benefitId === benefit.id);

  const toggleSave = () => {
    setIsSaved((prev) => !prev);
    Alert.alert(
      isSaved ? 'Removed from saved' : 'Saved to profile',
      isSaved ? `${benefit.name} has been removed.` : `${benefit.name} saved to your saved benefits.`,
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
        {/* TOP NAVIGATION BAR */}
        <View style={styles.nav}>
          <IconButton
            name="arrow-back"
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            background={colors.card}
          />
          <View style={[styles.demoMini, { backgroundColor: colors.accent }]}>
            <Text style={[ui.small, { color: colors.teal, fontFamily: 'Inter_700Bold' }]}>DEMO PROGRAM</Text>
          </View>
          <IconButton
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            onPress={toggleSave}
            accessibilityLabel="Save benefit"
            color={isSaved ? colors.teal : colors.foreground}
            background={colors.card}
          />
        </View>

        {/* HERO TITLE BLOCK */}
        <View style={styles.heroHeader}>
          <View style={[styles.heroIcon, { backgroundColor: categoryTheme.bg }]}>
            <Ionicons name={iconForCategory(benefit.category)} size={30} color={categoryTheme.fg} />
          </View>
          <View style={styles.heroTitles}>
            <Text style={[ui.small, { color: categoryTheme.fg, fontFamily: 'Inter_700Bold', letterSpacing: 1.2 }]}>
              {benefit.category.toUpperCase()} SUPPORT
            </Text>
            <Text style={[ui.h1, width <= 340 && styles.compactTitle, { color: colors.foreground, marginTop: 4 }]}>{benefit.name}</Text>
          </View>
        </View>

        <Text style={[ui.body, { color: colors.mutedForeground, marginTop: 8, marginBottom: 16 }]}>
          {benefit.fullName}
        </Text>

        {/* PROGRAM CATEGORY VISUAL */}
        <SectionIllustration
          source={getCategoryVisual(benefit.category) || APP_IMAGES.benefitsDiscovery}
          aspectRatio={2.4}
          badgeText={`${benefit.name.toUpperCase()} PROGRAM`}
          style={{ marginBottom: 16 }}
        />

        {/* MATCH SCORE BREAKDOWN */}
        <View style={[styles.matchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.matchHeader}>
            <Text style={[ui.small, { color: colors.mutedForeground }]}>Match assessment</Text>
            <Text style={[ui.h3, { color: colors.teal, fontFamily: 'Inter_700Bold' }]}>
              {benefit.potentialMatch}% potential match
            </Text>
          </View>
          <MatchBar score={benefit.potentialMatch} />
          <Text style={[ui.small, { color: colors.mutedForeground, marginTop: 10, lineHeight: 17 }]}>
            Based on your reported household size, income, location, and employment status. This is a potential match score and not a final eligibility determination.
          </Text>
        </View>

        {/* KEY PROGRAM SUMMARY CARD */}
        {(benefit.agency || benefit.whoItsFor || benefit.estimatedProcessingTime || benefit.incomeThreshold) ? (
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[ui.small, { color: colors.teal, fontFamily: 'Inter_700Bold', letterSpacing: 0.8, marginBottom: 12 }]}>
              KEY PROGRAM DETAILS
            </Text>

            {benefit.agency ? (
              <View style={styles.summaryItem}>
                <Ionicons name="business-outline" size={16} color={colors.teal} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[ui.small, { color: colors.mutedForeground }]}>Administering Agency</Text>
                  <Text style={[ui.small, { color: colors.foreground, fontFamily: 'Inter_600SemiBold', marginTop: 1 }]}>
                    {benefit.agency}
                  </Text>
                </View>
              </View>
            ) : null}

            {benefit.whoItsFor ? (
              <View style={styles.summaryItem}>
                <Ionicons name="people-outline" size={16} color={colors.teal} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[ui.small, { color: colors.mutedForeground }]}>Who It&apos;s For</Text>
                  <Text style={[ui.small, { color: colors.foreground, fontFamily: 'Inter_600SemiBold', marginTop: 1 }]}>
                    {benefit.whoItsFor}
                  </Text>
                </View>
              </View>
            ) : null}

            {benefit.estimatedProcessingTime ? (
              <View style={styles.summaryItem}>
                <Ionicons name="time-outline" size={16} color={colors.teal} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[ui.small, { color: colors.mutedForeground }]}>Estimated Processing Time</Text>
                  <Text style={[ui.small, { color: colors.foreground, fontFamily: 'Inter_600SemiBold', marginTop: 1 }]}>
                    {benefit.estimatedProcessingTime}
                  </Text>
                </View>
              </View>
            ) : null}

            {benefit.incomeThreshold ? (
              <View style={styles.summaryItem}>
                <Ionicons name="cash-outline" size={16} color={colors.teal} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[ui.small, { color: colors.mutedForeground }]}>Income Guideline</Text>
                  <Text style={[ui.small, { color: colors.foreground, fontFamily: 'Inter_600SemiBold', marginTop: 1 }]}>
                    {benefit.incomeThreshold}
                  </Text>
                </View>
              </View>
            ) : null}

            {benefit.tags && benefit.tags.length > 0 ? (
              <View style={styles.tagsRow}>
                {benefit.tags.map((tag) => (
                  <View key={tag} style={[styles.tagPill, { backgroundColor: colors.secondary }]}>
                    <Text style={[styles.tagText, { color: colors.teal }]}>{tag}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {/* 1. WHY YOU MAY BE A POTENTIAL MATCH */}
        <DetailSection title="Why you may be a potential match">
          <View style={styles.reasonsStack}>
            {benefit.whyRecommended.map((reason) => (
              <View key={reason} style={[styles.reasonRow, { backgroundColor: colors.secondary }]}>
                <Ionicons name="checkmark-circle" size={18} color={colors.teal} />
                <Text style={[ui.body, { color: colors.foreground, flex: 1, fontSize: 14 }]}>
                  {reason}
                </Text>
              </View>
            ))}
          </View>
        </DetailSection>

        {/* 2. WHAT IT PROVIDES */}
        <DetailSection title="What it provides">
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[ui.body, { color: colors.foreground, lineHeight: 22 }]}>
              {benefit.whatItProvides}
            </Text>
          </View>
        </DetailSection>

        {/* 3. WHAT YOU MAY NEED */}
        <DetailSection title="What you may need">
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border, gap: 12 }]}>
            {benefit.requirements.map((item) => (
              <View key={item} style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: colors.teal }]} />
                <Text style={[ui.body, { color: colors.foreground, flex: 1, fontSize: 14 }]}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </DetailSection>

        {/* 4. HOW IT WORKS */}
        <DetailSection title="How the process works">
          <View style={{ gap: 10 }}>
            {benefit.applicationSteps.map((item, index) => (
              <View
                key={item}
                style={[styles.stepRow, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={[styles.stepNumber, { backgroundColor: colors.secondary }]}>
                  <Text style={[ui.small, { color: colors.teal, fontFamily: 'Inter_700Bold' }]}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={[ui.body, { color: colors.foreground, flex: 1, fontSize: 14 }]}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </DetailSection>

        {/* 5. OFFICIAL INFORMATION SOURCE */}
        <DetailSection title="Official information source">
          <View style={[styles.sourceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="globe-outline" size={22} color={colors.teal} />
            <View style={{ flex: 1 }}>
              <Text style={[ui.small, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
                {benefit.source.label}
              </Text>
              <Text style={[ui.small, { color: colors.mutedForeground, marginTop: 2 }]}>
                {benefit.source.detail}
              </Text>
              <Pressable
                onPress={() => Linking.openURL(benefit.source.url)}
                hitSlop={8}
                style={{ marginTop: 10, alignSelf: 'flex-start' }}
              >
                <Text style={[ui.link, { color: colors.teal }]}>View official agency website →</Text>
              </Pressable>
            </View>
          </View>
        </DetailSection>
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
          onPress={() =>
            router.push({
              pathname: '/application/[id]',
              params: { id: application?.id ?? 'new', benefitId: benefit.id },
            })
          }
          icon="arrow-forward"
        >
          {application ? 'Continue preparing' : 'Prepare application'}
        </PrimaryButton>
      </View>
    </View>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={styles.section}>
      <Text style={[ui.h3, { color: colors.foreground, marginBottom: 12 }]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  demoMini: { maxWidth: '55%', borderRadius: 99, paddingHorizontal: 12, paddingVertical: 6, flexShrink: 1 },
  heroHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 22 },
  heroIcon: { width: 62, height: 62, borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  heroTitles: { flex: 1, minWidth: 0 },
  compactTitle: { fontSize: 27, lineHeight: 33 },
  matchBox: { borderWidth: 1, borderRadius: 20, padding: 18, marginTop: 20 },
  matchHeader: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  summaryCard: { borderWidth: 1, borderRadius: 20, padding: 18, marginTop: 16, gap: 12 },
  summaryItem: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', minWidth: 0 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  tagPill: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  section: { marginTop: 26 },
  reasonsStack: { gap: 10 },
  reasonRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 14 },
  infoCard: { borderWidth: 1, borderRadius: 18, padding: 16 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginLeft: 2 },
  stepRow: { borderWidth: 1, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  stepNumber: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sourceCard: { borderWidth: 1, borderRadius: 18, padding: 16, flexDirection: 'row', gap: 12 },
  ctaBar: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10 },
});
