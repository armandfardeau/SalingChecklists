/**
 * Priority levels for tasks
 */
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Status of a task
 */
export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
}

/**
 * Represents a single task within a checklist
 */
export interface Task {
  /**
   * Unique identifier for the task
   */
  id: string;

  /**
   * Title of the task
   */
  title: string;

  /**
   * Optional detailed description of the task
   */
  description?: string;

  /**
   * Whether the task is completed
   */
  completed: boolean;

  /**
   * Status of the task
   */
  status: TaskStatus;

  /**
   * Priority level of the task
   */
  priority: TaskPriority;

  /**
   * Order/position of the task in the checklist
   */
  order: number;

  /**
   * Timestamp when the task was created
   */
  createdAt: Date;

  /**
   * Timestamp when the task was last updated
   */
  updatedAt: Date;

  /**
   * Timestamp when the task was completed (if applicable)
   */
  completedAt?: Date;
}

/**
 * Input type for creating a new task
 */
export type CreateTaskInput = Pick<Task, 'title' | 'order'> & 
  Partial<Pick<Task, 'description' | 'priority'>>;

/**
 * Input type for updating an existing task
 */
export type UpdateTaskInput = Partial<
  Pick<Task, 'title' | 'description' | 'completed' | 'status' | 'priority' | 'order'>
>;
