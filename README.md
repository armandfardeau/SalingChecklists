# SalingChecklists

Mobile checklist management application for sailing navigation, built with React Native and Expo.

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
├── api/                   # API client and endpoints
├── types/                 # TypeScript type definitions
├── __tests__/            # Test files
├── assets/                # Images, icons, fonts
├── app.json              # Expo configuration
└── package.json          # Dependencies and scripts
```

See [STRUCTURE.md](STRUCTURE.md) for more details about the folder organization.

## 📝 Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Launch app on Android
- `npm run ios` - Launch app on iOS (macOS only)
- `npm run web` - Launch app in browser

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or pull request.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
