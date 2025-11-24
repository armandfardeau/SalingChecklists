/**
 * Utility for loading default tasks from JSON data source
 */

import { Checklist, Task } from '../types';
import defaultTasksData from '../assets/defaultTasks.json';

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
