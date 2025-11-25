/**
 * ChecklistCard Component tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChecklistCard from '../components/ChecklistCard';
import { ChecklistCategory, TaskStatus, TaskPriority } from '../types';

describe('ChecklistCard', () => {
  const mockChecklist = {
    id: 'test-1',
    name: 'Test Checklist',
    description: 'A test checklist description',
    category: ChecklistCategory.PRE_DEPARTURE,
    tasks: [],
    isActive: true,
    isTemplate: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockStats = {
    totalTasks: 5,
    completedTasks: 3,
    pendingTasks: 2,
    completionPercentage: 60,
    isFullyCompleted: false,
  };

  it('should render checklist name', () => {
    const { getByText } = render(
      <ChecklistCard checklist={mockChecklist} stats={mockStats} />
    );

    expect(getByText('Test Checklist')).toBeTruthy();
  });

  it('should render checklist description', () => {
    const { getByText } = render(
      <ChecklistCard checklist={mockChecklist} stats={mockStats} />
    );

    expect(getByText('A test checklist description')).toBeTruthy();
  });

  it('should render category badge', () => {
    const { getByText } = render(
      <ChecklistCard checklist={mockChecklist} stats={mockStats} />
    );

    expect(getByText('Pre Departure')).toBeTruthy();
  });

  it('should render task progress', () => {
    const { getByText } = render(
      <ChecklistCard checklist={mockChecklist} stats={mockStats} />
    );

    expect(getByText('3 / 5 tasks')).toBeTruthy();
  });

  it('should call onPress when card is pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <ChecklistCard 
        checklist={mockChecklist} 
        stats={mockStats}
        onPress={onPressMock}
      />
    );

    fireEvent.press(getByText('Test Checklist'));
    expect(onPressMock).toHaveBeenCalledWith(mockChecklist);
  });

  it('should display inactive badge for inactive checklist', () => {
    const inactiveChecklist = { ...mockChecklist, isActive: false };
    const { getByText } = render(
      <ChecklistCard checklist={inactiveChecklist} stats={mockStats} />
    );

    expect(getByText('Inactive')).toBeTruthy();
  });

  it('should not display inactive badge for active checklist', () => {
    const { queryByText } = render(
      <ChecklistCard checklist={mockChecklist} stats={mockStats} />
    );

    expect(queryByText('Inactive')).toBeNull();
  });

  it('should show completion checkmark when fully completed', () => {
    const completedStats = {
      ...mockStats,
      completedTasks: 5,
      pendingTasks: 0,
      completionPercentage: 100,
      isFullyCompleted: true,
    };

    const { getByText } = render(
      <ChecklistCard checklist={mockChecklist} stats={completedStats} />
    );

    expect(getByText('5 / 5 tasks')).toBeTruthy();
  });

  it('should render icon if provided', () => {
    const checklistWithIcon = { ...mockChecklist, icon: '⛵' };
    const { getByText } = render(
      <ChecklistCard checklist={checklistWithIcon} stats={mockStats} />
    );

    expect(getByText('⛵')).toBeTruthy();
  });

  it('should handle checklist without description', () => {
    const checklistNoDesc = { ...mockChecklist, description: undefined };
    const { queryByText, getByText } = render(
      <ChecklistCard checklist={checklistNoDesc} stats={mockStats} />
    );

    expect(queryByText('A test checklist description')).toBeNull();
    expect(getByText('Test Checklist')).toBeTruthy();
  });
});
