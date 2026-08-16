import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUnione } from '@/context/UnioneContext';
import { useColors } from '@/hooks/useColors';
import { getPersonalizedBenefits, type BenefitRecommendation } from '@/services/benefitService';
import { styles as ui } from '@/components/Ui';
import { SectionIllustration, APP_IMAGES } from '@/components/SectionIllustration';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

export default function HomeScreen() {
  console.log('[UNIONE DEBUG] HOME SCREEN MOUNTED');
  const colors = useColors();
  const { width, fontScale, pagePadding, topContentPadding, tabScreenBottomPadding } = useResponsiveLayout();
  const { profile, applications } = useUnione();
  const stackQuickActions = width <= 340 || fontScale >= 1.3;
  const compactJourney = width <= 400 || fontScale >= 1.1;
  const stackJourney = fontScale >= 1.4;

  const [recommendations, setRecommendations] = useState<BenefitRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(14)).current;
  const orbScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Ambient floating pulse for Hero AI orb
    Animated.loop(
      Animated.sequence([
        Animated.timing(orbScale, {
          toValue: 1.06,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(orbScale, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [fadeAnim, orbScale, slideAnim]);

  useEffect(() => {
    let isMounted = true;
    getPersonalizedBenefits(profile).then((items) => {
      if (isMounted) {
        setRecommendations(items.slice(0, 3));
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [profile]);

  const firstName = profile.name ? profile.name.split(' ')[0] : 'there';
  const actionApp = applications.find((a) => a.status === 'Action required') || applications[0];
  const topRec = recommendations[0]?.benefit;

  const nextStepTitle = actionApp
    ? `${actionApp.nextStep}`
    : topRec
      ? `Explore ${topRec.name} requirements`
      : 'Explore benefit requirements';

  const nextStepSubtext = actionApp
    ? `Action required for your ${actionApp.benefitId.toUpperCase()} application.`
    : 'See what documents you may need and understand the application process.';

  const handleNextStepPress = () => {
    if (actionApp) {
      router.push(`/application/${actionApp.id}` as any);
    } else if (topRec) {
      router.push(`/benefit/${topRec.id}` as any);
    } else {
      router.push('/(tabs)/discover');
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingHorizontal: pagePadding },
        { paddingTop: topContentPadding, paddingBottom: tabScreenBottomPadding },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* 1. HEADER & PROFILE CONTEXT */}
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={[styles.brandText, { color: colors.teal }]}>UNIONE</Text>
            <Text style={[ui.h1, width <= 340 && styles.compactTitle, { color: colors.foreground, marginTop: 4 }]}>
              Good morning, {firstName} 👋
            </Text>
            <Text style={[ui.body, { color: colors.mutedForeground, marginTop: 4 }]}>
              Let’s find the support that’s right for you.
            </Text>
          </View>

          <View style={[styles.contextBadge, { backgroundColor: colors.secondary }]}>
            <Ionicons name="location-outline" size={14} color={colors.teal} />
            <Text style={[styles.contextText, { color: colors.teal }]}>
              {profile.state || 'California'} • Household of {profile.householdSize || '4'}
            </Text>
          </View>
        </View>

        {/* 2. HERO — ASK UNIONE */}
        <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionIllustration
            source={APP_IMAGES.hero}
            aspectRatio={2.5}
            badgeText="DISCOVER RESOURCES"
            style={{ marginBottom: 16 }}
          />
          <View style={styles.heroHeader}>
            <Animated.View
              style={[
                styles.sparkIconBox,
                { backgroundColor: colors.secondary, transform: [{ scale: orbScale }] },
              ]}
            >
              <Ionicons name="sparkles" size={22} color={colors.teal} />
            </Animated.View>

            <View style={[styles.pillBadge, { backgroundColor: colors.accent }]}>
              <Text style={[styles.pillBadgeText, { color: colors.teal }]}>AI GUIDANCE</Text>
            </View>
          </View>

          <Text style={[ui.h2, { color: colors.foreground, marginTop: 14 }]}>
            Not sure where to start?
          </Text>

          <Text style={[ui.body, { color: colors.mutedForeground, marginTop: 8 }]}>
            Tell Unione what’s going on and we’ll help you figure out what to explore.
          </Text>

          <Pressable
            onPress={() => router.push('/(tabs)/ask')}
            accessibilityRole="button"
            accessibilityLabel="Ask Unione"
            style={({ pressed }) => [
              styles.heroButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={[styles.heroButtonText, { color: colors.primaryForeground }]}>
              Ask Unione →
            </Text>
          </Pressable>
        </View>

        {/* 3. YOUR NEXT STEP */}
        <View style={styles.sectionHeader}>
          <Text style={[ui.h3, { color: colors.foreground }]}>Your next step</Text>
        </View>

        <View style={[styles.nextStepCard, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <View style={styles.nextStepContent}>
            <View style={[styles.nextStepIcon, { backgroundColor: colors.card }]}>
              <Ionicons name="arrow-forward-circle-outline" size={24} color={colors.teal} />
            </View>
            <View style={styles.sectionCopy}>
              <Text style={[styles.nextStepTag, { color: colors.teal }]}>ACTION RECOMMENDED</Text>
              <Text style={[ui.h3, { color: colors.foreground, marginTop: 2 }]}>{nextStepTitle}</Text>
              <Text style={[ui.small, { color: colors.mutedForeground, marginTop: 4, lineHeight: 18 }]}>
                {nextStepSubtext}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={handleNextStepPress}
            accessibilityRole="button"
            accessibilityLabel="Continue next step"
            style={({ pressed }) => [
              styles.nextStepButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={[styles.nextStepButtonText, { color: colors.primaryForeground }]}>
              Continue →
            </Text>
          </Pressable>
        </View>

        {/* 4. PERSONALIZED BENEFITS ("POTENTIAL SUPPORT FOR YOU") */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionCopy}>
            <Text style={[ui.h3, { color: colors.foreground }]}>Potential support for you</Text>
            <Text style={[ui.small, { color: colors.mutedForeground, marginTop: 2 }]}>
              Based on what you’ve shared
            </Text>
          </View>

          <Pressable onPress={() => router.push('/(tabs)/discover')} hitSlop={10}>
            <Text style={[ui.link, { color: colors.teal }]}>See all benefits</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.skeletonContainer}>
            <View style={[styles.skeletonCard, { backgroundColor: colors.muted }]} />
            <View style={[styles.skeletonCard, { backgroundColor: colors.muted }]} />
          </View>
        ) : recommendations.length > 0 ? (
          <View style={styles.recommendationsList}>
            {recommendations.map((item) => (
              <Pressable
                key={item.benefit.id}
                onPress={() => router.push(`/benefit/${item.benefit.id}` as any)}
                accessibilityRole="button"
                accessibilityLabel={`View ${item.benefit.name} details`}
                style={({ pressed }) => [
                  styles.recommendationCard,
                  { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.9 : 1 },
                ]}
              >
                <View style={styles.recTopRow}>
                  <View style={[styles.categoryBadge, { backgroundColor: colors.secondary }]}>
                    <Text style={[styles.categoryText, { color: colors.teal }]}>
                      {item.benefit.category}
                    </Text>
                  </View>
                  <View style={[styles.matchBadge, { backgroundColor: colors.accent }]}>
                    <Text style={[styles.matchText, { color: colors.teal }]}>
                      {item.benefit.potentialMatch}% potential match
                    </Text>
                  </View>
                </View>

                <Text style={[ui.h3, styles.flexibleText, { color: colors.foreground, marginTop: 12 }]}>
                  {item.benefit.name}
                </Text>
                <Text style={[ui.small, { color: colors.mutedForeground, marginTop: 2 }]}>
                  {item.benefit.fullName}
                </Text>

                <Text style={[ui.small, { color: colors.navySoft, marginTop: 10, lineHeight: 18 }]}>
                  {item.reason}
                </Text>

                <View style={styles.cardFooterAction}>
                  <Text style={[ui.small, { color: colors.teal, fontFamily: 'Inter_600SemiBold' }]}>
                    View details →
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={[styles.emptyContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <Ionicons name="sparkles-outline" size={24} color={colors.mutedForeground} />
            <Text style={[ui.h3, { color: colors.foreground, marginTop: 8 }]}>
              We’re still learning what might fit your situation.
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/profile')}
              style={({ pressed }) => [
                styles.emptyButton,
                { backgroundColor: colors.secondary, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={[ui.small, { color: colors.teal, fontFamily: 'Inter_600SemiBold' }]}>
                Update my profile
              </Text>
            </Pressable>
          </View>
        )}

        {/* 5. SMALL PROGRESS JOURNEY */}
        <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.progressTopRow}>
            <View style={styles.sectionCopy}>
              <Text style={[ui.h3, { color: colors.foreground }]}>Your Unione journey</Text>
              <Text style={[ui.small, { color: colors.mutedForeground, marginTop: 2 }]}>
                2 of 4 steps complete
              </Text>
            </View>

            <View style={[styles.progressCountBadge, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.progressCountText, { color: colors.teal }]}>50%</Text>
            </View>
          </View>

          {compactJourney ? (
            <View style={styles.compactJourneyGrid}>
              <JourneyStep label="Discover" status="done" colors={colors} compact stacked={stackJourney} />
              <JourneyStep label="Understand" status="done" colors={colors} compact stacked={stackJourney} />
              <JourneyStep label="Apply" status="active" colors={colors} compact stacked={stackJourney} />
              <JourneyStep label="Track" status="pending" colors={colors} compact stacked={stackJourney} />
            </View>
          ) : (
            <View style={styles.journeyStepsRow}>
              <JourneyStep label="Discover" status="done" colors={colors} />
              <StepDivider colors={colors} active />
              <JourneyStep label="Understand" status="done" colors={colors} />
              <StepDivider colors={colors} active />
              <JourneyStep label="Apply" status="active" colors={colors} />
              <StepDivider colors={colors} active={false} />
              <JourneyStep label="Track" status="pending" colors={colors} />
            </View>
          )}
        </View>

        {/* 6. QUICK ACTIONS */}
        <View style={styles.sectionHeader}>
          <Text style={[ui.h3, { color: colors.foreground }]}>Quick actions</Text>
        </View>

        <View style={styles.quickGrid}>
          <QuickActionChip
            icon="search-outline"
            label="Explore benefits"
            onPress={() => router.push('/(tabs)/discover')}
            colors={colors}
            stacked={stackQuickActions}
          />
          <QuickActionChip
            icon="sparkles-outline"
            label="Ask Unione"
            onPress={() => router.push('/(tabs)/ask')}
            colors={colors}
            stacked={stackQuickActions}
          />
          <QuickActionChip
            icon="document-text-outline"
            label="Applications"
            onPress={() => router.push('/(tabs)/applications')}
            colors={colors}
            stacked={stackQuickActions}
          />
          <QuickActionChip
            icon="person-outline"
            label="Update profile"
            onPress={() => router.push('/(tabs)/profile')}
            colors={colors}
            stacked={stackQuickActions}
          />
        </View>

        <Pressable
          onPress={() => router.push('/trust-security' as any)}
          style={({ pressed }) => [styles.trustCard, { backgroundColor: colors.secondary, borderColor: colors.border, opacity: pressed ? 0.8 : 1 }]}
        >
          <View style={[styles.trustIcon, { backgroundColor: colors.card }]}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.teal} />
          </View>
          <View style={styles.sectionCopy}>
            <Text style={[ui.h3, { color: colors.foreground }]}>You’re always in control</Text>
            <Text style={[ui.small, { color: colors.mutedForeground, marginTop: 3, lineHeight: 18 }]}>AI can help prepare information. Nothing is submitted without your review and authorization.</Text>
            <Text style={[ui.link, { color: colors.teal, marginTop: 8 }]}>Learn about UNIONE safety →</Text>
          </View>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

function JourneyStep({
  label,
  status,
  colors,
  compact = false,
  stacked = false,
}: {
  label: string;
  status: 'done' | 'active' | 'pending';
  colors: any;
  compact?: boolean;
  stacked?: boolean;
}) {
  const isDone = status === 'done';
  const isActive = status === 'active';

  return (
    <View style={[styles.stepItem, compact && styles.compactStepItem, stacked && styles.stackedStepItem]}>
      <View
        style={[
          styles.stepDot,
          {
            backgroundColor: isDone ? colors.teal : isActive ? colors.accent : colors.muted,
            borderColor: isActive ? colors.teal : 'transparent',
            borderWidth: isActive ? 2 : 0,
          },
        ]}
      >
        {isDone ? (
          <Ionicons name="checkmark" size={10} color={colors.primaryForeground} />
        ) : isActive ? (
          <View style={[styles.activeInnerDot, { backgroundColor: colors.teal }]} />
        ) : null}
      </View>
      <Text
        style={[
          ui.small,
          {
            fontSize: 11,
            color: isDone || isActive ? colors.foreground : colors.mutedForeground,
            fontFamily: isDone || isActive ? 'Inter_600SemiBold' : 'Inter_400Regular',
            marginTop: compact ? 0 : 4,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function StepDivider({ colors, active }: { colors: any; active: boolean }) {
  return (
    <View
      style={[
        styles.stepDividerLine,
        { backgroundColor: active ? colors.teal : colors.border },
      ]}
    />
  );
}

function QuickActionChip({
  icon,
  label,
  onPress,
  colors,
  stacked,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  colors: any;
  stacked: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.quickChip,
        stacked && styles.stackedQuickChip,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.75 : 1 },
      ]}
    >
      <View style={[styles.quickChipIconBox, { backgroundColor: colors.secondary }]}>
        <Ionicons name={icon} size={18} color={colors.teal} />
      </View>
      <Text style={[ui.small, styles.quickChipLabel, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  headerCopy: { minWidth: 0 },
  sectionCopy: { flex: 1, minWidth: 0 },
  flexibleText: { minWidth: 0, flexShrink: 1 },
  compactTitle: { fontSize: 27, lineHeight: 33 },
  header: { gap: 12 },
  brandText: { fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: 3 },
  contextBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    marginTop: 4,
    maxWidth: '100%',
    flexShrink: 1,
  },
  contextText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, flexShrink: 1 },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    marginTop: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sparkIconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  pillBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99 },
  pillBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.8 },
  heroButton: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  heroButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  sectionHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 26,
    marginBottom: 14,
  },
  nextStepCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 14,
  },
  nextStepContent: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  nextStepIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  nextStepTag: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.8 },
  nextStepButton: {
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextStepButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  recommendationsList: { gap: 14 },
  recommendationCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
  },
  recTopRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 6 },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99, flexShrink: 1 },
  categoryText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, flexShrink: 1 },
  matchBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99, flexShrink: 0 },
  matchText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  cardFooterAction: { marginTop: 14, alignSelf: 'flex-start' },
  skeletonContainer: { gap: 14 },
  skeletonCard: { height: 110, borderRadius: 20, opacity: 0.5 },
  emptyContainer: { borderRadius: 20, borderWidth: 1, padding: 24, alignItems: 'center', gap: 8 },
  emptyButton: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, marginTop: 8 },
  progressCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginTop: 26,
  },
  progressTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  progressCountBadge: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  progressCountText: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  journeyStepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingHorizontal: 4,
  },
  compactJourneyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 18 },
  compactStepItem: { flexBasis: '46%', flexGrow: 1, flexDirection: 'row', justifyContent: 'flex-start', gap: 8, minWidth: 0 },
  stackedStepItem: { flexBasis: '100%' },
  stepItem: { alignItems: 'center', flex: 1, minWidth: 0 },
  stepDot: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  activeInnerDot: { width: 6, height: 6, borderRadius: 3 },
  stepDividerLine: { flex: 1, height: 2, marginBottom: 16, marginHorizontal: -4 },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickChip: {
    flexGrow: 1,
    flexBasis: '46%',
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
  },
  stackedQuickChip: { flexBasis: '100%' },
  quickChipIconBox: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  quickChipLabel: { flex: 1, minWidth: 0 },
  trustCard: { marginTop: 16, borderWidth: 1, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  trustIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
});
