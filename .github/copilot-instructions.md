# GitHub Copilot Instructions for SalingChecklists

## Project Overview

SalingChecklists is a mobile checklist management application for sailing navigation, built with React Native and Expo. The app helps sailors manage their pre-departure and navigation checklists efficiently.

## Technology Stack

- **React Native**: 0.81.5
- **React**: 19.1.0
- **Expo**: ~54.0.25
- **TypeScript**: ~5.9.2
- **State Management**: Zustand (^5.0.8)
- **Local Storage**: react-native-mmkv (^4.0.1)
- **Routing**: Expo Router (~6.0.15)
- **Testing**: Jest (^30.2.0) with React Native Testing Library

## Project Structure

```
SalingChecklists/
├── app/                    # File-based routing (Expo Router)
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Home screen
├── components/            # Reusable UI components
├── constants/             # App constants (colors, config, etc.)
│   └── Colors.ts
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions and helpers
├── api/                   # API client and endpoints
├── types/                 # TypeScript type definitions
├── __tests__/            # Test files
├── assets/                # Images, fonts, and other static files
├── app.json              # Expo configuration
└── package.json          # Dependencies and scripts
```

## Coding Conventions

### General Guidelines

1. **Use TypeScript** for all new files (`.tsx` for React components, `.ts` for utilities)
2. **Follow React Native best practices** and Expo conventions
3. **Use functional components** with React hooks (no class components)
4. **Prefer const** over let, avoid var
5. **Use meaningful variable and function names** that describe their purpose

### File Naming

- **Components**: PascalCase (e.g., `ChecklistItem.tsx`, `NavigationBar.tsx`)
- **Utilities/Hooks**: camelCase (e.g., `useChecklists.ts`, `formatDate.ts`)
- **Constants**: PascalCase or UPPER_SNAKE_CASE (e.g., `Colors.ts`, `API_CONFIG.ts`)
- **Types**: PascalCase (e.g., `Checklist.ts`, `User.ts`)

### React Native Components

1. **Use StyleSheet.create** for all styles
2. **Extract styles** to the bottom of the file
3. **Use View, Text, and other React Native primitives** (not HTML elements)
4. **Leverage SafeAreaView** from `react-native-safe-area-context` for proper device layout
5. **Use StatusBar** from `expo-status-bar` for status bar management

### State Management

- **Zustand** is the primary state management solution
- Create stores in a `stores/` directory
- Keep stores focused and modular (one store per domain)
- Use TypeScript for store type definitions

Example Zustand store:
```typescript
import { create } from 'zustand';

interface ChecklistStore {
  checklists: Checklist[];
  addChecklist: (checklist: Checklist) => void;
  removeChecklist: (id: string) => void;
}

export const useChecklistStore = create<ChecklistStore>((set) => ({
  checklists: [],
  addChecklist: (checklist) =>
    set((state) => ({ checklists: [...state.checklists, checklist] })),
  removeChecklist: (id) =>
    set((state) => ({
      checklists: state.checklists.filter((c) => c.id !== id),
    })),
}));
```

### Data Persistence

- **Use react-native-mmkv** for local storage (fast and synchronous)
- Store user preferences, settings, and cached data
- Keep storage keys in a constants file

### Routing with Expo Router

- Follow **file-based routing** conventions
- Place all route files in the `app/` directory
- Use `_layout.tsx` for nested layouts
- Use `(tabs)/` or `(stack)/` for navigation groups
- Dynamic routes: `[id].tsx`

### TypeScript

1. **Define interfaces** for all data structures
2. **Type all function parameters and return values**
3. **Use type inference** where appropriate (don't over-annotate)
4. **Avoid `any`** type - use `unknown` if type is truly unknown
5. **Create shared types** in the `types/` directory

Example:
```typescript
interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}
```

### Testing

1. **Write tests** for all business logic and utility functions
2. **Use Jest** with React Native Testing Library
3. **Place tests** in `__tests__/` directory
4. **Test file naming**: `ComponentName.test.tsx` or `functionName.test.ts`
5. **Focus on behavior** rather than implementation details

Example test:
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import ChecklistItem from '../components/ChecklistItem';

describe('ChecklistItem', () => {
  it('should toggle checkbox when pressed', () => {
    const onToggle = jest.fn();
    const { getByRole } = render(
      <ChecklistItem text="Test item" checked={false} onToggle={onToggle} />
    );
    
    const checkbox = getByRole('checkbox');
    fireEvent.press(checkbox);
    
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
```

### Component Structure

Organize components with this structure:
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ComponentProps {
  // Props interface
}

export default function Component({ prop1, prop2 }: ComponentProps) {
  // Hooks at the top
  
  // Event handlers
  
  // Render
  return (
    <View style={styles.container}>
      <Text>Content</Text>
    </View>
  );
}

// Styles at the bottom
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

## Common Patterns

### Custom Hooks

Create custom hooks in the `hooks/` directory for reusable logic:
```typescript
import { useState, useEffect } from 'react';

export function useAsync<T>(asyncFunction: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    asyncFunction()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
```

### API Calls

Keep API-related code in the `api/` directory:
```typescript
const API_BASE_URL = 'https://api.example.com';

export const fetchChecklists = async (): Promise<Checklist[]> => {
  const response = await fetch(`${API_BASE_URL}/checklists`);
  if (!response.ok) throw new Error('Failed to fetch checklists');
  return response.json();
};
```

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Launch app on Android
- `npm run ios` - Launch app on iOS (macOS only)
- `npm run web` - Launch app in browser
- `npm test` - Run Jest tests

## Dependencies Management

- Keep dependencies up to date, especially Expo SDK
- Test thoroughly after updating dependencies
- Use exact versions for critical dependencies
- Document any peer dependency issues

## Accessibility

1. **Add accessibility labels** to interactive elements
2. **Use semantic components** when available
3. **Support screen readers** with proper ARIA labels
4. **Test with TalkBack (Android) and VoiceOver (iOS)**

Example:
```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Mark item as complete"
  accessibilityRole="button"
  onPress={handlePress}
>
  <Text>Complete</Text>
</TouchableOpacity>
```

## Performance

1. **Memoize expensive computations** with `useMemo`
2. **Memoize callbacks** with `useCallback` when passing to child components
3. **Use React.memo** for components that don't need frequent re-renders
4. **Optimize lists** with `FlatList` or `SectionList` (not ScrollView for large lists)
5. **Lazy load images** and use proper image optimization

## Error Handling

1. **Always handle errors** in async operations
2. **Provide user-friendly error messages**
3. **Log errors** for debugging (use console.error)
4. **Use error boundaries** for component-level error handling

## Security

1. **Never commit API keys or secrets** to the repository
2. **Use environment variables** for sensitive configuration
3. **Validate user input** before processing
4. **Sanitize data** before displaying or storing

## Git Workflow

1. Write clear, concise commit messages
2. Keep commits focused and atomic
3. Test before committing
4. Follow conventional commit format when possible

## Additional Notes

- This is a sailing/navigation application - consider maritime terminology and use cases
- The target users are sailors, so UI should be clear and usable in various conditions
- Consider offline functionality given maritime environments may lack connectivity
- Think about quick access patterns - sailors need fast, glanceable information
