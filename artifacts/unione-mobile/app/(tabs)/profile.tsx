import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { DemoPill, SectionTitle, styles as ui } from '@/components/Ui';
import { useUnione } from '@/context/UnioneContext';
import { useColors } from '@/hooks/useColors';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

export default function ProfileScreen() {
  const colors = useColors();
  const { width, fontScale, pagePadding, topContentPadding, tabScreenBottomPadding } = useResponsiveLayout();
  const stackDetails = width <= 340 || fontScale >= 1.25;
  const { profile, setProfile, resetDemoState } = useUnione();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  const save = () => {
    setProfile(draft);
    setEditing(false);
    Alert.alert('Profile updated', 'Your benefit recommendations will update based on your details.');
  };

  const handleReset = () => {
    Alert.alert(
      'Reset demo state?',
      'This will clear your local state and let you experience the first-time onboarding flow again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetDemoState();
            Alert.alert('State reset', 'Local storage has been cleared.');
          },
        },
      ],
    );
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return editing ? (
    <KeyboardAwareScrollViewCompat
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[ui.content, { paddingHorizontal: pagePadding, paddingTop: topContentPadding, paddingBottom: tabScreenBottomPadding }]}
      bottomOffset={80}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.topEditNav}>
        <Pressable onPress={() => setEditing(false)} hitSlop={10} style={styles.topAction}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[ui.h3, { color: colors.foreground }]}>Edit profile</Text>
        <Pressable onPress={save} hitSlop={10} style={styles.topAction}>
          <Text style={[ui.link, { color: colors.teal }]}>Save</Text>
        </Pressable>
      </View>

      <Text style={[ui.body, { color: colors.mutedForeground, marginTop: 16, marginBottom: 20 }]}>
        Keep your details current to make your benefit recommendations as accurate as possible.
      </Text>

      {[
        ['name', 'Full name'],
        ['age', 'Age'],
        ['state', 'State'],
        ['zip', 'ZIP code'],
        ['householdSize', 'Household size'],
        ['employment', 'Employment status'],
        ['income', 'Approximate annual income'],
        ['children', 'Number of children'],
      ].map(([key, label]) => (
        <View key={key} style={styles.field}>
          <Text style={[ui.small, { color: colors.foreground, marginBottom: 8, fontFamily: 'Inter_600SemiBold' }]}>
            {label}
          </Text>
          <TextInput
            value={draft[key as keyof typeof draft]}
            onChangeText={(value) => setDraft((current) => ({ ...current, [key]: value }))}
            style={[
              styles.input,
              { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground },
            ]}
          />
        </View>
      ))}
    </KeyboardAwareScrollViewCompat>
  ) : (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        ui.content,
        { paddingHorizontal: pagePadding, paddingTop: topContentPadding, paddingBottom: tabScreenBottomPadding },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={[ui.small, { color: colors.teal, letterSpacing: 1.3 }]}>YOUR SPACE</Text>
          <Text style={[ui.h1, { color: colors.foreground, marginTop: 6 }]}>Profile</Text>
        </View>

        <Pressable
          onPress={() => {
            setDraft(profile);
            setEditing(true);
          }}
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
          style={({ pressed }) => [
            styles.editBtn,
            { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.75 : 1 },
          ]}
        >
          <Ionicons name="pencil-outline" size={15} color={colors.foreground} />
          <Text style={[ui.small, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>Edit</Text>
        </Pressable>
      </View>

      {/* PROFILE HERO */}
      <View style={[styles.profileHero, { backgroundColor: colors.primary }]}>
        <View style={styles.identityRow}>
          <View style={[styles.bigAvatar, { backgroundColor: 'rgba(255,255,255,0.16)' }]}>
            <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>
              {getInitials(profile.name)}
            </Text>
          </View>
          <View style={styles.identityCopy}>
            <Text style={[ui.h2, styles.flexibleText, { color: colors.primaryForeground }]}>{profile.name}</Text>
            <Text style={[ui.small, styles.flexibleText, { color: colors.primaryForeground, opacity: 0.86, marginTop: 4 }]}>
              {profile.state} · Household {profile.householdSize}
            </Text>
            <Text style={[ui.small, styles.flexibleText, { color: colors.primaryForeground, opacity: 0.72, marginTop: 2 }]}>
              ZIP {profile.zip} · {profile.employment}
            </Text>
          </View>
        </View>
        <View style={styles.heroBadgeRow}><DemoPill /></View>
      </View>

      {/* 1. MY INFORMATION */}
      <View style={{ marginTop: 26 }}>
        <SectionTitle title="My information" />
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            ['Age', profile.age],
            ['Household size', `${profile.householdSize} people`],
            ['Children in household', profile.children],
            ['Employment status', profile.employment],
            ['Approximate annual income', profile.income],
          ].map(([label, value], idx) => (
            <View
              key={label}
              style={[
                styles.infoLine,
                stackDetails && styles.stackedInfoLine,
                idx > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
              ]}
            >
              <Text style={[ui.small, styles.infoLabel, { color: colors.mutedForeground }]}>{label}</Text>
              <Text style={[ui.small, styles.infoValue, { color: colors.foreground, fontFamily: 'Inter_600SemiBold', textAlign: stackDetails ? 'left' : 'right' }]}>
                {value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 2. PREFERENCES & SAVED */}
      <View style={{ marginTop: 26 }}>
        <SectionTitle title="Saved & Preferences" />
        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Pressable
            onPress={() => router.push('/(tabs)/discover')}
            style={({ pressed }) => [styles.menuItem, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="bookmark-outline" size={20} color={colors.teal} />
            <Text style={[ui.body, { color: colors.foreground, flex: 1 }]}>Saved benefits</Text>
            <Ionicons name="chevron-forward" size={17} color={colors.mutedForeground} />
          </Pressable>

          <View style={{ height: 1, backgroundColor: colors.border }} />

          <Pressable
            onPress={() => Alert.alert('Notifications', 'Notification preferences are enabled for demo mode.')}
            style={({ pressed }) => [styles.menuItem, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="notifications-outline" size={20} color={colors.teal} />
            <Text style={[ui.body, { color: colors.foreground, flex: 1 }]}>Notifications</Text>
            <Ionicons name="chevron-forward" size={17} color={colors.mutedForeground} />
          </Pressable>
        </View>
      </View>

      {/* 3. SETTINGS & SYSTEM */}
      <View style={{ marginTop: 26 }}>
        <SectionTitle title="Settings & System" />
        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            ['lock-closed-outline', 'Trust & Security', false],
            ['analytics-outline', 'Policy Insights', false],
            ['business-outline', 'Institutional Impact', false],
            ['help-circle-outline', 'Help & support', false],
            ['refresh-outline', 'Reset demo state', true],
          ].map(([icon, label, isDestructive], idx) => (
            <Pressable
              key={label as string}
              onPress={() =>
                isDestructive
                  ? handleReset()
                  : label === 'Trust & Security'
                    ? router.push('/trust-security' as any)
                    : label === 'Policy Insights'
                      ? router.push('/policy-insights' as any)
                      : label === 'Institutional Impact'
                        ? router.push('/institutional-impact' as any)
                        : Alert.alert(label as string, 'Support resources are represented as a future product flow in this prototype.')
              }
              style={({ pressed }) => [
                styles.menuItem,
                idx > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons
                name={icon as keyof typeof Ionicons.glyphMap}
                size={20}
                color={isDestructive ? colors.destructive : colors.teal}
              />
              <Text
                style={[
                  ui.body,
                  { color: isDestructive ? colors.destructive : colors.foreground, flex: 1 },
                ]}
              >
                {label as string}
              </Text>
              <Ionicons name="chevron-forward" size={17} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </View>
      </View>

      <Text style={[ui.small, { color: colors.mutedForeground, textAlign: 'center', marginTop: 26 }]}>
        Unione prototype v1.0 · Local demo mode
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  editBtn: {
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 44,
    minWidth: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  topEditNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topAction: { minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' },
  profileHero: { borderRadius: 22, padding: 18, marginTop: 22, gap: 14, overflow: 'hidden' },
  identityRow: { flexDirection: 'row', alignItems: 'center', gap: 14, width: '100%' },
  identityCopy: { flex: 1, minWidth: 0 },
  flexibleText: { flexShrink: 1, minWidth: 0 },
  bigAvatar: { width: 52, height: 52, flexBasis: 52, flexShrink: 0, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 18 },
  heroBadgeRow: { width: '100%', flexDirection: 'row', flexWrap: 'wrap' },
  infoCard: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 16 },
  infoLine: { minHeight: 52, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  stackedInfoLine: { flexDirection: 'column', alignItems: 'flex-start', gap: 3 },
  infoLabel: { flex: 1, minWidth: 0 },
  infoValue: { flex: 1, minWidth: 0 },
  menuCard: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 16 },
  menuItem: { minHeight: 56, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 12 },
  field: { marginBottom: 16 },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
  },
});
