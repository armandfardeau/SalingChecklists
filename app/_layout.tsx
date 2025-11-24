import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RevenueCatProvider } from '../contexts/RevenueCatProvider';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RevenueCatProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </RevenueCatProvider>
    </SafeAreaProvider>
  );
}
