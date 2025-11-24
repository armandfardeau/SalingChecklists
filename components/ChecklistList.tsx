import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { Checklist, ChecklistStats } from '../types';
import ChecklistCard from './ChecklistCard';
import { useThemedColors } from '../hooks/useThemedColors';

interface ChecklistListProps {
  /**
   * Array of checklists to display
   */
  checklists: Checklist[];

  /**
   * Function to get statistics for a checklist
   */
  getStats: (checklistId: string) => ChecklistStats | undefined;

  /**
   * Callback when a checklist card is pressed
   */
  onChecklistPress?: (checklist: Checklist) => void;

  /**
   * Callback when the edit button is pressed
   */
  onEditPress?: (checklist: Checklist) => void;

  /**
   * Callback when the delete button is pressed
   */
  onDeletePress?: (checklist: Checklist) => void;

  /**
   * Custom empty state component
   */
  emptyComponent?: React.ReactElement;
}

/**
 * ChecklistList component displays a list of checklists
 */
export default function ChecklistList({
  checklists,
  getStats,
  onChecklistPress,
  onEditPress,
  onDeletePress,
  emptyComponent,
}: ChecklistListProps) {
  const colors = useThemedColors();

  const renderItem = ({ item }: { item: Checklist }) => {
    const stats = getStats(item.id);
    
    // Provide default stats if not available
    const defaultStats: ChecklistStats = {
      totalTasks: item.tasks.length,
      completedTasks: 0,
      pendingTasks: item.tasks.length,
      completionPercentage: 0,
      isFullyCompleted: false,
    };

    return (
      <ChecklistCard
        checklist={item}
        stats={stats || defaultStats}
        onPress={onChecklistPress}
        onEditPress={onEditPress}
        onDeletePress={onDeletePress}
      />
    );
  };

  const renderEmpty = () => {
    if (emptyComponent) {
      return emptyComponent;
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Checklists Yet</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Create your first checklist to get started with your sailing preparations.
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={checklists}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[
        styles.listContent,
        checklists.length === 0 && styles.emptyListContent,
      ]}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 72,  // Larger icon
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,  // Larger font
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,  // Larger font
    textAlign: 'center',
    lineHeight: 24,
  },
});
