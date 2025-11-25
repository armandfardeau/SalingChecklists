import { Platform } from 'react-native';

/**
 * RevenueCat configuration
 * 
 * To use RevenueCat in your app:
 * 1. Sign up at https://app.revenuecat.com
 * 2. Create a new project
 * 3. Get your API keys from the RevenueCat dashboard
 * 4. Replace the placeholder keys below with your actual keys
 */

export const REVENUECAT_CONFIG = {
  // Replace with your actual RevenueCat API keys from the dashboard
  // iOS key from App Store Connect integration
  apiKey: Platform.select({
    ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY || 'your_ios_api_key_here',
    android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY || 'your_android_api_key_here',
  }) as string,
  
  // Optional: Set to true to enable debug logs in development
  enableDebugLogs: __DEV__,
};

/**
 * Validates if RevenueCat is properly configured
 */
export const isRevenueCatConfigured = (): boolean => {
  const key = REVENUECAT_CONFIG.apiKey;
  // Check that key exists, is not empty, and is not a placeholder
  return !!key && 
         key.trim() !== '' && 
         key !== 'your_ios_api_key_here' && 
         key !== 'your_android_api_key_here';
};
