import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format, differenceInDays, addDays } from 'date-fns';
import { ASSESSMENT_SCHEDULE } from '../data/assessmentRules';

export default function SixtyDayProgress({ family, currentDate = new Date('2026-01-07') }) {
  const admissionDate = new Date(family.admissionDate);
  const sixtyDayDeadline = addDays(admissionDate, 60);
  const daysSinceAdmission = differenceInDays(currentDate, admissionDate);
  const daysRemaining = 60 - daysSinceAdmission;
  const progressPercentage = Math.min((daysSinceAdmission / 60) * 100, 100);

  // Calculate assessment completion
  const baselineAssessments = [];
  ['coreIntake', 'childDevelopment', 'socialEmotional', 'caregiverWellbeing', 'traumaAssessment', 'observational', 'additionalBaseline'].forEach(category => {
    const cat = ASSESSMENT_SCHEDULE[category];
    if (cat && cat.phase === 'baseline') {
      cat.items.forEach(item => {
        baselineAssessments.push({
          ...item,
          category: cat.title,
          completed: family.completedDocs?.includes(item.id) || false
        });
      });
    }
  });

  const requiredAssessments = baselineAssessments.filter(a => a.required);
  const completedRequired = requiredAssessments.filter(a => a.completed).length;
  const totalRequired = requiredAssessments.length;
  const assessmentProgress = (completedRequired / totalRequired) * 100;

  // Observation progress
  const ccisProgress = (family.ccisObservations / 4) * 100;
  const hopeProgress = (family.hopeObservations / 3) * 100;

  // Overall completion
  const overallProgress = (assessmentProgress + ccisProgress + hopeProgress) / 3;

  // Status determination
  let status = 'on-track';
  let statusColor = '#5B8C5A';
  if (family.phase !== 'baseline') {
    status = 'complete';
    statusColor = '#5B8C5A';
  } else if (daysSinceAdmission > 60) {
    status = 'overdue';
    statusColor = '#C44536';
  } else if (daysRemaining <= 14) {
    status = 'due-soon';
    statusColor = '#D4A72C';
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>60-Day Baseline Period</Text>
          <Text style={styles.subtitle}>
            {status === 'complete'
              ? `Completed ${format(sixtyDayDeadline, 'MMM d, yyyy')}`
              : status === 'overdue'
              ? `Overdue by ${Math.abs(daysRemaining)} days`
              : `${daysRemaining} days remaining • Due ${format(sixtyDayDeadline, 'MMM d, yyyy')}`
            }
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>
            {status === 'complete' ? '✓ Complete' : `Day ${daysSinceAdmission}`}
          </Text>
        </View>
      </View>

      {/* Main 60-day progress bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPercentage}%`,
                backgroundColor: statusColor
              }
            ]}
          />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>Day 0</Text>
          <Text style={[styles.progressLabel, { color: statusColor, fontWeight: '600' }]}>
            {Math.round(progressPercentage)}%
          </Text>
          <Text style={styles.progressLabel}>Day 60</Text>
        </View>
      </View>

      {/* Assessment completion breakdown */}
      <View style={styles.breakdownSection}>
        <Text style={styles.breakdownTitle}>Completion Status</Text>

        {/* Required Assessments */}
        <View style={styles.breakdownItem}>
          <View style={styles.breakdownHeader}>
            <Text style={styles.breakdownLabel}>Required Assessments</Text>
            <Text style={styles.breakdownValue}>
              {completedRequired}/{totalRequired}
            </Text>
          </View>
          <View style={styles.miniProgressBar}>
            <View
              style={[
                styles.miniProgressFill,
                {
                  width: `${assessmentProgress}%`,
                  backgroundColor: assessmentProgress === 100 ? '#5B8C5A' : assessmentProgress > 50 ? '#D4A72C' : '#C44536'
                }
              ]}
            />
          </View>
        </View>

        {/* CCIS Observations */}
        <View style={styles.breakdownItem}>
          <View style={styles.breakdownHeader}>
            <Text style={styles.breakdownLabel}>CCIS Observations</Text>
            <Text style={styles.breakdownValue}>
              {family.ccisObservations}/4
            </Text>
          </View>
          <View style={styles.miniProgressBar}>
            <View
              style={[
                styles.miniProgressFill,
                {
                  width: `${ccisProgress}%`,
                  backgroundColor: ccisProgress === 100 ? '#5B8C5A' : ccisProgress > 50 ? '#D4A72C' : '#C44536'
                }
              ]}
            />
          </View>
        </View>

        {/* HOPE Observations */}
        <View style={styles.breakdownItem}>
          <View style={styles.breakdownHeader}>
            <Text style={styles.breakdownLabel}>HOPE Observations (3 weeks)</Text>
            <Text style={styles.breakdownValue}>
              {family.hopeObservations}/3
            </Text>
          </View>
          <View style={styles.miniProgressBar}>
            <View
              style={[
                styles.miniProgressFill,
                {
                  width: `${hopeProgress}%`,
                  backgroundColor: hopeProgress === 100 ? '#5B8C5A' : hopeProgress > 50 ? '#D4A72C' : '#C44536'
                }
              ]}
            />
          </View>
        </View>
      </View>

      {/* Overall completion gauge */}
      <View style={styles.overallSection}>
        <Text style={styles.overallLabel}>Overall Baseline Completion</Text>
        <Text
          style={[
            styles.overallPercentage,
            {
              color: overallProgress === 100 ? '#5B8C5A' : overallProgress > 50 ? '#D4A72C' : '#C44536'
            }
          ]}
        >
          {Math.round(overallProgress)}%
        </Text>
      </View>

      {/* Critical items missing */}
      {status !== 'complete' && overallProgress < 100 && (
        <View style={[styles.alertBox, { backgroundColor: status === 'overdue' ? '#FCEAE8' : '#FDF8E7' }]}>
          <Text style={[styles.alertTitle, { color: status === 'overdue' ? '#C44536' : '#D4A72C' }]}>
            {status === 'overdue' ? '🚨 Baseline Overdue' : '⏰ Action Required'}
          </Text>
          {completedRequired < totalRequired && (
            <Text style={styles.alertText}>
              • {totalRequired - completedRequired} required assessment(s) pending
            </Text>
          )}
          {family.ccisObservations < 4 && (
            <Text style={styles.alertText}>
              • {4 - family.ccisObservations} CCIS observation(s) needed
            </Text>
          )}
          {family.hopeObservations < 3 && (
            <Text style={styles.alertText}>
              • {3 - family.hopeObservations} HOPE observation(s) needed
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 12,
    color: '#666'
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 1
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  progressSection: {
    marginBottom: 16
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden'
  },
  progressFill: {
    height: 12,
    borderRadius: 6
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6
  },
  progressLabel: {
    fontSize: 11,
    color: '#999'
  },
  breakdownSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0'
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E3A5F',
    marginBottom: 10
  },
  breakdownItem: {
    marginBottom: 10
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#666'
  },
  breakdownValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333'
  },
  miniProgressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden'
  },
  miniProgressFill: {
    height: 6,
    borderRadius: 3
  },
  overallSection: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0'
  },
  overallLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  overallPercentage: {
    fontSize: 32,
    fontWeight: '700'
  },
  alertBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#C44536'
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6
  },
  alertText: {
    fontSize: 11,
    color: '#666',
    marginTop: 2
  }
});
