import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { PrimaryButton, styles as ui } from '@/components/Ui';
import { demoProfile, type Benefit, type UserProfile } from '@/data/mockData';
import { useUnione } from '@/context/UnioneContext';
import { getPersonalizedBenefits } from '@/services/benefitService';
import { useColors } from '@/hooks/useColors';

type EntryPhase = 'splash' | 'welcome' | 'profile' | 'options' | 'ready';

export default function Onboarding() {
  const colors = useColors();
  const { hasOnboarded, completeOnboarding, isHydrating } = useUnione();
  const [phase, setPhase] = useState<EntryPhase>('splash');
  const [form, setForm] = useState<UserProfile>(demoProfile);
  const [recommendations, setRecommendations] = useState<Benefit[]>([]);

  useEffect(() => {
    console.log('[UNIONE DEBUG] Entry route effect check - isHydrating:', isHydrating, 'hasOnboarded:', hasOnboarded);
    if (isHydrating) return;

    console.log('[UNIONE DEBUG] HYDRATION COMPLETE');
    console.log('[UNIONE DEBUG] hasOnboarded =', hasOnboarded);

    if (hasOnboarded) {
      console.log('[UNIONE DEBUG] ABOUT TO NAVIGATE TO TABS');
      console.log('[UNIONE DEBUG] NAVIGATION COMMAND SENT');
      router.replace('/(tabs)');
    } else {
      console.log('[UNIONE DEBUG] First-time user detected. Setting phase to welcome');
      setPhase('welcome');
    }
  }, [isHydrating, hasOnboarded]);

  useEffect(() => {
    if (phase !== 'options') return;

    let isMounted = true;
    getPersonalizedBenefits(form).then((items) => {
      if (!isMounted) return;
      setRecommendations(items.slice(0, 3).map((item) => item.benefit));
    });

    return () => {
      isMounted = false;
    };
  }, [form, phase]);

  const fields = useMemo(
    () => [
      { key: 'age' as const, label: 'Age', placeholder: '32', keyboardType: 'number-pad' as const },
      { key: 'state' as const, label: 'State', placeholder: 'California', keyboardType: 'default' as const },
      { key: 'zip' as const, label: 'ZIP code', placeholder: '90001', keyboardType: 'number-pad' as const },
      { key: 'householdSize' as const, label: 'Household size', placeholder: '4', keyboardType: 'number-pad' as const },
      { key: 'employment' as const, label: 'Employment status', placeholder: 'Recently unemployed', keyboardType: 'default' as const },
      { key: 'income' as const, label: 'Approximate annual income', placeholder: '$32,000', keyboardType: 'default' as const },
      { key: 'children' as const, label: 'Number of children', placeholder: '2', keyboardType: 'number-pad' as const },
    ],
    [],
  );

  const completeAndEnterHome = () => {
    console.log('[UNIONE DEBUG] User completing onboarding manually');
    completeOnboarding(form);
    console.log('[UNIONE DEBUG] ABOUT TO NAVIGATE TO TABS VIA SIGNIN/COMPLETE');
    console.log('[UNIONE DEBUG] NAVIGATION COMMAND SENT');
    router.replace('/(tabs)');
  };

  if (isHydrating || phase === 'splash') {
    return (
      <View style={[styles.splashScreen, { backgroundColor: colors.background }]}>
        <View style={styles.splashContent}>
          <View style={[styles.logoMark, { backgroundColor: colors.primary }]}>
            <Text style={[styles.logoLetter, { color: colors.primaryForeground }]}>U</Text>
          </View>
          <Text style={[styles.splashBrand, { color: colors.foreground }]}>UNIONE</Text>
          <Text style={[styles.splashTagline, { color: colors.mutedForeground }]}>
            Find support. Understand your options. Take the next step.
          </Text>
        </View>
      </View>
    );
  }

  if (phase === 'welcome') {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={styles.backdrop}>
          <View style={[styles.backdropOrbLarge, { backgroundColor: colors.secondary }]} />
          <View style={[styles.backdropOrbSmall, { backgroundColor: colors.accent }]} />
        </View>
        <View style={styles.welcomeContent}>
          <View style={styles.welcomeTop}>
            <View style={[styles.mark, { backgroundColor: colors.primary }]}>
              <Ionicons name="link-outline" size={27} color={colors.primaryForeground} />
            </View>
            <Text style={[styles.brand, { color: colors.foreground }]}>UNIONE</Text>
          </View>

          <View style={styles.welcomeBody}>
            <Text style={[ui.h1, { color: colors.foreground, fontSize: 38, lineHeight: 44 }]}>
              Finding support{`\n`}shouldn’t feel overwhelming.
            </Text>
            <Text style={[ui.body, { color: colors.mutedForeground, marginTop: 16, maxWidth: 340 }]}>
              Unione helps you discover benefits that may fit your situation and guides you toward your next step.
            </Text>
          </View>

          <View style={styles.welcomeActions}>
            <PrimaryButton onPress={() => setPhase('profile')} icon="arrow-forward">
              Get started
            </PrimaryButton>
            <Pressable
              onPress={completeAndEnterHome}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.secondaryButton,
                { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.74 : 1 },
              ]}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.foreground }]}>Sign in</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  if (phase === 'profile') {
    return (
      <KeyboardAwareScrollViewCompat
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[styles.formContent, { paddingTop: 56, paddingBottom: 32 }]}
        bottomOffset={90}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.stepHeader}>
          <Pressable onPress={() => setPhase('welcome')} hitSlop={10} style={styles.backRow}>
            <Ionicons name="arrow-back" size={18} color={colors.foreground} />
            <Text style={[ui.small, { color: colors.foreground }]}>Back</Text>
          </Pressable>
          <Text style={[ui.small, { color: colors.teal, letterSpacing: 1.4 }]}>STEP 2 OF 4</Text>
        </View>

        <Text style={[ui.h2, { color: colors.foreground, marginTop: 22 }]}>Tell us about yourself.</Text>
        <Text style={[ui.body, { color: colors.mutedForeground, marginTop: 10 }]}>
          We&apos;ll use this to personalize what may be available to you.
        </Text>

        <View style={[styles.summaryCard, { backgroundColor: colors.secondary }]}>
          <Text style={[ui.small, { color: colors.teal, letterSpacing: 1.1 }]}>YOUR DEMO PROFILE</Text>
          <Text style={[ui.h3, { color: colors.foreground, marginTop: 8 }]}>{form.name}</Text>
          <Text style={[ui.small, { color: colors.mutedForeground, marginTop: 4 }]}>
            {form.state} · {form.zip} · {form.householdSize} people
          </Text>
        </View>

        <View style={styles.fieldGrid}>
          {fields.map((field) => (
            <View key={field.key} style={styles.field}>
              <Text style={[ui.small, { color: colors.foreground, marginBottom: 8 }]}>{field.label}</Text>
              <TextInput
                value={form[field.key]}
                placeholder={field.placeholder}
                placeholderTextColor={colors.mutedForeground}
                onChangeText={(value) => setForm((current) => ({ ...current, [field.key]: value }))}
                keyboardType={field.keyboardType}
                style={[
                  styles.input,
                  { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground },
                ]}
                testID={`onboarding-${field.key}`}
              />
            </View>
          ))}
        </View>

        <PrimaryButton onPress={() => setPhase('options')} icon="arrow-forward" style={{ marginTop: 8 }}>
          See potential options
        </PrimaryButton>
      </KeyboardAwareScrollViewCompat>
    );
  }

  if (phase === 'options') {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={styles.backdrop}>
          <View style={[styles.backdropOrbLarge, { backgroundColor: colors.secondary }]} />
          <View style={[styles.backdropOrbSmall, { backgroundColor: colors.accent }]} />
        </View>
        <View style={styles.welcomeContent}>
          <View style={styles.stepHeader}>
            <Pressable onPress={() => setPhase('profile')} hitSlop={10} style={styles.backRow}>
              <Ionicons name="arrow-back" size={18} color={colors.foreground} />
              <Text style={[ui.small, { color: colors.foreground }]}>Edit</Text>
            </Pressable>
            <Text style={[ui.small, { color: colors.teal, letterSpacing: 1.4 }]}>STEP 3 OF 4</Text>
          </View>

          <View style={styles.welcomeBody}>
            <Text style={[ui.h2, { color: colors.foreground }]}>See your potential options.</Text>
            <Text style={[ui.body, { color: colors.mutedForeground, marginTop: 10 }]}>
              Here are a few programs that may fit the profile you shared.
            </Text>
          </View>

          <View style={[styles.optionStack, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {recommendations.map((benefit, index) => (
              <View
                key={benefit.id}
                style={[
                  styles.optionRow,
                  index > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
                ]}
              >
                <View
                  style={[
                    styles.optionIcon,
                    { backgroundColor: index === 0 ? colors.secondary : colors.accent },
                  ]}
                >
                  <Text style={[ui.small, { color: colors.teal }]}>{benefit.name}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.optionTop}>
                    <Text style={[ui.h3, { color: colors.foreground }]}>{benefit.name}</Text>
                    <Text style={[ui.small, { color: colors.teal }]}>{benefit.potentialMatch}% match</Text>
                  </View>
                  <Text style={[ui.small, { color: colors.mutedForeground, marginTop: 3 }]}>
                    {benefit.fullName}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <PrimaryButton onPress={() => setPhase('ready')} icon="arrow-forward">
            Get your next step
          </PrimaryButton>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.backdrop}>
        <View style={[styles.backdropOrbLarge, { backgroundColor: colors.secondary }]} />
        <View style={[styles.backdropOrbSmall, { backgroundColor: colors.accent }]} />
      </View>
      <View style={styles.welcomeContent}>
        <View style={styles.stepHeader}>
          <Pressable onPress={() => setPhase('options')} hitSlop={10} style={styles.backRow}>
            <Ionicons name="arrow-back" size={18} color={colors.foreground} />
            <Text style={[ui.small, { color: colors.foreground }]}>Edit</Text>
          </Pressable>
          <Text style={[ui.small, { color: colors.teal, letterSpacing: 1.4 }]}>STEP 4 OF 4</Text>
        </View>

        <View style={[styles.readyMark, { backgroundColor: colors.primary }]}>
          <Ionicons name="sparkles-outline" size={30} color={colors.primaryForeground} />
        </View>
        <Text style={[ui.h2, { color: colors.foreground, marginTop: 22 }]}>Your Unione profile is ready.</Text>
        <Text style={[ui.body, { color: colors.mutedForeground, marginTop: 10 }]}>
          Let&apos;s see what may be available to you.
        </Text>

        <View style={[styles.readyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SummaryLine label="Location" value={`${form.state} · ${form.zip}`} />
          <SummaryLine label="Household" value={`${form.householdSize} people · ${form.children} children`} />
          <SummaryLine label="Employment" value={form.employment} />
          <SummaryLine label="Income" value={`${form.income} / year`} />
        </View>

        <PrimaryButton onPress={completeAndEnterHome} icon="arrow-forward">
          See my options
        </PrimaryButton>
      </View>
    </View>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  const colors = useColors();
  return (
    <View style={[styles.summaryLine, { borderTopColor: colors.border }]}>
      <Text style={[ui.small, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[ui.small, { color: colors.foreground, textAlign: 'right', flex: 1, marginLeft: 15 }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  splashScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  splashContent: { alignItems: 'center', maxWidth: 320 },
  splashBrand: { marginTop: 18, fontFamily: 'Inter_700Bold', fontSize: 14, letterSpacing: 4.2 },
  splashTagline: { marginTop: 14, fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 23, textAlign: 'center' },
  logoMark: { width: 72, height: 72, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  logoLetter: { fontFamily: 'Inter_700Bold', fontSize: 28, letterSpacing: -1 },
  screen: { flex: 1 },
  backdrop: { ...StyleSheet.absoluteFillObject },
  backdropOrbLarge: { position: 'absolute', right: -56, top: 120, width: 220, height: 220, borderRadius: 110, opacity: 0.46 },
  backdropOrbSmall: { position: 'absolute', left: -34, bottom: 140, width: 132, height: 132, borderRadius: 66, opacity: 0.5 },
  welcomeContent: { flex: 1, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 28, justifyContent: 'space-between' },
  welcomeTop: { gap: 15 },
  mark: { width: 53, height: 53, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  brand: { fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: 3.2 },
  welcomeBody: { marginTop: 6 },
  welcomeActions: { gap: 12 },
  secondaryButton: { minHeight: 54, borderWidth: 1, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  formContent: { paddingHorizontal: 24 },
  stepHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'flex-start', paddingVertical: 6, paddingRight: 4 },
  fieldGrid: { marginTop: 22 },
  field: { marginBottom: 14 },
  input: { height: 52, borderWidth: 1, borderRadius: 14, paddingHorizontal: 15, fontFamily: 'Inter_400Regular', fontSize: 15 },
  summaryCard: { borderRadius: 20, padding: 16, marginTop: 22 },
  optionStack: { borderWidth: 1, borderRadius: 20, marginTop: 22, overflow: 'hidden' },
  optionRow: { padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionIcon: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  optionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  readyMark: { width: 66, height: 66, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  readyCard: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, marginTop: 22 },
  summaryLine: { borderTopWidth: 1, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' },
});