# Store

This directory contains Zustand state management with MMKV persistence.

## Overview

The store implementation combines:
- **Zustand**: Lightweight state management
- **MMKV**: Fast, synchronous key-value storage for React Native

## Files

- `mmkv-storage.ts` - MMKV storage adapter for Zustand persist middleware
- `useStore.ts` - Example store with persistence (counter example)
- `index.ts` - Central export point

## Usage

### Basic Usage

```tsx
import { useStore } from '@/store';

function MyComponent() {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);
  
  return (
    <Button onPress={increment}>
      Count: {count}
    </Button>
  );
}
```

### Creating a New Store

To create a new persisted store:

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkv-storage';

interface MyStoreState {
  value: string;
  setValue: (value: string) => void;
}

export const useMyStore = create<MyStoreState>()(
  persist(
    (set) => ({
      value: '',
      setValue: (value) => set({ value }),
    }),
    {
      name: 'my-store-storage', // unique storage key
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
```

### Non-Persisted Store

For stores that don't need persistence:

```typescript
import { create } from 'zustand';

interface TemporaryState {
  tempValue: number;
  setTempValue: (value: number) => void;
}

export const useTempStore = create<TemporaryState>((set) => ({
  tempValue: 0,
  setTempValue: (value) => set({ tempValue: value }),
}));
```

## Features

- ✅ Type-safe with TypeScript
- ✅ Automatic persistence to device storage
- ✅ Synchronous storage operations
- ✅ Small bundle size
- ✅ Fast performance with MMKV
- ✅ State rehydration on app restart

## Testing

Store tests are located in `__tests__/store.test.js`. Run tests with:

```bash
npm test
```

## References

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Native MMKV](https://github.com/mrousavy/react-native-mmkv)
