/**
 * Utility for loading default tasks from JSON data source
 */

import { Checklist, Task } from '../types';
import defaultTasksData from '../assets/defaultTasks.json';
import i18n from './i18n';

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
 * Mapping of default checklist IDs to translation keys
 */
const CHECKLIST_TRANSLATION_MAP: Record<string, string> = {
  'pre-dep-1': 'preDeparture',
  'emergency-1': 'emergency',
  'arrival-1': 'arrival',
};

/**
 * Mapping of default task IDs to translation keys
 */
const TASK_TRANSLATION_MAP: Record<string, Record<string, string>> = {
  'pre-dep-1': {
    'task-1': 'checkWeather',
    'task-2': 'inspectLifeJackets',
    'task-3': 'checkFuel',
    'task-4': 'testLights',
    'task-5': 'verifyRadio',
  },
  'emergency-1': {
    'emerg-task-1': 'assessSituation',
    'emerg-task-2': 'alertCrew',
    'emerg-task-3': 'lifeJackets',
    'emerg-task-4': 'distressCall',
    'emerg-task-5': 'deploySafety',
    'emerg-task-6': 'controlSituation',
    'emerg-task-7': 'prepareEvacuation',
  },
  'arrival-1': {
    'arrival-task-1': 'secureBoat',
    'arrival-task-2': 'engineShutdown',
    'arrival-task-3': 'checkLines',
    'arrival-task-4': 'logArrival',
    'arrival-task-5': 'checkCrew',
  },
};

/**
 * Gets translation key for a default checklist
 */
const getChecklistTranslationKey = (checklistId: string): string | null => {
  return CHECKLIST_TRANSLATION_MAP[checklistId] || null;
};

/**
 * Gets translation key for a default task
 */
const getTaskTranslationKey = (checklistId: string, taskId: string): string | null => {
  return TASK_TRANSLATION_MAP[checklistId]?.[taskId] || null;
};

/**
 * Converts a checklist from JSON format to Checklist type with Date objects
 */
const parseChecklist = (checklistData: DefaultTasksJSON['checklists'][0]): Checklist => {
  const now = new Date();
  const checklistKey = getChecklistTranslationKey(checklistData.id);

  // Try to get translated name and description
  let name = checklistData.name;
  let description = checklistData.description;
  
  if (checklistKey) {
    const nameKey = `defaultChecklists.${checklistKey}.name`;
    const descKey = `defaultChecklists.${checklistKey}.description`;
    
    // Use i18n.exists() to check if translation exists
    if (i18n.exists(nameKey)) {
      name = i18n.t(nameKey);
    }
    if (i18n.exists(descKey)) {
      description = i18n.t(descKey);
    }
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
    tasks: checklistData.tasks.map(task => {
      const taskKey = getTaskTranslationKey(checklistData.id, task.id);
      let taskTitle = task.title;
      let taskDescription = task.description;

      if (checklistKey && taskKey) {
        const titleKey = `defaultChecklists.${checklistKey}.tasks.${taskKey}.title`;
        const descKey = `defaultChecklists.${checklistKey}.tasks.${taskKey}.description`;

        // Use i18n.exists() to check if translation exists
        if (i18n.exists(titleKey)) {
          taskTitle = i18n.t(titleKey);
        }
        if (i18n.exists(descKey)) {
          taskDescription = i18n.t(descKey);
        }
      }

      return {
        ...parseTask(task, now),
        title: taskTitle,
        description: taskDescription,
      };
    }),
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
