import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkv-storage';

/**
 * Supported languages in the app
 */
export type SupportedLocale = 'en' | 'fr' | 'es' | 'de' | 'it';

interface LocaleState {
  /**
   * Currently selected locale/language
   */
  locale: SupportedLocale;

  /**
   * Set the app locale/language
   */
  setLocale: (locale: SupportedLocale) => void;

  /**
   * Flag indicating if the store has been hydrated from persistent storage
   */
  _hasHydrated: boolean;
}

/**
 * Locale store with MMKV persistence
 * 
 * Manages the app's language/locale preference with persistent storage
 * 
 * Usage:
 * ```tsx
 * import { useLocaleStore } from '@/store';
 * 
 * function MyComponent() {
 *   const locale = useLocaleStore((state) => state.locale);
 *   const setLocale = useLocaleStore((state) => state.setLocale);
 *   
 *   return (
 *     <Button onPress={() => setLocale('fr')}>
 *       Switch to French
 *     </Button>
 *   );
 * }
 * ```
 */
export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'en',
      _hasHydrated: false,
      setLocale: (locale: SupportedLocale) => set({ locale }),
    }),
    {
      name: 'locale-storage',
      storage: createJSONStorage(() => mmkvStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },
    }
  )
);
