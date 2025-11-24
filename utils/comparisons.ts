/**
 * Utility functions for comparing objects and arrays
 */

import { Task } from '../types';

/**
 * Compares two arrays of tasks to check if they are equal
 * More efficient than JSON.stringify and handles task-specific comparison
 * @param tasks1 - First array of tasks
 * @param tasks2 - Second array of tasks
 * @returns true if arrays are equal, false otherwise
 */
export function areTaskArraysEqual(tasks1: Task[], tasks2: Task[]): boolean {
  if (tasks1.length !== tasks2.length) {
    return false;
  }

  // Create maps for efficient lookup
  const tasks1Map = new Map(tasks1.map(t => [t.id, t]));
  const tasks2Map = new Map(tasks2.map(t => [t.id, t]));

  // Check if all task IDs match
  if (tasks1Map.size !== tasks2Map.size) {
    return false;
  }

  // Compare each task's properties
  for (const [id, task1] of tasks1Map) {
    const task2 = tasks2Map.get(id);
    if (!task2) {
      return false;
    }

    // Compare relevant properties (excluding dates as they may differ slightly)
    if (
      task1.title !== task2.title ||
      task1.description !== task2.description ||
      task1.status !== task2.status ||
      task1.priority !== task2.priority ||
      task1.order !== task2.order
    ) {
      return false;
    }
  }

  return true;
}
