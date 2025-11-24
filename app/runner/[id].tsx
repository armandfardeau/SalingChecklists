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
import { useChecklistStore } from '../../store';
import { TaskStatus, TaskPriority } from '../../types';
import { TouchTargets, Typography } from '../../constants/Colors';
import { useThemedColors } from '../../hooks/useThemedColors';

// Animation delay after completing or skipping a task before auto-advancing
const AUTO_ADVANCE_DELAY_MS = 300;

/**
 * ChecklistRunner screen for executing checklists
 * Allows users to mark tasks as completed, pending, or skipped
 */
export default function ChecklistRunner() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useThemedColors();
  
  const checklist = useChecklistStore((state) => state.getChecklist(id || ''));
  const updateTaskStatus = useChecklistStore((state) => state.updateTaskStatus);
  const getChecklistStats = useChecklistStore((state) => state.getChecklistStats);
  const resetChecklistRun = useChecklistStore((state) => state.resetChecklistRun);

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

  const handleResetAll = () => {
    resetChecklistRun(checklist.id);
    setCurrentTaskIndex(0);
  };

  const getPriorityColor = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.CRITICAL:
        return colors.danger;
      case TaskPriority.HIGH:
        return colors.warning;
      case TaskPriority.MEDIUM:
        return colors.info;
      case TaskPriority.LOW:
        return colors.lowPriority;
      default:
        return colors.textDisabled;
    }
  };

  const getPriorityLabel = (priority: TaskPriority): string => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return colors.success;
      case TaskStatus.SKIPPED:
        return colors.secondary;
      case TaskStatus.PENDING:
        return colors.textDisabled;
      default:
        return colors.textDisabled;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.screenBackground }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors.textInverse }]}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleResetAll} style={styles.resetAllButton}>
            <Text style={[styles.resetAllButtonText, { color: colors.textInverse }]}>↻ Reset All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerContent}>
          <Text style={[styles.checklistName, { color: colors.textInverse }]} numberOfLines={1}>
            {checklist.name}
          </Text>
          {stats && (
            <Text style={[styles.progressText, { color: colors.textInverse }]}>
              {stats.completedTasks} / {stats.totalTasks} completed
            </Text>
          )}
        </View>
      </View>

      {/* Progress Bar */}
      {stats && (
        <View style={[styles.progressBarContainer, { backgroundColor: colors.cardBackground, borderBottomColor: colors.cardBorder }]}>
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
          <Text style={[styles.progressPercentage, { color: colors.textPrimary }]}>
            {stats.completionPercentage}%
          </Text>
        </View>
      )}

      {/* Task Navigation */}
      <View style={[styles.taskNavigation, { backgroundColor: colors.cardBackground, borderBottomColor: colors.cardBorder }]}>
        <Text style={[styles.taskCounter, { color: colors.textPrimary }]}>
          Task {currentTaskIndex + 1} of {sortedTasks.length}
        </Text>
      </View>

      {/* Current Task */}
      <ScrollView style={styles.taskContent} contentContainerStyle={styles.taskContentContainer}>
        {currentTask && (
          <View style={[styles.taskCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            {/* Priority Badge */}
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(currentTask.priority), borderColor: colors.borderLight },
              ]}
            >
              <Text style={[styles.priorityText, { color: colors.textInverse }]}>
                {getPriorityLabel(currentTask.priority)} Priority
              </Text>
            </View>

            {/* Task Title */}
            <Text style={[styles.taskTitle, { color: colors.textPrimary }]}>{currentTask.title}</Text>

            {/* Task Description */}
            {currentTask.description && (
              <Text style={[styles.taskDescription, { color: colors.textSecondary }]}>{currentTask.description}</Text>
            )}

            {/* Task Status */}
            <View style={styles.statusContainer}>
              <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Status:</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(currentTask.status), borderColor: colors.borderLight },
                ]}
              >
                <Text style={[styles.statusText, { color: colors.textInverse }]}>
                  {currentTask.status.charAt(0).toUpperCase() + currentTask.status.slice(1)}
                </Text>
              </View>
            </View>

            {/* Completed Timestamp */}
            {currentTask.completedAt && (
              <Text style={[styles.completedText, { color: colors.textSecondary }]}>
                Completed: {new Date(currentTask.completedAt).toLocaleString()}
              </Text>
            )}
          </View>
        )}

        {/* All Tasks List */}
        <View style={[styles.allTasksContainer, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <Text style={[styles.allTasksTitle, { color: colors.textPrimary }]}>All Tasks</Text>
          {sortedTasks.map((task, index) => (
            <TouchableOpacity
              key={task.id}
              style={[
                styles.taskListItem,
                index === currentTaskIndex && [styles.taskListItemActive, { backgroundColor: colors.inputBackground, borderColor: colors.primary }],
              ]}
              onPress={() => setCurrentTaskIndex(index)}
            >
              <View style={styles.taskListItemContent}>
                <Text
                  style={[
                    styles.taskListItemNumber,
                    { color: colors.textSecondary },
                    index === currentTaskIndex && [styles.taskListItemTextActive, { color: colors.primary }],
                  ]}
                >
                  {index + 1}.
                </Text>
                <Text
                  style={[
                    styles.taskListItemText,
                    { color: colors.textSecondary },
                    index === currentTaskIndex && [styles.taskListItemTextActive, { color: colors.primary }],
                  ]}
                  numberOfLines={1}
                >
                  {task.title}
                </Text>
              </View>
              <View
                style={[
                  styles.taskListItemStatus,
                  { backgroundColor: getStatusColor(task.status), borderColor: colors.borderLight },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.actionButtons, { backgroundColor: colors.cardBackground, borderTopColor: colors.cardBorder }]}>
        {currentTask.status === TaskStatus.PENDING && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.success, borderColor: colors.borderLight }]}
              onPress={handleComplete}
            >
              <Text style={[styles.actionButtonText, { color: colors.textInverse }]}>✓ Complete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.secondary, borderColor: colors.borderLight }]}
              onPress={handleSkip}
            >
              <Text style={[styles.actionButtonText, { color: colors.textInverse }]}>Skip</Text>
            </TouchableOpacity>
          </>
        )}
        {(currentTask.status === TaskStatus.COMPLETED ||
          currentTask.status === TaskStatus.SKIPPED) && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.textDisabled, borderColor: colors.borderLight }]}
            onPress={handleReset}
          >
            <Text style={[styles.actionButtonText, { color: colors.textInverse }]}>↻ Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Navigation Buttons */}
      <View style={[styles.navigationButtons, { backgroundColor: colors.cardBackground }]}>
        <TouchableOpacity
          style={[
            styles.navButton,
            { backgroundColor: colors.primary, borderColor: colors.primaryDark },
            currentTaskIndex === 0 && [styles.navButtonDisabled, { backgroundColor: colors.disabledBackground, borderColor: colors.cardBorder }],
          ]}
          onPress={handlePreviousTask}
          disabled={currentTaskIndex === 0}
        >
          <Text
            style={[
              styles.navButtonText,
              { color: colors.textInverse },
              currentTaskIndex === 0 && [styles.navButtonTextDisabled, { color: colors.textDisabled }],
            ]}
          >
            ← Previous
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            { backgroundColor: colors.primary, borderColor: colors.primaryDark },
            currentTaskIndex === sortedTasks.length - 1 && [styles.navButtonDisabled, { backgroundColor: colors.disabledBackground, borderColor: colors.cardBorder }],
          ]}
          onPress={handleNextTask}
          disabled={currentTaskIndex === sortedTasks.length - 1}
        >
          <Text
            style={[
              styles.navButtonText,
              { color: colors.textInverse },
              currentTaskIndex === sortedTasks.length - 1 && [styles.navButtonTextDisabled, { color: colors.textDisabled }],
            ]}
          >
            Next →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Completion Message */}
      {stats && stats.isFullyCompleted && (
        <View style={[styles.completionMessage, { backgroundColor: colors.success, borderColor: colors.lowPriority }]}>
          <Text style={[styles.completionText, { color: colors.textInverse }]}>
            🎉 Checklist Complete! All tasks finished.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,  // More padding
    paddingTop: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    minHeight: TouchTargets.minimum,
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 18,  // Larger font
    fontWeight: 'bold',
  },
  resetAllButton: {
    minHeight: TouchTargets.minimum,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  resetAllButtonText: {
    fontSize: 16,
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
    marginRight: 16,
    lineHeight: 30,
  },
  progressText: {
    fontSize: 16,  // Larger font
    fontWeight: 'bold',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,  // More padding
    borderBottomWidth: 2,
  },
  progressBar: {
    flex: 1,
    height: 14,  // Thicker progress bar
    backgroundColor: '#E0E0E0',
    borderRadius: 7,
    overflow: 'hidden',
    marginRight: 16,
    borderWidth: 1,
  },
  progressFill: {
    height: '100%',
    borderRadius: 7,
  },
  progressPercentage: {
    fontSize: 18,  // Larger font
    fontWeight: 'bold',
    minWidth: 55,
    textAlign: 'right',
  },
  taskNavigation: {
    paddingHorizontal: 20,
    paddingVertical: 16,  // More padding
    borderBottomWidth: 2,
  },
  taskCounter: {
    fontSize: 16,  // Larger font
    fontWeight: 'bold',
    textAlign: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskContentContainer: {
    padding: 20,  // More padding
  },
  taskCard: {
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
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,  // More padding
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 14,  // Larger font
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  taskTitle: {
    fontSize: 28,  // Larger font
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 36,
  },
  taskDescription: {
    fontSize: 18,  // Larger font
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
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,  // More padding
    borderRadius: 16,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 14,  // Larger font
    fontWeight: 'bold',
  },
  completedText: {
    fontSize: 14,  // Larger font
    marginTop: 12,
    fontStyle: 'italic',
  },
  allTasksContainer: {
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
  },
  allTasksTitle: {
    fontSize: 18,  // Larger font
    fontWeight: 'bold',
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
    borderWidth: 2,
  },
  taskListItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskListItemNumber: {
    fontSize: 16,  // Larger font
    fontWeight: 'bold',
    marginRight: 12,
    minWidth: 32,
  },
  taskListItemText: {
    fontSize: 16,  // Larger font
    flex: 1,
  },
  taskListItemTextActive: {
    fontWeight: 'bold',
  },
  taskListItemStatus: {
    width: 16,  // Larger indicator
    height: 16,
    borderRadius: 8,
    marginLeft: 12,
    borderWidth: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,  // More padding
    borderTopWidth: 2,
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
  },
  actionButtonText: {
    fontSize: 18,  // Larger font
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,  // More spacing
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,  // Larger touch target
    minHeight: TouchTargets.minimum,  // Minimum 48px
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  navButtonDisabled: {
  },
  navButtonText: {
    fontSize: 16,  // Larger font
    fontWeight: 'bold',
  },
  navButtonTextDisabled: {
  },
  completionMessage: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
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
  },
  completionText: {
    fontSize: 18,  // Larger font
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
