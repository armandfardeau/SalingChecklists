/**
 * Onboarding Screen tests
 * Tests for the onboarding flow with language and theme selection
 */

import React from 'react';
import { render } from '@testing-library/react-native';

// Mock expo-router
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

// Mock useThemedColors hook
jest.mock('../hooks/useThemedColors', () => ({
  useThemedColors: () => ({
    screenBackground: '#FFFFFF',
    cardBackground: '#FFFFFF',
    primary: '#0066CC',
    cardBorder: '#E0E0E0',
    textPrimary: '#000000',
    textSecondary: '#424242',
    textInverse: '#FFFFFF',
  }),
}));

describe('Onboarding Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render welcome message', () => {
    const OnboardingScreen = require('../app/onboarding').default;
    const { getByText } = render(<OnboardingScreen />);
    expect(getByText('Welcome to Sailing Checklists')).toBeTruthy();
    expect(getByText("Let's personalize your experience")).toBeTruthy();
  });

  it('should render language selection section', () => {
    const OnboardingScreen = require('../app/onboarding').default;
    const { getByText } = render(<OnboardingScreen />);
    expect(getByText('Choose Your Language')).toBeTruthy();
    expect(getByText('English')).toBeTruthy();
    expect(getByText('Français')).toBeTruthy();
    expect(getByText('Español')).toBeTruthy();
    expect(getByText('Deutsch')).toBeTruthy();
    expect(getByText('Italiano')).toBeTruthy();
  });

  it('should render theme selection section', () => {
    const OnboardingScreen = require('../app/onboarding').default;
    const { getByText } = render(<OnboardingScreen />);
    expect(getByText('Choose Your Theme')).toBeTruthy();
    expect(getByText('Light Mode')).toBeTruthy();
    expect(getByText('Dark Mode')).toBeTruthy();
  });

  it('should render continue button', () => {
    const OnboardingScreen = require('../app/onboarding').default;
    const { getByText } = render(<OnboardingScreen />);
    expect(getByText('Continue')).toBeTruthy();
  });

  it('should show settings note', () => {
    const OnboardingScreen = require('../app/onboarding').default;
    const { getByText } = render(<OnboardingScreen />);
    expect(getByText('You can change these settings later in the app')).toBeTruthy();
  });
});
