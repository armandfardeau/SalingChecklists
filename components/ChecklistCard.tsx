import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { Checklist, ChecklistStats } from '../types';
import { getCategoryLabel } from '../utils/formatters';
import { TouchTargets, Interactions } from '../constants/Colors';
import { useThemedColors } from '../hooks/useThemedColors';
import { useTranslation } from '../hooks/useTranslation';

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

  /**
   * Callback when the delete button is pressed
   */
  onDeletePress?: (checklist: Checklist) => void;
}

/**
 * ChecklistCard component displays a single checklist with its progress
 */
export default function ChecklistCard({ checklist, stats, onPress, onEditPress, onDeletePress }: ChecklistCardProps) {
  const colors = useThemedColors();
  const { t } = useTranslation();

  const handlePress = () => {
    if (onPress) {
      onPress(checklist);
    }
  };

  const handleEditPress = (event: GestureResponderEvent) => {
    if (event) {
      event.stopPropagation();
    }
    if (onEditPress) {
      onEditPress(checklist);
    }
  };

  const handleDeletePress = (event: GestureResponderEvent) => {
    if (event) {
      event.stopPropagation();
    }
    if (onDeletePress) {
      onDeletePress(checklist);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
        !checklist.isActive && styles.inactiveCard,
      ]}
      onPress={handlePress}
      activeOpacity={Interactions.activeOpacity.default}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {checklist.icon && (
            <Text style={styles.icon}>{checklist.icon}</Text>
          )}
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
              {checklist.name}
            </Text>
            {checklist.description && (
              <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
                {checklist.description}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.actionButtons}>
            {onEditPress && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEditPress}
                activeOpacity={Interactions.activeOpacity.light}
              >
                <Text style={styles.editButtonText}>✏️</Text>
              </TouchableOpacity>
            )}
            {onDeletePress && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeletePress}
                activeOpacity={Interactions.activeOpacity.light}
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={[styles.categoryBadge, { backgroundColor: colors.inputBackground, borderColor: colors.cardBorder }]}>
            <Text style={[styles.categoryText, { color: colors.textPrimary }]}>
              {getCategoryLabel(checklist.category)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { borderColor: colors.cardBorder }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${stats.completionPercentage}%`,
                backgroundColor: stats.isFullyCompleted ? colors.success : colors.primary,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textPrimary }]}>
          {t('checklist.tasksProgress', { completed: stats.completedTasks, total: stats.totalTasks })}
          {stats.isFullyCompleted && ' ✓'}
        </Text>
      </View>

      {!checklist.isActive && (
        <View style={[styles.inactiveBadge, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.inactiveText, { color: colors.textInverse }]}>{t('checklist.inactive')}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 20,  // Increased padding for larger touch target
    marginBottom: 16,  // Increased spacing
    minHeight: TouchTargets.minimum,  // Minimum touch target
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,  // Slightly stronger shadow
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,  // Added border for better definition
  },
  inactiveCard: {
    opacity: 0.6,
  },
  header: {
    marginBottom: 16,  // Increased spacing
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 8,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 12,  // Increased spacing
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 12,  // Larger touch target
    minWidth: TouchTargets.minimum,
    minHeight: TouchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 24,  // Larger icon
  },
  deleteButton: {
    padding: 12,  // Larger touch target
    minWidth: TouchTargets.minimum,
    minHeight: TouchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 24,  // Larger icon
  },
  icon: {
    fontSize: 32,  // Larger icon
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,  // Larger font
    fontWeight: 'bold',
    marginBottom: 6,
    lineHeight: 28,  // Better readability
  },
  description: {
    fontSize: 16,  // Larger font
    lineHeight: 24,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,  // Larger padding
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,  // Larger font
    fontWeight: 'bold',  // Bolder
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 12,  // Thicker progress bar
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,  // Larger font
    textAlign: 'right',
    fontWeight: '600',  // Bolder
  },
  inactiveBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  inactiveText: {
    fontSize: 12,  // Larger font
    fontWeight: 'bold',
  },
});
