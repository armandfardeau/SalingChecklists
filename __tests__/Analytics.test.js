import { Analytics } from '../constants/Analytics';

describe('Analytics Configuration', () => {
  it('should have vexoApiKey property', () => {
    expect(Analytics).toHaveProperty('vexoApiKey');
  });

  it('should have productionOnly property', () => {
    expect(Analytics).toHaveProperty('productionOnly');
  });

  it('should have productionOnly set to true by default', () => {
    expect(Analytics.productionOnly).toBe(true);
  });

  it('should return empty string if EXPO_PUBLIC_VEXO_API_KEY is not set', () => {
    // In test environment, the env var is not set
    expect(Analytics.vexoApiKey).toBe('');
  });

  it('should be a valid configuration object', () => {
    expect(typeof Analytics).toBe('object');
    expect(typeof Analytics.vexoApiKey).toBe('string');
    expect(typeof Analytics.productionOnly).toBe('boolean');
  });
});
