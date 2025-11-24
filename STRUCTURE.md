# Folder Structure

This project follows Expo's recommended folder structure for scalability and clarity:

```
SalingChecklists/
├── app/                    # File-based routing (Expo Router)
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Home screen
├── components/            # Reusable UI components
├── constants/             # App constants (colors, config, etc.)
│   └── Colors.ts
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions and helpers
├── api/                   # API client and endpoints
├── types/                 # TypeScript type definitions
├── __tests__/            # Test files
│   └── App.test.js
├── assets/                # Images, fonts, and other static files
├── app.json              # Expo configuration
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

## Key Features

- **Expo Router**: File-based routing in the `app/` directory
- **Component Organization**: Reusable components in `components/`
- **Type Safety**: TypeScript types in `types/`
- **Testing**: Tests in `__tests__/` directory
- **Constants**: Centralized constants and configuration
