import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#2f95dc',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: '#2f95dc',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Checklists',
          tabBarIcon: () => '📋',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: () => '⚙️',
        }}
      />
    </Tabs>
  );
}
