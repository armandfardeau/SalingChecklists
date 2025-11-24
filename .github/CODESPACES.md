# GitHub Codespaces Guide for SailingChecklists

This guide will help you get started with developing SailingChecklists in GitHub Codespaces.

## Quick Start

1. **Create a Codespace**
   - Navigate to the repository on GitHub
   - Click the green "Code" button
   - Select the "Codespaces" tab
   - Click "Create codespace on main" (or your branch)

2. **Wait for Setup**
   - The dev container will build automatically
   - Dependencies will install via `npm install`
   - This may take 2-3 minutes on first run

3. **Start Development**
   ```bash
   npm start
   ```

## Development Workflow

### Running the App

**Web Preview (Easiest in Codespaces):**
```bash
npm run web
```
The app will open in a Simple Browser within VS Code.

**Mobile Device with Expo Go:**
```bash
npm start -- --tunnel
```
Scan the QR code with Expo Go app on your phone.

**iOS Simulator (if available):**
```bash
npm run ios
```

**Android Emulator (if available):**
```bash
npm run android
```

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Editing Code

The dev container comes with:
- ✅ GitHub Copilot (AI-powered code suggestions)
- ✅ ESLint (code quality)
- ✅ Prettier (code formatting)
- ✅ React Native Tools
- ✅ Expo Tools
- ✅ Jest Test Runner

Files are automatically formatted on save.

## Project Structure

```
SalingChecklists/
├── app/                    # Expo Router file-based routing
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Entry redirect
│   └── (tabs)/            # Tab navigation
├── components/            # Reusable UI components
├── constants/             # App constants (colors, config)
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── __tests__/            # Test files
```

## Common Tasks

### Adding a New Screen

1. Create a new file in `app/` or `app/(tabs)/`
2. Export a default React component
3. The route is automatically available based on filename

Example `app/settings.tsx`:
```typescript
import { View, Text, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text>Settings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});
```

### Adding a Component

Create in `components/` directory:
```typescript
// components/Button.tsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
}

export default function Button({ title, onPress }: ButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { padding: 15, backgroundColor: '#2f95dc' },
  text: { color: '#fff', fontWeight: 'bold' }
});
```

### Using Zustand for State Management

```typescript
import { create } from 'zustand';

interface MyStore {
  items: string[];
  addItem: (item: string) => void;
}

export const useMyStore = create<MyStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  }))
}));

// In a component:
const items = useMyStore((state) => state.items);
const addItem = useMyStore((state) => state.addItem);
```

### Persisting Data with MMKV

```typescript
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

// Store data
storage.set('key', 'value');
storage.set('user', JSON.stringify({ name: 'John' }));

// Retrieve data
const value = storage.getString('key');
const user = JSON.parse(storage.getString('user') || '{}');

// Delete data
storage.delete('key');
```

## Tips for Codespaces

1. **Keep Codespace Active**
   - Codespaces auto-suspend after 30 minutes of inactivity
   - Your work is saved, but you'll need to restart the dev server

2. **Port Forwarding**
   - Ports are automatically forwarded and usually work out of the box
   - Check the "Ports" tab if you have connection issues
   - Make ports "Public" if accessing from external devices

3. **Performance**
   - Codespaces run on cloud VMs with good performance
   - Use `npm run web` for fastest development cycle
   - Use tunnel mode for mobile device testing

4. **Customize Your Environment**
   - Edit `.devcontainer/devcontainer.json` to add extensions or features
   - Changes take effect after rebuilding the container

5. **Managing Secrets**
   - Use Codespace secrets for API keys
   - Access via `process.env.YOUR_SECRET_NAME`
   - Never commit secrets to the repository

## Troubleshooting

### Can't Connect to Expo

Try tunnel mode:
```bash
npm start -- --tunnel
```

### Metro Bundler Errors

Clear cache and restart:
```bash
npx expo start --clear
```

### TypeScript Errors

Ensure TypeScript is using workspace version:
- Press `Cmd/Ctrl + Shift + P`
- Type "TypeScript: Select TypeScript Version"
- Choose "Use Workspace Version"

### Package Issues

Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [GitHub Codespaces Documentation](https://docs.github.com/codespaces)

## Getting Help

- Check existing issues in the repository
- Create a new issue with detailed description
- Ask in discussions for general questions
- Use GitHub Copilot Chat for code assistance
