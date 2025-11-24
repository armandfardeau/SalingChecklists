const fs = require('fs');
const path = require('path');

describe('Navigation Structure', () => {
  it('should have the correct app directory structure', () => {
    const appDir = path.join(__dirname, '..', 'app');
    
    // Check root layout exists
    expect(fs.existsSync(path.join(appDir, '_layout.tsx'))).toBe(true);
    
    // Check root index exists
    expect(fs.existsSync(path.join(appDir, 'index.tsx'))).toBe(true);
    
    // Check tabs directory exists
    const tabsDir = path.join(appDir, '(tabs)');
    expect(fs.existsSync(tabsDir)).toBe(true);
    
    // Check tabs layout exists
    expect(fs.existsSync(path.join(tabsDir, '_layout.tsx'))).toBe(true);
    
    // Check tab screens exist
    expect(fs.existsSync(path.join(tabsDir, 'index.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(tabsDir, 'settings.tsx'))).toBe(true);
  });

  it('should have proper expo-router configuration in package.json', () => {
    const packageJson = require('../package.json');
    expect(packageJson.main).toBe('expo-router/entry');
  });

  it('should not have the old index.js entry point', () => {
    const oldIndexPath = path.join(__dirname, '..', 'index.js');
    expect(fs.existsSync(oldIndexPath)).toBe(false);
  });
});
