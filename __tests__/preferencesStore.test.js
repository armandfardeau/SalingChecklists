/**
 * Preferences Store tests
 * Tests for preferences store with MMKV persistence
 */

describe('Preferences Store', () => {
  let usePreferencesStore;

  beforeEach(() => {
    // Clear the module cache to get a fresh store instance
    jest.resetModules();
    const storeModule = require('../store/usePreferencesStore');
    usePreferencesStore = storeModule.usePreferencesStore;
  });

  it('should initialize with English language', () => {
    const state = usePreferencesStore.getState();
    expect(state.language).toBe('en');
  });

  it('should initialize with onboarding incomplete', () => {
    const state = usePreferencesStore.getState();
    expect(state.hasCompletedOnboarding).toBe(false);
  });

  it('should set language to French', () => {
    const state = usePreferencesStore.getState();
    state.setLanguage('fr');
    expect(usePreferencesStore.getState().language).toBe('fr');
  });

  it('should set language to Spanish', () => {
    const state = usePreferencesStore.getState();
    state.setLanguage('es');
    expect(usePreferencesStore.getState().language).toBe('es');
  });

  it('should set language to German', () => {
    const state = usePreferencesStore.getState();
    state.setLanguage('de');
    expect(usePreferencesStore.getState().language).toBe('de');
  });

  it('should set language to Italian', () => {
    const state = usePreferencesStore.getState();
    state.setLanguage('it');
    expect(usePreferencesStore.getState().language).toBe('it');
  });

  it('should complete onboarding', () => {
    const state = usePreferencesStore.getState();
    expect(state.hasCompletedOnboarding).toBe(false);
    state.completeOnboarding();
    expect(usePreferencesStore.getState().hasCompletedOnboarding).toBe(true);
  });

  it('should reset onboarding', () => {
    const state = usePreferencesStore.getState();
    state.completeOnboarding();
    expect(usePreferencesStore.getState().hasCompletedOnboarding).toBe(true);
    state.resetOnboarding();
    expect(usePreferencesStore.getState().hasCompletedOnboarding).toBe(false);
  });

  it('should maintain state across multiple accesses', () => {
    const state1 = usePreferencesStore.getState();
    state1.setLanguage('fr');
    state1.completeOnboarding();
    
    const state2 = usePreferencesStore.getState();
    expect(state2.language).toBe('fr');
    expect(state2.hasCompletedOnboarding).toBe(true);
    
    state2.setLanguage('de');
    expect(usePreferencesStore.getState().language).toBe('de');
  });

  it('should allow changing language after onboarding', () => {
    const state = usePreferencesStore.getState();
    state.completeOnboarding();
    state.setLanguage('es');
    
    expect(usePreferencesStore.getState().language).toBe('es');
    expect(usePreferencesStore.getState().hasCompletedOnboarding).toBe(true);
    
    state.setLanguage('it');
    expect(usePreferencesStore.getState().language).toBe('it');
  });
});
