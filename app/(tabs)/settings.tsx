import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import SubscriptionStatus from '../../components/SubscriptionStatus';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.description}>
            Configure your app preferences
          </Text>
          
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
  },
});
