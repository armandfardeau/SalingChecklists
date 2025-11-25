import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { usePreferencesStore, useThemeStore, Language, ThemeMode } from '../store';
import { useThemedColors } from '../hooks/useThemedColors';
import { TouchTargets, Typography } from '../constants/Colors';

const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const colors = useThemedColors();
  
  const language = usePreferencesStore((state) => state.language);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);
  const completeOnboarding = usePreferencesStore((state) => state.completeOnboarding);
  
  const mode = useThemeStore((state) => state.mode);
  const setTheme = useThemeStore((state) => state.setTheme);
  
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(mode);

  const handleContinue = () => {
    setLanguage(selectedLanguage);
    setTheme(selectedTheme);
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.screenBackground }]} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.welcomeEmoji, { color: colors.textPrimary }]}>⚓</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Welcome to Sailing Checklists
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Let's personalize your experience
            </Text>
          </View>

          {/* Language Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Choose Your Language
            </Text>
            <View style={styles.optionsContainer}>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: selectedLanguage === lang.code ? colors.primary : colors.cardBorder,
                      borderWidth: selectedLanguage === lang.code ? 3 : 2,
                    },
                  ]}
                  onPress={() => setSelectedLanguage(lang.code)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionEmoji}>{lang.flag}</Text>
                  <Text style={[styles.optionText, { color: colors.textPrimary }]}>
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Theme Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Choose Your Theme
            </Text>
            <View style={styles.themeContainer}>
              <TouchableOpacity
                style={[
                  styles.themeCard,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: selectedTheme === 'light' ? colors.primary : colors.cardBorder,
                    borderWidth: selectedTheme === 'light' ? 3 : 2,
                  },
                ]}
                onPress={() => setSelectedTheme('light')}
                activeOpacity={0.7}
              >
                <Text style={styles.themeEmoji}>☀️</Text>
                <Text style={[styles.themeText, { color: colors.textPrimary }]}>
                  Light Mode
                </Text>
                <Text style={[styles.themeDescription, { color: colors.textSecondary }]}>
                  Bright and clear
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.themeCard,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: selectedTheme === 'dark' ? colors.primary : colors.cardBorder,
                    borderWidth: selectedTheme === 'dark' ? 3 : 2,
                  },
                ]}
                onPress={() => setSelectedTheme('dark')}
                activeOpacity={0.7}
              >
                <Text style={styles.themeEmoji}>🌙</Text>
                <Text style={[styles.themeText, { color: colors.textPrimary }]}>
                  Dark Mode
                </Text>
                <Text style={[styles.themeDescription, { color: colors.textSecondary }]}>
                  Easy on the eyes
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[styles.continueButton, { backgroundColor: colors.primary }]}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={[styles.continueButtonText, { color: colors.textInverse }]}>
              Continue
            </Text>
          </TouchableOpacity>

          <Text style={[styles.note, { color: colors.textSecondary }]}>
            You can change these settings later in the app
          </Text>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  welcomeEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    minHeight: TouchTargets.minimum,
  },
  optionEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  optionText: {
    fontSize: Typography.bodyLarge,
    fontWeight: '600',
  },
  themeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  themeCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    minHeight: 140,
    justifyContent: 'center',
  },
  themeEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  themeText: {
    fontSize: Typography.bodyLarge,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  themeDescription: {
    fontSize: Typography.body,
    textAlign: 'center',
  },
  continueButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: TouchTargets.comfortable,
    marginTop: 8,
    marginBottom: 16,
  },
  continueButtonText: {
    fontSize: Typography.buttonText,
    fontWeight: 'bold',
  },
  note: {
    fontSize: Typography.bodySmall,
    textAlign: 'center',
    lineHeight: 20,
  },
});
