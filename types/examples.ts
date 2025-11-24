/**
 * Examples demonstrating usage of checklist and task types
 * This file shows how to use the data models in the application
 */

import {
  Task,
  TaskPriority,
  TaskStatus,
  CreateTaskInput,
  UpdateTaskInput,
  Checklist,
  ChecklistCategory,
  CreateChecklistInput,
  UpdateChecklistInput,
  ChecklistStats,
} from './index';

// Example 1: Creating a new task
const createTask = (input: CreateTaskInput): Task => {
  const now = new Date();
  return {
    id: Math.random().toString(36).substring(7),
    title: input.title,
    description: input.description,
    completed: false,
    status: TaskStatus.PENDING,
    priority: input.priority || TaskPriority.MEDIUM,
    order: input.order,
    createdAt: now,
    updatedAt: now,
  };
};

// Example 2: Updating a task
const updateTask = (task: Task, updates: UpdateTaskInput): Task => {
  return {
    ...task,
    ...updates,
    updatedAt: new Date(),
    completedAt: updates.completed && !task.completed ? new Date() : task.completedAt,
  };
};

// Example 3: Creating a new checklist
const createChecklist = (input: CreateChecklistInput): Checklist => {
  const now = new Date();
  return {
    id: Math.random().toString(36).substring(7),
    name: input.name,
    description: input.description,
    category: input.category,
    tasks: [],
    isActive: true,
    isTemplate: input.isTemplate || false,
    color: input.color,
    icon: input.icon,
    createdAt: now,
    updatedAt: now,
  };
};

// Example 4: Calculating checklist statistics
const calculateChecklistStats = (checklist: Checklist): ChecklistStats => {
  const totalTasks = checklist.tasks.length;
  const completedTasks = checklist.tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const isFullyCompleted = totalTasks > 0 && completedTasks === totalTasks;

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completionPercentage,
    isFullyCompleted,
  };
};

// Example 5: Sample data - Pre-departure checklist
export const examplePreDepartureChecklist: Checklist = {
  id: 'pre-dep-1',
  name: 'Pre-Departure Safety Check',
  description: 'Essential safety checks before departure',
  category: ChecklistCategory.PRE_DEPARTURE,
  isActive: true,
  isTemplate: false,
  color: '#FF6B6B',
  icon: 'sailboat',
  createdAt: new Date(),
  updatedAt: new Date(),
  tasks: [
    {
      id: 'task-1',
      title: 'Check weather forecast',
      description: 'Review local weather conditions and marine forecast',
      completed: false,
      status: TaskStatus.PENDING,
      priority: TaskPriority.CRITICAL,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'task-2',
      title: 'Inspect life jackets',
      description: 'Ensure all crew members have properly fitting life jackets',
      completed: false,
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'task-3',
      title: 'Check fuel level',
      description: 'Verify sufficient fuel for planned route',
      completed: false,
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'task-4',
      title: 'Test navigation lights',
      description: 'Ensure all navigation lights are functioning',
      completed: false,
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
      order: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'task-5',
      title: 'Verify VHF radio',
      description: 'Test VHF radio communication',
      completed: false,
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
      order: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

// Export utility functions for use in the application
export {
  createTask,
  updateTask,
  createChecklist,
  calculateChecklistStats,
};
