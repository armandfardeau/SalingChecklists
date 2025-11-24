import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useChecklistStore } from '../../store';
import { Checklist } from '../../types';
import ChecklistList from '../../components/ChecklistList';

export default function App() {
  const router = useRouter();
  const checklists = useChecklistStore((state) => state.checklists);
  const getChecklistStats = useChecklistStore((state) => state.getChecklistStats);
  const initializeSampleData = useChecklistStore((state) => state.initializeSampleData);

  // Initialize sample data on first load
  useEffect(() => {
    initializeSampleData();
  }, []);

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
        activeOpacity={0.8}
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
    backgroundColor: '#f5f5f5',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2f95dc',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
});
