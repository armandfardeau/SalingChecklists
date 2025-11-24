/**
 * Store tests
 * Tests for Zustand store with MMKV persistence
 */

// Mock MMKV before importing the store
jest.mock('react-native-mmkv', () => {
  const mockStorage = new Map();
  
  return {
    createMMKV: jest.fn(() => ({
      set: jest.fn((key, value) => {
        mockStorage.set(key, value);
      }),
      getString: jest.fn((key) => {
        return mockStorage.get(key);
      }),
      remove: jest.fn((key) => {
        mockStorage.delete(key);
      }),
      clearAll: jest.fn(() => {
        mockStorage.clear();
      }),
    })),
  };
});

describe('Store', () => {
  describe('mmkvStorage adapter', () => {
    let mmkvStorage;

    beforeEach(() => {
      // Clear the module cache to get a fresh instance
      jest.resetModules();
      const storageModule = require('../store/mmkv-storage');
      mmkvStorage = storageModule.mmkvStorage;
    });

    it('should set and get items', () => {
      mmkvStorage.setItem('test-key', 'test-value');
      const value = mmkvStorage.getItem('test-key');
      expect(value).toBe('test-value');
    });

    it('should return null for non-existent keys', () => {
      const value = mmkvStorage.getItem('non-existent-key');
      expect(value).toBeNull();
    });

    it('should remove items', () => {
      mmkvStorage.setItem('test-key', 'test-value');
      mmkvStorage.removeItem('test-key');
      const value = mmkvStorage.getItem('test-key');
      expect(value).toBeNull();
    });

    it('should handle JSON data', () => {
      const data = JSON.stringify({ foo: 'bar', count: 42 });
      mmkvStorage.setItem('json-key', data);
      const retrieved = mmkvStorage.getItem('json-key');
      expect(retrieved).toBe(data);
      expect(JSON.parse(retrieved)).toEqual({ foo: 'bar', count: 42 });
    });
  });

  describe('useStore', () => {
    let useStore;

    beforeEach(() => {
      // Clear the module cache to get a fresh store instance
      jest.resetModules();
      const storeModule = require('../store/useStore');
      useStore = storeModule.useStore;
    });

    it('should initialize with default state', () => {
      const state = useStore.getState();
      expect(state.count).toBe(0);
    });

    it('should increment count', () => {
      const state = useStore.getState();
      state.increment();
      expect(useStore.getState().count).toBe(1);
      state.increment();
      expect(useStore.getState().count).toBe(2);
    });

    it('should decrement count', () => {
      const state = useStore.getState();
      state.increment();
      state.increment();
      state.decrement();
      expect(useStore.getState().count).toBe(1);
    });

    it('should reset count', () => {
      const state = useStore.getState();
      state.increment();
      state.increment();
      state.increment();
      state.reset();
      expect(useStore.getState().count).toBe(0);
    });

    it('should maintain state across multiple accesses', () => {
      const state1 = useStore.getState();
      state1.increment();
      
      const state2 = useStore.getState();
      expect(state2.count).toBe(1);
      
      state2.increment();
      expect(useStore.getState().count).toBe(2);
    });
  });
});
