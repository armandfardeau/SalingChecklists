import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { usePreferencesStore } from '../store';

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const hasCompletedOnboarding = usePreferencesStore((state) => state.hasCompletedOnboarding);
  const hasHydrated = usePreferencesStore((state) => state._hasHydrated);

  useEffect(() => {
    // Wait for store to hydrate before deciding where to redirect
    if (hasHydrated) {
      setIsReady(true);
    }
  }, [hasHydrated]);

  if (!isReady) {
    // Show nothing while hydrating to avoid flicker
    return null;
  }

  return <Redirect href={hasCompletedOnboarding ? '/(tabs)' : '/onboarding'} />;
}
