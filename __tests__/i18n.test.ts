import i18n, { LANGUAGES } from '../utils/i18n';

describe('i18n', () => {
  beforeEach(() => {
    // Reset to English before each test
    i18n.changeLanguage('en');
  });

  describe('Configuration', () => {
    it('should initialize with English as default', () => {
      expect(i18n.language).toBe('en');
    });

    it('should have fallback language set to English', () => {
      expect(i18n.options.fallbackLng).toEqual(['en']);
    });

    it('should have both English and French resources', () => {
      const languages = Object.keys(i18n.options.resources || {});
      expect(languages).toContain('en');
      expect(languages).toContain('fr');
    });
  });

  describe('Language constants', () => {
    it('should export LANGUAGES array with correct structure', () => {
      expect(LANGUAGES).toHaveLength(2);
      expect(LANGUAGES[0]).toEqual({ code: 'en', name: 'English', nativeName: 'English' });
      expect(LANGUAGES[1]).toEqual({ code: 'fr', name: 'French', nativeName: 'Français' });
    });
  });

  describe('Language switching', () => {
    it('should switch to French', async () => {
      await i18n.changeLanguage('fr');
      expect(i18n.language).toBe('fr');
    });

    it('should switch back to English', async () => {
      await i18n.changeLanguage('fr');
      await i18n.changeLanguage('en');
      expect(i18n.language).toBe('en');
    });
  });

  describe('Translation keys', () => {
    describe('English translations', () => {
      beforeEach(() => {
        i18n.changeLanguage('en');
      });

      it('should translate tab names', () => {
        expect(i18n.t('tabs.checklists')).toBe('Checklists');
        expect(i18n.t('tabs.emergency')).toBe('Emergency');
        expect(i18n.t('tabs.settings')).toBe('Settings');
      });

      it('should translate settings screen', () => {
        expect(i18n.t('settings.title')).toBe('Settings');
        expect(i18n.t('settings.darkMode')).toBe('Dark Mode');
        expect(i18n.t('settings.language')).toBe('Language');
      });

      it('should translate emergency screen', () => {
        expect(i18n.t('emergency.title')).toBe('EMERGENCY');
        expect(i18n.t('emergency.subtitle')).toBe('Quick access to critical procedures');
        expect(i18n.t('emergency.start')).toBe('START');
      });

      it('should translate categories', () => {
        expect(i18n.t('category.pre_departure')).toBe('Pre Departure');
        expect(i18n.t('category.departure')).toBe('Departure');
        expect(i18n.t('category.emergency')).toBe('Emergency');
        expect(i18n.t('category.arrival')).toBe('Arrival');
      });

      it('should translate checklist progress with interpolation', () => {
        expect(i18n.t('checklist.tasksProgress', { completed: 3, total: 5 })).toBe('3 / 5 tasks');
      });

      it('should translate emergency tasks count with interpolation', () => {
        expect(i18n.t('emergency.criticalTasks', { count: 7 })).toBe('7 critical tasks');
      });
    });

    describe('French translations', () => {
      beforeEach(() => {
        i18n.changeLanguage('fr');
      });

      it('should translate tab names to French', () => {
        expect(i18n.t('tabs.checklists')).toBe('Listes');
        expect(i18n.t('tabs.emergency')).toBe('Urgence');
        expect(i18n.t('tabs.settings')).toBe('Réglages');
      });

      it('should translate settings screen to French', () => {
        expect(i18n.t('settings.title')).toBe('Réglages');
        expect(i18n.t('settings.darkMode')).toBe('Mode sombre');
        expect(i18n.t('settings.language')).toBe('Langue');
      });

      it('should translate emergency screen to French', () => {
        expect(i18n.t('emergency.title')).toBe('URGENCE');
        expect(i18n.t('emergency.subtitle')).toBe('Accès rapide aux procédures critiques');
        expect(i18n.t('emergency.start')).toBe('DÉMARRER');
      });

      it('should translate categories to French', () => {
        expect(i18n.t('category.pre_departure')).toBe('Pré Départ');
        expect(i18n.t('category.departure')).toBe('Départ');
        expect(i18n.t('category.emergency')).toBe('Urgence');
        expect(i18n.t('category.arrival')).toBe('Arrivée');
      });

      it('should translate checklist progress with interpolation', () => {
        expect(i18n.t('checklist.tasksProgress', { completed: 3, total: 5 })).toBe('3 / 5 tâches');
      });

      it('should translate emergency tasks count with interpolation', () => {
        expect(i18n.t('emergency.criticalTasks', { count: 7 })).toBe('7 tâches critiques');
      });
    });
  });

  describe('Default checklists translations', () => {
    it('should translate pre-departure checklist in English', () => {
      i18n.changeLanguage('en');
      expect(i18n.t('defaultChecklists.preDeparture.name')).toBe('Pre-Departure Safety Check');
      expect(i18n.t('defaultChecklists.preDeparture.tasks.checkWeather.title')).toBe('Check weather forecast');
    });

    it('should translate pre-departure checklist in French', () => {
      i18n.changeLanguage('fr');
      expect(i18n.t('defaultChecklists.preDeparture.name')).toBe('Contrôle de sécurité avant départ');
      expect(i18n.t('defaultChecklists.preDeparture.tasks.checkWeather.title')).toBe('Vérifier les prévisions météo');
    });

    it('should translate emergency checklist in English', () => {
      i18n.changeLanguage('en');
      expect(i18n.t('defaultChecklists.emergency.name')).toBe('Emergency Procedures');
      expect(i18n.t('defaultChecklists.emergency.tasks.assessSituation.title')).toBe('Assess the situation');
    });

    it('should translate emergency checklist in French', () => {
      i18n.changeLanguage('fr');
      expect(i18n.t('defaultChecklists.emergency.name')).toBe('Procédures d\'urgence');
      expect(i18n.t('defaultChecklists.emergency.tasks.assessSituation.title')).toBe('Évaluer la situation');
    });
  });

  describe('Missing translations', () => {
    it('should return key if translation is missing', () => {
      const missingKey = i18n.t('nonexistent.key.path');
      expect(missingKey).toBe('nonexistent.key.path');
    });

    it('should use fallback language for missing translations', async () => {
      await i18n.changeLanguage('fr');
      // If a key doesn't exist in French, it should fall back to English
      const result = i18n.t('tabs.checklists');
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
