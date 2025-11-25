# Contributing Translations

Thank you for your interest in translating SailingChecklists! This document explains how to add translations for default tasks and checklists.

## Overview

SailingChecklists supports multiple languages for default checklists. When users select a language in the app settings, they can choose to load the default checklists in that language.

## Supported Languages

Currently, the following languages are supported:
- **English** (en) - Default
- **Français** (fr) - French

We welcome contributions for additional languages!

## How to Add a New Translation

### 1. Create a Translation File

1. Navigate to the `assets/locales/` directory
2. Copy the English template file:
   ```bash
   cp assets/locales/en.json assets/locales/[language-code].json
   ```
   Replace `[language-code]` with the appropriate ISO 639-1 code (e.g., `es` for Spanish, `de` for German, `it` for Italian)

### 2. Translate the Content

Open your new JSON file and translate the following fields:
- `name` - The checklist name
- `description` - The checklist description
- `title` - Task titles
- `description` - Task descriptions

**Important:** Do NOT change the following fields:
- `id` - Must remain the same across all translations
- `category` - Must remain the same
- `isActive`, `isTemplate` - Must remain the same
- `color`, `icon` - Must remain the same
- `status`, `priority`, `order` - Must remain the same

### 3. Example

Here's an excerpt from the French translation (`fr.json`):

```json
{
  "checklists": [
    {
      "id": "pre-dep-1",
      "name": "Contrôle de sécurité avant départ",
      "description": "Contrôles de sécurité essentiels avant le départ",
      "category": "pre_departure",
      "isActive": true,
      "isTemplate": false,
      "color": "#FF6B6B",
      "icon": "sailboat",
      "tasks": [
        {
          "id": "task-1",
          "title": "Vérifier les prévisions météorologiques",
          "description": "Examiner les conditions météorologiques locales et les prévisions marines",
          "status": "pending",
          "priority": "critical",
          "order": 1
        }
      ]
    }
  ]
}
```

### 4. Update the Code

After creating your translation file, you need to update the code to support the new language:

1. **Import the translation** in `utils/loadDefaultTasks.ts`:
   ```typescript
   import esTranslation from '../assets/locales/es.json';
   ```

2. **Add to the locale map** in `utils/loadDefaultTasks.ts`:
   ```typescript
   const localeTasksMap: Record<SupportedLocale, DefaultTasksJSON> = {
     en: enTasks as DefaultTasksJSON,
     fr: frTasks as DefaultTasksJSON,
     es: esTranslation as DefaultTasksJSON, // Add your language here
     // ...
   };
   ```

3. **Add to supported locales** in `store/useLocaleStore.ts`:
   ```typescript
   export type SupportedLocale = 'en' | 'fr' | 'es' | 'de' | 'it'; // Add your code here
   ```

4. **Update getAvailableLocales** in `utils/loadDefaultTasks.ts`:
   ```typescript
   export const getAvailableLocales = (): SupportedLocale[] => {
     return ['en', 'fr', 'es']; // Add your language code here
   };
   ```

5. **Add language name** in `app/(tabs)/settings.tsx`:
   ```typescript
   const getLanguageName = (code: SupportedLocale): string => {
     const names: Record<SupportedLocale, string> = {
       en: 'English',
       fr: 'Français',
       es: 'Español', // Add your language name here
       // ...
     };
     return names[code];
   };
   ```

### 5. Validate Your Translation

1. **Run tests** to ensure structure is correct:
   ```bash
   npm test
   ```

2. **Check linting**:
   ```bash
   npm run lint
   ```

3. **Test in the app**:
   - Build and run the app
   - Navigate to Settings
   - Select your new language
   - Verify that the prompt appears
   - Choose to load default tasks in your language
   - Confirm all translations appear correctly

## Translation Guidelines

### Do:
- ✅ Keep translations natural and contextually appropriate for sailing/maritime use
- ✅ Maintain consistent terminology throughout
- ✅ Use formal language for safety-related content
- ✅ Preserve the same level of detail as the original
- ✅ Test your translations in the actual app

### Don't:
- ❌ Change IDs, categories, or structural elements
- ❌ Add or remove tasks (maintain the same task count)
- ❌ Use machine translation without review
- ❌ Translate technical terms that are universally known (e.g., "VHF", "MAYDAY")

## Checklist Structure

The JSON file contains an array of checklists. Each checklist has:

| Field | Translatable? | Description |
|-------|---------------|-------------|
| `id` | ❌ No | Unique identifier (must stay the same) |
| `name` | ✅ Yes | Checklist name |
| `description` | ✅ Yes | Checklist description |
| `category` | ❌ No | Internal category code |
| `isActive` | ❌ No | Whether checklist is active |
| `isTemplate` | ❌ No | Whether checklist is a template |
| `color` | ❌ No | Display color |
| `icon` | ❌ No | Display icon |
| `tasks` | ✅ Yes | Array of tasks (translate `title` and `description`) |

Each task has:

| Field | Translatable? | Description |
|-------|---------------|-------------|
| `id` | ❌ No | Unique identifier (must stay the same) |
| `title` | ✅ Yes | Task title |
| `description` | ✅ Yes | Task description |
| `status` | ❌ No | Task status |
| `priority` | ❌ No | Task priority |
| `order` | ❌ No | Display order |

## Testing Your Translation

After adding a translation, write tests to verify it:

```javascript
it('should load default tasks in [Your Language]', () => {
  const checklists = loadDefaultChecklists('es');
  expect(checklists).toBeDefined();
  expect(checklists[0].name).toContain('[Expected Text]');
});
```

Add your test to `__tests__/localizedTasks.test.js`.

## Submitting Your Translation

1. Fork the repository
2. Create a new branch: `git checkout -b translation/[language-code]`
3. Add your translation file and code changes
4. Run tests and linting
5. Commit your changes with a clear message: `Add [Language] translation for default tasks`
6. Submit a pull request with:
   - Description of the language added
   - Confirmation that you tested the translation
   - Any notes about terminology choices

## Questions?

If you have questions about contributing translations, please:
1. Check existing translations for examples
2. Open an issue on GitHub
3. Reach out to the maintainers

Thank you for helping make SailingChecklists accessible to more users worldwide! 🌍⛵
