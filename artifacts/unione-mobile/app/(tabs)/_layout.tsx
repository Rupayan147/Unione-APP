import React from 'react';
import { Platform, StyleSheet, useColorScheme, useWindowDimensions, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

export default function TabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';
  const { width } = useWindowDimensions();
  const { safeBottom, tabBarHeight } = useResponsiveLayout();
  const icon = (name: React.ComponentProps<typeof Feather>['name']) => ({ color }: { color: string }) => (
    <Feather name={name} size={21} color={color} />
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarAllowFontScaling: false,
        tabBarLabelStyle: { fontSize: width <= 340 ? 9 : 10, lineHeight: 13, fontFamily: 'Inter_500Medium' },
        tabBarItemStyle: { minWidth: 0, paddingTop: 5 },
        tabBarStyle: {
          position: 'absolute',
          height: isWeb ? 76 : tabBarHeight,
          paddingBottom: isWeb ? 8 : safeBottom,
          paddingTop: 2,
          backgroundColor: isIOS ? 'transparent' : colors.background,
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: colors.border,
          elevation: 0,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={100}
              tint={isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: colors.background },
              ]}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: icon('home') }}
      />
      <Tabs.Screen name="discover" options={{ title: 'Discover', tabBarIcon: icon('search') }} />
      <Tabs.Screen name="ask" options={{ title: 'Ask', tabBarIcon: icon('message-circle') }} />
      <Tabs.Screen name="applications" options={{ title: 'Applications', tabBarIcon: icon('check-circle') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon('user') }} />
    </Tabs>
  );
}
