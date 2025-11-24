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
