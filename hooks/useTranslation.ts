import { useTranslation as useI18nTranslation } from 'react-i18next';

/**
 * Custom hook for translations
 * Re-exports useTranslation from react-i18next for consistency
 */
export function useTranslation() {
  return useI18nTranslation();
}
