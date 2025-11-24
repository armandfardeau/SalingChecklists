import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { vexo } from 'vexo-analytics';
import { Analytics } from '../constants/Analytics';
import '../locales'; // Initialize i18n

if (Analytics.vexoApiKey && (!Analytics.productionOnly || !__DEV__)) {
  vexo(Analytics.vexoApiKey);
}
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
