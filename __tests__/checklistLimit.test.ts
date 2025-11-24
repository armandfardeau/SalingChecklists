/**
 * Tests for checklist limit functionality with RevenueCat
 */

import { canCreateChecklist, FREE_CHECKLIST_LIMIT } from '../types/revenuecat';
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

// Mock customer info without active subscription (free user)
const mockFreeCustomerInfo = {
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

describe('canCreateChecklist', () => {
  describe('for subscribed users', () => {
    it('should allow creation with 0 checklists', () => {
      expect(canCreateChecklist(mockActiveCustomerInfo, 0)).toBe(true);
    });

    it('should allow creation with less than limit', () => {
      expect(canCreateChecklist(mockActiveCustomerInfo, 2)).toBe(true);
    });

    it('should allow creation at limit', () => {
      expect(canCreateChecklist(mockActiveCustomerInfo, FREE_CHECKLIST_LIMIT)).toBe(true);
    });

    it('should allow creation above limit (unlimited)', () => {
      expect(canCreateChecklist(mockActiveCustomerInfo, 10)).toBe(true);
      expect(canCreateChecklist(mockActiveCustomerInfo, 100)).toBe(true);
    });
  });

  describe('for free users', () => {
    it('should allow creation with 0 checklists', () => {
      expect(canCreateChecklist(mockFreeCustomerInfo, 0)).toBe(true);
    });

    it('should allow creation with 1 checklist (below limit)', () => {
      expect(canCreateChecklist(mockFreeCustomerInfo, 1)).toBe(true);
    });

    it('should allow creation with 2 checklists (below limit)', () => {
      expect(canCreateChecklist(mockFreeCustomerInfo, 2)).toBe(true);
    });

    it('should deny creation at limit (3 checklists)', () => {
      expect(canCreateChecklist(mockFreeCustomerInfo, FREE_CHECKLIST_LIMIT)).toBe(false);
    });

    it('should deny creation above limit', () => {
      expect(canCreateChecklist(mockFreeCustomerInfo, 4)).toBe(false);
      expect(canCreateChecklist(mockFreeCustomerInfo, 10)).toBe(false);
    });
  });

  describe('for null customerInfo (no RevenueCat)', () => {
    it('should allow creation with 0 checklists', () => {
      expect(canCreateChecklist(null, 0)).toBe(true);
    });

    it('should allow creation below limit', () => {
      expect(canCreateChecklist(null, 1)).toBe(true);
      expect(canCreateChecklist(null, 2)).toBe(true);
    });

    it('should deny creation at limit', () => {
      expect(canCreateChecklist(null, FREE_CHECKLIST_LIMIT)).toBe(false);
    });

    it('should deny creation above limit', () => {
      expect(canCreateChecklist(null, 4)).toBe(false);
    });
  });
});

describe('FREE_CHECKLIST_LIMIT', () => {
  it('should be set to 3', () => {
    expect(FREE_CHECKLIST_LIMIT).toBe(3);
  });
});
