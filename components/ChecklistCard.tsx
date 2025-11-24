import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Checklist, ChecklistStats } from '../types';
import { getCategoryLabel } from '../utils/formatters';
import { Colors, TouchTargets, Interactions } from '../constants/Colors';

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
  const { t } = useTranslation();
  
  const handlePress = () => {
    if (onPress) {
      onPress(checklist);
    }
  };

  const handleEditPress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    if (onEditPress) {
      onEditPress(checklist);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
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
              activeOpacity={Interactions.activeOpacity.light}
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
                backgroundColor: stats.isFullyCompleted ? Colors.sea.success : Colors.sea.primary,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {stats.completedTasks} / {stats.totalTasks} {t('checklists.stats.tasks')}
          {stats.isFullyCompleted && ' ✓'}
        </Text>
      </View>

      {!checklist.isActive && (
        <View style={styles.inactiveBadge}>
          <Text style={styles.inactiveText}>{t('checklistCard.inactive')}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.sea.cardBackground,
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
    borderColor: Colors.sea.cardBorder,
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 12,  // Increased spacing
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
    color: Colors.sea.textPrimary,  // High contrast black
    marginBottom: 6,
    lineHeight: 28,  // Better readability
  },
  description: {
    fontSize: 16,  // Larger font
    color: Colors.sea.textSecondary,  // High contrast
    lineHeight: 24,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.sea.inputBackground,
    paddingHorizontal: 16,  // Larger padding
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.sea.cardBorder,
  },
  categoryText: {
    fontSize: 14,  // Larger font
    color: Colors.sea.textPrimary,  // High contrast
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
    borderColor: Colors.sea.cardBorder,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,  // Larger font
    color: Colors.sea.textPrimary,  // High contrast
    textAlign: 'right',
    fontWeight: '600',  // Bolder
  },
  inactiveBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.sea.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  inactiveText: {
    fontSize: 12,  // Larger font
    color: Colors.sea.textInverse,
    fontWeight: 'bold',
  },
});
