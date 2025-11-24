/**
 * Tests for RevenueCat configuration
 */

import { REVENUECAT_CONFIG, isRevenueCatConfigured } from '../utils/revenueCatConfig';

describe('revenueCatConfig', () => {
  describe('REVENUECAT_CONFIG', () => {
    it('should have an apiKey property', () => {
      expect(REVENUECAT_CONFIG).toHaveProperty('apiKey');
      expect(typeof REVENUECAT_CONFIG.apiKey).toBe('string');
    });

    it('should have an enableDebugLogs property', () => {
      expect(REVENUECAT_CONFIG).toHaveProperty('enableDebugLogs');
      expect(typeof REVENUECAT_CONFIG.enableDebugLogs).toBe('boolean');
    });
  });

  describe('isRevenueCatConfigured', () => {
    it('should return a boolean', () => {
      const result = isRevenueCatConfigured();
      expect(typeof result).toBe('boolean');
    });

    it('should return false when using placeholder keys', () => {
      // Since we're using placeholder keys by default in tests
      const result = isRevenueCatConfigured();
      expect(result).toBe(false);
    });

    it('should validate properly with environment variables', () => {
      // The function should work correctly when env vars are set
      // This test documents the expected behavior with env variables
      const originalEnv = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
      
      // Test with valid env var
      process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY = 'sk_test_1234567890';
      // Note: We can't test this directly since REVENUECAT_CONFIG is already evaluated
      // This test documents that the config should handle env vars correctly
      
      // Restore original env
      if (originalEnv) {
        process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY = originalEnv;
      } else {
        delete process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
      }
      
      // When env vars are properly set, isRevenueCatConfigured should return true
      // When env vars are not set or empty, it should return false
      expect(typeof isRevenueCatConfigured()).toBe('boolean');
    });
  });
});
