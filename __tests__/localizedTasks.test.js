/**
 * Test suite for localized default tasks functionality
 */
import { loadDefaultChecklists, getAvailableLocales } from '../utils/loadDefaultTasks';

describe('Localized Default Tasks', () => {
  it('should load default tasks in English', () => {
    const checklists = loadDefaultChecklists('en');
    expect(checklists).toBeDefined();
    expect(Array.isArray(checklists)).toBe(true);
    expect(checklists.length).toBeGreaterThan(0);
    
    // Check that the first checklist has English text
    expect(checklists[0].name).toContain('Safety Check');
  });

  it('should load default tasks in French', () => {
    const checklists = loadDefaultChecklists('fr');
    expect(checklists).toBeDefined();
    expect(Array.isArray(checklists)).toBe(true);
    expect(checklists.length).toBeGreaterThan(0);
    
    // Check that the first checklist has French text
    expect(checklists[0].name).toContain('Contrôle de sécurité');
  });

  it('should fall back to English for unsupported locales', () => {
    const checklists = loadDefaultChecklists('es');
    expect(checklists).toBeDefined();
    expect(Array.isArray(checklists)).toBe(true);
    expect(checklists.length).toBeGreaterThan(0);
    
    // Should fall back to English
    expect(checklists[0].name).toContain('Safety Check');
  });

  it('should load English by default when no locale is specified', () => {
    const checklists = loadDefaultChecklists();
    expect(checklists).toBeDefined();
    expect(checklists[0].name).toContain('Safety Check');
  });

  it('should have the same number of checklists across all locales', () => {
    const enChecklists = loadDefaultChecklists('en');
    const frChecklists = loadDefaultChecklists('fr');
    
    expect(enChecklists.length).toBe(frChecklists.length);
  });

  it('should have the same task count per checklist across locales', () => {
    const enChecklists = loadDefaultChecklists('en');
    const frChecklists = loadDefaultChecklists('fr');
    
    enChecklists.forEach((enChecklist, index) => {
      const frChecklist = frChecklists[index];
      expect(enChecklist.tasks.length).toBe(frChecklist.tasks.length);
    });
  });

  it('should have matching IDs across different locales', () => {
    const enChecklists = loadDefaultChecklists('en');
    const frChecklists = loadDefaultChecklists('fr');
    
    enChecklists.forEach((enChecklist, index) => {
      const frChecklist = frChecklists[index];
      expect(enChecklist.id).toBe(frChecklist.id);
      
      enChecklist.tasks.forEach((enTask, taskIndex) => {
        const frTask = frChecklist.tasks[taskIndex];
        expect(enTask.id).toBe(frTask.id);
      });
    });
  });

  it('should return available locales', () => {
    const locales = getAvailableLocales();
    expect(locales).toBeDefined();
    expect(Array.isArray(locales)).toBe(true);
    expect(locales).toContain('en');
    expect(locales).toContain('fr');
  });
});
