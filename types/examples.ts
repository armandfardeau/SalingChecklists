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
// Note: In production, use crypto.randomUUID() or a proper UUID library
const createTask = (input: CreateTaskInput): Task => {
  const now = new Date();
  return {
    id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    title: input.title,
    description: input.description,
    status: TaskStatus.PENDING,
    priority: input.priority || TaskPriority.MEDIUM,
    order: input.order,
    createdAt: now,
    updatedAt: now,
  };
};

// Example 2: Updating a task
const updateTask = (task: Task, updates: UpdateTaskInput): Task => {
  const wasCompleted = task.status === TaskStatus.COMPLETED;
  const newStatus = updates.status ?? task.status;
  const isNowCompleted = newStatus === TaskStatus.COMPLETED;
  
  // Set completedAt when transitioning to COMPLETED, clear it when transitioning away
  let completedAt = task.completedAt;
  if (updates.status !== undefined) {
    if (isNowCompleted && !wasCompleted) {
      completedAt = new Date();
    } else if (!isNowCompleted && wasCompleted) {
      completedAt = undefined;
    }
  }
  
  return {
    ...task,
    ...updates,
    updatedAt: new Date(),
    completedAt,
  };
};

// Example 3: Creating a new checklist
// Note: In production, use crypto.randomUUID() or a proper UUID library
const createChecklist = (input: CreateChecklistInput): Checklist => {
  const now = new Date();
  return {
    id: `checklist-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
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
  const completedTasks = checklist.tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
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

// Note: Default checklist data has been moved to assets/defaultTasks.json
// Use the loadDefaultChecklists() function from utils/loadDefaultTasks.ts to load sample data

// Export utility functions for use in the application
export {
  createTask,
  updateTask,
  createChecklist,
  calculateChecklistStats,
};
