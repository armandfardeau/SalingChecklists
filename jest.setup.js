// Jest setup file for handling Expo imports
// This prevents errors when running simple tests that don't use Expo components

// Mock structuredClone if not available (Node < 17)
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Mock Expo winter runtime to prevent import errors
if (typeof globalThis.import === 'undefined') {
  globalThis.import = {
    meta: {
      url: 'file:///',
      resolve: (specifier) => specifier,
    },
  };
}

// Ensure __ExpoImportMetaRegistry is defined
if (typeof globalThis.__ExpoImportMetaRegistry === 'undefined') {
  globalThis.__ExpoImportMetaRegistry = {
    register: () => {},
    get: () => ({}),
  };
}

// Mock Expo modules that might cause issues in test environment
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      name: 'test',
    },
  },
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, params) => {
      // Return the actual English translations for testing
      const translations = {
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.back': 'Back',
        'common.next': 'Next',
        'common.previous': 'Previous',
        'common.reset': 'Reset',
        'common.complete': 'Complete',
        'common.skip': 'Skip',
        'common.add': 'Add',
        'common.update': 'Update',
        'common.error': 'Error',
        'tabs.checklists': 'Checklists',
        'tabs.settings': 'Settings',
        'checklists.emptyTitle': 'No Checklists Yet',
        'checklists.emptyText': 'Create your first checklist to get started with your sailing preparations.',
        'checklists.stats.tasks': 'tasks',
        'checklistCard.inactive': 'Inactive',
        'checklistEditor.newChecklist': 'New Checklist',
        'checklistEditor.editChecklist': 'Edit Checklist',
        'checklistEditor.checklistDetails': 'Checklist Details',
        'checklistEditor.tasks': 'Tasks',
        'checklistEditor.name': 'Name',
        'checklistEditor.description': 'Description',
        'checklistEditor.category': 'Category',
        'checklistEditor.icon': 'Icon (emoji)',
        'checklistEditor.color': 'Color (hex)',
        'checklistEditor.taskTitle': 'Task Title',
        'checklistEditor.taskDescription': 'Task Description',
        'checklistEditor.priority': 'Priority',
        'checklistEditor.addTask': 'Add Task',
        'checklistEditor.updateTask': 'Update Task',
        'checklistEditor.noTasksYet': 'No tasks yet. Add your first task above.',
        'checklistEditor.validation.nameRequired': 'Checklist name is required',
        'checklistEditor.validation.taskTitleRequired': 'Task title is required',
        'checklistEditor.deleteTask.title': 'Delete Task',
        'checklistEditor.deleteTask.message': 'Are you sure you want to delete this task?',
        'checklistEditor.placeholders.checklistName': 'Enter checklist name',
        'checklistEditor.placeholders.description': 'Enter description (optional)',
        'checklistEditor.placeholders.iconExample': 'e.g., ⛵',
        'checklistEditor.placeholders.colorExample': 'e.g., #FF6B6B',
        'checklistEditor.placeholders.taskTitle': 'Enter task title',
        'checklistEditor.placeholders.taskDescription': 'Enter task description (optional)',
        'checklistRunner.taskCounter': `Task ${params?.current || '{{current}}'} of ${params?.total || '{{total}}'}`,
        'checklistRunner.progressCompleted': `${params?.completed || '{{completed}}'} / ${params?.total || '{{total}}'} completed`,
        'checklistRunner.allTasks': 'All Tasks',
        'checklistRunner.status': 'Status:',
        'checklistRunner.completedAt': `Completed: ${params?.date || '{{date}}'}`,
        'checklistRunner.completionMessage': '🎉 Checklist Complete! All tasks finished.',
        'settings.title': 'Settings',
        'settings.description': 'Configure your app preferences',
        'settings.language': 'Language',
        'priorities.critical': 'Critical',
        'priorities.high': 'High',
        'priorities.medium': 'Medium',
        'priorities.low': 'Low',
        'taskStatus.pending': 'Pending',
        'taskStatus.completed': 'Completed',
        'taskStatus.skipped': 'Skipped',
        'categories.pre_departure': 'Pre Departure',
        'categories.general': 'General',
      };
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));
