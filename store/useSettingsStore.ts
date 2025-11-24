import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkv-storage';
import i18n, { DEFAULT_LANGUAGE } from '../locales';

/**
 * Settings store interface
 */
interface SettingsState {
  language: string;
  _hasHydrated: boolean;
  setLanguage: (language: string) => void;
  setHasHydrated: (state: boolean) => void;
}

/**
 * Settings store with MMKV persistence
 * Manages app settings including language preference
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: DEFAULT_LANGUAGE,
      _hasHydrated: false,
      setLanguage: (language: string) => {
        i18n.changeLanguage(language);
        set({ language });
      },
      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => mmkvStorage),
      onRehydrateStorage: () => (state) => {
        // After rehydration, update i18n with saved language and mark as hydrated
        if (state) {
          i18n.changeLanguage(state.language);
          state.setHasHydrated(true);
        }
      },
    }
  )
);
