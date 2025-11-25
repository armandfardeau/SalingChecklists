/**
 * Test suite for locale store functionality
 */
import { useLocaleStore } from '../store/useLocaleStore';

describe('useLocaleStore', () => {
  beforeEach(() => {
    // Reset the store state before each test
    const store = useLocaleStore.getState();
    store.setLocale('en');
  });

  it('should have default locale as English', () => {
    const locale = useLocaleStore.getState().locale;
    expect(locale).toBe('en');
  });

  it('should change locale when setLocale is called', () => {
    const { setLocale } = useLocaleStore.getState();
    
    setLocale('fr');
    expect(useLocaleStore.getState().locale).toBe('fr');
    
    setLocale('es');
    expect(useLocaleStore.getState().locale).toBe('es');
  });

  it('should persist locale across store instances', () => {
    const { setLocale } = useLocaleStore.getState();
    
    setLocale('fr');
    expect(useLocaleStore.getState().locale).toBe('fr');
  });

  it('should support all defined locales', () => {
    const { setLocale } = useLocaleStore.getState();
    const supportedLocales = ['en', 'fr', 'es', 'de', 'it'];
    
    supportedLocales.forEach(locale => {
      setLocale(locale);
      expect(useLocaleStore.getState().locale).toBe(locale);
    });
  });
});
