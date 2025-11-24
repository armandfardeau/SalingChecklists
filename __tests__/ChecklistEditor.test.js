/**
 * ChecklistEditor Screen tests
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

// Mock MMKV before importing the store or components
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

// Mock expo-router
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
  })),
}));

// Mock SafeAreaView
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
}));

// Mock RevenueCat Provider
jest.mock('../contexts/RevenueCatProvider', () => ({
  useRevenueCat: jest.fn(() => ({
    isConfigured: false,
    customerInfo: null,
    isLoading: false,
    refreshCustomerInfo: jest.fn(),
  })),
  RevenueCatProvider: ({ children }) => children,
}));

import ChecklistEditor from '../app/editor/[id]';
import { useChecklistStore } from '../store';
import { ChecklistCategory, TaskPriority } from '../types';

// Mock Alert
jest.spyOn(Alert, 'alert');

const { useLocalSearchParams, useRouter } = require('expo-router');

describe('ChecklistEditor', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue(mockRouter);
    // Reset store
    useChecklistStore.setState({ checklists: [] });
  });

  describe('Creating a new checklist', () => {
    beforeEach(() => {
      useLocalSearchParams.mockReturnValue({ id: 'new' });
    });

    it('should render with empty form for new checklist', () => {
      const { getByText, getByPlaceholderText } = render(<ChecklistEditor />);

      expect(getByText('New Checklist')).toBeTruthy();
      expect(getByPlaceholderText('Enter checklist name')).toBeTruthy();
      expect(getByPlaceholderText('Enter description (optional)')).toBeTruthy();
    });

    it('should update name field when typing', () => {
      const { getByPlaceholderText } = render(<ChecklistEditor />);
      const nameInput = getByPlaceholderText('Enter checklist name');

      fireEvent.changeText(nameInput, 'My New Checklist');
      expect(nameInput.props.value).toBe('My New Checklist');
    });

    it('should update description field when typing', () => {
      const { getByPlaceholderText } = render(<ChecklistEditor />);
      const descInput = getByPlaceholderText('Enter description (optional)');

      fireEvent.changeText(descInput, 'A detailed description');
      expect(descInput.props.value).toBe('A detailed description');
    });

    it('should allow selecting a category', () => {
      const { getByText } = render(<ChecklistEditor />);
      const categoryButton = getByText('Pre Departure');

      fireEvent.press(categoryButton);
      // Category selection changes internal state
    });

    it('should show error when saving without name', () => {
      const { getByText } = render(<ChecklistEditor />);
      const saveButton = getByText('Save');

      fireEvent.press(saveButton);
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Checklist name is required');
    });

    it('should create new checklist and navigate back on save', () => {
      const { getByText, getByPlaceholderText } = render(<ChecklistEditor />);
      const nameInput = getByPlaceholderText('Enter checklist name');
      const saveButton = getByText('Save');

      fireEvent.changeText(nameInput, 'Test Checklist');
      fireEvent.press(saveButton);

      const checklists = useChecklistStore.getState().checklists;
      expect(checklists.length).toBe(1);
      expect(checklists[0].name).toBe('Test Checklist');
      expect(mockRouter.back).toHaveBeenCalled();
    });

    it('should navigate back when cancel is pressed', () => {
      const { getByText } = render(<ChecklistEditor />);
      const cancelButton = getByText('← Cancel');

      fireEvent.press(cancelButton);
      expect(mockRouter.back).toHaveBeenCalled();
    });
  });

  describe('Task management', () => {
    beforeEach(() => {
      useLocalSearchParams.mockReturnValue({ id: 'new' });
    });

    it('should add a task when form is filled and Add Task is pressed', () => {
      const { getByText, getByPlaceholderText } = render(<ChecklistEditor />);
      const taskTitleInput = getByPlaceholderText('Enter task title');
      const addButton = getByText('Add Task');

      fireEvent.changeText(taskTitleInput, 'First Task');
      fireEvent.press(addButton);

      expect(getByText('First Task')).toBeTruthy();
      expect(getByText('1.')).toBeTruthy();
    });

    it('should show error when adding task without title', () => {
      const { getByText } = render(<ChecklistEditor />);
      const addButton = getByText('Add Task');

      fireEvent.press(addButton);
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Task title is required');
    });

    it('should clear task form after adding a task', () => {
      const { getByText, getByPlaceholderText } = render(<ChecklistEditor />);
      const taskTitleInput = getByPlaceholderText('Enter task title');
      const taskDescInput = getByPlaceholderText('Enter task description (optional)');
      const addButton = getByText('Add Task');

      fireEvent.changeText(taskTitleInput, 'Task 1');
      fireEvent.changeText(taskDescInput, 'Description 1');
      fireEvent.press(addButton);

      expect(taskTitleInput.props.value).toBe('');
      expect(taskDescInput.props.value).toBe('');
    });

    it('should enter edit mode when Edit button is pressed', () => {
      const { getByText, getByPlaceholderText, getAllByText } = render(<ChecklistEditor />);
      const taskTitleInput = getByPlaceholderText('Enter task title');
      const addButton = getByText('Add Task');

      // Add a task
      fireEvent.changeText(taskTitleInput, 'Task to Edit');
      fireEvent.press(addButton);

      // Click Edit button
      const editButton = getAllByText('Edit')[0];
      fireEvent.press(editButton);

      // Should populate form and change button text
      expect(taskTitleInput.props.value).toBe('Task to Edit');
      expect(getByText('Update Task')).toBeTruthy();
      expect(getByText('Cancel')).toBeTruthy();
    });

    it('should update task when in edit mode', () => {
      const { getByText, getByPlaceholderText, getAllByText, queryByText } = render(<ChecklistEditor />);
      const taskTitleInput = getByPlaceholderText('Enter task title');
      const addButton = getByText('Add Task');

      // Add a task
      fireEvent.changeText(taskTitleInput, 'Original Task');
      fireEvent.press(addButton);

      // Edit the task
      const editButton = getAllByText('Edit')[0];
      fireEvent.press(editButton);
      
      fireEvent.changeText(taskTitleInput, 'Updated Task');
      const updateButton = getByText('Update Task');
      fireEvent.press(updateButton);

      // Original should be gone, updated should be present
      expect(queryByText('Original Task')).toBeNull();
      expect(getByText('Updated Task')).toBeTruthy();
    });

    it('should cancel edit mode when Cancel is pressed', () => {
      const { getByText, getByPlaceholderText, getAllByText } = render(<ChecklistEditor />);
      const taskTitleInput = getByPlaceholderText('Enter task title');

      // Add a task
      fireEvent.changeText(taskTitleInput, 'Task 1');
      fireEvent.press(getByText('Add Task'));

      // Enter edit mode
      const editButton = getAllByText('Edit')[0];
      fireEvent.press(editButton);

      // Cancel edit
      const cancelButton = getByText('Cancel');
      fireEvent.press(cancelButton);

      expect(taskTitleInput.props.value).toBe('');
      expect(getByText('Add Task')).toBeTruthy();
    });

    it('should delete task when Delete button is pressed and confirmed', () => {
      Alert.alert.mockImplementation((title, message, buttons) => {
        // Simulate pressing the Delete button
        const deleteButton = buttons.find(btn => btn.text === 'Delete');
        if (deleteButton) {
          deleteButton.onPress();
        }
      });

      const { getByText, getByPlaceholderText, getAllByText, queryByText } = render(<ChecklistEditor />);
      const taskTitleInput = getByPlaceholderText('Enter task title');

      // Add a task
      fireEvent.changeText(taskTitleInput, 'Task to Delete');
      fireEvent.press(getByText('Add Task'));

      // Delete the task
      const deleteButton = getAllByText('Delete')[0];
      fireEvent.press(deleteButton);

      expect(Alert.alert).toHaveBeenCalledWith(
        'Delete Task',
        'Are you sure you want to delete this task?',
        expect.any(Array)
      );
      expect(queryByText('Task to Delete')).toBeNull();
    });

    it('should allow selecting task priority', () => {
      const { getByText, getByPlaceholderText, getAllByText } = render(<ChecklistEditor />);
      const taskTitleInput = getByPlaceholderText('Enter task title');

      // Select High priority
      const highPriorityButton = getAllByText('High')[0];
      fireEvent.press(highPriorityButton);

      // Add task
      fireEvent.changeText(taskTitleInput, 'High Priority Task');
      fireEvent.press(getByText('Add Task'));

      expect(getByText('High Priority')).toBeTruthy();
    });
  });

  describe('Editing an existing checklist', () => {
    const existingChecklist = {
      id: 'existing-1',
      name: 'Existing Checklist',
      description: 'Existing description',
      category: ChecklistCategory.NAVIGATION,
      tasks: [
        {
          id: 'task-1',
          title: 'Existing Task',
          description: 'Task description',
          status: 'pending',
          priority: TaskPriority.MEDIUM,
          order: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      isActive: true,
      isTemplate: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      useLocalSearchParams.mockReturnValue({ id: 'existing-1' });
      useChecklistStore.setState({ checklists: [existingChecklist] });
    });

    it('should render with existing checklist data', () => {
      const { getByText, getByDisplayValue } = render(<ChecklistEditor />);

      expect(getByText('Edit Checklist')).toBeTruthy();
      expect(getByDisplayValue('Existing Checklist')).toBeTruthy();
      expect(getByDisplayValue('Existing description')).toBeTruthy();
      expect(getByText('Existing Task')).toBeTruthy();
    });

    it('should update existing checklist on save', () => {
      const { getByText, getByDisplayValue } = render(<ChecklistEditor />);
      const nameInput = getByDisplayValue('Existing Checklist');

      fireEvent.changeText(nameInput, 'Updated Checklist');
      fireEvent.press(getByText('Save'));

      const checklists = useChecklistStore.getState().checklists;
      expect(checklists[0].name).toBe('Updated Checklist');
      expect(mockRouter.back).toHaveBeenCalled();
    });

    it('should navigate back if checklist does not exist', () => {
      useLocalSearchParams.mockReturnValue({ id: 'non-existent' });
      render(<ChecklistEditor />);

      expect(mockRouter.back).toHaveBeenCalled();
    });
  });

  describe('Category selection', () => {
    beforeEach(() => {
      useLocalSearchParams.mockReturnValue({ id: 'new' });
    });

    it('should display all category options', () => {
      const { getByText } = render(<ChecklistEditor />);

      expect(getByText('Pre Departure')).toBeTruthy();
      expect(getByText('Departure')).toBeTruthy();
      expect(getByText('Navigation')).toBeTruthy();
      expect(getByText('Arrival')).toBeTruthy();
      expect(getByText('Safety')).toBeTruthy();
      expect(getByText('Maintenance')).toBeTruthy();
      expect(getByText('Emergency')).toBeTruthy();
      expect(getByText('General')).toBeTruthy();
    });
  });

  describe('Icon and color fields', () => {
    beforeEach(() => {
      useLocalSearchParams.mockReturnValue({ id: 'new' });
    });

    it('should allow entering icon emoji', () => {
      const { getByPlaceholderText } = render(<ChecklistEditor />);
      const iconInput = getByPlaceholderText('e.g., ⛵');

      fireEvent.changeText(iconInput, '⚓');
      expect(iconInput.props.value).toBe('⚓');
    });

    it('should allow entering color hex code', () => {
      const { getByPlaceholderText } = render(<ChecklistEditor />);
      const colorInput = getByPlaceholderText('e.g., #FF6B6B');

      fireEvent.changeText(colorInput, '#00FF00');
      expect(colorInput.props.value).toBe('#00FF00');
    });
  });
});
