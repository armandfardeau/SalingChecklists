import { StyleSheet, Text, View, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore, useChecklistStore, useLanguageStore } from '../../store';
import { useThemedColors } from '../../hooks/useThemedColors';
import { useTranslation } from '../../hooks/useTranslation';
import { TouchTargets, Typography } from '../../constants/Colors';
import { Colors } from '../../constants/Colors';
import SubscriptionStatus from '../../components/SubscriptionStatus';
import { LANGUAGES } from '../../utils/i18n';

export default function SettingsScreen() {
  const colors = useThemedColors();
  const mode = useThemeStore((state) => state.mode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const { t, i18n } = useTranslation();
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const currentLanguage = i18n.language;

  const handleLanguageChange = () => {
    Alert.alert(
      t('settings.language'),
      t('settings.languageDescription'),
      LANGUAGES.map((lang) => ({
        text: `${lang.nativeName}`,
        onPress: () => setLanguage(lang.code),
        style: currentLanguage === lang.code ? 'default' : 'cancel',
      }))
    );
  };
  const reloadDefaultChecklists = useChecklistStore((state) => state.reloadDefaultChecklists);

  const handleReloadChecklists = () => {
    Alert.alert(
      'Reload Default Checklists',
      'This will restore unmodified default checklists while preserving your custom checklists and any modifications you made. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reload',
          style: 'destructive',
          onPress: () => {
            try {
              reloadDefaultChecklists();
              Alert.alert('Success', 'Default checklists have been reloaded.');
            } catch (error) {
              console.error('Failed to reload default checklists:', error);
              Alert.alert('Error', 'Failed to reload default checklists. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.screenBackground }]} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{t('settings.title')}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {t('settings.description')}
          </Text>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('settings.appearance')}
            </Text>
            <View style={[styles.settingItem, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                  {t('settings.darkMode')}
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  {mode === 'dark' ? t('settings.enabled') : t('settings.disabled')}
                </Text>
              </View>
              <Switch
                value={mode === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.disabledBackground, true: colors.primary }}
                thumbColor={colors.textInverse}
              />
            </View>
            <TouchableOpacity
              style={[styles.settingItem, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder, marginTop: 12 }]}
              onPress={handleLanguageChange}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                  {t('settings.language')}
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  {LANGUAGES.find(lang => lang.code === currentLanguage)?.nativeName || 'English'}
                </Text>
              </View>
              <Text style={[styles.arrow, { color: colors.textSecondary }]}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Checklists
            </Text>
            <TouchableOpacity
              style={[styles.settingItem, { backgroundColor: colors.cardBackground, borderColor: colors.danger }]}
              onPress={handleReloadChecklists}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.danger }]}>
                  Reload Default Checklists
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Restore unmodified defaults only
                </Text>
              </View>
            </TouchableOpacity>
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
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    minHeight: TouchTargets.minimum,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: Typography.bodyLarge,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: Typography.body,
    lineHeight: 22,
  },
  arrow: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});
