import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BenefitCard } from '@/components/BenefitCard';
import { EmptyState, DemoPill, styles as ui } from '@/components/Ui';
import { categories, type Benefit, type BenefitCategory } from '@/data/mockData';
import { searchBenefits } from '@/services/benefitService';
import { useColors } from '@/hooks/useColors';
import { SectionIllustration, APP_IMAGES, getCategoryVisual } from '@/components/SectionIllustration';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

export default function DiscoverScreen() {
  const colors = useColors();
  const { pagePadding, topContentPadding, tabScreenBottomPadding } = useResponsiveLayout();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<BenefitCategory | undefined>();
  const [results, setResults] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let isMounted = true;
    searchBenefits(query, category).then((next) => {
      if (isMounted) {
        setResults(next);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [query, category]);

  const clearSearch = () => {
    setQuery('');
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        ui.content,
        { paddingHorizontal: pagePadding, paddingTop: topContentPadding, paddingBottom: tabScreenBottomPadding },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <View style={styles.headerTagRow}>
            <Text style={[ui.small, { color: colors.teal, letterSpacing: 1.3 }]}>EXPLORE</Text>
            <DemoPill />
          </View>
          <Text style={[ui.h1, { color: colors.foreground, marginTop: 6 }]}>Discover benefits</Text>
        </View>
      </View>

      <Text style={[ui.body, { color: colors.mutedForeground, marginTop: 6, marginBottom: 16 }]}>
        Explore programs that may support your household.
      </Text>

      {/* HEADER VISUAL */}
      <SectionIllustration
        source={category ? (getCategoryVisual(category) || APP_IMAGES.benefitsDiscovery) : APP_IMAGES.benefitsDiscovery}
        aspectRatio={2.4}
        badgeText={category ? `${category.toUpperCase()} SUPPORT` : 'BENEFITS DISCOVERY'}
        style={{ marginBottom: 16 }}
      />

      {/* SEARCH BAR */}
      <View style={[styles.searchShell, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={20} color={colors.teal} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search benefits, categories, or requirements..."
          placeholderTextColor={colors.mutedForeground}
          style={[styles.searchInput, { color: colors.foreground }]}
          returnKeyType="search"
        />
        {query ? (
          <Pressable onPress={clearSearch} hitSlop={10} accessibilityRole="button" accessibilityLabel="Clear search">
            <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
          </Pressable>
        ) : null}
      </View>

      {/* CATEGORY CHIPS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -pagePadding }}
        contentContainerStyle={[styles.categoriesContainer, { paddingHorizontal: pagePadding }]}
      >
        <Pressable
          onPress={() => setCategory(undefined)}
          accessibilityRole="button"
          accessibilityLabel="Filter for you"
          style={({ pressed }) => [
            styles.chip,
            {
              backgroundColor: !category ? colors.primary : colors.card,
              borderColor: !category ? colors.primary : colors.border,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text style={[ui.small, { color: !category ? colors.primaryForeground : colors.mutedForeground, fontFamily: 'Inter_600SemiBold' }]}>
            For you
          </Text>
        </Pressable>

        {categories.map((item) => (
          <Pressable
            key={item}
            onPress={() => setCategory(item)}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${item}`}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: category === item ? colors.secondary : colors.card,
                borderColor: category === item ? colors.teal : colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text style={[ui.small, { color: category === item ? colors.teal : colors.mutedForeground, fontFamily: 'Inter_600SemiBold' }]}>
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* LIST SECTION HEADER */}
      <View style={styles.listHeader}>
        <Text style={[ui.h3, { color: colors.foreground }]}>
          {category ? `${category} support` : query ? `Search results for "${query}"` : 'Recommended for you'}
        </Text>
        <Text style={[ui.small, { color: colors.mutedForeground }]}>
          {results.length} {results.length === 1 ? 'program' : 'programs'}
        </Text>
      </View>

      {/* RESULTS / SKELETON / EMPTY */}
      {loading ? (
        <View style={styles.skeletonContainer}>
          <ActivityIndicator color={colors.teal} style={{ marginVertical: 32 }} />
        </View>
      ) : results.length ? (
        results.map((benefit) => (
          <BenefitCard
            key={benefit.id}
            benefit={benefit}
            onPress={() => router.push(`/benefit/${benefit.id}` as any)}
          />
        ))
      ) : (
        <EmptyState
          title="No programs found"
          detail="Try adjusting your search terms or selecting a different category to explore available options."
          icon="search-outline"
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', minWidth: 0 },
  headerTagRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 },
  searchShell: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginTop: 20,
    gap: 10,
  },
  searchInput: { flex: 1, minWidth: 0, fontFamily: 'Inter_400Regular', fontSize: 15 },
  categoriesContainer: { gap: 8, paddingVertical: 18, alignItems: 'center' },
  chip: {
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listHeader: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  skeletonContainer: { alignItems: 'center', justifyContent: 'center' },
});
