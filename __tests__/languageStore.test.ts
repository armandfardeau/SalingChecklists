import i18n from '../utils/i18n';

/**
 * Language Store tests
 * Tests for language store interface and i18n integration
 * Note: MMKV persistence is not tested here as it's not available in test environment
 */
describe('useLanguageStore', () => {
  let useLanguageStore: any;

  beforeEach(() => {
    // Clear the module cache to get a fresh store instance
    jest.resetModules();
    const storeModule = require('../store/useLanguageStore');
    useLanguageStore = storeModule.useLanguageStore;
    
    // Reset i18n to English
    i18n.changeLanguage('en');
  });

  it('should export the store with expected interface', () => {
    const state = useLanguageStore.getState();
    
    // Check that all expected properties and methods exist
    expect(state).toHaveProperty('language');
    expect(state).toHaveProperty('setLanguage');
    expect(state).toHaveProperty('_hasHydrated');
    expect(state).toHaveProperty('setHasHydrated');
    
    // Check types
    expect(typeof state.language).toBe('string');
    expect(typeof state.setLanguage).toBe('function');
    expect(typeof state._hasHydrated).toBe('boolean');
    expect(typeof state.setHasHydrated).toBe('function');
  });

  it('should initialize with English as default language', () => {
    const state = useLanguageStore.getState();
    expect(state.language).toBe('en');
  });

  it('should have a hydration state flag', () => {
    const state = useLanguageStore.getState();
    // The hydration state is managed by Zustand persist middleware
    // In tests, it may be true or false depending on when the store is accessed
    expect(typeof state._hasHydrated).toBe('boolean');
  });
});
