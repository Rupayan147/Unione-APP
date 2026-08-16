import { Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TAB_BAR_BASE_HEIGHT = 60;

/**
 * Shared phone layout measurements. Keeping these values in one place prevents
 * screens from independently guessing at status-bar and bottom-navigation space.
 */
export function useResponsiveLayout() {
  const insets = useSafeAreaInsets();
  const { width, height, fontScale } = useWindowDimensions();
  const pagePadding = width <= 340 ? 16 : width <= 380 ? 18 : 20;
  const safeTop = Math.max(insets.top, Platform.OS === 'web' ? 0 : 24);
  const safeBottom = Math.max(insets.bottom, Platform.OS === 'web' ? 0 : 8);
  const tabBarHeight = TAB_BAR_BASE_HEIGHT + safeBottom;

  return {
    width,
    height,
    fontScale,
    insets,
    pagePadding,
    safeTop,
    safeBottom,
    topContentPadding: safeTop + 16,
    detailTopPadding: safeTop + 14,
    tabBarHeight,
    tabScreenBottomPadding: tabBarHeight + 24,
    stickyActionBottomPadding: safeBottom + 10,
    stickyActionScrollPadding: safeBottom + 112,
    isNarrow: width <= 360,
    isCompact: width <= 360 || fontScale >= 1.2,
    usesLargeText: fontScale >= 1.2,
  };
}
