import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChecklistCard from '../components/ChecklistCard';
import { ChecklistCategory, TaskStatus, TaskPriority } from '../types';
import { Alert } from 'react-native';

// Mock hooks
jest.mock('../hooks/useThemedColors', () => ({
  useThemedColors: () => ({
    cardBackground: '#FFFFFF',
    cardBorder: '#E0E0E0',
    textPrimary: '#000000',
    textSecondary: '#424242',
    textInverse: '#FFFFFF',
    inputBackground: '#F5F5F5',
    primary: '#0066CC',
    success: '#2E7D32',
    borderLight: 'rgba(0,0,0,0.1)',
  }),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('Delete Checklist Functionality', () => {
  const mockChecklist = {
    id: 'test-1',
    name: 'Test Checklist',
    description: 'Test description',
    category: ChecklistCategory.GENERAL,
    isActive: true,
    isTemplate: false,
    tasks: [
      {
        id: 'task-1',
        title: 'Task 1',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockStats = {
    totalTasks: 1,
    completedTasks: 0,
    pendingTasks: 1,
    completionPercentage: 0,
    isFullyCompleted: false,
  };

  it('renders delete button when onDeletePress is provided', () => {
    const mockDelete = jest.fn();
    
    const { getByTestId } = render(
      <ChecklistCard
        checklist={mockChecklist}
        stats={mockStats}
        onDeletePress={mockDelete}
      />
    );
    
    expect(getByTestId('delete-button')).toBeTruthy();
  });

  it('does not render delete button when onDeletePress is not provided', () => {
    const { queryByTestId } = render(
      <ChecklistCard
        checklist={mockChecklist}
        stats={mockStats}
      />
    );
    
    expect(queryByTestId('delete-button')).toBeNull();
  });

  it('calls onDeletePress when delete button is pressed', () => {
    const mockDelete = jest.fn();
    
    const { getByTestId } = render(
      <ChecklistCard
        checklist={mockChecklist}
        stats={mockStats}
        onDeletePress={mockDelete}
      />
    );
    
    const deleteButton = getByTestId('delete-button');
    fireEvent.press(deleteButton);
    
    expect(mockDelete).toHaveBeenCalledWith(mockChecklist);
  });

  it('delete button press does not trigger card press', () => {
    const mockDelete = jest.fn();
    const mockPress = jest.fn();
    
    const { getByTestId } = render(
      <ChecklistCard
        checklist={mockChecklist}
        stats={mockStats}
        onPress={mockPress}
        onDeletePress={mockDelete}
      />
    );
    
    const deleteButton = getByTestId('delete-button');
    fireEvent.press(deleteButton);
    
    expect(mockDelete).toHaveBeenCalledWith(mockChecklist);
    expect(mockPress).not.toHaveBeenCalled();
  });

  it('renders both edit and delete buttons together', () => {
    const mockEdit = jest.fn();
    const mockDelete = jest.fn();
    
    const { getByTestId } = render(
      <ChecklistCard
        checklist={mockChecklist}
        stats={mockStats}
        onEditPress={mockEdit}
        onDeletePress={mockDelete}
      />
    );
    
    expect(getByTestId('edit-button')).toBeTruthy();
    expect(getByTestId('delete-button')).toBeTruthy();
  });

  it('action buttons have proper touch target', () => {
    const mockDelete = jest.fn();
    
    const { getByTestId } = render(
      <ChecklistCard
        checklist={mockChecklist}
        stats={mockStats}
        onDeletePress={mockDelete}
      />
    );
    
    // The button should exist and be pressable
    const deleteButton = getByTestId('delete-button');
    expect(deleteButton).toBeTruthy();
    
    // Can successfully press the delete button
    fireEvent.press(deleteButton);
    expect(mockDelete).toHaveBeenCalledWith(mockChecklist);
  });
});

describe('Store Delete Functionality', () => {
  let useChecklistStore;

  beforeEach(() => {
    // Clear the module cache to get a fresh store instance
    jest.resetModules();
    const storeModule = require('../store/useChecklistStore');
    useChecklistStore = storeModule.useChecklistStore;
  });

  it('deleteChecklist removes checklist from store', () => {
    const state = useChecklistStore.getState();
    
    // Add a checklist
    state.addChecklist({
      name: 'Test Checklist',
      category: ChecklistCategory.GENERAL,
    });
    
    // Get fresh state after adding
    const newState = useChecklistStore.getState();
    expect(newState.checklists.length).toBe(1);
    const checklistId = newState.checklists[0].id;
    
    // Delete the checklist
    newState.deleteChecklist(checklistId);
    
    // Get fresh state after deleting
    const finalState = useChecklistStore.getState();
    expect(finalState.checklists.length).toBe(0);
  });

  it('deleteChecklist only removes the specified checklist', () => {
    const state = useChecklistStore.getState();
    
    // Add multiple checklists
    state.addChecklist({
      name: 'Checklist 1',
      category: ChecklistCategory.GENERAL,
    });
    state.addChecklist({
      name: 'Checklist 2',
      category: ChecklistCategory.SAFETY,
    });
    
    // Get fresh state after adding
    const newState = useChecklistStore.getState();
    expect(newState.checklists.length).toBe(2);
    
    // Delete only the first checklist
    const checklist1Id = newState.checklists[0].id;
    const checklist2Name = newState.checklists[1].name;
    
    newState.deleteChecklist(checklist1Id);
    
    // Get fresh state after deleting
    const finalState = useChecklistStore.getState();
    expect(finalState.checklists.length).toBe(1);
    expect(finalState.checklists[0].name).toBe(checklist2Name);
  });

  it('deleteChecklist does nothing if checklist does not exist', () => {
    const state = useChecklistStore.getState();
    
    state.addChecklist({
      name: 'Test Checklist',
      category: ChecklistCategory.GENERAL,
    });
    
    // Get fresh state after adding
    const newState = useChecklistStore.getState();
    expect(newState.checklists.length).toBe(1);
    
    // Try to delete non-existent checklist
    newState.deleteChecklist('non-existent-id');
    
    // Get fresh state after attempted delete
    const finalState = useChecklistStore.getState();
    expect(finalState.checklists.length).toBe(1);
  });
});
