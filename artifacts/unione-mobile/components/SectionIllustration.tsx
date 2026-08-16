import { Image, ImageSourcePropType, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { APP_IMAGES, getCategoryVisual, type AppImageKey } from '@/constants/images';

export { APP_IMAGES, getCategoryVisual, type AppImageKey };

interface SectionIllustrationProps {
  source: ImageSourcePropType;
  aspectRatio?: number;
  height?: number;
  badgeText?: string;
  caption?: string;
  style?: ViewStyle;
}

export function SectionIllustration({
  source,
  aspectRatio = 1.8,
  height,
  badgeText,
  caption,
  style,
}: SectionIllustrationProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        height ? { height } : { aspectRatio },
        style,
      ]}
    >
      <Image
        source={source}
        style={styles.image}
        resizeMode="cover"
        accessibilityRole="image"
      />

      {badgeText ? (
        <View style={[styles.badge, { backgroundColor: `${colors.teal}EE` }]}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      ) : null}

      {caption ? (
        <View style={[styles.captionBar, { backgroundColor: 'rgba(20, 35, 49, 0.75)' }]}>
          <Text style={styles.captionText} numberOfLines={1}>
            {caption}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    maxWidth: '85%',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.8,
    flexShrink: 1,
  },
  captionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  captionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    flexShrink: 1,
  },
});
