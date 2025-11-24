/**
 * Utility for loading default tasks from JSON data source
 */

import { Checklist, Task } from '../types';
import defaultTasksData from '../assets/defaultTasks.json';
import i18n from '../locales';

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
 * Converts a task from JSON format to Task type with translations applied
 */
const parseTaskWithTranslation = (taskData: DefaultTasksJSON['checklists'][0]['tasks'][0], index: number, timestamp: Date): Task => {
  let title = taskData.title;
  let description = taskData.description;
  
  // Map task IDs to translation keys for pre-departure safety checklist
  const taskKeys = ['checkWeather', 'inspectLifeJackets', 'checkFuel', 'testNavLights', 'verifyVHF'];
  if (index < taskKeys.length) {
    const taskKey = taskKeys[index];
    const titleKey = `defaultTasks.preDepartureSafety.tasks.${taskKey}.title`;
    const descKey = `defaultTasks.preDepartureSafety.tasks.${taskKey}.description`;
    const translatedTitle = i18n.t(titleKey);
    const translatedDesc = i18n.t(descKey);
    
    // Only use translation if it exists (not same as key)
    if (translatedTitle !== titleKey) title = translatedTitle;
    if (translatedDesc !== descKey) description = translatedDesc;
  }
  
  return {
    id: taskData.id,
    title,
    description,
    status: taskData.status as Task['status'],
    priority: taskData.priority as Task['priority'],
    order: taskData.order,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

/**
 * Converts a checklist from JSON format to Checklist type with Date objects
 * Applies translations if available
 */
const parseChecklist = (checklistData: DefaultTasksJSON['checklists'][0]): Checklist => {
  const now = new Date();
  
  // Try to get translated name and description
  let name = checklistData.name;
  let description = checklistData.description;
  
  // Check if this is the pre-departure safety checklist
  if (checklistData.id === 'pre-dep-1') {
    const nameKey = 'defaultTasks.preDepartureSafety.name';
    const descKey = 'defaultTasks.preDepartureSafety.description';
    const translatedName = i18n.t(nameKey);
    const translatedDesc = i18n.t(descKey);
    
    // Only use translation if it exists (not same as key)
    if (translatedName !== nameKey) name = translatedName;
    if (translatedDesc !== descKey) description = translatedDesc;
  }
  
  return {
    id: checklistData.id,
    name,
    description,
    category: checklistData.category as Checklist['category'],
    isActive: checklistData.isActive,
    isTemplate: checklistData.isTemplate,
    color: checklistData.color,
    icon: checklistData.icon,
    tasks: checklistData.tasks.map((task, index) => parseTaskWithTranslation(task, index, now)),
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Loads default checklists from JSON data source
 * @returns Array of default checklists with proper TypeScript types
 */
export const loadDefaultChecklists = (): Checklist[] => {
  const data = defaultTasksData as DefaultTasksJSON;
  return data.checklists.map(parseChecklist);
};

/**
 * Gets a specific default checklist by ID
 * @param id - The checklist ID to find
 * @returns The checklist if found, undefined otherwise
 */
export const getDefaultChecklistById = (id: string): Checklist | undefined => {
  const checklists = loadDefaultChecklists();
  return checklists.find(checklist => checklist.id === id);
};
