import { Tabs } from 'expo-router';
import { Typography } from '../../constants/Colors';
import { useThemedColors } from '../../hooks/useThemedColors';
import { useTranslation } from '../../hooks/useTranslation';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colors = useThemedColors();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
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
          height: 100,  // Taller tab bar for larger touch targets
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
          title: t('tabs.checklists'),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="checklist" size={Typography.tabIcon} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          title: t('tabs.emergency'),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="emergency" size={Typography.tabIcon} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={Typography.tabIcon} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
