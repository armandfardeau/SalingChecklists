import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Emergency from '../app/(tabs)/emergency';
import { useChecklistStore } from '../store';
import { ChecklistCategory } from '../types';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock expo-status-bar
jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

// Mock hooks
jest.mock('../hooks/useThemedColors', () => ({
  useThemedColors: () => ({
    screenBackground: '#F5F5F5',
    danger: '#C62828',
    dangerDark: '#8B1A1A',
    textInverse: '#FFFFFF',
    cardBackground: '#FFFFFF',
    textPrimary: '#000000',
    textSecondary: '#424242',
    warning: '#F57C00',
  }),
}));

describe('Emergency Tab', () => {
  beforeEach(() => {
    // Reset store before each test - clear all checklists
    const store = useChecklistStore.getState();
    store.checklists = [];
    store._hasHydrated = true;
    
    // Mock initializeSampleData to do nothing in tests
    store.initializeSampleData = jest.fn();
  });

  it('renders emergency screen with header', () => {
    const { getByText } = render(<Emergency />);
    
    expect(getByText('EMERGENCY')).toBeTruthy();
    expect(getByText('Quick access to critical procedures')).toBeTruthy();
  });

  it('shows empty state when no emergency checklists exist', () => {
    // Ensure store is truly empty
    const store = useChecklistStore.getState();
    store.checklists = [];
    
    const { getByText } = render(<Emergency />);
    
    expect(getByText('No Emergency Checklists')).toBeTruthy();
    expect(getByText(/Add an emergency checklist/)).toBeTruthy();
  });

  it('displays emergency checklists', () => {
    const store = useChecklistStore.getState();
    store.checklists = [
      {
        id: 'emergency-1',
        name: 'Emergency Procedures',
        description: 'Critical emergency response',
        category: ChecklistCategory.EMERGENCY,
        isActive: true,
        isTemplate: false,
        tasks: [
          {
            id: 'task-1',
            title: 'Assess situation',
            status: 'pending',
            priority: 'critical',
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const { getByText } = render(<Emergency />);
    
    expect(getByText('Emergency Procedures')).toBeTruthy();
    expect(getByText('Critical emergency response')).toBeTruthy();
    expect(getByText('1 critical tasks')).toBeTruthy();
  });

  it('only shows emergency category checklists', () => {
    const store = useChecklistStore.getState();
    store.checklists = [
      {
        id: 'emergency-1',
        name: 'Emergency Procedures',
        category: ChecklistCategory.EMERGENCY,
        isActive: true,
        isTemplate: false,
        tasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'regular-1',
        name: 'Regular Checklist',
        category: ChecklistCategory.GENERAL,
        isActive: true,
        isTemplate: false,
        tasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const { getByText, queryByText } = render(<Emergency />);
    
    expect(getByText('Emergency Procedures')).toBeTruthy();
    expect(queryByText('Regular Checklist')).toBeNull();
  });

  it('navigates to runner when emergency checklist is pressed', () => {
    const mockPush = jest.fn();
    jest.spyOn(require('expo-router'), 'useRouter').mockReturnValue({
      push: mockPush,
      back: jest.fn(),
    });

    const store = useChecklistStore.getState();
    store.checklists = [
      {
        id: 'emergency-1',
        name: 'Emergency Procedures',
        category: ChecklistCategory.EMERGENCY,
        isActive: true,
        isTemplate: false,
        tasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const { getByText } = render(<Emergency />);
    
    const startButton = getByText('START →');
    fireEvent.press(startButton);
    
    expect(mockPush).toHaveBeenCalledWith('/runner/emergency-1');
  });

  it('displays warning information box', () => {
    const { getByText } = render(<Emergency />);
    
    expect(getByText('When to Use Emergency Checklists')).toBeTruthy();
    expect(getByText(/Life-threatening situations/)).toBeTruthy();
    expect(getByText(/Man overboard/)).toBeTruthy();
  });

  it('does not show inactive emergency checklists', () => {
    const store = useChecklistStore.getState();
    store.checklists = [
      {
        id: 'emergency-1',
        name: 'Active Emergency',
        category: ChecklistCategory.EMERGENCY,
        isActive: true,
        isTemplate: false,
        tasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'emergency-2',
        name: 'Inactive Emergency',
        category: ChecklistCategory.EMERGENCY,
        isActive: false,
        isTemplate: false,
        tasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const { getByText, queryByText } = render(<Emergency />);
    
    expect(getByText('Active Emergency')).toBeTruthy();
    expect(queryByText('Inactive Emergency')).toBeNull();
  });
});
