# SalingChecklists

Mobile checklist management application for sailing navigation, built with React Native and Expo.

## 🚀 Quick Start with GitHub Codespaces

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/armandfardeau/SalingChecklists)

Get started instantly with a fully configured development environment in the cloud:

1. Click the badge above or the "Code" → "Codespaces" button
2. Wait for the container to build (~2-3 minutes)
3. Run `npm start` to launch the development server
4. Access the web version or use Expo Go on your phone

For detailed Codespaces instructions, see [CODESPACES.md](.github/CODESPACES.md).

## 📋 Prerequisites

- Node.js (version 20 or higher)
- npm or yarn
- Expo Go on your mobile device ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/armandfardeau/SalingChecklists.git
cd SalingChecklists
```

2. Install dependencies:
```bash
npm install
```

## 🧪 Running and Testing

### Start the development server

```bash
npm start
```

This command launches Expo Dev Tools. You will see a QR code in your terminal.

### Test on different platforms

#### On mobile device (recommended)
1. Install the **Expo Go** app on your phone
2. Scan the QR code displayed in the terminal with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

#### On Android emulator
```bash
npm run android
```
*Requires Android Studio and a configured emulator*

#### On iOS simulator
```bash
npm run ios
```
*Requires macOS and Xcode*

#### In web browser
```bash
npm run web
```

## 📱 Technologies Used

- **React Native** 0.81.5
- **Expo** ~54.0
- **React** 19.1.0
- **Zustand** - State management
- **MMKV** - Fast, persistent key-value storage

## 🛠️ Project Structure

This project follows Expo's recommended folder structure with Expo Router for file-based routing:

```
SalingChecklists/
├── app/                    # File-based routing (Expo Router)
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Home screen
├── store/                 # State management (Zustand + MMKV)
├── components/            # Reusable UI components
├── constants/             # App constants (colors, config, etc.)
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions and helpers
│   └── loadDefaultTasks.ts # Load default checklist data from JSON
├── api/                   # API client and endpoints
├── types/                 # TypeScript type definitions
├── __tests__/            # Test files
├── assets/                # Images, icons, fonts
│   └── defaultTasks.json  # Default checklist data
├── app.json              # Expo configuration
└── package.json          # Dependencies and scripts
```

See [STRUCTURE.md](STRUCTURE.md) for more details about the folder organization.

### Default Checklists

Default checklists (like the pre-departure safety check) are defined in `assets/defaultTasks.json`. This JSON file contains sample checklist data that is loaded when the app is first launched. You can modify this file to customize the default checklists without changing any code.

The JSON structure follows this format:
```json
{
  "checklists": [
    {
      "id": "unique-id",
      "name": "Checklist Name",
      "description": "Description",
      "category": "pre_departure",
      "tasks": [
        {
          "id": "task-id",
          "title": "Task Title",
          "description": "Task description",
          "status": "pending",
          "priority": "high",
          "order": 1
        }
      ]
    }
  ]
}
```

## 📝 Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Launch app on Android
- `npm run ios` - Launch app on iOS (macOS only)
- `npm run web` - Launch app in browser

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or pull request.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
