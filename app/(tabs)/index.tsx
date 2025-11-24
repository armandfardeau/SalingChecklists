import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useChecklistStore } from '../../store';
import { Checklist } from '../../types';
import ChecklistList from '../../components/ChecklistList';

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

  return (
    <View style={styles.container}>
      <ChecklistList
        checklists={checklists}
        getStats={getChecklistStats}
        onChecklistPress={handleChecklistPress}
      />
      
      {/* TODO: Add floating action button to create new checklists */}
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
