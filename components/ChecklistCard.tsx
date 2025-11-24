import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Checklist, ChecklistStats } from '../types';

interface ChecklistCardProps {
  /**
   * The checklist to display
   */
  checklist: Checklist;

  /**
   * Statistics for the checklist
   */
  stats: ChecklistStats;

  /**
   * Callback when the card is pressed
   */
  onPress?: (checklist: Checklist) => void;

  /**
   * Callback when the edit button is pressed
   */
  onEditPress?: (checklist: Checklist) => void;
}

/**
 * ChecklistCard component displays a single checklist with its progress
 */
export default function ChecklistCard({ checklist, stats, onPress, onEditPress }: ChecklistCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress(checklist);
    }
  };

  const handleEditPress = (event: any) => {
    event.stopPropagation();
    if (onEditPress) {
      onEditPress(checklist);
    }
  };

// Get category display name
function getCategoryLabel(category: string): string {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

  return (
    <TouchableOpacity
      style={[
        styles.card,
        !checklist.isActive && styles.inactiveCard,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {checklist.icon && (
            <Text style={styles.icon}>{checklist.icon}</Text>
          )}
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {checklist.name}
            </Text>
            {checklist.description && (
              <Text style={styles.description} numberOfLines={2}>
                {checklist.description}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.headerRight}>
          {onEditPress && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.editButtonText}>✏️</Text>
            </TouchableOpacity>
          )}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {getCategoryLabel(checklist.category)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${stats.completionPercentage}%`,
                backgroundColor: stats.isFullyCompleted ? '#4CAF50' : '#2f95dc',
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {stats.completedTasks} / {stats.totalTasks} tasks
          {stats.isFullyCompleted && ' ✓'}
        </Text>
      </View>

      {!checklist.isActive && (
        <View style={styles.inactiveBadge}>
          <Text style={styles.inactiveText}>Inactive</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inactiveCard: {
    opacity: 0.6,
  },
  header: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
  },
  editButton: {
    padding: 4,
  },
  editButtonText: {
    fontSize: 18,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  inactiveBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  inactiveText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
});
