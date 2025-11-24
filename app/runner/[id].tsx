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

// Animation delay after completing or skipping a task before auto-advancing
const AUTO_ADVANCE_DELAY_MS = 300;

/**
 * ChecklistRunner screen for executing checklists
 * Allows users to mark tasks as completed, pending, or skipped
 */
export default function ChecklistRunner() {
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
        return '#d32f2f';
      case TaskPriority.HIGH:
        return '#f57c00';
      case TaskPriority.MEDIUM:
        return '#fbc02d';
      case TaskPriority.LOW:
        return '#689f38';
      default:
        return '#757575';
    }
  };

  const getPriorityLabel = (priority: TaskPriority): string => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return '#4CAF50';
      case TaskStatus.SKIPPED:
        return '#FF9800';
      case TaskStatus.PENDING:
        return '#757575';
      default:
        return '#757575';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.checklistName} numberOfLines={1}>
            {checklist.name}
          </Text>
          {stats && (
            <Text style={styles.progressText}>
              {stats.completedTasks} / {stats.totalTasks} completed
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
                  backgroundColor: stats.isFullyCompleted ? '#4CAF50' : '#2f95dc',
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
          Task {currentTaskIndex + 1} of {sortedTasks.length}
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
                {getPriorityLabel(currentTask.priority)} Priority
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
              <Text style={styles.statusLabel}>Status:</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(currentTask.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {currentTask.status.charAt(0).toUpperCase() + currentTask.status.slice(1)}
                </Text>
              </View>
            </View>

            {/* Completed Timestamp */}
            {currentTask.completedAt && (
              <Text style={styles.completedText}>
                Completed: {new Date(currentTask.completedAt).toLocaleString()}
              </Text>
            )}
          </View>
        )}

        {/* All Tasks List */}
        <View style={styles.allTasksContainer}>
          <Text style={styles.allTasksTitle}>All Tasks</Text>
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
              <Text style={styles.actionButtonText}>✓ Complete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.skipButton]}
              onPress={handleSkip}
            >
              <Text style={styles.actionButtonText}>Skip</Text>
            </TouchableOpacity>
          </>
        )}
        {(currentTask.status === TaskStatus.COMPLETED ||
          currentTask.status === TaskStatus.SKIPPED) && (
          <TouchableOpacity
            style={[styles.actionButton, styles.resetButton]}
            onPress={handleReset}
          >
            <Text style={styles.actionButtonText}>↻ Reset</Text>
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
            ← Previous
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
            Next →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Completion Message */}
      {stats && stats.isFullyCompleted && (
        <View style={styles.completionMessage}>
          <Text style={styles.completionText}>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2f95dc',
    padding: 16,
    paddingTop: 8,
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checklistName: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 16,
  },
  progressText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    minWidth: 45,
    textAlign: 'right',
  },
  taskNavigation: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  taskCounter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskContentContainer: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    lineHeight: 32,
  },
  taskDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  completedText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  allTasksContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  allTasksTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  taskListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  taskListItemActive: {
    backgroundColor: '#e3f2fd',
  },
  taskListItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskListItemNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
    minWidth: 24,
  },
  taskListItemText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  taskListItemTextActive: {
    color: '#2f95dc',
    fontWeight: '600',
  },
  taskListItemStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  skipButton: {
    backgroundColor: '#FF9800',
  },
  resetButton: {
    backgroundColor: '#757575',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2f95dc',
  },
  navButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: '#999',
  },
  completionMessage: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  completionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
