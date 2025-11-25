/**
 * Icon utilities for consistent vector icon usage across the app
 * Uses @expo/vector-icons (Material Icons by default)
 */

import { MaterialIcons } from '@expo/vector-icons';

/**
 * Icon mappings for common UI elements
 */
export const IconNames = {
  // Tab navigation
  CHECKLIST: 'checklist' as const,
  EMERGENCY: 'emergency' as const,
  SETTINGS: 'settings' as const,
  
  // Actions
  EDIT: 'edit' as const,
  DELETE: 'delete' as const,
  CHECK: 'check' as const,
  WARNING: 'warning' as const,
  
  // Status
  CREDIT_CARD: 'credit-card' as const,
  
  // Navigation
  ARROW_FORWARD: 'arrow-forward' as const,
};

export { MaterialIcons };

export type IconName = typeof IconNames[keyof typeof IconNames];
