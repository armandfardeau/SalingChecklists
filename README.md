# SalingChecklists

Mobile checklist management application for sailing navigation, built with React Native and Expo.

## 🚀 Quick Start with GitHub Codespaces

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/armandfardeau/SalingChecklists)

Get started instantly with a fully configured development environment in the cloud:

1. Click the badge above or the "Code" → "Codespaces" button
2. Wait for the container to build (~2-3 minutes)
3. Run `npm start` to launch the development server
4. Access the web version or use Expo Go on your phone

For detailed Codespaces instructions, see [CODESPACES.md](.github/CODESPACES.md).

## 📋 Prerequisites

- Node.js (version 20 or higher)
- npm or yarn
- Expo Go on your mobile device ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/armandfardeau/SalingChecklists.git
cd SalingChecklists
```

2. Install dependencies:
```bash
npm install
```

## 🧪 Running and Testing

### Start the development server

```bash
npm start
```

This command launches Expo Dev Tools. You will see a QR code in your terminal.

### Test on different platforms

#### On mobile device (recommended)
1. Install the **Expo Go** app on your phone
2. Scan the QR code displayed in the terminal with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

#### On Android emulator
```bash
npm run android
```
*Requires Android Studio and a configured emulator*

#### On iOS simulator
```bash
npm run ios
```
*Requires macOS and Xcode*

#### In web browser
```bash
npm run web
```

## 📱 Technologies Used

- **React Native** 0.81.5
- **Expo** ~54.0
- **React** 19.1.0
- **Zustand** - State management
- **MMKV** - Fast, persistent key-value storage
- **Vexo** - Product analytics and user insights

## 🛠️ Project Structure

This project follows Expo's recommended folder structure with Expo Router for file-based routing:

```
SalingChecklists/
├── app/                    # File-based routing (Expo Router)
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Home screen
├── store/                 # State management (Zustand + MMKV)
├── components/            # Reusable UI components
├── constants/             # App constants (colors, config, etc.)
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions and helpers
│   └── loadDefaultTasks.ts # Load default checklist data from JSON
├── api/                   # API client and endpoints
├── types/                 # TypeScript type definitions
├── __tests__/            # Test files
├── assets/                # Images, icons, fonts
│   └── defaultTasks.json  # Default checklist data
├── app.json              # Expo configuration
└── package.json          # Dependencies and scripts
```

See [STRUCTURE.md](STRUCTURE.md) for more details about the folder organization.

### Default Checklists

Default checklists (like the pre-departure safety check) are defined in `assets/defaultTasks.json`. This JSON file contains sample checklist data that is loaded when the app is first launched. You can modify this file to customize the default checklists without changing any code.

The JSON structure follows this format:
```json
{
  "checklists": [
    {
      "id": "unique-id",
      "name": "Checklist Name",
      "description": "Description",
      "category": "pre_departure",
      "tasks": [
        {
          "id": "task-id",
          "title": "Task Title",
          "description": "Task description",
          "status": "pending",
          "priority": "high",
          "order": 1
        }
      ]
    }
  ]
}
```

## 📝 Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Launch app on Android
- `npm run ios` - Launch app on iOS (macOS only)
- `npm run web` - Launch app in browser
- `npm test` - Run Jest tests

## 📊 Analytics Configuration

This app integrates [Vexo.co](https://vexo.co) for product analytics and user insights.

### Setting up Vexo Analytics

1. Create a free account at [vexo.co](https://vexo.co)
2. Create a new app in the Vexo dashboard and copy your API key
3. Create a `.env` file in the project root (you can copy `.env.example`):
   ```bash
   cp .env.example .env
   ```
4. Add your Vexo API key to the `.env` file:
   ```
   EXPO_PUBLIC_VEXO_API_KEY=your_actual_api_key_here
   ```
5. Rebuild your app to include the analytics

**Note:** By default, analytics are only sent in production builds. To test analytics in development, modify the `productionOnly` setting in `constants/Analytics.ts`.

### What Vexo Tracks

- User sessions and engagement
- Screen navigation and user flows
- App performance metrics
- Session replays (optional)
- Custom events (can be added as needed)

For more information, visit the [Vexo documentation](https://docs.vexo.co/).

## 🌐 Internationalization (i18n)

This app supports multiple languages and automatically detects your device's language setting.

### Supported Languages

- **English** (en) - Default
- **Français** (fr) - French

### Changing Language

1. Go to the **Settings** tab
2. Tap on **Language**
3. Select your preferred language from the list

The app will remember your language preference across sessions.

### Adding New Languages

To add support for a new language:

1. Create a new translation file in the `translations/` directory (e.g., `es.json` for Spanish)
2. Copy the structure from `translations/en.json` and translate all values
3. Add the language to `utils/i18n.ts` in the `LANGUAGES` array:
   ```typescript
   export const LANGUAGES = [
     { code: 'en', name: 'English', nativeName: 'English' },
     { code: 'fr', name: 'French', nativeName: 'Français' },
     { code: 'es', name: 'Spanish', nativeName: 'Español' }, // Add your language
   ] as const;
   ```
4. Import and add the translation resource in `utils/i18n.ts`:
   ```typescript
   import es from '../translations/es.json';
   
   i18n.use(initReactI18next).init({
     resources: {
       en: { translation: en },
       fr: { translation: fr },
       es: { translation: es }, // Add your language
     },
     // ...
   });
   ```

### Translation Keys

All UI text is stored in JSON files under `translations/`. Key categories include:

- `tabs.*` - Navigation tab labels
- `home.*` - Home screen text and alerts
- `settings.*` - Settings screen labels
- `emergency.*` - Emergency screen text
- `checklist.*` - Checklist component text
- `category.*` - Checklist category names
- `defaultChecklists.*` - Pre-loaded checklist content

### Technical Details

- **Library**: [i18next](https://www.i18next.com/) with [react-i18next](https://react.i18next.com/)
- **Language Detection**: Uses `expo-localization` to detect device language
- **Persistence**: Language preference is saved using MMKV storage
- **Fallback**: If a translation is missing, English is used as fallback
- **Hook**: Use `useTranslation()` hook in components to access translations

Example usage:
```typescript
import { useTranslation } from '../hooks/useTranslation';

function MyComponent() {
  const { t } = useTranslation();
  return <Text>{t('home.createChecklist')}</Text>;
}
```

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or pull request.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
