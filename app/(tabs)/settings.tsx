import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore, useChecklistStore, usePreferencesStore } from '../../store';
import { useThemedColors } from '../../hooks/useThemedColors';
import { TouchTargets, Typography } from '../../constants/Colors';
import { Colors } from '../../constants/Colors';
import SubscriptionStatus from '../../components/SubscriptionStatus';
import { LANGUAGES } from '../../constants/Languages';

export default function SettingsScreen() {
  const colors = useThemedColors();
  const mode = useThemeStore((state) => state.mode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const reloadDefaultChecklists = useChecklistStore((state) => state.reloadDefaultChecklists);
  
  const language = usePreferencesStore((state) => state.language);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);
  
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  
  const currentLanguage = LANGUAGES.find(lang => lang.code === language);
  
  // Fallback to English if stored language is invalid
  if (!currentLanguage) {
    console.warn(`Invalid language code stored: ${language}. Falling back to English.`);
    setLanguage('en');
  }
  
  const displayLanguage = currentLanguage || LANGUAGES[0];

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
          <Text style={[styles.title, { color: colors.textPrimary }]}>Settings</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Configure your app preferences
          </Text>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Language
            </Text>
            <TouchableOpacity
              style={[styles.settingItem, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
              onPress={() => setShowLanguageModal(true)}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                  Language
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  {displayLanguage.flag} {displayLanguage.name}
                </Text>
              </View>
              <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Appearance
            </Text>
            <View style={[styles.settingItem, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                  Dark Mode
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  {mode === 'dark' ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
              <Switch
                value={mode === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.disabledBackground, true: colors.primary }}
                thumbColor={colors.textInverse}
              />
            </View>
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

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Select Language
            </Text>
            <ScrollView style={styles.modalScroll}>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    {
                      backgroundColor: language === lang.code ? colors.selectionBackground : 'transparent',
                      borderColor: language === lang.code ? colors.primary : colors.cardBorder,
                    },
                  ]}
                  onPress={() => {
                    setLanguage(lang.code);
                    setShowLanguageModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.languageEmoji}>{lang.flag}</Text>
                  <Text style={[styles.languageName, { color: colors.textPrimary }]}>
                    {lang.name}
                  </Text>
                  {language === lang.code && (
                    <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowLanguageModal(false)}
              activeOpacity={0.8}
            >
              <Text style={[styles.modalCloseButtonText, { color: colors.textInverse }]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  chevron: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalScroll: {
    maxHeight: 400,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
    minHeight: TouchTargets.minimum,
  },
  languageEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  languageName: {
    fontSize: Typography.bodyLarge,
    fontWeight: '600',
    flex: 1,
  },
  checkmark: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: TouchTargets.comfortable,
    marginTop: 16,
  },
  modalCloseButtonText: {
    fontSize: Typography.buttonText,
    fontWeight: 'bold',
  },
});
