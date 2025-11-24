# Vexo.co Analytics Integration

This document describes the Vexo.co analytics integration in the SalingChecklists application.

## What is Vexo?

[Vexo.co](https://vexo.co) is a product analytics platform specifically designed for React Native and Expo applications. It provides:

- Real-time user analytics and insights
- Session replays to see how users interact with your app
- Heatmaps to visualize navigation patterns
- Custom event tracking
- User funnels and conversion tracking
- Active user statistics, OS distribution, and geographic insights

## Integration Overview

The Vexo analytics integration has been implemented with the following principles:

1. **Opt-in by default**: Analytics are disabled unless explicitly configured
2. **Production-focused**: By default, analytics only run in production builds
3. **Environment-based configuration**: API key is managed through environment variables
4. **Minimal code changes**: Integration requires no changes to existing app functionality

## Files Modified/Created

### New Files

1. **`constants/Analytics.ts`**
   - Central configuration for Vexo analytics
   - Reads API key from environment variables
   - Controls production-only mode

2. **`.env.example`**
   - Example environment configuration
   - Documents required environment variables

3. **`__tests__/Analytics.test.js`**
   - Tests for Analytics configuration
   - Validates configuration structure

### Modified Files

1. **`app/_layout.tsx`**
   - Added Vexo initialization on app startup
   - Conditional initialization based on configuration

2. **`package.json`**
   - Added `vexo-analytics` dependency (v1.5.2)

3. **`.gitignore`**
   - Added `.env` to prevent committing sensitive data

4. **`README.md`**
   - Added analytics setup instructions
   - Documented Vexo features and configuration

## Setup Instructions

### For Development

1. **Sign up for Vexo**
   - Go to [vexo.co](https://vexo.co) and create an account
   - Create a new app in the Vexo dashboard

2. **Get your API key**
   - Copy the API key from your Vexo dashboard

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```

4. **Add your API key to `.env`**
   ```
   EXPO_PUBLIC_VEXO_API_KEY=your_actual_api_key_here
   ```

5. **Test in development (optional)**
   - By default, analytics only run in production
   - To test in development, modify `constants/Analytics.ts`:
     ```typescript
     productionOnly: false,
     ```

6. **Rebuild your app**
   - Since Vexo includes native code, rebuild your app:
     ```bash
     npm run android  # for Android
     npm run ios      # for iOS (macOS only)
     ```

### For Production

1. **Set environment variable in your build system**
   - For EAS Build, add to `eas.json`:
     ```json
     {
       "build": {
         "production": {
           "env": {
             "EXPO_PUBLIC_VEXO_API_KEY": "your_api_key"
           }
         }
       }
     }
     ```

2. **Build and deploy**
   - Analytics will automatically start tracking in production builds

## Configuration Options

Edit `constants/Analytics.ts` to customize:

- **`vexoApiKey`**: Your Vexo API key (from environment variable)
- **`productionOnly`**: Whether to run analytics only in production (default: `true`)

## What Gets Tracked

By default, Vexo automatically tracks:

- Screen views and navigation
- User sessions
- App lifecycle events (opens, closes)
- Device information (OS, version, model)
- Performance metrics

### Adding Custom Events (Optional)

You can add custom event tracking anywhere in your app:

```typescript
import { vexo } from 'vexo-analytics';

// Track a custom event
vexo.track('checklist_completed', {
  checklistId: 'abc123',
  itemCount: 15,
  completionTime: 180
});
```

## Privacy and Compliance

- Vexo is privacy-focused with GDPR compliance options
- Users can opt-out of analytics in your app's settings (you'll need to implement this)
- No personally identifiable information (PII) is tracked by default
- Session replays can be disabled if needed

## Linking to Expo Dashboard

For Expo projects, you can link Vexo to your Expo dashboard:

1. Go to your Expo dashboard settings
2. Find the Vexo integration section
3. Click "Connect" and authenticate with Vexo
4. Link your Vexo project to your Expo project
5. Session replays will appear directly in Expo dashboard

## Troubleshooting

### Analytics not appearing in Vexo dashboard

1. Check that your API key is correctly set in `.env`
2. Verify that you're running a production build (or set `productionOnly: false`)
3. Make sure you rebuilt your app after adding the integration
4. Check the Vexo dashboard for your app (it may take a few minutes for data to appear)

### Build errors

If you encounter build errors:

1. Clear your build cache: `expo start -c`
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. For native builds, clean and rebuild: `cd android && ./gradlew clean`

### TypeScript errors

If you see TypeScript errors related to Analytics:

1. Ensure `constants/Analytics.ts` exists
2. Check that the import path is correct (relative imports)
3. Restart your TypeScript server

## Resources

- [Vexo Documentation](https://docs.vexo.co/)
- [Expo Vexo Guide](https://docs.expo.dev/guides/using-vexo/)
- [Vexo + Expo Blog Post](https://expo.dev/blog/optimize-user-experience-and-drive-engagement-with-vexo-and-expo)

## Support

For issues with:
- **Vexo platform**: Contact [Vexo support](https://vexo.co/support)
- **Integration code**: Open an issue in this repository
- **Expo-specific issues**: Check [Expo documentation](https://docs.expo.dev/)
