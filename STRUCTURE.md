# Folder Structure

This project follows Expo's recommended folder structure for scalability and clarity:

```
SalingChecklists/
├── app/                    # File-based routing (Expo Router)
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Home screen
├── store/                 # State management (Zustand + MMKV)
│   ├── mmkv-storage.ts   # MMKV storage adapter
│   ├── useStore.ts       # Example store with persistence
│   ├── useChecklistStore.ts # Checklist store
│   ├── index.ts          # Store exports
│   └── README.md         # Store documentation
├── components/            # Reusable UI components
├── constants/             # App constants (colors, config, etc.)
│   └── Colors.ts
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions and helpers
│   └── loadDefaultTasks.ts # Load default checklist data from JSON
├── api/                   # API client and endpoints
├── types/                 # TypeScript type definitions
├── __tests__/            # Test files
│   ├── App.test.js
│   ├── store.test.js
│   ├── checklistStore.test.js
│   └── loadDefaultTasks.test.js
├── assets/                # Images, fonts, and other static files
│   └── defaultTasks.json  # Default checklist data
├── app.json              # Expo configuration
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

## Key Features

- **Expo Router**: File-based routing in the `app/` directory
- **State Management**: Zustand with MMKV persistence in `store/`
- **Component Organization**: Reusable components in `components/`
- **Type Safety**: TypeScript types in `types/`
- **Testing**: Tests in `__tests__/` directory
- **Constants**: Centralized constants and configuration
- **Data-Driven Defaults**: Default checklists loaded from `assets/defaultTasks.json`

## Default Checklists

Default checklists are defined in `assets/defaultTasks.json` and loaded at runtime using the `loadDefaultChecklists()` utility from `utils/loadDefaultTasks.ts`. This separation of data and code makes it easy to:

- Update task lists without modifying code
- Add new default checklists
- Customize checklists for different use cases
- Potentially localize checklist content

To modify default checklists, simply edit the JSON file following the documented structure.
