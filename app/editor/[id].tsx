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
  const addChecklist = useChecklistStore((state) => state.addChecklist);
  const updateChecklist = useChecklistStore((state) => state.updateChecklist);

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
      // Create new checklist with tasks
      const newChecklistId = `checklist-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const now = new Date();
      const newChecklist = {
        id: newChecklistId,
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        tasks,
        isActive: true,
        isTemplate: false,
        icon: icon.trim() || undefined,
        color: color.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      };
      
      // Use the store's internal method to add the full checklist
      useChecklistStore.setState((state) => ({
        checklists: [...state.checklists, newChecklist],
      }));
    } else if (existingChecklist) {
      // Update existing checklist
      updateChecklist(existingChecklist.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        icon: icon.trim() || undefined,
        color: color.trim() || undefined,
      });
      
      // Update tasks by setting state directly if they changed
      if (JSON.stringify(tasks) !== JSON.stringify(existingChecklist.tasks)) {
        useChecklistStore.setState((state) => ({
          checklists: state.checklists.map((checklist) =>
            checklist.id === existingChecklist.id
              ? { ...checklist, tasks, updatedAt: new Date() }
              : checklist
          ),
        }));
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

  const getCategoryLabel = (cat: ChecklistCategory): string => {
    return cat
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2f95dc',
    padding: 16,
  },
  backButton: {
    minWidth: 60,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    minWidth: 60,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#2f95dc',
    borderColor: '#2f95dc',
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  taskForm: {
    marginBottom: 16,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#2f95dc',
    borderColor: '#2f95dc',
  },
  priorityButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  priorityButtonTextActive: {
    color: '#fff',
  },
  taskFormButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#757575',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskList: {
    marginTop: 16,
  },
  taskItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  taskItemContent: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  taskItemNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
    minWidth: 24,
  },
  taskItemText: {
    flex: 1,
  },
  taskItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  taskItemDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  taskItemPriority: {
    fontSize: 11,
    color: '#999',
  },
  taskItemActions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  taskActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#2f95dc',
  },
  deleteActionButton: {
    backgroundColor: '#f44336',
  },
  taskActionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteActionButtonText: {
    color: '#fff',
  },
  emptyTaskList: {
    padding: 24,
    alignItems: 'center',
  },
  emptyTaskText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
