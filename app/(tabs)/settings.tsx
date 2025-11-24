import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Colors, TouchTargets } from '../../constants/Colors';
import SubscriptionStatus from '../../components/SubscriptionStatus';
import { useSettingsStore } from '../../store';
import { LANGUAGES } from '../../locales';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { language, setLanguage } = useSettingsStore();
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>{t('settings.title')}</Text>
          <Text style={styles.description}>
            {t('settings.description')}
          </Text>
          
          {/* Language Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
            <View style={styles.languageOptions}>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageButton,
                    language === lang.code && styles.languageButtonActive,
                  ]}
                  onPress={() => setLanguage(lang.code)}
                >
                  <Text
                    style={[
                      styles.languageButtonText,
                      language === lang.code && styles.languageButtonTextActive,
                    ]}
                  >
                    {lang.nativeName}
                  </Text>
                  {language === lang.code && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <SubscriptionStatus />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.sea.screenBackground,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,  // More padding
  },
  title: {
    fontSize: 28,  // Larger font
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.sea.textPrimary,  // High contrast
  },
  description: {
    fontSize: 18,  // Larger font
    color: Colors.sea.textSecondary,  // High contrast
    lineHeight: 26,
    marginBottom: 24,
  },
  section: {
    backgroundColor: Colors.sea.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: Colors.sea.cardBorder,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.sea.textPrimary,
    marginBottom: 16,
  },
  languageOptions: {
    gap: 12,
  },
  languageButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: TouchTargets.minimum,
    borderRadius: 10,
    backgroundColor: Colors.sea.inputBackground,
    borderWidth: 2,
    borderColor: Colors.sea.cardBorder,
  },
  languageButtonActive: {
    backgroundColor: Colors.sea.primary,
    borderColor: Colors.sea.primaryDark,
  },
  languageButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.sea.textSecondary,
  },
  languageButtonTextActive: {
    color: Colors.sea.textInverse,
  },
  checkmark: {
    fontSize: 20,
    color: Colors.sea.textInverse,
    fontWeight: 'bold',
  },
});
