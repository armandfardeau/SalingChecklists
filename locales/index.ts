/**
 * i18n configuration and initialization
 * Provides translation support for the application
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import fr from './fr.json';
import es from './es.json';

// Translation resources
const resources = {
  en: { translation: en },
  fr: { translation: fr },
  es: { translation: es },
};

// Available languages
export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
];

// Default language
export const DEFAULT_LANGUAGE = 'en';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
