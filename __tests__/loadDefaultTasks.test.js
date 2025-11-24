/**
 * Tests for loading default tasks from JSON data source
 */

import { loadDefaultChecklists, getDefaultChecklistById } from '../utils/loadDefaultTasks';
import { ChecklistCategory, TaskStatus, TaskPriority } from '../types';

describe('loadDefaultTasks', () => {
  describe('loadDefaultChecklists', () => {
    it('should load checklists from JSON data', () => {
      const checklists = loadDefaultChecklists();
      
      expect(checklists).toBeDefined();
      expect(Array.isArray(checklists)).toBe(true);
      expect(checklists.length).toBeGreaterThan(0);
    });

    it('should return checklist with correct structure', () => {
      const checklists = loadDefaultChecklists();
      const checklist = checklists[0];
      
      expect(checklist).toHaveProperty('id');
      expect(checklist).toHaveProperty('name');
      expect(checklist).toHaveProperty('category');
      expect(checklist).toHaveProperty('tasks');
      expect(checklist).toHaveProperty('isActive');
      expect(checklist).toHaveProperty('isTemplate');
      expect(checklist).toHaveProperty('createdAt');
      expect(checklist).toHaveProperty('updatedAt');
    });

    it('should parse tasks correctly', () => {
      const checklists = loadDefaultChecklists();
      const checklist = checklists[0];
      
      expect(Array.isArray(checklist.tasks)).toBe(true);
      expect(checklist.tasks.length).toBeGreaterThan(0);
      
      const task = checklist.tasks[0];
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('status');
      expect(task).toHaveProperty('priority');
      expect(task).toHaveProperty('order');
      expect(task).toHaveProperty('createdAt');
      expect(task).toHaveProperty('updatedAt');
    });

    it('should have proper Date objects for timestamps', () => {
      const checklists = loadDefaultChecklists();
      const checklist = checklists[0];
      
      expect(checklist.createdAt).toBeInstanceOf(Date);
      expect(checklist.updatedAt).toBeInstanceOf(Date);
      
      const task = checklist.tasks[0];
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
    });

    it('should load pre-departure checklist', () => {
      const checklists = loadDefaultChecklists();
      const preDepartureChecklist = checklists.find(
        c => c.category === ChecklistCategory.PRE_DEPARTURE
      );
      
      expect(preDepartureChecklist).toBeDefined();
      expect(preDepartureChecklist.name).toBe('Pre-Departure Safety Check');
      expect(preDepartureChecklist.description).toBe('Essential safety checks before departure');
    });

    it('should load arrival checklist', () => {
      const checklists = loadDefaultChecklists();
      const arrivalChecklist = checklists.find(
        c => c.category === ChecklistCategory.ARRIVAL
      );
      
      expect(arrivalChecklist).toBeDefined();
      expect(arrivalChecklist.id).toBe('arrival-1');
      expect(arrivalChecklist.name).toBe('Arrival Procedures');
      expect(arrivalChecklist.description).toBe('Essential tasks to complete upon arrival at destination.');
      expect(arrivalChecklist.color).toBe('#3498db');
      expect(arrivalChecklist.icon).toBe('anchor');
      expect(arrivalChecklist.tasks.length).toBe(5);
    });

    it('should have correct arrival tasks', () => {
      const checklists = loadDefaultChecklists();
      const arrivalChecklist = checklists.find(
        c => c.category === ChecklistCategory.ARRIVAL
      );
      
      expect(arrivalChecklist).toBeDefined();
      
      // Verify all required tasks are present
      const taskTitles = arrivalChecklist.tasks.map(t => t.title);
      expect(taskTitles).toContain('Secure the boat at the dock or anchorage');
      expect(taskTitles).toContain('Engine shutdown and post-operation checks');
      expect(taskTitles).toContain('Check all lines and fenders');
      expect(taskTitles).toContain('Log arrival time and location');
      expect(taskTitles).toContain('Check crew and passengers');
      
      // Verify task priorities
      const secureBoatTask = arrivalChecklist.tasks.find(
        t => t.title === 'Secure the boat at the dock or anchorage'
      );
      expect(secureBoatTask.priority).toBe(TaskPriority.CRITICAL);
      
      const engineTask = arrivalChecklist.tasks.find(
        t => t.title === 'Engine shutdown and post-operation checks'
      );
      expect(engineTask.priority).toBe(TaskPriority.HIGH);
    });

    it('should have tasks with correct priorities', () => {
      const checklists = loadDefaultChecklists();
      const checklist = checklists[0];
      
      // Find the weather forecast task which should be critical priority
      const weatherTask = checklist.tasks.find(t => t.title === 'Check weather forecast');
      expect(weatherTask).toBeDefined();
      expect(weatherTask.priority).toBe(TaskPriority.CRITICAL);
      
      // Find life jacket task which should be high priority
      const lifeJacketTask = checklist.tasks.find(t => t.title === 'Inspect life jackets');
      expect(lifeJacketTask).toBeDefined();
      expect(lifeJacketTask.priority).toBe(TaskPriority.HIGH);
    });

    it('should have tasks with pending status by default', () => {
      const checklists = loadDefaultChecklists();
      const checklist = checklists[0];
      
      checklist.tasks.forEach(task => {
        expect(task.status).toBe(TaskStatus.PENDING);
      });
    });

    it('should have tasks with proper ordering', () => {
      const checklists = loadDefaultChecklists();
      const checklist = checklists[0];
      
      // Check that tasks are ordered
      for (let i = 0; i < checklist.tasks.length; i++) {
        expect(checklist.tasks[i].order).toBe(i + 1);
      }
    });
  });

  describe('getDefaultChecklistById', () => {
    it('should find checklist by ID', () => {
      const checklist = getDefaultChecklistById('pre-dep-1');
      
      expect(checklist).toBeDefined();
      expect(checklist.id).toBe('pre-dep-1');
      expect(checklist.name).toBe('Pre-Departure Safety Check');
    });

    it('should find arrival checklist by ID', () => {
      const checklist = getDefaultChecklistById('arrival-1');
      
      expect(checklist).toBeDefined();
      expect(checklist.id).toBe('arrival-1');
      expect(checklist.name).toBe('Arrival Procedures');
    });

    it('should return undefined for non-existent ID', () => {
      const checklist = getDefaultChecklistById('non-existent-id');
      
      expect(checklist).toBeUndefined();
    });
  });
});
