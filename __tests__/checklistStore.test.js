/**
 * Checklist Store tests
 * Tests for Zustand checklist store with MMKV persistence
 */

import { ChecklistCategory, TaskStatus, TaskPriority } from '../types';

// Mock MMKV before importing the store
jest.mock('react-native-mmkv', () => {
  const mockStorage = new Map();
  
  return {
    createMMKV: jest.fn(() => ({
      set: jest.fn((key, value) => {
        mockStorage.set(key, value);
      }),
      getString: jest.fn((key) => {
        return mockStorage.get(key);
      }),
      remove: jest.fn((key) => {
        mockStorage.delete(key);
      }),
      clearAll: jest.fn(() => {
        mockStorage.clear();
      }),
    })),
  };
});

describe('Checklist Store', () => {
  let useChecklistStore;

  beforeEach(() => {
    // Clear the module cache to get a fresh store instance
    jest.resetModules();
    const storeModule = require('../store/useChecklistStore');
    useChecklistStore = storeModule.useChecklistStore;
  });

  it('should initialize with empty checklists array', () => {
    const state = useChecklistStore.getState();
    expect(state.checklists).toEqual([]);
  });

  it('should add a new checklist', () => {
    const state = useChecklistStore.getState();
    
    state.addChecklist({
      name: 'Test Checklist',
      category: ChecklistCategory.PRE_DEPARTURE,
      description: 'A test checklist',
    });

    const newState = useChecklistStore.getState();
    expect(newState.checklists).toHaveLength(1);
    expect(newState.checklists[0].name).toBe('Test Checklist');
    expect(newState.checklists[0].category).toBe(ChecklistCategory.PRE_DEPARTURE);
    expect(newState.checklists[0].description).toBe('A test checklist');
    expect(newState.checklists[0].isActive).toBe(true);
    expect(newState.checklists[0].tasks).toEqual([]);
  });

  it('should update an existing checklist', () => {
    const state = useChecklistStore.getState();
    
    // Add a checklist first
    state.addChecklist({
      name: 'Original Name',
      category: ChecklistCategory.PRE_DEPARTURE,
    });

    const checklistId = useChecklistStore.getState().checklists[0].id;

    // Update the checklist
    state.updateChecklist(checklistId, {
      name: 'Updated Name',
      description: 'New description',
    });

    const updatedState = useChecklistStore.getState();
    expect(updatedState.checklists[0].name).toBe('Updated Name');
    expect(updatedState.checklists[0].description).toBe('New description');
  });

  it('should delete a checklist', () => {
    const state = useChecklistStore.getState();
    
    // Add two checklists
    state.addChecklist({
      name: 'Checklist 1',
      category: ChecklistCategory.PRE_DEPARTURE,
    });
    state.addChecklist({
      name: 'Checklist 2',
      category: ChecklistCategory.NAVIGATION,
    });

    const currentState = useChecklistStore.getState();
    expect(currentState.checklists).toHaveLength(2);

    const firstChecklistId = currentState.checklists[0].id;

    // Delete the first checklist
    state.deleteChecklist(firstChecklistId);

    const finalState = useChecklistStore.getState();
    expect(finalState.checklists).toHaveLength(1);
    expect(finalState.checklists[0].name).toBe('Checklist 2');
  });

  it('should get a checklist by ID', () => {
    const state = useChecklistStore.getState();
    
    state.addChecklist({
      name: 'Find Me',
      category: ChecklistCategory.SAFETY,
    });

    const checklistId = useChecklistStore.getState().checklists[0].id;
    const foundChecklist = state.getChecklist(checklistId);

    expect(foundChecklist).toBeDefined();
    expect(foundChecklist.name).toBe('Find Me');
  });

  it('should return undefined for non-existent checklist ID', () => {
    const state = useChecklistStore.getState();
    const foundChecklist = state.getChecklist('non-existent-id');

    expect(foundChecklist).toBeUndefined();
  });

  it('should toggle checklist active status', () => {
    const state = useChecklistStore.getState();
    
    state.addChecklist({
      name: 'Toggle Me',
      category: ChecklistCategory.PRE_DEPARTURE,
    });

    const checklistId = useChecklistStore.getState().checklists[0].id;
    expect(useChecklistStore.getState().checklists[0].isActive).toBe(true);

    // Toggle to inactive
    state.toggleChecklistActive(checklistId);
    expect(useChecklistStore.getState().checklists[0].isActive).toBe(false);

    // Toggle back to active
    state.toggleChecklistActive(checklistId);
    expect(useChecklistStore.getState().checklists[0].isActive).toBe(true);
  });

  it('should calculate checklist stats correctly', () => {
    const state = useChecklistStore.getState();
    
    // Add a checklist with tasks
    state.addChecklist({
      name: 'Stats Test',
      category: ChecklistCategory.PRE_DEPARTURE,
    });

    const checklistId = useChecklistStore.getState().checklists[0].id;
    
    // Manually add some tasks to the checklist for testing
    const mockTasks = [
      {
        id: 'task-1',
        title: 'Task 1',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'task-2',
        title: 'Task 2',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'task-3',
        title: 'Task 3',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.LOW,
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    state.updateChecklist(checklistId, { tasks: mockTasks });

    const stats = state.getChecklistStats(checklistId);

    expect(stats).toBeDefined();
    expect(stats.totalTasks).toBe(3);
    expect(stats.completedTasks).toBe(2);
    expect(stats.pendingTasks).toBe(1);
    expect(stats.completionPercentage).toBe(67); // 2/3 rounded
    expect(stats.isFullyCompleted).toBe(false);
  });

  it('should initialize sample data only once', () => {
    const state = useChecklistStore.getState();
    
    // First initialization
    state.initializeSampleData();
    const firstCount = useChecklistStore.getState().checklists.length;
    expect(firstCount).toBeGreaterThan(0);

    // Second initialization should not add more
    state.initializeSampleData();
    const secondCount = useChecklistStore.getState().checklists.length;
    expect(secondCount).toBe(firstCount);
  });

  it('should track hydration state', () => {
    const state = useChecklistStore.getState();
    
    // Initially should not be hydrated (but in test environment it may start as true)
    // The important thing is that _hasHydrated flag exists and can be set
    expect(state._hasHydrated).toBeDefined();
    expect(typeof state._hasHydrated).toBe('boolean');
    
    // Should be able to set hydration state
    state._setHasHydrated(true);
    expect(useChecklistStore.getState()._hasHydrated).toBe(true);
    
    state._setHasHydrated(false);
    expect(useChecklistStore.getState()._hasHydrated).toBe(false);
  });

  it('should reset all tasks in a checklist run to pending', () => {
    const state = useChecklistStore.getState();
    
    // Create a checklist with tasks
    const mockTasks = [
      {
        id: 'task-1',
        title: 'Task 1',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: new Date(),
      },
      {
        id: 'task-2',
        title: 'Task 2',
        status: TaskStatus.SKIPPED,
        priority: TaskPriority.MEDIUM,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'task-3',
        title: 'Task 3',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const checklistId = state.addChecklistWithTasks(
      {
        name: 'Reset Test',
        category: ChecklistCategory.PRE_DEPARTURE,
      },
      mockTasks
    );

    // Set lastCompletedAt
    state.updateChecklist(checklistId, { lastCompletedAt: new Date() });

    // Reset the checklist run
    state.resetChecklistRun(checklistId);

    const resetState = useChecklistStore.getState();
    const resetChecklist = resetState.checklists.find(c => c.id === checklistId);

    // All tasks should be pending
    expect(resetChecklist.tasks[0].status).toBe(TaskStatus.PENDING);
    expect(resetChecklist.tasks[1].status).toBe(TaskStatus.PENDING);
    expect(resetChecklist.tasks[2].status).toBe(TaskStatus.PENDING);

    // completedAt should be cleared for all tasks
    expect(resetChecklist.tasks[0].completedAt).toBeUndefined();
    expect(resetChecklist.tasks[1].completedAt).toBeUndefined();
    expect(resetChecklist.tasks[2].completedAt).toBeUndefined();

    // lastCompletedAt should be cleared
    expect(resetChecklist.lastCompletedAt).toBeUndefined();
  });

  it('should not affect other checklists when resetting one', () => {
    const state = useChecklistStore.getState();
    
    // Create two checklists with tasks
    const mockTasks1 = [
      {
        id: 'task-1',
        title: 'Task 1',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: new Date(),
      },
    ];

    const mockTasks2 = [
      {
        id: 'task-2',
        title: 'Task 2',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: new Date(),
      },
    ];

    const checklistId1 = state.addChecklistWithTasks(
      {
        name: 'Checklist 1',
        category: ChecklistCategory.PRE_DEPARTURE,
      },
      mockTasks1
    );

    const checklistId2 = state.addChecklistWithTasks(
      {
        name: 'Checklist 2',
        category: ChecklistCategory.NAVIGATION,
      },
      mockTasks2
    );

    // Reset only the first checklist
    state.resetChecklistRun(checklistId1);

    const finalState = useChecklistStore.getState();
    const checklist1 = finalState.checklists.find(c => c.id === checklistId1);
    const checklist2 = finalState.checklists.find(c => c.id === checklistId2);

    // First checklist should be reset
    expect(checklist1.tasks[0].status).toBe(TaskStatus.PENDING);

    // Second checklist should remain unchanged
    expect(checklist2.tasks[0].status).toBe(TaskStatus.COMPLETED);
    expect(checklist2.tasks[0].completedAt).toBeDefined();
  });

  it('should reload default checklists while preserving custom checklists', () => {
    const state = useChecklistStore.getState();
    
    // Add some custom checklists
    state.addChecklist({
      name: 'Custom Checklist 1',
      category: ChecklistCategory.PRE_DEPARTURE,
    });
    state.addChecklist({
      name: 'Custom Checklist 2',
      category: ChecklistCategory.NAVIGATION,
    });

    const beforeReload = useChecklistStore.getState().checklists;
    expect(beforeReload).toHaveLength(2);
    expect(beforeReload[0].name).toBe('Custom Checklist 1');

    // Reload default checklists
    state.reloadDefaultChecklists();

    const afterReload = useChecklistStore.getState().checklists;
    
    // Should have default checklists + custom checklists
    expect(afterReload.length).toBeGreaterThan(2);
    
    // Should still contain the custom checklists
    expect(afterReload.find(c => c.name === 'Custom Checklist 1')).toBeDefined();
    expect(afterReload.find(c => c.name === 'Custom Checklist 2')).toBeDefined();
    
    // Should contain default checklist names
    expect(afterReload[0].name).toBeTruthy();
    expect(afterReload[0].tasks).toBeDefined();
    expect(afterReload[0].tasks.length).toBeGreaterThan(0);
  });

  it('should replace modified default checklists when reloading', () => {
    const state = useChecklistStore.getState();
    
    // First load defaults
    state.reloadDefaultChecklists();
    
    // Get a default checklist and modify it
    const defaultChecklist = useChecklistStore.getState().checklists.find(c => c.id === 'pre-dep-1');
    expect(defaultChecklist).toBeDefined();
    
    state.updateChecklist(defaultChecklist.id, { 
      name: 'Modified Default Name',
      description: 'This was modified by user'
    });

    // Add a custom checklist
    state.addChecklist({
      name: 'My Custom Checklist',
      category: ChecklistCategory.GENERAL,
    });

    const beforeReload = useChecklistStore.getState().checklists;
    const modifiedChecklist = beforeReload.find(c => c.id === 'pre-dep-1');
    expect(modifiedChecklist?.name).toBe('Modified Default Name');

    // Reload default checklists
    state.reloadDefaultChecklists();

    const afterReload = useChecklistStore.getState().checklists;
    
    // Default checklist should be reset to original
    const resetChecklist = afterReload.find(c => c.id === 'pre-dep-1');
    expect(resetChecklist?.name).not.toBe('Modified Default Name');
    expect(resetChecklist?.name).toBe('Pre-Departure Safety Check');
    
    // Custom checklist should still exist
    expect(afterReload.find(c => c.name === 'My Custom Checklist')).toBeDefined();
  });
});
