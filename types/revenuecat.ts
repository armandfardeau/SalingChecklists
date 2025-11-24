/**
 * RevenueCat types and interfaces
 * 
 * These types extend and provide convenience types for the RevenueCat SDK
 */

import { CustomerInfo, PurchasesPackage, PurchasesOfferings } from 'react-native-purchases';

/**
 * Free tier checklist limit
 */
export const FREE_CHECKLIST_LIMIT = 3;

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

/**
 * Check if user can create more checklists based on their subscription status
 * @param customerInfo - Current customer info from RevenueCat
 * @param currentChecklistCount - Number of checklists the user currently has
 * @returns true if user can create more checklists, false otherwise
 */
export const canCreateChecklist = (
  customerInfo: CustomerInfo | null,
  currentChecklistCount: number
): boolean => {
  // If user has active subscription, they have unlimited checklists
  if (hasActiveSubscription(customerInfo)) {
    return true;
  }
  
  // Free users are limited to FREE_CHECKLIST_LIMIT checklists
  return currentChecklistCount < FREE_CHECKLIST_LIMIT;
};

export type { CustomerInfo, PurchasesPackage, PurchasesOfferings };
