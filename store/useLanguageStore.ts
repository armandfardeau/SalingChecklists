import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage } from './mmkv-storage';
import i18n from '../utils/i18n';
import type { LanguageCode } from '../utils/i18n';

interface LanguageStore {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language: LanguageCode) => {
        i18n.changeLanguage(language);
        set({ language });
      },
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => storage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Restore language to i18n when rehydrated
          i18n.changeLanguage(state.language);
          state.setHasHydrated(true);
        }
      },
    }
  )
);
