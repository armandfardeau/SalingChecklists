/**
 * RevenueCat types and interfaces
 * 
 * These types extend and provide convenience types for the RevenueCat SDK
 */

import { CustomerInfo, PurchasesPackage, PurchasesOfferings } from 'react-native-purchases';

/**
 * Check if user has an active subscription
 */
export const hasActiveSubscription = (customerInfo: CustomerInfo | null): boolean => {
  if (!customerInfo) {
    return false;
  }
  
  return Object.keys(customerInfo.entitlements.active).length > 0;
};

/**
 * Get the list of active entitlement identifiers
 */
export const getActiveEntitlements = (customerInfo: CustomerInfo | null): string[] => {
  if (!customerInfo) {
    return [];
  }
  
  return Object.keys(customerInfo.entitlements.active);
};

/**
 * Check if user has a specific entitlement
 */
export const hasEntitlement = (
  customerInfo: CustomerInfo | null,
  entitlementId: string
): boolean => {
  if (!customerInfo) {
    return false;
  }
  
  return entitlementId in customerInfo.entitlements.active;
};

export type { CustomerInfo, PurchasesPackage, PurchasesOfferings };
