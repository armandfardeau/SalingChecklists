import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useChecklistStore } from '../../store';
import { Checklist } from '../../types';
import ChecklistList from '../../components/ChecklistList';
import { Colors, TouchTargets, Interactions } from '../../constants/Colors';

export default function App() {
  const router = useRouter();
  const checklists = useChecklistStore((state) => state.checklists);
  const getChecklistStats = useChecklistStore((state) => state.getChecklistStats);
  const initializeSampleData = useChecklistStore((state) => state.initializeSampleData);
  const hasHydrated = useChecklistStore((state) => state._hasHydrated);

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
    router.push('/editor/new');
  };

  return (
    <View style={styles.container}>
      <ChecklistList
        checklists={checklists}
        getStats={getChecklistStats}
        onChecklistPress={handleChecklistPress}
        onEditPress={handleEditChecklist}
      />
      
      {/* Floating action button to create new checklists */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateChecklist}
        activeOpacity={Interactions.activeOpacity.strong}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.sea.screenBackground,
  },
  fab: {
    position: 'absolute',
    right: 20,  // More spacing from edge
    bottom: 20,
    width: TouchTargets.large,  // 64px - larger touch target
    height: TouchTargets.large,
    borderRadius: TouchTargets.large / 2,
    backgroundColor: Colors.sea.primary,
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
    borderColor: Colors.sea.primaryDark,
  },
  fabIcon: {
    fontSize: 40,  // Larger icon
    color: Colors.sea.textInverse,
    fontWeight: 'bold',
  },
});
