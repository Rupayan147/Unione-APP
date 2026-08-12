import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type Benefit } from '@/data/mockData';
import { styles as ui } from '@/components/Ui';
import { useColors } from '@/hooks/useColors';

export function BenefitCard({ benefit, onPress }: { benefit: Benefit; onPress: () => void }) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View ${benefit.name} details`}
      testID={`benefit-card-${benefit.id}`}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={styles.topRow}>
        <View style={[styles.icon, { backgroundColor: colors.secondary }]}>
          <Ionicons name={iconForCategory(benefit.category)} size={22} color={colors.teal} />
        </View>

        <View style={styles.titleBlock}>
          <View style={styles.titleTop}>
            <Text style={[ui.h3, { color: colors.foreground }]}>{benefit.name}</Text>
            <View style={[styles.matchBadge, { backgroundColor: colors.accent }]}>
              <Text style={[styles.matchText, { color: colors.teal }]}>
                {benefit.potentialMatch}% match
              </Text>
            </View>
          </View>
          <Text style={[ui.small, { color: colors.mutedForeground, marginTop: 2 }]}>
            {benefit.fullName}
          </Text>
        </View>
      </View>

      <Text style={[ui.body, { color: colors.mutedForeground, marginTop: 12, fontSize: 14, lineHeight: 20 }]} numberOfLines={2}>
        {benefit.description}
      </Text>

      <View style={styles.cardFooter}>
        <View style={[styles.categoryChip, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.categoryChipText, { color: colors.teal }]}>{benefit.category}</Text>
        </View>
        <View style={styles.actionLink}>
          <Text style={[ui.small, { color: colors.teal, fontFamily: 'Inter_600SemiBold' }]}>
            View details
          </Text>
          <Ionicons name="chevron-forward" size={15} color={colors.teal} />
        </View>
      </View>
    </Pressable>
  );
}

export function iconForCategory(category: string): keyof typeof Ionicons.glyphMap {
  switch (category) {
    case 'Food':
      return 'restaurant-outline';
    case 'Healthcare':
      return 'heart-outline';
    case 'Housing':
      return 'home-outline';
    case 'Employment':
      return 'briefcase-outline';
    case 'Family':
      return 'people-outline';
    case 'Financial':
      return 'cash-outline';
    case 'Education':
      return 'school-outline';
    case 'Utilities':
      return 'flash-outline';
    default:
      return 'sparkles-outline';
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  titleBlock: { flex: 1 },
  titleTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  matchBadge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 99 },
  matchText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F3',
  },
  categoryChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  categoryChipText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  actionLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});