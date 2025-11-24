/**
 * Utility functions for formatting text and labels
 */

import { ChecklistCategory } from '../types';
import i18n from '../locales';

/**
 * Converts a ChecklistCategory enum value to a human-readable label
 * @param category - The category to format
 * @returns Formatted category label (e.g., "Pre Departure")
 */
export function getCategoryLabel(category: ChecklistCategory): string {
  const key = `categories.${category}`;
  const translated = i18n.t(key);
  
  // Fallback to formatted category name if translation is missing
  if (translated === key) {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  return translated;
}
