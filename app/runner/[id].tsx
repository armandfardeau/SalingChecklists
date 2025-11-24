import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useChecklistStore } from '../../store';
import { TaskStatus, TaskPriority } from '../../types';
import { Colors, TouchTargets, Typography } from '../../constants/Colors';

// Animation delay after completing or skipping a task before auto-advancing
const AUTO_ADVANCE_DELAY_MS = 300;

/**
 * ChecklistRunner screen for executing checklists
 * Allows users to mark tasks as completed, pending, or skipped
 */
export default function ChecklistRunner() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const checklist = useChecklistStore((state) => state.getChecklist(id || ''));
  const updateTaskStatus = useChecklistStore((state) => state.updateTaskStatus);
  const getChecklistStats = useChecklistStore((state) => state.getChecklistStats);

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  useEffect(() => {
    // If checklist doesn't exist, go back
    if (!checklist) {
      router.back();
    }
  }, [checklist, router]);

  if (!checklist) {
    return null;
  }

  const stats = getChecklistStats(checklist.id);
  const sortedTasks = [...checklist.tasks].sort((a, b) => a.order - b.order);
  const currentTask = sortedTasks[currentTaskIndex];

  const handleTaskStatusChange = (taskId: string, status: TaskStatus) => {
    updateTaskStatus(checklist.id, taskId, status);
  };

  const handleNextTask = () => {
    if (currentTaskIndex < sortedTasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    }
  };

  const handlePreviousTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
    }
  };

  const handleComplete = () => {
    handleTaskStatusChange(currentTask.id, TaskStatus.COMPLETED);
    if (currentTaskIndex < sortedTasks.length - 1) {
      setTimeout(() => handleNextTask(), AUTO_ADVANCE_DELAY_MS);
    }
  };

  const handleSkip = () => {
    handleTaskStatusChange(currentTask.id, TaskStatus.SKIPPED);
    if (currentTaskIndex < sortedTasks.length - 1) {
      setTimeout(() => handleNextTask(), AUTO_ADVANCE_DELAY_MS);
    }
  };

  const handleReset = () => {
    handleTaskStatusChange(currentTask.id, TaskStatus.PENDING);
  };

  const getPriorityColor = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.CRITICAL:
        return Colors.sea.danger;
      case TaskPriority.HIGH:
        return Colors.sea.warning;
      case TaskPriority.MEDIUM:
        return Colors.sea.info;
      case TaskPriority.LOW:
        return Colors.sea.lowPriority;
      default:
        return Colors.sea.textDisabled;
    }
  };

  const getPriorityLabel = (priority: TaskPriority): string => {
    return t(`priorities.${priority}`);
  };

  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return Colors.sea.success;
      case TaskStatus.SKIPPED:
        return Colors.sea.secondary;
      case TaskStatus.PENDING:
        return Colors.sea.textDisabled;
      default:
        return Colors.sea.textDisabled;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← {t('common.back')}</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.checklistName} numberOfLines={1}>
            {checklist.name}
          </Text>
          {stats && (
            <Text style={styles.progressText}>
              {t('checklistRunner.progressCompleted', { completed: stats.completedTasks, total: stats.totalTasks })}
            </Text>
          )}
        </View>
      </View>

      {/* Progress Bar */}
      {stats && (
        <View style={styles.progressBarContainer}>
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
          <Text style={styles.progressPercentage}>
            {stats.completionPercentage}%
          </Text>
        </View>
      )}

      {/* Task Navigation */}
      <View style={styles.taskNavigation}>
        <Text style={styles.taskCounter}>
          {t('checklistRunner.taskCounter', { current: currentTaskIndex + 1, total: sortedTasks.length })}
        </Text>
      </View>

      {/* Current Task */}
      <ScrollView style={styles.taskContent} contentContainerStyle={styles.taskContentContainer}>
        {currentTask && (
          <View style={styles.taskCard}>
            {/* Priority Badge */}
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(currentTask.priority) },
              ]}
            >
              <Text style={styles.priorityText}>
                {getPriorityLabel(currentTask.priority)} {t('checklistEditor.priority')}
              </Text>
            </View>

            {/* Task Title */}
            <Text style={styles.taskTitle}>{currentTask.title}</Text>

            {/* Task Description */}
            {currentTask.description && (
              <Text style={styles.taskDescription}>{currentTask.description}</Text>
            )}

            {/* Task Status */}
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>{t('checklistRunner.status')}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(currentTask.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {t(`taskStatus.${currentTask.status}`)}
                </Text>
              </View>
            </View>

            {/* Completed Timestamp */}
            {currentTask.completedAt && (
              <Text style={styles.completedText}>
                {t('checklistRunner.completedAt', { date: new Date(currentTask.completedAt).toLocaleString() })}
              </Text>
            )}
          </View>
        )}

        {/* All Tasks List */}
        <View style={styles.allTasksContainer}>
          <Text style={styles.allTasksTitle}>{t('checklistRunner.allTasks')}</Text>
          {sortedTasks.map((task, index) => (
            <TouchableOpacity
              key={task.id}
              style={[
                styles.taskListItem,
                index === currentTaskIndex && styles.taskListItemActive,
              ]}
              onPress={() => setCurrentTaskIndex(index)}
            >
              <View style={styles.taskListItemContent}>
                <Text
                  style={[
                    styles.taskListItemNumber,
                    index === currentTaskIndex && styles.taskListItemTextActive,
                  ]}
                >
                  {index + 1}.
                </Text>
                <Text
                  style={[
                    styles.taskListItemText,
                    index === currentTaskIndex && styles.taskListItemTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {task.title}
                </Text>
              </View>
              <View
                style={[
                  styles.taskListItemStatus,
                  { backgroundColor: getStatusColor(task.status) },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {currentTask.status === TaskStatus.PENDING && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={handleComplete}
            >
              <Text style={styles.actionButtonText}>✓ {t('common.complete')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.skipButton]}
              onPress={handleSkip}
            >
              <Text style={styles.actionButtonText}>{t('common.skip')}</Text>
            </TouchableOpacity>
          </>
        )}
        {(currentTask.status === TaskStatus.COMPLETED ||
          currentTask.status === TaskStatus.SKIPPED) && (
          <TouchableOpacity
            style={[styles.actionButton, styles.resetButton]}
            onPress={handleReset}
          >
            <Text style={styles.actionButtonText}>↻ {t('common.reset')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentTaskIndex === 0 && styles.navButtonDisabled,
          ]}
          onPress={handlePreviousTask}
          disabled={currentTaskIndex === 0}
        >
          <Text
            style={[
              styles.navButtonText,
              currentTaskIndex === 0 && styles.navButtonTextDisabled,
            ]}
          >
            ← {t('common.previous')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentTaskIndex === sortedTasks.length - 1 && styles.navButtonDisabled,
          ]}
          onPress={handleNextTask}
          disabled={currentTaskIndex === sortedTasks.length - 1}
        >
          <Text
            style={[
              styles.navButtonText,
              currentTaskIndex === sortedTasks.length - 1 && styles.navButtonTextDisabled,
            ]}
          >
            {t('common.next')} →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Completion Message */}
      {stats && stats.isFullyCompleted && (
        <View style={styles.completionMessage}>
          <Text style={styles.completionText}>
            {t('checklistRunner.completionMessage')}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.sea.screenBackground,
  },
  header: {
    backgroundColor: Colors.sea.primary,
    padding: 20,  // More padding
    paddingTop: 12,
  },
  backButton: {
    marginBottom: 12,
    minHeight: TouchTargets.minimum,
    justifyContent: 'center',
  },
  backButtonText: {
    color: Colors.sea.textInverse,
    fontSize: 18,  // Larger font
    fontWeight: 'bold',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checklistName: {
    flex: 1,
    fontSize: 24,  // Larger font
    fontWeight: 'bold',
    color: Colors.sea.textInverse,
    marginRight: 16,
    lineHeight: 30,
  },
  progressText: {
    fontSize: 16,  // Larger font
    color: Colors.sea.textInverse,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,  // More padding
    backgroundColor: Colors.sea.cardBackground,
    borderBottomWidth: 2,
    borderBottomColor: Colors.sea.cardBorder,
  },
  progressBar: {
    flex: 1,
    height: 14,  // Thicker progress bar
    backgroundColor: '#E0E0E0',
    borderRadius: 7,
    overflow: 'hidden',
    marginRight: 16,
    borderWidth: 1,
    borderColor: Colors.sea.cardBorder,
  },
  progressFill: {
    height: '100%',
    borderRadius: 7,
  },
  progressPercentage: {
    fontSize: 18,  // Larger font
    fontWeight: 'bold',
    color: Colors.sea.textPrimary,
    minWidth: 55,
    textAlign: 'right',
  },
  taskNavigation: {
    paddingHorizontal: 20,
    paddingVertical: 16,  // More padding
    backgroundColor: Colors.sea.cardBackground,
    borderBottomWidth: 2,
    borderBottomColor: Colors.sea.cardBorder,
  },
  taskCounter: {
    fontSize: 16,  // Larger font
    fontWeight: 'bold',
    color: Colors.sea.textPrimary,
    textAlign: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskContentContainer: {
    padding: 20,  // More padding
  },
  taskCard: {
    backgroundColor: Colors.sea.cardBackground,
    borderRadius: 12,
    padding: 24,  // More padding
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: Colors.sea.cardBorder,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,  // More padding
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.sea.borderLight,
  },
  priorityText: {
    color: Colors.sea.textInverse,
    fontSize: 14,  // Larger font
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  taskTitle: {
    fontSize: 28,  // Larger font
    fontWeight: 'bold',
    color: Colors.sea.textPrimary,
    marginBottom: 16,
    lineHeight: 36,
  },
  taskDescription: {
    fontSize: 18,  // Larger font
    color: Colors.sea.textSecondary,
    lineHeight: 28,
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  statusLabel: {
    fontSize: 16,  // Larger font
    fontWeight: 'bold',
    color: Colors.sea.textSecondary,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,  // More padding
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.sea.borderLight,
  },
  statusText: {
    color: Colors.sea.textInverse,
    fontSize: 14,  // Larger font
    fontWeight: 'bold',
  },
  completedText: {
    fontSize: 14,  // Larger font
    color: Colors.sea.textSecondary,
    marginTop: 12,
    fontStyle: 'italic',
  },
  allTasksContainer: {
    backgroundColor: Colors.sea.cardBackground,
    borderRadius: 12,
    padding: 20,  // More padding
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: Colors.sea.cardBorder,
  },
  allTasksTitle: {
    fontSize: 18,  // Larger font
    fontWeight: 'bold',
    color: Colors.sea.textPrimary,
    marginBottom: 16,
  },
  taskListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,  // More padding for larger touch target
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    minHeight: TouchTargets.minimum,  // Minimum touch target
  },
  taskListItemActive: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: Colors.sea.primary,
  },
  taskListItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskListItemNumber: {
    fontSize: 16,  // Larger font
    fontWeight: 'bold',
    color: Colors.sea.textSecondary,
    marginRight: 12,
    minWidth: 32,
  },
  taskListItemText: {
    fontSize: 16,  // Larger font
    color: Colors.sea.textSecondary,
    flex: 1,
  },
  taskListItemTextActive: {
    color: Colors.sea.primary,
    fontWeight: 'bold',
  },
  taskListItemStatus: {
    width: 16,  // Larger indicator
    height: 16,
    borderRadius: 8,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: Colors.sea.borderLight,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,  // More padding
    backgroundColor: Colors.sea.cardBackground,
    borderTopWidth: 2,
    borderTopColor: Colors.sea.cardBorder,
    gap: 16,  // More spacing
  },
  actionButton: {
    flex: 1,
    paddingVertical: 20,  // Larger touch target
    minHeight: TouchTargets.comfortable,  // Minimum 56px
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.sea.borderLight,
  },
  completeButton: {
    backgroundColor: Colors.sea.success,
  },
  skipButton: {
    backgroundColor: Colors.sea.secondary,
  },
  resetButton: {
    backgroundColor: Colors.sea.textDisabled,
  },
  actionButtonText: {
    color: Colors.sea.textInverse,
    fontSize: 18,  // Larger font
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.sea.cardBackground,
    gap: 16,  // More spacing
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,  // Larger touch target
    minHeight: TouchTargets.minimum,  // Minimum 48px
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.sea.primary,
    borderWidth: 2,
    borderColor: Colors.sea.primaryDark,
  },
  navButtonDisabled: {
    backgroundColor: Colors.sea.disabledBackground,
    borderColor: Colors.sea.cardBorder,
  },
  navButtonText: {
    color: Colors.sea.textInverse,
    fontSize: 16,  // Larger font
    fontWeight: 'bold',
  },
  navButtonTextDisabled: {
    color: Colors.sea.textDisabled,
  },
  completionMessage: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: Colors.sea.success,
    padding: 20,  // More padding
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 2,
    borderColor: Colors.sea.lowPriority,
  },
  completionText: {
    color: Colors.sea.textInverse,
    fontSize: 18,  // Larger font
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
