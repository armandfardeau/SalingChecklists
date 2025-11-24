import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

// Initialize MMKV instance
const storage = new MMKV();

/**
 * MMKV storage adapter for Zustand persist middleware
 * Provides synchronous, fast key-value storage for React Native
 */
export const mmkvStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.delete(name);
  },
};
