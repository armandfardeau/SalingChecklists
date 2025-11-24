import { Task } from './task';

/**
 * Category of checklist for sailing navigation
 */
export enum ChecklistCategory {
  PRE_DEPARTURE = 'pre_departure',
  DEPARTURE = 'departure',
  NAVIGATION = 'navigation',
  ARRIVAL = 'arrival',
  SAFETY = 'safety',
  MAINTENANCE = 'maintenance',
  EMERGENCY = 'emergency',
  GENERAL = 'general',
}

/**
 * Represents a checklist containing multiple tasks
 */
export interface Checklist {
  /**
   * Unique identifier for the checklist
   */
  id: string;

  /**
   * Name of the checklist
   */
  name: string;

  /**
   * Optional description of the checklist
   */
  description?: string;

  /**
   * Category of the checklist
   */
  category: ChecklistCategory;

  /**
   * Array of tasks in the checklist
   */
  tasks: Task[];

  /**
   * Whether the checklist is active/in-use
   */
  isActive: boolean;

  /**
   * Whether the checklist is a template
   */
  isTemplate: boolean;

  /**
   * Color code for visual identification (hex format)
   */
  color?: string;

  /**
   * Icon identifier for the checklist
   */
  icon?: string;

  /**
   * Timestamp when the checklist was created
   */
  createdAt: Date;

  /**
   * Timestamp when the checklist was last updated
   */
  updatedAt: Date;

  /**
   * Timestamp when the checklist was last completed (if applicable)
   */
  lastCompletedAt?: Date;
}

/**
 * Input type for creating a new checklist
 */
export type CreateChecklistInput = Pick<Checklist, 'name' | 'category'> & 
  Partial<Pick<Checklist, 'description' | 'isTemplate' | 'color' | 'icon'>>;

/**
 * Input type for updating an existing checklist
 */
export type UpdateChecklistInput = Partial<
  Pick<Checklist, 'name' | 'description' | 'category' | 'isActive' | 'color' | 'icon'>
>;

/**
 * Statistics for a checklist
 */
export interface ChecklistStats {
  /**
   * Total number of tasks
   */
  totalTasks: number;

  /**
   * Number of completed tasks
   */
  completedTasks: number;

  /**
   * Number of pending tasks
   */
  pendingTasks: number;

  /**
   * Completion percentage (0-100)
   */
  completionPercentage: number;

  /**
   * Whether all tasks are completed
   */
  isFullyCompleted: boolean;
}
