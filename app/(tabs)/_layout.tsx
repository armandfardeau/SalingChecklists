import { Tabs } from 'expo-router';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
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
          fontSize: 20,  // Larger header title
        },
        tabBarActiveTintColor: Colors.sea.primary,
        tabBarInactiveTintColor: Colors.sea.tabIconDefault,
        tabBarLabelStyle: {
          fontSize: 14,  // Larger tab labels
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
    fontSize: 28,  // Larger tab icons for better visibility
  },
});
