# RevenueCat Integration Guide

This application has been set up with RevenueCat for in-app purchases and subscriptions. Follow this guide to complete the configuration.

## 📋 Overview

RevenueCat provides a unified API for managing in-app subscriptions and purchases across iOS and Android. The SDK has been integrated into this app, but requires configuration with your RevenueCat account.

## 🚀 Quick Start

### 1. Create a RevenueCat Account

1. Visit [app.revenuecat.com](https://app.revenuecat.com)
2. Sign up for a free account
3. Create a new project for "Sailing Checklists"

### 2. Get Your API Keys

1. In the RevenueCat dashboard, navigate to your project
2. Go to **API Keys** section
3. Copy your API keys for iOS and Android

### 3. Configure the App

You have two options to configure your API keys:

#### Option A: Environment Variables (Recommended for production)

Add these to your environment:
```bash
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=your_ios_api_key_here
EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=your_android_api_key_here
```

#### Option B: Direct Configuration (Good for development)

Edit `/utils/revenueCatConfig.ts` and replace the placeholder keys:
```typescript
export const REVENUECAT_CONFIG = {
  apiKey: Platform.select({
    ios: 'your_actual_ios_api_key',
    android: 'your_actual_android_api_key',
  }) as string,
};
```

### 4. Configure Store Connections

#### For iOS (App Store Connect)
1. In RevenueCat dashboard, go to **Project Settings** → **App Store Connect**
2. Follow the setup wizard to connect your App Store account
3. Enable the "In-App Purchase" capability in Xcode
4. Create products in App Store Connect

#### For Android (Google Play Console)
1. In RevenueCat dashboard, go to **Project Settings** → **Google Play**
2. Follow the setup wizard to connect your Google Play account
3. Create products in Google Play Console

### 5. Set Up Products and Entitlements

1. **Create Entitlements**: Define what features users get (e.g., "premium")
2. **Create Products**: Create your subscription or one-time purchase products
3. **Attach Products to Entitlements**: Link products to the entitlements they unlock
4. **Create Offerings**: Group products into offerings (e.g., "default" offering)

## 📱 How It Works

### SDK Initialization

The app automatically initializes RevenueCat in `app/_layout.tsx` using the `RevenueCatProvider`:

```typescript
<RevenueCatProvider>
  {/* Your app content */}
</RevenueCatProvider>
```

### Using RevenueCat in Your Components

Access RevenueCat functionality using the `useRevenueCat` hook:

```typescript
import { useRevenueCat } from '../contexts/RevenueCatProvider';

function MyComponent() {
  const { isConfigured, customerInfo, refreshCustomerInfo } = useRevenueCat();
  
  // Check if user has active subscription
  const hasSubscription = hasActiveSubscription(customerInfo);
  
  return (
    // Your component UI
  );
}
```

### Checking Subscription Status

Use the helper functions from `types/revenuecat.ts`:

```typescript
import { hasActiveSubscription, hasEntitlement } from '../types/revenuecat';

// Check if user has any active subscription
const isSubscribed = hasActiveSubscription(customerInfo);

// Check for specific entitlement
const hasPremium = hasEntitlement(customerInfo, 'premium');
```

## 🧪 Testing

### Development Testing

1. **Build a development client** (required for native modules):
   ```bash
   npx expo prebuild
   npm run ios  # or npm run android
   ```

2. **Use sandbox accounts**:
   - iOS: Create test accounts in App Store Connect
   - Android: Use test accounts in Google Play Console

### Viewing Status

The Settings screen includes a `SubscriptionStatus` component that displays:
- Current subscription status
- Active entitlements
- Customer information
- Configuration status

## 📦 Files Added/Modified

### New Files
- `utils/revenueCatConfig.ts` - Configuration for RevenueCat API keys
- `contexts/RevenueCatProvider.tsx` - React context for RevenueCat SDK
- `types/revenuecat.ts` - TypeScript types and helper functions
- `components/SubscriptionStatus.tsx` - UI component for subscription display
- `REVENUECAT_SETUP.md` - This setup guide

### Modified Files
- `app.json` - Added `react-native-purchases` plugin
- `package.json` - Added RevenueCat dependencies
- `app/_layout.tsx` - Wrapped app with `RevenueCatProvider`
- `app/(tabs)/settings.tsx` - Added `SubscriptionStatus` component
- `types/index.ts` - Exported RevenueCat types

## 🎨 UI Components

### SubscriptionStatus Component

A pre-built component that displays subscription status. Located in `components/SubscriptionStatus.tsx`.

Features:
- Shows configuration status
- Displays active subscriptions
- Lists active entitlements
- Refresh button for customer info
- Debug information in development

### Adding Paywalls

To add a paywall using RevenueCat's UI:

```typescript
import { Paywall } from 'react-native-purchases-ui';

function MyPaywall() {
  return (
    <Paywall
      offeringId="default"
      onPurchaseCompleted={(transaction) => {
        console.log('Purchase completed', transaction);
      }}
      onDismiss={() => {
        console.log('Paywall dismissed');
      }}
    />
  );
}
```

## 🔒 Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for production builds
3. **Validate purchases server-side** using RevenueCat webhooks
4. **Enable fraud protection** in RevenueCat dashboard

## 📚 Additional Resources

- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [RevenueCat Expo Guide](https://www.revenuecat.com/docs/getting-started/installation/expo)
- [React Native Purchases SDK](https://github.com/RevenueCat/react-native-purchases)
- [RevenueCat Dashboard](https://app.revenuecat.com/)

## ❓ Troubleshooting

### "RevenueCat is not configured" message

Make sure you've:
1. Created a RevenueCat account
2. Added your API keys to the app
3. Rebuilt the app (not using Expo Go)

### Native module errors

RevenueCat requires custom native code. You must:
1. Use `expo-dev-client` (already installed)
2. Build a development client: `npx expo prebuild`
3. Run on device/simulator: `npm run ios` or `npm run android`

### Purchases not working

1. Check that products are created in App Store Connect / Google Play Console
2. Verify products are configured in RevenueCat dashboard
3. Ensure you're using sandbox test accounts
4. Check RevenueCat logs in the dashboard

## 🆘 Support

- [RevenueCat Community](https://community.revenuecat.com/)
- [RevenueCat Support](https://app.revenuecat.com/support)
- Create an issue in this repository for app-specific problems
