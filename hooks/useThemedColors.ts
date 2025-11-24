import { Colors } from '../constants/Colors';
import { useThemeStore } from '../store/useThemeStore';

/**
 * Hook to get theme-aware colors based on current theme mode
 * 
 * Returns the appropriate color palette (sea for light mode, seaDark for dark mode)
 * 
 * Usage:
 * ```tsx
 * import { useThemedColors } from '../hooks/useThemedColors';
 * 
 * function MyComponent() {
 *   const colors = useThemedColors();
 *   
 *   return (
 *     <View style={{ backgroundColor: colors.cardBackground }}>
 *       <Text style={{ color: colors.textPrimary }}>Hello</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export const useThemedColors = () => {
  const mode = useThemeStore((state) => state.mode);
  return mode === 'dark' ? Colors.seaDark : Colors.sea;
};
