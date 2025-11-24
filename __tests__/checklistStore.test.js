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
});
