import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { differenceInDays } from 'date-fns';
import { SKYLAR_CASELOAD } from '../data/familyData';
import { getOverdueAssessments } from '../data/assessmentRules';

export default function FamilyListScreen({ navigation }) {
  const currentDate = new Date('2026-01-07');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Families</Text>
        <Text style={styles.subtitle}>Active caseload ({SKYLAR_CASELOAD.length})</Text>
      </View>

      <ScrollView style={styles.content}>
        {SKYLAR_CASELOAD.map(family => {
          const days = differenceInDays(currentDate, new Date(family.admissionDate));
          const overdue = getOverdueAssessments(family, currentDate);
          const criticalNeeds = Object.values(family.needs || {}).filter(n => n.priority).length;

          return (
            <TouchableOpacity
              key={family.id}
              style={styles.familyCard}
              onPress={() => navigation.navigate('FamilyDetail', { familyId: family.id })}
            >
              <View style={styles.familyHeader}>
                <View style={[styles.avatar, { backgroundColor: family.avatarColor }]}>
                  <Text style={styles.avatarText}>{family.codeName.charAt(0)}</Text>
                </View>
                <View style={styles.familyInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.familyChild}>{family.child}</Text>
                    <View style={styles.codeNameBadge}>
                      <Text style={styles.codeNameText}>{family.codeName}</Text>
                    </View>
                  </View>
                  <Text style={styles.familyCaregiver}>
                    {family.caregiver} • Day {days} • {family.therapist}
                  </Text>
                  <Text style={styles.familyDiagnosis}>
                    {family.diagnosis || 'No diagnosis yet'}
                  </Text>
                </View>
              </View>

              <View style={styles.familyBadges}>
                {family.isTwin && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Twin of {family.twinOf}</Text>
                  </View>
                )}
                {family.relationship && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{family.relationship}</Text>
                  </View>
                )}
                <View style={[styles.badge, family.phase === 'baseline' && styles.badgeBaseline]}>
                  <Text style={styles.badgeText}>{family.phase}</Text>
                </View>
                {overdue.length > 0 && (
                  <View style={[styles.badge, styles.badgeOverdue]}>
                    <Text style={[styles.badgeText, styles.badgeTextOverdue]}>
                      {overdue.length} overdue
                    </Text>
                  </View>
                )}
                {family.unsignedDocs && family.unsignedDocs.length > 0 && (
                  <View style={[styles.badge, styles.badgeWarning]}>
                    <Text style={[styles.badgeText, styles.badgeTextWarning]}>
                      {family.unsignedDocs.length} unsigned
                    </Text>
                  </View>
                )}
                {criticalNeeds > 0 && (
                  <View style={[styles.badge, styles.badgeCritical]}>
                    <Text style={[styles.badgeText, styles.badgeTextCritical]}>
                      {criticalNeeds} critical
                    </Text>
                  </View>
                )}
              </View>

              {/* Progress indicators */}
              {family.phase === 'baseline' && (
                <View style={styles.progressIndicator}>
                  <Text style={styles.progressLabel}>Baseline Progress</Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min((days / 60) * 100, 100)}%`,
                          backgroundColor: days > 60 ? '#C44536' : days > 45 ? '#D4A72C' : '#5B8C5A'
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.progressValue}>{days}/60 days</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
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
  content: {
    flex: 1,
    padding: 16
  },
  familyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  familyHeader: {
    flexDirection: 'row',
    marginBottom: 12
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600'
  },
  familyInfo: {
    flex: 1
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3
  },
  familyChild: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8
  },
  codeNameBadge: {
    backgroundColor: '#F0EDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4
  },
  codeNameText: {
    fontSize: 11,
    color: '#6B5B95',
    fontWeight: '500'
  },
  familyCaregiver: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2
  },
  familyDiagnosis: {
    fontSize: 12,
    color: '#888'
  },
  familyBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#f0f0f0'
  },
  badgeBaseline: {
    backgroundColor: '#E8F0F7'
  },
  badgeOverdue: {
    backgroundColor: '#FCEAE8'
  },
  badgeWarning: {
    backgroundColor: '#FDF8E7'
  },
  badgeCritical: {
    backgroundColor: '#FCEAE8'
  },
  badgeText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500'
  },
  badgeTextOverdue: {
    color: '#C44536'
  },
  badgeTextWarning: {
    color: '#b8860b'
  },
  badgeTextCritical: {
    color: '#C44536'
  },
  progressIndicator: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0'
  },
  progressLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 6
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4
  },
  progressFill: {
    height: 6,
    borderRadius: 3
  },
  progressValue: {
    fontSize: 11,
    color: '#666',
    textAlign: 'right'
  }
});
