/**
 * Theme Store tests
 * Tests for theme store with MMKV persistence
 */

describe('Theme Store', () => {
  let useThemeStore;

  beforeEach(() => {
    // Clear the module cache to get a fresh store instance
    jest.resetModules();
    const storeModule = require('../store/useThemeStore');
    useThemeStore = storeModule.useThemeStore;
  });

  it('should initialize with light mode', () => {
    const state = useThemeStore.getState();
    expect(state.mode).toBe('light');
  });

  it('should set theme to dark mode', () => {
    const state = useThemeStore.getState();
    state.setTheme('dark');
    expect(useThemeStore.getState().mode).toBe('dark');
  });

  it('should set theme to light mode', () => {
    const state = useThemeStore.getState();
    state.setTheme('dark');
    state.setTheme('light');
    expect(useThemeStore.getState().mode).toBe('light');
  });

  it('should toggle theme from light to dark', () => {
    const state = useThemeStore.getState();
    expect(state.mode).toBe('light');
    state.toggleTheme();
    expect(useThemeStore.getState().mode).toBe('dark');
  });

  it('should toggle theme from dark to light', () => {
    const state = useThemeStore.getState();
    state.setTheme('dark');
    state.toggleTheme();
    expect(useThemeStore.getState().mode).toBe('light');
  });

  it('should maintain state across multiple accesses', () => {
    const state1 = useThemeStore.getState();
    state1.setTheme('dark');
    
    const state2 = useThemeStore.getState();
    expect(state2.mode).toBe('dark');
    
    state2.toggleTheme();
    expect(useThemeStore.getState().mode).toBe('light');
  });
});
