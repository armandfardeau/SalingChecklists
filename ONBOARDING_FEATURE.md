# Language and Theme Selection Feature

## Overview
Added a new onboarding screen that appears on the first app launch, allowing users to select their preferred language and theme (Light/Dark mode). Users can also change these preferences later in the Settings screen.

## Implementation Details

### New Files Created

1. **`store/usePreferencesStore.ts`**
   - Zustand store for managing user preferences
   - Stores language selection (English, French, Spanish, German, Italian)
   - Tracks onboarding completion state
   - Persisted to device storage using MMKV

2. **`app/onboarding.tsx`**
   - Full-screen onboarding interface
   - Language selection with flag emojis
   - Theme selection (Light/Dark mode)
   - Clean, maritime-themed design consistent with app styling

3. **`__tests__/preferencesStore.test.js`**
   - Comprehensive tests for preferences store
   - Tests language selection
   - Tests onboarding state management

4. **`__tests__/Onboarding.test.js`**
   - Tests for onboarding screen rendering
   - Validates all UI elements are present

### Modified Files

1. **`app/index.tsx`**
   - Updated to check onboarding completion state
   - Redirects to `/onboarding` for first-time users
   - Redirects to `/(tabs)` for returning users
   - Waits for store hydration before deciding route

2. **`app/(tabs)/settings.tsx`**
   - Added language selection section
   - Modal dialog for choosing language
   - Displays current language with flag emoji
   - Users can change language anytime after onboarding

3. **`store/index.ts`**
   - Exported new `usePreferencesStore`
   - Exported `Language` type for TypeScript support

## User Flow

### First Launch
1. App starts and checks onboarding status
2. New users see the onboarding screen with:
   - Welcome message with anchor emoji ⚓
   - Language selection (5 languages)
   - Theme selection (Light/Dark)
   - Continue button
3. After clicking Continue:
   - Preferences are saved to device storage
   - Onboarding is marked as complete
   - User is redirected to main app tabs

### Returning Users
1. App checks onboarding status
2. Preferences are loaded from storage
3. User goes directly to main app tabs

### Changing Preferences
Users can change language and theme anytime in Settings:
- **Language**: Tap "Language" in Settings → Select from modal
- **Theme**: Toggle "Dark Mode" switch in Settings

## Supported Languages

- 🇬🇧 English (en)
- 🇫🇷 Français (fr)
- 🇪🇸 Español (es)
- 🇩🇪 Deutsch (de)
- 🇮🇹 Italiano (it)

## Design Considerations

### Accessibility
- Large touch targets (minimum 48dp) for maritime conditions
- High contrast colors for visibility in bright sunlight
- Clear visual feedback for selections
- Consistent with app's sea-optimized design system

### Extensibility
The implementation is designed for future expansion:
- Easy to add more languages (update `LANGUAGES` array)
- Store structure supports additional preference types
- Theme system ready for more theme options
- Modular component design

## Technical Details

### Storage
- Uses MMKV for fast, synchronous storage
- Preferences persist across app restarts
- Zustand middleware handles serialization automatically

### State Management
- Zustand stores for clean, reactive state management
- Separate stores for different concerns:
  - `usePreferencesStore`: Language and onboarding
  - `useThemeStore`: Theme mode (existing)

### Testing
- All tests passing (165 tests total)
- New tests for preferences store (10 tests)
- New tests for onboarding screen (5 tests)
- No regressions in existing functionality

## Future Enhancements

Potential improvements for future iterations:
1. **Internationalization (i18n)**
   - Implement full translation support
   - Load language-specific strings
   - Format dates/numbers based on locale

2. **Additional Languages**
   - Portuguese, Dutch, Norwegian, Swedish
   - Based on user demand and maritime regions

3. **Theme Options**
   - Additional theme variants (e.g., High Contrast, True Black)
   - Custom color schemes
   - Auto theme based on time of day

4. **Onboarding Enhancements**
   - Multi-step wizard with app feature highlights
   - Permission requests (if needed)
   - Optional account creation

## Testing the Feature

To test the feature:
1. Clear app data or reinstall to trigger first-time experience
2. Verify onboarding screen appears
3. Select a language and theme
4. Verify redirection to main app
5. Go to Settings and verify you can change preferences
6. Restart app and verify preferences are persisted
