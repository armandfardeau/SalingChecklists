/**
 * Tests for RevenueCat helper functions
 */

import {
  hasActiveSubscription,
  getActiveEntitlements,
  hasEntitlement,
} from '../types/revenuecat';
import { CustomerInfo } from 'react-native-purchases';

// Mock customer info with active subscription
const mockActiveCustomerInfo = {
  entitlements: {
    active: {
      premium: {},
    },
    all: {},
    verification: 'NOT_REQUESTED',
  },
  originalAppUserId: 'test-user-123',
  firstSeen: '2024-01-01T00:00:00Z',
  originalApplicationVersion: '1.0.0',
  originalPurchaseDate: null,
  activeSubscriptions: [],
  allPurchasedProductIdentifiers: [],
  allPurchaseDates: {},
  latestExpirationDate: null,
  requestDate: '2024-01-01T00:00:00Z',
  nonSubscriptionTransactions: [],
  allExpirationDates: {},
  managementURL: null,
  subscriptionsByProductIdentifier: {},
} as unknown as CustomerInfo;

// Mock customer info without active subscription
const mockInactiveCustomerInfo = {
  entitlements: {
    active: {},
    all: {},
    verification: 'NOT_REQUESTED',
  },
  originalAppUserId: 'test-user-456',
  firstSeen: '2024-01-01T00:00:00Z',
  originalApplicationVersion: '1.0.0',
  originalPurchaseDate: null,
  activeSubscriptions: [],
  allPurchasedProductIdentifiers: [],
  allPurchaseDates: {},
  latestExpirationDate: null,
  requestDate: '2024-01-01T00:00:00Z',
  nonSubscriptionTransactions: [],
  allExpirationDates: {},
  managementURL: null,
  subscriptionsByProductIdentifier: {},
} as unknown as CustomerInfo;

describe('hasActiveSubscription', () => {
  it('should return true when customer has active entitlements', () => {
    expect(hasActiveSubscription(mockActiveCustomerInfo as CustomerInfo)).toBe(true);
  });

  it('should return false when customer has no active entitlements', () => {
    expect(hasActiveSubscription(mockInactiveCustomerInfo as CustomerInfo)).toBe(false);
  });

  it('should return false when customerInfo is null', () => {
    expect(hasActiveSubscription(null)).toBe(false);
  });
});

describe('getActiveEntitlements', () => {
  it('should return array of active entitlement identifiers', () => {
    const entitlements = getActiveEntitlements(mockActiveCustomerInfo as CustomerInfo);
    expect(entitlements).toEqual(['premium']);
  });

  it('should return empty array when customer has no active entitlements', () => {
    const entitlements = getActiveEntitlements(mockInactiveCustomerInfo as CustomerInfo);
    expect(entitlements).toEqual([]);
  });

  it('should return empty array when customerInfo is null', () => {
    const entitlements = getActiveEntitlements(null);
    expect(entitlements).toEqual([]);
  });
});

describe('hasEntitlement', () => {
  it('should return true when customer has the specific entitlement', () => {
    expect(hasEntitlement(mockActiveCustomerInfo as CustomerInfo, 'premium')).toBe(true);
  });

  it('should return false when customer does not have the specific entitlement', () => {
    expect(hasEntitlement(mockActiveCustomerInfo as CustomerInfo, 'pro')).toBe(false);
  });

  it('should return false when customer has no active entitlements', () => {
    expect(hasEntitlement(mockInactiveCustomerInfo as CustomerInfo, 'premium')).toBe(false);
  });

  it('should return false when customerInfo is null', () => {
    expect(hasEntitlement(null, 'premium')).toBe(false);
  });
});
