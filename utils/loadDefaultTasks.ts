/**
 * Utility for loading default tasks from JSON data source
 * Supports loading localized versions of default tasks
 */

import { Checklist, Task } from '../types';
import type { SupportedLocale } from '../store/useLocaleStore';

// Import all localized versions
import enTasks from '../assets/locales/en.json';
import frTasks from '../assets/locales/fr.json';

/**
 * Interface matching the JSON structure
 */
interface DefaultTasksJSON {
  checklists: Array<{
    id: string;
    name: string;
    description?: string;
    category: string;
    isActive: boolean;
    isTemplate: boolean;
    color?: string;
    icon?: string;
    tasks: Array<{
      id: string;
      title: string;
      description?: string;
      status: string;
      priority: string;
      order: number;
    }>;
  }>;
}

/**
 * Converts a task from JSON format to Task type with Date objects
 */
const parseTask = (taskData: DefaultTasksJSON['checklists'][0]['tasks'][0], timestamp: Date): Task => {
  return {
    id: taskData.id,
    title: taskData.title,
    description: taskData.description,
    status: taskData.status as Task['status'],
    priority: taskData.priority as Task['priority'],
    order: taskData.order,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

/**
 * Converts a checklist from JSON format to Checklist type with Date objects
 */
const parseChecklist = (checklistData: DefaultTasksJSON['checklists'][0]): Checklist => {
  const now = new Date();
  return {
    id: checklistData.id,
    name: checklistData.name,
    description: checklistData.description,
    category: checklistData.category as Checklist['category'],
    isActive: checklistData.isActive,
    isTemplate: checklistData.isTemplate,
    color: checklistData.color,
    icon: checklistData.icon,
    tasks: checklistData.tasks.map(task => parseTask(task, now)),
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Map of locale to task data
 * Only includes locales with actual translations
 */
const localeTasksMap: Partial<Record<SupportedLocale, DefaultTasksJSON>> = {
  en: enTasks as DefaultTasksJSON,
  fr: frTasks as DefaultTasksJSON,
  // Additional translations can be added here as they become available
};

/**
 * Loads default checklists from JSON data source
 * @param locale - Optional locale to load localized tasks (defaults to English)
 * @returns Array of default checklists with proper TypeScript types
 */
export const loadDefaultChecklists = (locale?: SupportedLocale): Checklist[] => {
  // Use provided locale or fall back to English
  const effectiveLocale = locale || 'en';
  const data = localeTasksMap[effectiveLocale] || localeTasksMap.en;
  return data.checklists.map(parseChecklist);
};

/**
 * Gets a specific default checklist by ID
 * @param id - The checklist ID to find
 * @param locale - Optional locale to load localized tasks
 * @returns The checklist if found, undefined otherwise
 */
export const getDefaultChecklistById = (id: string, locale?: SupportedLocale): Checklist | undefined => {
  const checklists = loadDefaultChecklists(locale);
  return checklists.find(checklist => checklist.id === id);
};

/**
 * Gets list of available locales for default tasks
 * @returns Array of supported locales that have translations
 */
export const getAvailableLocales = (): SupportedLocale[] => {
  // Derive available locales from the localeTasksMap to ensure consistency
  return Object.keys(localeTasksMap) as SupportedLocale[];
};
