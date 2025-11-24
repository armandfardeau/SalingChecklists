import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkv-storage';

/**
 * Example store interface
 * Add your store state properties here
 */
interface StoreState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

/**
 * Example Zustand store with MMKV persistence
 * 
 * This store demonstrates:
 * - State management with Zustand
 * - Persistent storage with MMKV
 * - TypeScript type safety
 * 
 * Usage:
 * ```tsx
 * import { useStore } from '@/store/useStore';
 * 
 * function MyComponent() {
 *   const count = useStore((state) => state.count);
 *   const increment = useStore((state) => state.increment);
 *   
 *   return (
 *     <Button onPress={increment}>
 *       Count: {count}
 *     </Button>
 *   );
 * }
 * ```
 */
export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set({ count: 0 }),
    }),
    {
      name: 'app-storage', // unique name for the storage key
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
