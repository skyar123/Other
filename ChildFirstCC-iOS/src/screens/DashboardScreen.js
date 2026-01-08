import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { format, differenceInDays } from 'date-fns';
import { SKYLAR_CASELOAD } from '../data/familyData';
import { getOverdueAssessments } from '../data/assessmentRules';

export default function DashboardScreen({ navigation }) {
  const currentDate = new Date('2026-01-07');

  const stats = useMemo(() => {
    let overdueCount = 0;
    let wantsHelpCount = 0;
    let criticalNeeds = 0;
    let baselineCount = 0;
    let unsignedCount = 0;

    SKYLAR_CASELOAD.forEach(family => {
      const overdue = getOverdueAssessments(family, currentDate);
      overdueCount += overdue.length;

      if (family.phase === 'baseline') baselineCount++;
      if (family.unsignedDocs) unsignedCount += family.unsignedDocs.length;

      Object.values(family.needs || {}).forEach(need => {
        if (need.status === 'wantsHelp') wantsHelpCount++;
        if (need.priority) criticalNeeds++;
      });
    });

    return {
      overdueCount,
      wantsHelpCount,
      criticalNeeds,
      totalFamilies: SKYLAR_CASELOAD.length,
      baselineCount,
      unsignedCount
    };
  }, []);

  const urgentTasks = useMemo(() => {
    const tasks = [];

    SKYLAR_CASELOAD.forEach(family => {
      const overdue = getOverdueAssessments(family, currentDate);
      overdue.forEach(assessment => {
        tasks.push({
          family: family.codeName,
          task: assessment.name,
          detail: `${assessment.daysOverdue} days overdue`,
          type: 'overdue',
          icon: '🚨'
        });
      });

      if (family.unsignedDocs?.length > 0) {
        tasks.push({
          family: family.codeName,
          task: `${family.unsignedDocs.length} unsigned doc(s)`,
          detail: family.unsignedDocs[0],
          type: 'urgent',
          icon: '✍️'
        });
      }

      Object.entries(family.needs || {}).forEach(([needId, needData]) => {
        if (needData.priority) {
          tasks.push({
            family: family.codeName,
            task: 'Priority SNIFF need',
            detail: needData.note?.substring(0, 40) + '...',
            type: 'critical',
            icon: '🔴'
          });
        }
      });
    });

    return tasks.slice(0, 15);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>
          {format(currentDate, 'EEEE, MMMM d, yyyy')} • {stats.totalFamilies} families
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, stats.overdueCount > 0 && styles.statCardUrgent]}>
          <Text style={styles.statLabel}>Overdue</Text>
          <Text style={[styles.statValue, stats.overdueCount > 0 && styles.statValueUrgent]}>
            {stats.overdueCount}
          </Text>
          <Text style={styles.statDetail}>fidelity items</Text>
        </View>

        <View style={[styles.statCard, stats.unsignedCount > 0 && styles.statCardWarning]}>
          <Text style={styles.statLabel}>Unsigned</Text>
          <Text style={[styles.statValue, stats.unsignedCount > 0 && styles.statValueWarning]}>
            {stats.unsignedCount}
          </Text>
          <Text style={styles.statDetail}>documents</Text>
        </View>

        <View style={[styles.statCard, stats.criticalNeeds > 0 && styles.statCardUrgent]}>
          <Text style={styles.statLabel}>Critical</Text>
          <Text style={[styles.statValue, stats.criticalNeeds > 0 && styles.statValueUrgent]}>
            {stats.criticalNeeds}
          </Text>
          <Text style={styles.statDetail}>SNIFF priorities</Text>
        </View>

        <View style={[styles.statCard, styles.statCardInfo]}>
          <Text style={styles.statLabel}>Baseline</Text>
          <Text style={[styles.statValue, styles.statValueInfo]}>
            {stats.baselineCount}
          </Text>
          <Text style={styles.statDetail}>of {stats.totalFamilies}</Text>
        </View>
      </View>

      {/* Priority Tasks */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚨 Priority Tasks</Text>
        {urgentTasks.map((task, index) => (
          <View
            key={index}
            style={[
              styles.taskItem,
              task.type === 'overdue' && styles.taskItemOverdue,
              task.type === 'urgent' && styles.taskItemUrgent,
              task.type === 'critical' && styles.taskItemCritical
            ]}
          >
            <Text style={styles.taskIcon}>{task.icon}</Text>
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>{task.task}</Text>
              <Text style={styles.taskDetail}>{task.detail}</Text>
            </View>
            <View style={styles.taskFamily}>
              <Text style={styles.taskFamilyText}>{task.family}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Families Quick View */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>👨‍👩‍👧 Families</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Families')}>
            <Text style={styles.viewAllLink}>View All →</Text>
          </TouchableOpacity>
        </View>
        {SKYLAR_CASELOAD.slice(0, 5).map(family => {
          const days = differenceInDays(currentDate, new Date(family.admissionDate));
          const overdue = getOverdueAssessments(family, currentDate);
          const criticalNeeds = Object.values(family.needs || {}).filter(n => n.priority).length;

          return (
            <TouchableOpacity
              key={family.id}
              style={styles.familyRow}
              onPress={() => navigation.navigate('FamilyDetail', { familyId: family.id })}
            >
              <View style={[styles.familyAvatar, { backgroundColor: family.avatarColor }]}>
                <Text style={styles.familyAvatarText}>
                  {family.codeName.charAt(0)}
                </Text>
              </View>
              <View style={styles.familyInfo}>
                <Text style={styles.familyName}>{family.codeName}</Text>
                <Text style={styles.familyMeta}>{family.child} • Day {days}</Text>
              </View>
              <View style={styles.familyBadges}>
                {overdue.length > 0 && (
                  <View style={[styles.badge, styles.badgeOverdue]}>
                    <Text style={styles.badgeText}>{overdue.length}</Text>
                  </View>
                )}
                {criticalNeeds > 0 && (
                  <View style={[styles.badge, styles.badgeCritical]}>
                    <Text style={styles.badgeText}>{criticalNeeds}!</Text>
                  </View>
                )}
                {family.phase === 'baseline' && days <= 30 && (
                  <View style={[styles.badge, styles.badgeNew]}>
                    <Text style={styles.badgeText}>New</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6F3'
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#1E3A5F'
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)'
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ddd',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  statCardUrgent: {
    backgroundColor: '#FCEAE8',
    borderLeftColor: '#C44536'
  },
  statCardWarning: {
    backgroundColor: '#FDF8E7',
    borderLeftColor: '#D4A72C'
  },
  statCardInfo: {
    backgroundColor: '#F0EDF5',
    borderLeftColor: '#6B5B95'
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333'
  },
  statValueUrgent: {
    color: '#C44536'
  },
  statValueWarning: {
    color: '#D4A72C'
  },
  statValueInfo: {
    color: '#6B5B95'
  },
  statDetail: {
    fontSize: 11,
    color: '#888',
    marginTop: 2
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
    marginBottom: 12
  },
  viewAllLink: {
    fontSize: 13,
    color: '#1E3A5F',
    fontWeight: '500'
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FAFAF8',
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent'
  },
  taskItemOverdue: {
    backgroundColor: '#FCEAE8',
    borderLeftColor: '#C44536'
  },
  taskItemUrgent: {
    backgroundColor: '#FDF8E7',
    borderLeftColor: '#D4A72C'
  },
  taskItemCritical: {
    backgroundColor: '#FFF0F0',
    borderLeftColor: '#B91C1C'
  },
  taskIcon: {
    fontSize: 16,
    marginRight: 10
  },
  taskContent: {
    flex: 1
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333'
  },
  taskDetail: {
    fontSize: 11,
    color: '#666',
    marginTop: 2
  },
  taskFamily: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  taskFamilyText: {
    fontSize: 10,
    color: '#666'
  },
  familyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FAFAF8',
    borderRadius: 10,
    marginBottom: 10
  },
  familyAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  familyAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  familyInfo: {
    flex: 1
  },
  familyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2
  },
  familyMeta: {
    fontSize: 12,
    color: '#666'
  },
  familyBadges: {
    flexDirection: 'row',
    gap: 4
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10
  },
  badgeOverdue: {
    backgroundColor: '#FCEAE8'
  },
  badgeCritical: {
    backgroundColor: '#FCEAE8'
  },
  badgeNew: {
    backgroundColor: '#E8F5E8'
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#C44536'
  }
});
