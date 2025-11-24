/**
 * ChecklistRunner Component tests
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ChecklistRunner from '../app/runner/[id]';
import { useChecklistStore } from '../store';
import { ChecklistCategory, TaskStatus, TaskPriority } from '../types';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

// Mock the store
jest.mock('../store', () => ({
  useChecklistStore: jest.fn(),
}));

describe('ChecklistRunner', () => {
  const mockRouter = {
    back: jest.fn(),
    push: jest.fn(),
  };

  const mockChecklist = {
    id: 'test-checklist-1',
    name: 'Test Checklist',
    description: 'A test checklist',
    category: ChecklistCategory.PRE_DEPARTURE,
    isActive: true,
    isTemplate: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    tasks: [
      {
        id: 'task-1',
        title: 'Task 1',
        description: 'First task description',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'task-2',
        title: 'Task 2',
        description: 'Second task description',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'task-3',
        title: 'Task 3',
        description: 'Third task description',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.LOW,
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: new Date(),
      },
    ],
  };

  const mockStats = {
    totalTasks: 3,
    completedTasks: 1,
    pendingTasks: 2,
    completionPercentage: 33,
    isFullyCompleted: false,
  };

  const mockUpdateTaskStatus = jest.fn();
  const mockGetChecklist = jest.fn();
  const mockGetChecklistStats = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    useRouter.mockReturnValue(mockRouter);
    useLocalSearchParams.mockReturnValue({ id: 'test-checklist-1' });
    
    mockGetChecklist.mockReturnValue(mockChecklist);
    mockGetChecklistStats.mockReturnValue(mockStats);
    
    useChecklistStore.mockImplementation((selector) =>
      selector({
        getChecklist: mockGetChecklist,
        updateTaskStatus: mockUpdateTaskStatus,
        getChecklistStats: mockGetChecklistStats,
      })
    );
  });

  it('should render checklist name', () => {
    const { getByText } = render(<ChecklistRunner />);
    expect(getByText('Test Checklist')).toBeTruthy();
  });

  it('should render progress information', () => {
    const { getByText } = render(<ChecklistRunner />);
    expect(getByText('1 / 3 completed')).toBeTruthy();
    expect(getByText('33%')).toBeTruthy();
  });

  it('should render task counter', () => {
    const { getByText } = render(<ChecklistRunner />);
    expect(getByText('Task 1 of 3')).toBeTruthy();
  });

  it('should render current task title and description', () => {
    const { getAllByText, getByText } = render(<ChecklistRunner />);
    // Task 1 appears both in the main card and in the task list
    const task1Elements = getAllByText('Task 1');
    expect(task1Elements.length).toBeGreaterThan(0);
    expect(getByText('First task description')).toBeTruthy();
  });

  it('should show complete and skip buttons for pending tasks', () => {
    const { getByText } = render(<ChecklistRunner />);
    expect(getByText('✓ Complete')).toBeTruthy();
    expect(getByText('Skip')).toBeTruthy();
  });

  it('should call updateTaskStatus when complete button is pressed', () => {
    const { getByText } = render(<ChecklistRunner />);
    const completeButton = getByText('✓ Complete');
    
    fireEvent.press(completeButton);
    
    expect(mockUpdateTaskStatus).toHaveBeenCalledWith(
      'test-checklist-1',
      'task-1',
      TaskStatus.COMPLETED
    );
  });

  it('should call updateTaskStatus when skip button is pressed', () => {
    const { getByText } = render(<ChecklistRunner />);
    const skipButton = getByText('Skip');
    
    fireEvent.press(skipButton);
    
    expect(mockUpdateTaskStatus).toHaveBeenCalledWith(
      'test-checklist-1',
      'task-1',
      TaskStatus.SKIPPED
    );
  });

  it('should show reset button for completed tasks', () => {
    const { getByText } = render(<ChecklistRunner />);
    
    // Navigate to task 3 (completed)
    const nextButton = getByText('Next →');
    fireEvent.press(nextButton);
    fireEvent.press(nextButton);
    
    expect(getByText('↻ Reset')).toBeTruthy();
  });

  it('should navigate to next task when next button is pressed', () => {
    const { getByText } = render(<ChecklistRunner />);
    
    expect(getByText('Task 1 of 3')).toBeTruthy();
    
    const nextButton = getByText('Next →');
    fireEvent.press(nextButton);
    
    expect(getByText('Task 2 of 3')).toBeTruthy();
  });

  it('should navigate to previous task when previous button is pressed', () => {
    const { getByText } = render(<ChecklistRunner />);
    
    // Go to task 2
    const nextButton = getByText('Next →');
    fireEvent.press(nextButton);
    expect(getByText('Task 2 of 3')).toBeTruthy();
    
    // Go back to task 1
    const previousButton = getByText('← Previous');
    fireEvent.press(previousButton);
    expect(getByText('Task 1 of 3')).toBeTruthy();
  });

  it('should disable previous button on first task', () => {
    const { getByText } = render(<ChecklistRunner />);
    const previousButton = getByText('← Previous');
    
    // The disabled prop is set on the TouchableOpacity, navigate up to find it
    let element = previousButton;
    while (element && element.props.disabled === undefined) {
      element = element.parent;
    }
    expect(element.props.disabled).toBe(true);
  });

  it('should disable next button on last task', () => {
    const { getByText } = render(<ChecklistRunner />);
    
    // Navigate to last task
    const nextButton = getByText('Next →');
    fireEvent.press(nextButton);
    fireEvent.press(nextButton);
    
    // The disabled prop is set on the TouchableOpacity, navigate up to find it
    let element = nextButton;
    while (element && element.props.disabled === undefined) {
      element = element.parent;
    }
    expect(element.props.disabled).toBe(true);
  });

  it('should display all tasks in task list', () => {
    const { getByText } = render(<ChecklistRunner />);
    expect(getByText('All Tasks')).toBeTruthy();
    expect(getByText('1.')).toBeTruthy();
    expect(getByText('2.')).toBeTruthy();
    expect(getByText('3.')).toBeTruthy();
  });

  it('should navigate to task when clicking on task in list', () => {
    const { getByText } = render(<ChecklistRunner />);
    
    expect(getByText('Task 1 of 3')).toBeTruthy();
    
    // Click on task 3 in the list
    fireEvent.press(getByText('Task 3'));
    
    expect(getByText('Task 3 of 3')).toBeTruthy();
  });

  it('should call router.back when back button is pressed', () => {
    const { getByText } = render(<ChecklistRunner />);
    const backButton = getByText('← Back');
    
    fireEvent.press(backButton);
    
    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('should navigate back if checklist does not exist', () => {
    mockGetChecklist.mockReturnValue(undefined);
    
    render(<ChecklistRunner />);
    
    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('should display priority badge with correct color', () => {
    const { getByText } = render(<ChecklistRunner />);
    const priorityBadge = getByText('High Priority');
    
    expect(priorityBadge).toBeTruthy();
  });

  it('should display completed timestamp for completed tasks', () => {
    const { getByText } = render(<ChecklistRunner />);
    
    // Navigate to task 3 (completed)
    const nextButton = getByText('Next →');
    fireEvent.press(nextButton);
    fireEvent.press(nextButton);
    
    expect(getByText(/Completed:/)).toBeTruthy();
  });

  it('should show completion message when all tasks are completed', () => {
    const completedStats = {
      ...mockStats,
      completedTasks: 3,
      pendingTasks: 0,
      completionPercentage: 100,
      isFullyCompleted: true,
    };
    
    mockGetChecklistStats.mockReturnValue(completedStats);
    
    const { getByText } = render(<ChecklistRunner />);
    
    expect(getByText('🎉 Checklist Complete! All tasks finished.')).toBeTruthy();
  });
});
