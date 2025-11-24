import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkv-storage';
import {
  Checklist,
  CreateChecklistInput,
  UpdateChecklistInput,
  ChecklistStats,
  TaskStatus,
  Task,
} from '../types';
import { createChecklist, calculateChecklistStats, updateTask } from '../types/examples';
import { loadDefaultChecklists } from '../utils/loadDefaultTasks';

/**
 * Checklist store state interface
 */
interface ChecklistStoreState {
  /**
   * Array of all checklists
   */
  checklists: Checklist[];

  /**
   * Flag indicating if the store has been hydrated from persistent storage
   */
  _hasHydrated: boolean;

  /**
   * Set the hydration status
   */
  _setHasHydrated: (hasHydrated: boolean) => void;

  /**
   * Add a new checklist
   */
  addChecklist: (input: CreateChecklistInput) => void;

  /**
   * Add a new checklist with tasks
   */
  addChecklistWithTasks: (input: CreateChecklistInput, tasks: Task[]) => string;

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

  /**
   * Update task status in a checklist
   */
  updateTaskStatus: (checklistId: string, taskId: string, status: TaskStatus) => void;

  /**
   * Update all tasks in a checklist
   */
  updateChecklistTasks: (checklistId: string, tasks: Task[]) => void;
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
      _hasHydrated: false,

      _setHasHydrated: (hasHydrated: boolean) => {
        set({ _hasHydrated: hasHydrated });
      },

      addChecklist: (input: CreateChecklistInput) => {
        const newChecklist = createChecklist(input);
        set((state) => ({
          checklists: [...state.checklists, newChecklist],
        }));
      },

      addChecklistWithTasks: (input: CreateChecklistInput, tasks: Task[]) => {
        const newChecklist = { ...createChecklist(input), tasks };
        set((state) => ({
          checklists: [...state.checklists, newChecklist],
        }));
        return newChecklist.id;
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
          const defaultChecklists = loadDefaultChecklists();
          set({ checklists: defaultChecklists });
        }
      },

      updateTaskStatus: (checklistId: string, taskId: string, status: TaskStatus) => {
        set((state) => ({
          checklists: state.checklists.map((checklist) => {
            if (checklist.id !== checklistId) return checklist;

            const updatedTasks = checklist.tasks.map((task) => {
              if (task.id !== taskId) return task;
              return updateTask(task, { status });
            });

            // Check if all tasks are now completed
            const allTasksCompleted = updatedTasks.every(t => t.status === TaskStatus.COMPLETED);

            return {
              ...checklist,
              tasks: updatedTasks,
              updatedAt: new Date(),
              lastCompletedAt: allTasksCompleted ? new Date() : checklist.lastCompletedAt,
            };
          }),
        }));
      },

      updateChecklistTasks: (checklistId: string, tasks: Task[]) => {
        set((state) => ({
          checklists: state.checklists.map((checklist) =>
            checklist.id === checklistId
              ? { ...checklist, tasks, updatedAt: new Date() }
              : checklist
          ),
        }));
      },
    }),
    {
      name: 'checklist-storage',
      storage: createJSONStorage(() => mmkvStorage),
      onRehydrateStorage: () => (state, error) => {
        // Mark store as hydrated even if there was an error
        // This prevents the app from being stuck waiting for hydration
        if (state) {
          state._setHasHydrated(true);
        }
        // If hydration fails, we still want the app to function
        // The store will use its initial state (empty array)
        // and sample data will be initialized
      },
    }
  )
);
