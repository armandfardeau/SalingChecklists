/**
 * Analytics Configuration
 * 
 * Configuration for Vexo.co analytics integration
 */

export const Analytics = {
  /**
   * Vexo API Key
   * 
   * Set this to your Vexo API key to enable analytics.
   * You can get your API key from https://vexo.co
   * 
   * Note: Leave empty or undefined to disable analytics
   */
  vexoApiKey: process.env.EXPO_PUBLIC_VEXO_API_KEY || '',

  /**
   * Enable analytics only in production
   * Set to false to test analytics in development
   */
  productionOnly: true,
};
