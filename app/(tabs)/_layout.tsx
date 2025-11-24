import { Tabs } from 'expo-router';
import { Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors, Typography } from '../../constants/Colors';

export default function TabLayout() {
  const { t } = useTranslation();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.sea.primary,
        },
        headerTintColor: Colors.sea.textInverse,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: Typography.headerTitle,
        },
        tabBarActiveTintColor: Colors.sea.primary,
        tabBarInactiveTintColor: Colors.sea.tabIconDefault,
        tabBarLabelStyle: {
          fontSize: Typography.tabLabel,
          fontWeight: '600',
        },
        tabBarStyle: {
          height: 64,  // Taller tab bar for larger touch targets
          paddingBottom: 8,
          paddingTop: 8,
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
            <Text style={[styles.tabIcon, { color }]}>📋</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
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
