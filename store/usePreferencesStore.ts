import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkv-storage';

export type Language = 'en' | 'fr' | 'es' | 'de' | 'it';

interface PreferencesState {
  language: Language;
  hasCompletedOnboarding: boolean;
  setLanguage: (language: Language) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  _hasHydrated: boolean;
}

/**
 * Preferences store with MMKV persistence
 * 
 * Manages user preferences including language selection and onboarding state
 * 
 * Usage:
 * ```tsx
 * import { usePreferencesStore } from '@/store';
 * 
 * function MyComponent() {
 *   const language = usePreferencesStore((state) => state.language);
 *   const setLanguage = usePreferencesStore((state) => state.setLanguage);
 *   
 *   return (
 *     <Button onPress={() => setLanguage('fr')}>
 *       Current language: {language}
 *     </Button>
 *   );
 * }
 * ```
 */
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      language: 'en',
      hasCompletedOnboarding: false,
      _hasHydrated: false,
      setLanguage: (language: Language) => set({ language }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetOnboarding: () => set({ hasCompletedOnboarding: false }),
    }),
    {
      name: 'preferences-storage',
      storage: createJSONStorage(() => mmkvStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },
    }
  )
);
