import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useChecklistStore } from '../../store';
import { Checklist } from '../../types';
import ChecklistList from '../../components/ChecklistList';

export default function App() {
  const checklists = useChecklistStore((state) => state.checklists);
  const getChecklistStats = useChecklistStore((state) => state.getChecklistStats);
  const initializeSampleData = useChecklistStore((state) => state.initializeSampleData);

  // Initialize sample data on first load
  useEffect(() => {
    initializeSampleData();
  }, [initializeSampleData]);

  const handleChecklistPress = (checklist: Checklist) => {
    // TODO: Navigate to checklist detail screen
    console.log('Pressed checklist:', checklist.name);
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
