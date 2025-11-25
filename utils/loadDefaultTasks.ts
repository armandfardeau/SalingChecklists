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
 * Gets translation key for a default checklist
 */
const getChecklistTranslationKey = (checklistId: string): string | null => {
  if (checklistId === 'pre-dep-1') return 'preDeparture';
  if (checklistId === 'emergency-1') return 'emergency';
  if (checklistId === 'arrival-1') return 'arrival';
  return null;
};

/**
 * Gets translation key for a default task
 */
const getTaskTranslationKey = (checklistId: string, taskId: string): string | null => {
  const checklistKey = getChecklistTranslationKey(checklistId);
  if (!checklistKey) return null;

  const taskMap: Record<string, Record<string, string>> = {
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

  return taskMap[checklistId]?.[taskId] || null;
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
    const translatedName = i18n.t(`defaultChecklists.${checklistKey}.name`);
    const translatedDesc = i18n.t(`defaultChecklists.${checklistKey}.description`);
    
    // Only use translation if it exists (not returning the key itself)
    if (translatedName && !translatedName.startsWith('defaultChecklists.')) {
      name = translatedName;
    }
    if (translatedDesc && !translatedDesc.startsWith('defaultChecklists.')) {
      description = translatedDesc;
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
        const translatedTitle = i18n.t(`defaultChecklists.${checklistKey}.tasks.${taskKey}.title`);
        const translatedDesc = i18n.t(`defaultChecklists.${checklistKey}.tasks.${taskKey}.description`);

        if (translatedTitle && !translatedTitle.startsWith('defaultChecklists.')) {
          taskTitle = translatedTitle;
        }
        if (translatedDesc && !translatedDesc.startsWith('defaultChecklists.')) {
          taskDescription = translatedDesc;
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
