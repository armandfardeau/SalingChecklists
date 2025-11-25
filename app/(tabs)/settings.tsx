import { StyleSheet, Text, View, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore, useChecklistStore } from '../../store';
import { useThemedColors } from '../../hooks/useThemedColors';
import { TouchTargets, Typography } from '../../constants/Colors';
import { Colors } from '../../constants/Colors';
import SubscriptionStatus from '../../components/SubscriptionStatus';

export default function SettingsScreen() {
  const colors = useThemedColors();
  const mode = useThemeStore((state) => state.mode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const reloadDefaultChecklists = useChecklistStore((state) => state.reloadDefaultChecklists);

  const handleReloadChecklists = () => {
    Alert.alert(
      'Reload Default Checklists',
      'This will replace all your current checklists with the default ones. This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reload',
          style: 'destructive',
          onPress: () => {
            reloadDefaultChecklists();
            Alert.alert('Success', 'Default checklists have been reloaded.');
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
                  Replace all checklists with defaults
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
});
