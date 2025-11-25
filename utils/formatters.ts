/**
 * Utility functions for formatting text and labels
 */

import { ChecklistCategory } from '../types';
import i18n from './i18n';

/**
 * Converts a ChecklistCategory enum value to a human-readable label
 * @param category - The category to format
 * @returns Formatted category label (e.g., "Pre Departure")
 */
export function getCategoryLabel(category: ChecklistCategory): string {
  return i18n.t(`category.${category}`);
}
