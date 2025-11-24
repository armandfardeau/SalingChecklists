// Sea-optimized theme colors with high contrast for maritime use
// Designed for visibility in bright sunlight and rough conditions
export const Colors = {
  light: {
    text: '#000000',           // Pure black for maximum contrast
    background: '#FFFFFF',     // Pure white background
    tint: '#0066CC',          // Darker blue for better contrast (7:1 ratio)
    tabIconDefault: '#757575', // Darker gray for better visibility
    tabIconSelected: '#0066CC',
  },
  dark: {
    text: '#FFFFFF',          // Pure white for maximum contrast
    background: '#000000',    // Pure black background
    tint: '#66B3FF',         // Lighter blue for dark mode
    tabIconDefault: '#BDBDBD',
    tabIconSelected: '#66B3FF',
  },
  sea: {
    // Sea-specific high contrast colors
    primary: '#0066CC',        // Deep blue (maritime theme, high contrast)
    primaryDark: '#004C99',    // Darker variant for pressed states
    secondary: '#FF9800',      // Orange for warnings/skipped items
    success: '#2E7D32',        // Dark green for completed items (high contrast)
    danger: '#C62828',         // Dark red for critical priority
    warning: '#F57C00',        // Amber for high priority
    info: '#1565C0',          // Blue for medium priority
    lowPriority: '#558B2F',   // Green for low priority
    
    // UI colors
    cardBackground: '#FFFFFF',
    cardBorder: '#E0E0E0',
    inputBackground: '#F5F5F5',
    screenBackground: '#F5F5F5',
    disabledBackground: '#BDBDBD',
    
    // Text colors (high contrast)
    textPrimary: '#000000',
    textSecondary: '#424242',
    textDisabled: '#757575',
    textInverse: '#FFFFFF',
  },
};

// Minimum touch target size for maritime conditions (iOS HIG / Material Design)
export const TouchTargets = {
  minimum: 48,              // Minimum 48x48 dp/px
  comfortable: 56,          // Comfortable for rough conditions
  large: 64,               // Large for critical actions
};
