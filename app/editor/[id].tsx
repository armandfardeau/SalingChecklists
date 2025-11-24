import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useChecklistStore } from '../../store';
import { ChecklistCategory, Task, TaskPriority, TaskStatus, CreateTaskInput } from '../../types';
import { createTask } from '../../types/examples';
import { getCategoryLabel } from '../../utils/formatters';
import { areTaskArraysEqual } from '../../utils/comparisons';
import { Colors, TouchTargets } from '../../constants/Colors';

/**
 * ChecklistEditor screen for creating and editing checklists
 * Supports both new checklist creation and editing existing checklists
 */
export default function ChecklistEditor() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isNewChecklist = id === 'new';
  
  const existingChecklist = useChecklistStore((state) => 
    isNewChecklist ? undefined : state.getChecklist(id || '')
  );
  const addChecklistWithTasks = useChecklistStore((state) => state.addChecklistWithTasks);
  const updateChecklist = useChecklistStore((state) => state.updateChecklist);
  const updateChecklistTasks = useChecklistStore((state) => state.updateChecklistTasks);

  // Form state
  const [name, setName] = useState(existingChecklist?.name || '');
  const [description, setDescription] = useState(existingChecklist?.description || '');
  const [category, setCategory] = useState<ChecklistCategory>(
    existingChecklist?.category || ChecklistCategory.GENERAL
  );
  const [icon, setIcon] = useState(existingChecklist?.icon || '');
  const [color, setColor] = useState(existingChecklist?.color || '');
  const [tasks, setTasks] = useState<Task[]>(existingChecklist?.tasks || []);

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  useEffect(() => {
    // If trying to edit a non-existent checklist, go back
    if (!isNewChecklist && !existingChecklist) {
      router.back();
    }
  }, [isNewChecklist, existingChecklist, router]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Checklist name is required');
      return;
    }

    if (isNewChecklist) {
      // Create new checklist with tasks using store method
      addChecklistWithTasks(
        {
          name: name.trim(),
          description: description.trim() || undefined,
          category,
          icon: icon.trim() || undefined,
          color: color.trim() || undefined,
        },
        tasks
      );
    } else if (existingChecklist) {
      // Update existing checklist metadata
      updateChecklist(existingChecklist.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        icon: icon.trim() || undefined,
        color: color.trim() || undefined,
      });
      
      // Update tasks if they changed (using efficient comparison)
      if (!areTaskArraysEqual(tasks, existingChecklist.tasks)) {
        updateChecklistTasks(existingChecklist.id, tasks);
      }
    }

    router.back();
  };

  const handleAddTask = () => {
    if (!taskTitle.trim()) {
      Alert.alert('Error', 'Task title is required');
      return;
    }

    if (editingTaskId) {
      // Update existing task
      setTasks(tasks.map(task => 
        task.id === editingTaskId
          ? {
              ...task,
              title: taskTitle.trim(),
              description: taskDescription.trim() || undefined,
              priority: taskPriority,
              updatedAt: new Date(),
            }
          : task
      ));
      setEditingTaskId(null);
    } else {
      // Add new task
      const taskInput: CreateTaskInput = {
        title: taskTitle.trim(),
        description: taskDescription.trim() || undefined,
        priority: taskPriority,
        order: tasks.length,
      };
      const newTask = createTask(taskInput);
      setTasks([...tasks, newTask]);
    }

    // Reset task form
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority(TaskPriority.MEDIUM);
  };

  const handleEditTask = (task: Task) => {
    setTaskTitle(task.title);
    setTaskDescription(task.description || '');
    setTaskPriority(task.priority);
    setEditingTaskId(task.id);
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTasks(tasks.filter(t => t.id !== taskId));
            if (editingTaskId === taskId) {
              setTaskTitle('');
              setTaskDescription('');
              setTaskPriority(TaskPriority.MEDIUM);
              setEditingTaskId(null);
            }
          },
        },
      ]
    );
  };

  const handleCancelEdit = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority(TaskPriority.MEDIUM);
    setEditingTaskId(null);
  };

  const getPriorityLabel = (priority: TaskPriority): string => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isNewChecklist ? 'New Checklist' : 'Edit Checklist'}
        </Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Checklist Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Checklist Details</Text>

          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter checklist name"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description (optional)"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryGrid}>
            {Object.values(ChecklistCategory).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.categoryButtonActive,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    category === cat && styles.categoryButtonTextActive,
                  ]}
                >
                  {getCategoryLabel(cat)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Icon (emoji)</Text>
          <TextInput
            style={styles.input}
            value={icon}
            onChangeText={setIcon}
            placeholder="e.g., ⛵"
            placeholderTextColor="#999"
            maxLength={2}
          />

          <Text style={styles.label}>Color (hex)</Text>
          <TextInput
            style={styles.input}
            value={color}
            onChangeText={setColor}
            placeholder="e.g., #FF6B6B"
            placeholderTextColor="#999"
            maxLength={7}
          />
        </View>

        {/* Tasks Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tasks</Text>

          {/* Task Form */}
          <View style={styles.taskForm}>
            <Text style={styles.label}>Task Title *</Text>
            <TextInput
              style={styles.input}
              value={taskTitle}
              onChangeText={setTaskTitle}
              placeholder="Enter task title"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Task Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={taskDescription}
              onChangeText={setTaskDescription}
              placeholder="Enter task description (optional)"
              placeholderTextColor="#999"
              multiline
              numberOfLines={2}
            />

            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityRow}>
              {Object.values(TaskPriority).map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    taskPriority === priority && styles.priorityButtonActive,
                  ]}
                  onPress={() => setTaskPriority(priority)}
                >
                  <Text
                    style={[
                      styles.priorityButtonText,
                      taskPriority === priority && styles.priorityButtonTextActive,
                    ]}
                  >
                    {getPriorityLabel(priority)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.taskFormButtons}>
              {editingTaskId && (
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancelEdit}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.button, styles.addButton]}
                onPress={handleAddTask}
              >
                <Text style={styles.buttonText}>
                  {editingTaskId ? 'Update Task' : 'Add Task'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Task List */}
          {tasks.length > 0 && (
            <View style={styles.taskList}>
              {tasks.map((task, index) => (
                <View key={task.id} style={styles.taskItem}>
                  <View style={styles.taskItemContent}>
                    <Text style={styles.taskItemNumber}>{index + 1}.</Text>
                    <View style={styles.taskItemText}>
                      <Text style={styles.taskItemTitle}>{task.title}</Text>
                      {task.description && (
                        <Text style={styles.taskItemDescription}>
                          {task.description}
                        </Text>
                      )}
                      <Text style={styles.taskItemPriority}>
                        {getPriorityLabel(task.priority)} Priority
                      </Text>
                    </View>
                  </View>
                  <View style={styles.taskItemActions}>
                    <TouchableOpacity
                      style={styles.taskActionButton}
                      onPress={() => handleEditTask(task)}
                    >
                      <Text style={styles.taskActionButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.taskActionButton, styles.deleteActionButton]}
                      onPress={() => handleDeleteTask(task.id)}
                    >
                      <Text style={[styles.taskActionButtonText, styles.deleteActionButtonText]}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {tasks.length === 0 && (
            <View style={styles.emptyTaskList}>
              <Text style={styles.emptyTaskText}>No tasks yet. Add your first task above.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.sea.screenBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.sea.primary,
    padding: 20,  // More padding
    minHeight: 68,
  },
  backButton: {
    minWidth: 80,
    minHeight: TouchTargets.minimum,
    justifyContent: 'center',
  },
  backButtonText: {
    color: Colors.sea.textInverse,
    fontSize: 18,  // Larger font
    fontWeight: 'bold',
  },
  headerTitle: {
    color: Colors.sea.textInverse,
    fontSize: 20,  // Larger font
    fontWeight: 'bold',
  },
  saveButton: {
    minWidth: 80,
    minHeight: TouchTargets.minimum,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: Colors.sea.textInverse,
    fontSize: 18,  // Larger font
    fontWeight: 'bold',
    textAlign: 'right',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,  // More padding
  },
  section: {
    backgroundColor: Colors.sea.cardBackground,
    borderRadius: 12,
    padding: 20,  // More padding
    marginBottom: 20,
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
  sectionTitle: {
    fontSize: 22,  // Larger font
    fontWeight: 'bold',
    color: Colors.sea.textPrimary,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,  // Larger font
    fontWeight: 'bold',
    color: Colors.sea.textPrimary,
    marginBottom: 10,
    marginTop: 16,
  },
  input: {
    backgroundColor: Colors.sea.inputBackground,
    borderRadius: 8,
    padding: 16,  // Larger padding
    fontSize: 18,  // Larger font
    color: Colors.sea.textPrimary,
    borderWidth: 2,
    borderColor: Colors.sea.cardBorder,
    minHeight: TouchTargets.minimum,  // Minimum touch target
  },
  textArea: {
    minHeight: 100,  // Taller text area
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,  // More spacing
    marginTop: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,  // More padding
    paddingVertical: 12,
    minHeight: TouchTargets.minimum,  // Minimum touch target
    borderRadius: 10,
    backgroundColor: Colors.sea.inputBackground,
    borderWidth: 2,
    borderColor: Colors.sea.cardBorder,
  },
  categoryButtonActive: {
    backgroundColor: Colors.sea.primary,
    borderColor: Colors.sea.primaryDark,
  },
  categoryButtonText: {
    fontSize: 14,  // Larger font
    color: Colors.sea.textSecondary,
    fontWeight: 'bold',
  },
  categoryButtonTextActive: {
    color: Colors.sea.textInverse,
  },
  taskForm: {
    marginBottom: 20,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 12,  // More spacing
    marginTop: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,  // More padding
    minHeight: TouchTargets.minimum,  // Minimum touch target
    borderRadius: 10,
    backgroundColor: Colors.sea.inputBackground,
    borderWidth: 2,
    borderColor: Colors.sea.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityButtonActive: {
    backgroundColor: Colors.sea.primary,
    borderColor: Colors.sea.primaryDark,
  },
  priorityButtonText: {
    fontSize: 14,  // Larger font
    color: Colors.sea.textSecondary,
    fontWeight: 'bold',
  },
  priorityButtonTextActive: {
    color: Colors.sea.textInverse,
  },
  taskFormButtons: {
    flexDirection: 'row',
    gap: 16,  // More spacing
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 16,  // Larger padding
    minHeight: TouchTargets.comfortable,  // Minimum 56px
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  addButton: {
    backgroundColor: Colors.sea.success,
    borderColor: Colors.sea.lowPriority,
  },
  cancelButton: {
    backgroundColor: Colors.sea.textDisabled,
    borderColor: Colors.sea.cardBorder,
  },
  buttonText: {
    color: Colors.sea.textInverse,
    fontSize: 16,  // Larger font
    fontWeight: 'bold',
  },
  taskList: {
    marginTop: 20,
  },
  taskItem: {
    backgroundColor: Colors.sea.inputBackground,
    borderRadius: 10,
    padding: 16,  // More padding
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.sea.cardBorder,
  },
  taskItemContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  taskItemNumber: {
    fontSize: 16,  // Larger font
    fontWeight: 'bold',
    color: Colors.sea.textSecondary,
    marginRight: 12,
    minWidth: 32,
  },
  taskItemText: {
    flex: 1,
  },
  taskItemTitle: {
    fontSize: 16,  // Larger font
    fontWeight: 'bold',
    color: Colors.sea.textPrimary,
    marginBottom: 6,
  },
  taskItemDescription: {
    fontSize: 14,  // Larger font
    color: Colors.sea.textSecondary,
    marginBottom: 6,
  },
  taskItemPriority: {
    fontSize: 13,  // Larger font
    color: Colors.sea.textSecondary,
    fontWeight: '600',
  },
  taskItemActions: {
    flexDirection: 'row',
    gap: 12,  // More spacing
    justifyContent: 'flex-end',
  },
  taskActionButton: {
    paddingHorizontal: 16,  // More padding
    paddingVertical: 10,
    minHeight: TouchTargets.minimum,  // Minimum touch target
    borderRadius: 8,
    backgroundColor: Colors.sea.primary,
    borderWidth: 1,
    borderColor: Colors.sea.primaryDark,
  },
  deleteActionButton: {
    backgroundColor: Colors.sea.danger,
    borderColor: Colors.sea.dangerDark,
  },
  taskActionButtonText: {
    color: Colors.sea.textInverse,
    fontSize: 14,  // Larger font
    fontWeight: 'bold',
  },
  deleteActionButtonText: {
    color: Colors.sea.textInverse,
  },
  emptyTaskList: {
    padding: 32,  // More padding
    alignItems: 'center',
  },
  emptyTaskText: {
    fontSize: 16,  // Larger font
    color: Colors.sea.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
