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
    dangerDark: '#8B1A1A',     // Darker red for danger borders/pressed states
    warning: '#F57C00',        // Amber for high priority
    info: '#1565C0',          // Blue for medium priority
    lowPriority: '#558B2F',   // Green for low priority
    
    // UI colors
    cardBackground: '#FFFFFF',
    cardBorder: '#E0E0E0',
    borderLight: 'rgba(0,0,0,0.1)',  // Light border with transparency
    inputBackground: '#F5F5F5',
    screenBackground: '#F5F5F5',
    disabledBackground: '#BDBDBD',
    tabIconDefault: '#757575',  // Darker gray for inactive tabs
    
    // Text colors (high contrast)
    textPrimary: '#000000',
    textSecondary: '#424242',
    textDisabled: '#757575',
    textInverse: '#FFFFFF',
  },
  seaDark: {
    // Sea-specific high contrast colors for dark mode
    /**
     * Primary action color for dark mode (maritime theme, high contrast)
     * Used for main buttons, highlights, and active elements
     */
    primary: '#66B3FF',
    /**
     * Darker variant of primary for pressed states in dark mode
     * Used for button press feedback and active states
     */
    primaryDark: '#4A90E2',
    /**
     * Secondary color for warnings/skipped items in dark mode
     * Used for alert banners, warning icons, and secondary actions
     */
    secondary: '#FFB74D',
    /**
     * Success color for completed items in dark mode (high contrast)
     * Used for checkmarks, completed checklist items, and success banners
     */
    success: '#66BB6A',
    /**
     * Danger color for critical priority in dark mode
     * Used for error states, critical alerts, and destructive actions
     */
    danger: '#EF5350',
    /**
     * Darker red for danger borders/pressed states in dark mode
     * Used for border highlights and pressed feedback on danger actions
     */
    dangerDark: '#D32F2F',
    /**
     * Warning color for high priority in dark mode
     * Used for warning icons, banners, and high priority checklist items
     */
    warning: '#FFA726',
    /**
     * Info color for medium priority in dark mode
     * Used for informational banners, icons, and medium priority items
     */
    info: '#42A5F5',
    /**
     * Low priority color for checklist items in dark mode
     * Used for low priority indicators and checklist backgrounds
     */
    lowPriority: '#9CCC65',
    
    // UI colors
    /**
     * Card background color for dark mode
     * Used for checklist cards and modal backgrounds
     */
    cardBackground: '#1E1E1E',
    /**
     * Card border color for dark mode
     * Used for card outlines and separators
     */
    cardBorder: '#424242',
    /**
     * Light border with transparency for dark mode
     * Used for subtle dividers and input borders
     */
    borderLight: 'rgba(255,255,255,0.1)',
    /**
     * Input background color for dark mode
     * Used for text fields and input areas
     */
    inputBackground: '#2C2C2C',
    /**
     * Screen background color for dark mode
     * Used for main app background
     */
    screenBackground: '#121212',
    /**
     * Disabled background color for dark mode
     * Used for disabled buttons and inactive UI elements
     */
    disabledBackground: '#424242',
    
    // Text colors (high contrast)
    /**
     * Primary text color for dark mode (high contrast)
     * Used for main text and headings
     */
    textPrimary: '#FFFFFF',
    /**
     * Secondary text color for dark mode
     * Used for subheadings, labels, and secondary information
     */
    textSecondary: '#BDBDBD',
    /**
     * Disabled text color for dark mode
     * Used for disabled labels and inactive text
     */
    textDisabled: '#757575',
    /**
     * Inverse text color for dark mode
     * Used for text on colored backgrounds (e.g., buttons)
     */
    textInverse: '#000000',
  },
};

// Minimum touch target size for maritime conditions (iOS HIG / Material Design)
export const TouchTargets = {
  minimum: 48,              // Minimum 48x48 dp/px
  comfortable: 56,          // Comfortable for rough conditions
  large: 64,               // Large for critical actions
};

// Typography scale for consistent font sizing
export const Typography = {
  // Headers
  headerTitle: 20,          // Main header titles
  sectionTitle: 22,         // Section titles
  
  // Body text
  taskTitle: 28,            // Large task titles in runner
  cardTitle: 20,            // Card titles
  bodyLarge: 18,            // Large body text
  body: 16,                 // Standard body text
  bodySmall: 14,            // Small body text
  
  // UI elements
  buttonText: 18,           // Primary button text
  inputText: 18,            // Input field text
  label: 16,                // Form labels
  tabLabel: 14,             // Tab bar labels
  tabIcon: 28,              // Tab bar icons
  
  // Specialized
  fabIcon: 40,              // FAB button icon
  priorityBadge: 14,        // Priority badge text
  progressText: 14,         // Progress indicators
};

// Interaction constants for touch feedback
export const Interactions = {
  activeOpacity: {
    default: 0.7,           // Standard touch feedback
    light: 0.6,             // Lighter feedback for secondary actions
    strong: 0.8,            // Stronger feedback for primary actions
  },
};
