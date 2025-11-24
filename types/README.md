# Type Definitions

This directory contains all TypeScript type definitions and interfaces for the SailingChecklists application.

## Overview

The type system is designed to provide strong typing for sailing checklists and their associated tasks, ensuring type safety throughout the application.

## Main Types

### Task (`task.ts`)

Represents a single task within a checklist.

**Key Properties:**
- `id`: Unique identifier
- `title`: Task title (required)
- `description`: Optional detailed description
- `status`: Task status (pending, completed, skipped)
- `priority`: Priority level (low, medium, high, critical)
- `order`: Position in the checklist
- Timestamps: `createdAt`, `updatedAt`, `completedAt`

**Enums:**
- `TaskPriority`: LOW, MEDIUM, HIGH, CRITICAL
- `TaskStatus`: PENDING, COMPLETED, SKIPPED

**Utility Types:**
- `CreateTaskInput`: Type for creating new tasks
- `UpdateTaskInput`: Type for updating existing tasks

### Checklist (`checklist.ts`)

Represents a checklist containing multiple tasks.

**Key Properties:**
- `id`: Unique identifier
- `name`: Checklist name (required)
- `description`: Optional description
- `category`: Checklist category (pre_departure, departure, navigation, etc.)
- `tasks`: Array of Task objects
- `isActive`: Whether the checklist is currently in use
- `isTemplate`: Whether the checklist is a reusable template
- `color`: Optional color code for visual identification
- `icon`: Optional icon identifier
- Timestamps: `createdAt`, `updatedAt`, `lastCompletedAt`

**Enums:**
- `ChecklistCategory`: PRE_DEPARTURE, DEPARTURE, NAVIGATION, ARRIVAL, SAFETY, MAINTENANCE, EMERGENCY, GENERAL

**Utility Types:**
- `CreateChecklistInput`: Type for creating new checklists
- `UpdateChecklistInput`: Type for updating existing checklists
- `ChecklistStats`: Type for checklist statistics (completion percentage, task counts, etc.)

## Usage

Import types from the index file:

```typescript
import {
  Task,
  TaskPriority,
  TaskStatus,
  Checklist,
  ChecklistCategory,
  CreateTaskInput,
  UpdateTaskInput,
  CreateChecklistInput,
  UpdateChecklistInput,
  ChecklistStats,
} from '@/types';
```

## Examples

See `examples.ts` for practical examples of:
- Creating tasks and checklists
- Updating tasks
- Calculating checklist statistics
- Sample pre-departure checklist data

## Categories

The application supports the following checklist categories for sailing navigation:

- **PRE_DEPARTURE**: Tasks to complete before leaving dock
- **DEPARTURE**: Tasks during the departure process
- **NAVIGATION**: Tasks for during navigation
- **ARRIVAL**: Tasks for arrival procedures
- **SAFETY**: Safety-related tasks
- **MAINTENANCE**: Maintenance and inspection tasks
- **EMERGENCY**: Emergency procedures
- **GENERAL**: General-purpose tasks

## Task Priorities

Tasks can be assigned the following priority levels:

- **CRITICAL**: Must be completed, safety-critical
- **HIGH**: Important, should be completed
- **MEDIUM**: Normal priority
- **LOW**: Optional or nice-to-have

## Type Safety

All types are exported through the central `index.ts` file, making it easy to import and use types consistently throughout the application. TypeScript will enforce type correctness at compile time.
