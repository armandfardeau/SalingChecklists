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
  });
});
