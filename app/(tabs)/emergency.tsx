import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChecklistStore, useThemeStore } from '../../store';
import { ChecklistCategory } from '../../types';
import { TouchTargets } from '../../constants/Colors';
import { useThemedColors } from '../../hooks/useThemedColors';
import { useTranslation } from '../../hooks/useTranslation';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Emergency tab - Quick access to emergency checklists
 * Provides immediate access to critical safety procedures
 */
export default function Emergency() {
  const router = useRouter();
  const colors = useThemedColors();
  const mode = useThemeStore((state) => state.mode);
  const { t } = useTranslation();
  const checklists = useChecklistStore((state) => state.checklists);
  const getChecklistStats = useChecklistStore((state) => state.getChecklistStats);
  const initializeSampleData = useChecklistStore((state) => state.initializeSampleData);
  const hasHydrated = useChecklistStore((state) => state._hasHydrated);

  // Initialize sample data after store has hydrated from storage
  useEffect(() => {
    if (hasHydrated) {
      initializeSampleData();
    }
  }, [hasHydrated, initializeSampleData]);

  // Filter for emergency checklists
  const emergencyChecklists = checklists.filter(
    (checklist) => checklist.category === ChecklistCategory.EMERGENCY && checklist.isActive
  );

  const handleEmergencyPress = (checklistId: string) => {
    router.push(`/runner/${checklistId}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.screenBackground }]}>
      <View style={[styles.header, { backgroundColor: colors.danger }]}>
        <View style={styles.headerTitleContainer}>
          <MaterialIcons name="emergency" size={32} color={colors.textInverse} style={styles.headerIcon} />
          <Text style={[styles.headerTitle, { color: colors.textInverse }]}>{t('emergency.title')}</Text>
        </View>
        <Text style={[styles.headerSubtitle, { color: colors.textInverse }]}>
          {t('emergency.subtitle')}
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {emergencyChecklists.length > 0 ? (
          emergencyChecklists.map((checklist) => {
            const stats = getChecklistStats(checklist.id);
            return (
              <TouchableOpacity
                key={checklist.id}
                style={[
                  styles.emergencyCard,
                  { backgroundColor: colors.cardBackground, borderColor: colors.danger },
                ]}
                onPress={() => handleEmergencyPress(checklist.id)}
              >
                <View style={styles.cardHeader}>
                  {checklist.icon && (
                    <Text style={styles.icon}>{checklist.icon}</Text>
                  )}
                  <View style={styles.cardContent}>
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                      {checklist.name}
                    </Text>
                    {checklist.description && (
                      <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                        {checklist.description}
                      </Text>
                    )}
                    {stats && (
                      <Text style={[styles.taskCount, { color: colors.textSecondary }]}>
                        {t('emergency.criticalTasks', { count: stats.totalTasks })}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={[styles.accessButton, { backgroundColor: colors.danger }]}>
                  <Text style={[styles.accessButtonText, { color: colors.textInverse }]}>
                    {t('emergency.start')} →
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="warning" size={80} color={colors.warning} style={styles.emptyIcon} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              {t('emergency.noChecklistsTitle')}
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('emergency.noChecklistsText')}
            </Text>
          </View>
        )}

        <View style={[styles.infoBox, { backgroundColor: colors.danger, borderColor: colors.dangerDark }]}>
          <View style={styles.infoTitleContainer}>
            <MaterialIcons name="warning" size={24} color={colors.textInverse} style={styles.infoIcon} />
            <Text style={[styles.infoTitle, { color: colors.textInverse }]}>
              {t('emergency.infoTitle')}
            </Text>
          </View>
          <Text style={[styles.infoText, { color: colors.textInverse }]}>
            {t('emergency.infoItems')}
          </Text>
        </View>
      </ScrollView>

      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  headerIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  emergencyCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    minHeight: TouchTargets.comfortable,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  icon: {
    fontSize: 40,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 30,
  },
  cardDescription: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  taskCount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  accessButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: TouchTargets.minimum,
  },
  accessButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  infoBox: {
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    borderWidth: 2,
  },
  infoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
