/**
 * Utility functions for formatting text and labels
 */

import { ChecklistCategory } from '../types';

/**
 * Converts a ChecklistCategory enum value to a human-readable label
 * @param category - The category to format
 * @returns Formatted category label (e.g., "Pre Departure")
 */
export function getCategoryLabel(category: ChecklistCategory): string {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
