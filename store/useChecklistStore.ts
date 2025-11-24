import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkv-storage';
import {
  Checklist,
  CreateChecklistInput,
  UpdateChecklistInput,
  ChecklistStats,
} from '../types';
import { createChecklist, calculateChecklistStats, examplePreDepartureChecklist } from '../types/examples';

/**
 * Checklist store state interface
 */
interface ChecklistStoreState {
  /**
   * Array of all checklists
   */
  checklists: Checklist[];

  /**
   * Add a new checklist
   */
  addChecklist: (input: CreateChecklistInput) => void;

  /**
   * Update an existing checklist
   */
  updateChecklist: (id: string, updates: UpdateChecklistInput) => void;

  /**
   * Delete a checklist
   */
  deleteChecklist: (id: string) => void;

  /**
   * Get a checklist by ID
   */
  getChecklist: (id: string) => Checklist | undefined;

  /**
   * Get statistics for a checklist
   */
  getChecklistStats: (id: string) => ChecklistStats | undefined;

  /**
   * Toggle checklist active status
   */
  toggleChecklistActive: (id: string) => void;

  /**
   * Initialize with sample data (for demo purposes)
   */
  initializeSampleData: () => void;
}

/**
 * Checklist store with MMKV persistence
 * 
 * This store manages all checklists in the application with:
 * - CRUD operations for checklists
 * - Persistent storage via MMKV
 * - Statistics calculation
 * - TypeScript type safety
 * 
 * Usage:
 * ```tsx
 * import { useChecklistStore } from '@/store';
 * 
 * function MyComponent() {
 *   const checklists = useChecklistStore((state) => state.checklists);
 *   const addChecklist = useChecklistStore((state) => state.addChecklist);
 *   
 *   return (
 *     <Button onPress={() => addChecklist({ 
 *       name: 'My Checklist', 
 *       category: ChecklistCategory.PRE_DEPARTURE 
 *     })}>
 *       Add Checklist
 *     </Button>
 *   );
 * }
 * ```
 */
export const useChecklistStore = create<ChecklistStoreState>()(
  persist(
    (set, get) => ({
      checklists: [],

      addChecklist: (input: CreateChecklistInput) => {
        const newChecklist = createChecklist(input);
        set((state) => ({
          checklists: [...state.checklists, newChecklist],
        }));
      },

      updateChecklist: (id: string, updates: UpdateChecklistInput) => {
        set((state) => ({
          checklists: state.checklists.map((checklist) =>
            checklist.id === id
              ? { ...checklist, ...updates, updatedAt: new Date() }
              : checklist
          ),
        }));
      },

      deleteChecklist: (id: string) => {
        set((state) => ({
          checklists: state.checklists.filter(
            (checklist) => checklist.id !== id
          ),
        }));
      },

      getChecklist: (id: string) => {
        return get().checklists.find((checklist) => checklist.id === id);
      },

      getChecklistStats: (id: string) => {
        const checklist = get().getChecklist(id);
        if (!checklist) return undefined;
        return calculateChecklistStats(checklist);
      },

      toggleChecklistActive: (id: string) => {
        set((state) => ({
          checklists: state.checklists.map((checklist) =>
            checklist.id === id
              ? { 
                  ...checklist, 
                  isActive: !checklist.isActive, 
                  updatedAt: new Date() 
                }
              : checklist
          ),
        }));
      },

      initializeSampleData: () => {
        // Only initialize if there are no checklists yet
        if (get().checklists.length === 0) {
          set({ checklists: [examplePreDepartureChecklist] });
        }
      },
    }),
    {
      name: 'checklist-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
