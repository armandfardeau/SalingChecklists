import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { vexo } from 'vexo-analytics';
import { Analytics } from '../constants/Analytics';

// Initialize Vexo Analytics
if (Analytics.vexoApiKey && (!Analytics.productionOnly || !__DEV__)) {
  vexo(Analytics.vexoApiKey);
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SafeAreaProvider>
  );
}
