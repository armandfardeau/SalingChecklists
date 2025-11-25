import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRevenueCat } from '../contexts/RevenueCatProvider';
import { hasActiveSubscription, getActiveEntitlements } from '../types/revenuecat';
import { Colors } from '../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

export default function SubscriptionStatus() {
  const { isConfigured, customerInfo, isLoading, refreshCustomerInfo } = useRevenueCat();

  if (!isConfigured) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <MaterialIcons name="credit-card" size={24} color="#333" style={styles.titleIcon} />
            <Text style={styles.title}>Subscription</Text>
          </View>
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              RevenueCat is not configured yet.
            </Text>
            <Text style={styles.infoText}>
              To enable in-app purchases and subscriptions:
            </Text>
            <Text style={styles.stepText}>
              1. Sign up at app.revenuecat.com
            </Text>
            <Text style={styles.stepText}>
              2. Create a project and get your API keys
            </Text>
            <Text style={styles.stepText}>
              3. Add keys to utils/revenueCatConfig.ts
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <MaterialIcons name="credit-card" size={24} color="#333" style={styles.titleIcon} />
            <Text style={styles.title}>Subscription</Text>
          </View>
          <ActivityIndicator size="large" color={Colors.sea.primary} style={styles.loader} />
        </View>
      </View>
    );
  }

  const hasSubscription = hasActiveSubscription(customerInfo);
  const activeEntitlements = getActiveEntitlements(customerInfo);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.titleContainer}>
          <MaterialIcons name="credit-card" size={24} color="#333" style={styles.titleIcon} />
          <Text style={styles.title}>Subscription</Text>
        </View>
        
        <View style={hasSubscription ? styles.activeBox : styles.inactiveBox}>
          <View style={styles.statusTitleContainer}>
            {hasSubscription && (
              <MaterialIcons name="check-circle" size={20} color="#4CAF50" style={styles.statusIcon} />
            )}
            <Text style={styles.statusTitle}>
              {hasSubscription ? 'Active' : 'No Active Subscription'}
            </Text>
          </View>
          
          {hasSubscription && activeEntitlements.length > 0 && (
            <View style={styles.entitlementsContainer}>
              <Text style={styles.entitlementsTitle}>Active Features:</Text>
              {activeEntitlements.map((entitlement) => (
                <Text key={entitlement} style={styles.entitlementItem}>
                  • {entitlement}
                </Text>
              ))}
            </View>
          )}
          
          {!hasSubscription && (
            <Text style={styles.infoText}>
              Subscribe to unlock premium features for managing your sailing checklists.
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={refreshCustomerInfo}
        >
          <View style={styles.refreshButtonContent}>
            <MaterialIcons name="refresh" size={20} color={Colors.sea.textInverse} />
            <Text style={styles.refreshButtonText}>Refresh Status</Text>
          </View>
        </TouchableOpacity>

        {customerInfo && (
          <View style={styles.debugInfo}>
            <Text style={styles.debugTitle}>Customer Info:</Text>
            <Text style={styles.debugText}>
              User ID: {customerInfo.originalAppUserId}
            </Text>
            <Text style={styles.debugText}>
              First Seen: {new Date(customerInfo.firstSeen).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  card: {
    backgroundColor: Colors.sea.cardBackground,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.sea.textPrimary,
  },
  statusTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 8,
  },
  loader: {
    marginVertical: 20,
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE69C',
  },
  warningText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.sea.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  stepText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 4,
    marginLeft: 8,
  },
  activeBox: {
    backgroundColor: '#D4EDDA',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C3E6CB',
    marginBottom: 16,
  },
  inactiveBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DEE2E6',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.sea.textPrimary,
    marginBottom: 8,
  },
  entitlementsContainer: {
    marginTop: 8,
  },
  entitlementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.sea.textSecondary,
    marginBottom: 4,
  },
  entitlementItem: {
    fontSize: 14,
    color: Colors.sea.textPrimary,
    marginLeft: 8,
    marginBottom: 2,
  },
  refreshButton: {
    backgroundColor: Colors.sea.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  refreshButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshButtonText: {
    color: Colors.sea.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  debugInfo: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.sea.textSecondary,
    marginBottom: 6,
  },
  debugText: {
    fontSize: 12,
    color: Colors.sea.textSecondary,
    marginBottom: 2,
  },
});
