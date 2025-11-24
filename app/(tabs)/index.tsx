import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useChecklistStore, useThemeStore } from '../../store';
import { Checklist } from '../../types';
import ChecklistList from '../../components/ChecklistList';
import { TouchTargets, Interactions } from '../../constants/Colors';
import { useThemedColors } from '../../hooks/useThemedColors';
import { useRevenueCat } from '../../contexts/RevenueCatProvider';
import { canCreateChecklist, FREE_CHECKLIST_LIMIT } from '../../types/revenuecat';

export default function App() {
  const router = useRouter();
  const colors = useThemedColors();
  const mode = useThemeStore((state) => state.mode);
  const checklists = useChecklistStore((state) => state.checklists);
  const getChecklistStats = useChecklistStore((state) => state.getChecklistStats);
  const initializeSampleData = useChecklistStore((state) => state.initializeSampleData);
  const hasHydrated = useChecklistStore((state) => state._hasHydrated);
  const { customerInfo } = useRevenueCat();

  // Initialize sample data after store has hydrated from storage
  useEffect(() => {
    if (hasHydrated) {
      initializeSampleData();
    }
  }, [hasHydrated, initializeSampleData]);

  const handleChecklistPress = (checklist: Checklist) => {
    router.push(`/runner/${checklist.id}`);
  };

  const handleEditChecklist = (checklist: Checklist) => {
    router.push(`/editor/${checklist.id}`);
  };

  const handleCreateChecklist = () => {
    // Check if user can create more checklists
    if (!canCreateChecklist(customerInfo, checklists.length)) {
      Alert.alert(
        'Checklist Limit Reached',
        `Free users can create up to ${FREE_CHECKLIST_LIMIT} checklists. Subscribe to unlock unlimited checklists.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'View Subscription', 
            onPress: () => router.push('/(tabs)/settings'),
          },
        ]
      );
      return;
    }
    
    router.push('/editor/new');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.screenBackground }]}>
      <ChecklistList
        checklists={checklists}
        getStats={getChecklistStats}
        onChecklistPress={handleChecklistPress}
        onEditPress={handleEditChecklist}
      />
      
      {/* Floating action button to create new checklists */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary, borderColor: colors.primaryDark }]}
        onPress={handleCreateChecklist}
        activeOpacity={Interactions.activeOpacity.strong}
      >
        <Text style={[styles.fabIcon, { color: colors.textInverse }]}>+</Text>
      </TouchableOpacity>
      
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,  // More spacing from edge
    bottom: 20,
    width: TouchTargets.large,  // 64px - larger touch target
    height: TouchTargets.large,
    borderRadius: TouchTargets.large / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,  // Stronger shadow
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 2,  // Added border for definition
  },
  fabIcon: {
    fontSize: 40,  // Larger icon
    fontWeight: 'bold',
  },
});
