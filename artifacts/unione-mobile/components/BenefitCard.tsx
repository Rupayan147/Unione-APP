import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type Benefit, type BenefitCategory } from '@/data/mockData';
import { styles as ui } from '@/components/Ui';
import { useColors } from '@/hooks/useColors';

export function BenefitCard({ benefit, onPress }: { benefit: Benefit; onPress: () => void }) {
  const colors = useColors();
  const { width, fontScale } = useWindowDimensions();
  const compact = width <= 360 || fontScale >= 1.2;
  const categoryTheme = getCategoryTheme(benefit.category, colors);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View ${benefit.name} details`}
      testID={`benefit-card-${benefit.id}`}
      style={({ pressed }) => [
        styles.card,
        compact && styles.compactCard,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      {/* A fixed visual mark and flexible content keep long program names readable. */}
      <View style={[styles.topRow, fontScale >= 1.4 && styles.stackedTopRow]}>
        <View style={[styles.iconBox, compact && styles.compactIconBox, { backgroundColor: categoryTheme.bg }]}>
          <Ionicons name={categoryTheme.icon} size={22} color={categoryTheme.fg} />
        </View>

        <View style={[styles.contentColumn, fontScale >= 1.4 && styles.stackedContentColumn]}>
          <View style={styles.badgeRow}>
            <View style={[styles.categoryChip, { backgroundColor: categoryTheme.bg }]}>
              <Text style={[styles.categoryChipText, { color: categoryTheme.fg }]}>{benefit.category}</Text>
            </View>
            <View style={[styles.matchBadge, { backgroundColor: colors.accent }]}>
              <Text style={[styles.matchText, { color: colors.teal }]}>{benefit.potentialMatch}% match</Text>
            </View>
          </View>
          <Text style={[ui.h3, styles.flexibleText, { color: colors.foreground, marginTop: 8 }]}>{benefit.name}</Text>
          <Text style={[ui.small, styles.flexibleText, { color: colors.mutedForeground, marginTop: 2 }]}>
            {benefit.fullName}
          </Text>
          <Text style={[ui.body, styles.description, { color: colors.foreground }]} numberOfLines={compact ? 4 : 3}>
            {benefit.description}
          </Text>
        </View>
      </View>

      {/* TAGS ROW (if available) */}
      {benefit.tags && benefit.tags.length > 0 ? (
        <View style={styles.tagsRow}>
          {benefit.tags.slice(0, 3).map((tag) => (
            <View key={tag} style={[styles.tagPill, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.tagText, { color: colors.teal }]}>{tag}</Text>
            </View>
          ))}
          {benefit.estimatedProcessingTime ? (
            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={12} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {benefit.estimatedProcessingTime}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* CARD FOOTER */}
      <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
        <View style={styles.footerMeta}>
          <Ionicons name="shield-checkmark-outline" size={14} color={colors.mutedForeground} />
          <Text style={[styles.metaText, styles.flexibleText, { color: colors.mutedForeground }]}>Review official requirements</Text>
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

export function iconForCategory(category: BenefitCategory | string): keyof typeof Ionicons.glyphMap {
  switch (category) {
    case 'Employment':
      return 'briefcase-outline';
    case 'Healthcare':
      return 'heart-outline';
    case 'Food':
      return 'restaurant-outline';
    case 'Housing':
      return 'home-outline';
    case 'Family':
      return 'people-outline';
    case 'Education':
      return 'school-outline';
    case 'Financial':
      return 'cash-outline';
    case 'Utilities':
      return 'flash-outline';
    default:
      return 'sparkles-outline';
  }
}

export function getCategoryTheme(category: BenefitCategory | string, colors: any) {
  const icon = iconForCategory(category);
  switch (category) {
    case 'Employment':
      return { bg: colors.secondary, fg: colors.teal, icon };
    case 'Healthcare':
      return { bg: colors.accent, fg: colors.teal, icon };
    case 'Food':
      return { bg: `${colors.warning}1A`, fg: colors.warning, icon };
    case 'Housing':
      return { bg: colors.secondary, fg: colors.teal, icon };
    case 'Education':
      return { bg: colors.accent, fg: colors.navySoft, icon };
    case 'Family':
      return { bg: `${colors.teal}14`, fg: colors.teal, icon };
    case 'Financial':
      return { bg: colors.secondary, fg: colors.teal, icon };
    case 'Utilities':
      return { bg: `${colors.warning}18`, fg: colors.warning, icon };
    default:
      return { bg: colors.secondary, fg: colors.teal, icon };
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  compactCard: { padding: 14 },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, width: '100%' },
  stackedTopRow: { flexDirection: 'column' },
  iconBox: { width: 48, height: 48, flexBasis: 48, flexShrink: 0, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  compactIconBox: { width: 42, height: 42, flexBasis: 42, borderRadius: 13 },
  contentColumn: { flex: 1, minWidth: 0 },
  stackedContentColumn: { flex: 0, width: '100%' },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  flexibleText: { flexShrink: 1, minWidth: 0 },
  description: { marginTop: 9, fontSize: 14, lineHeight: 20 },
  matchBadge: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 99, flexShrink: 0 },
  matchText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, flexShrink: 1 },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 4,
  },
  metaText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  cardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  categoryChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99, flexShrink: 1, maxWidth: '100%' },
  categoryChipText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, flexShrink: 1 },
  footerMeta: { flex: 1, minWidth: 140, flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionLink: { flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 0 },
});
