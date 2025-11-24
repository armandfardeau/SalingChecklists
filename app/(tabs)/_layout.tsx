import { Tabs } from 'expo-router';
import { Text, StyleSheet } from 'react-native';
import { Typography } from '../../constants/Colors';
import { useThemedColors } from '../../hooks/useThemedColors';

export default function TabLayout() {
  const colors = useThemedColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.textInverse,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: Typography.headerTitle,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDisabled,
        tabBarLabelStyle: {
          fontSize: Typography.tabLabel,
          fontWeight: '600',
        },
        tabBarStyle: {
          height: 64,  // Taller tab bar for larger touch targets
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: colors.cardBackground,
          borderTopColor: colors.cardBorder,
          borderTopWidth: 1,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Checklists',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>📋</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabIcon, { color }]}>⚙️</Text>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: Typography.tabIcon,
  },
});
