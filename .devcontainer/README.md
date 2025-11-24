# Dev Container Setup for SailingChecklists

This dev container provides a complete development environment for the SailingChecklists React Native/Expo project.

## Features

- **Node.js 20** - Latest LTS version
- **GitHub CLI** - For seamless GitHub integration
- **Pre-configured VS Code extensions**:
  - GitHub Copilot & Copilot Chat
  - ESLint & Prettier
  - React Native Tools
  - Expo Tools
  - Jest Test Runner

## Ports

The following ports are automatically forwarded:

- **8081** - Metro Bundler
- **19000** - Expo Dev Server
- **19001** - Expo Dev Tools
- **19002** - Expo Metro

## Getting Started

### In GitHub Codespaces

1. Click the "Code" button on the repository
2. Select "Codespaces" tab
3. Click "Create codespace on [branch]"
4. Wait for the container to build and dependencies to install
5. Run `npm start` to start the Expo development server

### In VS Code Desktop

1. Install the "Dev Containers" extension
2. Open the repository in VS Code
3. Press `F1` and select "Dev Containers: Reopen in Container"
4. Wait for the container to build
5. Run `npm start`

## Development

Once the container is running:

```bash
# Start Expo development server
npm start

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Start with specific platform
npm run android
npm run ios
npm run web
```

## Testing on Physical Device

When using Expo Go on your phone:

1. Make sure your phone is on the same network as your codespace
2. Use the Expo Go app to scan the QR code from `npm start`
3. Or use the tunnel option: `npm start -- --tunnel`

## Troubleshooting

### Metro bundler not accessible

If you can't access the Metro bundler, ensure port 8081 is forwarded and public in the Ports tab.

### Expo connection issues

Try using tunnel mode for better connectivity:
```bash
npm start -- --tunnel
```

### Package installation issues

If dependencies fail to install, try:
```bash
rm -rf node_modules package-lock.json
npm install
```
