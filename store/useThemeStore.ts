import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkv-storage';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  _hasHydrated: boolean;
}

/**
 * Theme store with MMKV persistence
 * 
 * Manages the app's theme mode (light/dark) with persistent storage
 * 
 * Usage:
 * ```tsx
 * import { useThemeStore } from '@/store';
 * 
 * function MyComponent() {
 *   const mode = useThemeStore((state) => state.mode);
 *   const toggleTheme = useThemeStore((state) => state.toggleTheme);
 *   
 *   return (
 *     <Button onPress={toggleTheme}>
 *       Current theme: {mode}
 *     </Button>
 *   );
 * }
 * ```
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      _hasHydrated: false,
      setTheme: (mode: ThemeMode) => set({ mode }),
      toggleTheme: () =>
        set((state) => ({
          mode: state.mode === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => mmkvStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },
    }
  )
);
