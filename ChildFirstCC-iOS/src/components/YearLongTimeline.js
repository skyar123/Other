import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { format, differenceInDays, addDays } from 'date-fns';
import { TIMELINE_MILESTONES } from '../data/assessmentRules';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TIMELINE_WIDTH = SCREEN_WIDTH * 3; // 3x screen width for scrolling
const DAY_WIDTH = TIMELINE_WIDTH / 365; // Pixel width per day

export default function YearLongTimeline({ family, currentDate = new Date('2026-01-07') }) {
  const admissionDate = new Date(family.admissionDate);
  const daysSinceAdmission = differenceInDays(currentDate, admissionDate);
  const currentProgress = Math.min(daysSinceAdmission / 365, 1);

  // Calculate milestone positions
  const milestones = Object.entries(TIMELINE_MILESTONES).map(([key, milestone]) => {
    const milestoneDate = addDays(admissionDate, milestone.day);
    const isPast = currentDate >= milestoneDate;
    const daysUntil = differenceInDays(milestoneDate, currentDate);

    return {
      key,
      ...milestone,
      date: milestoneDate,
      isPast,
      daysUntil,
      position: (milestone.day / 365) * 100 // Percentage position
    };
  });

  // Major phase markers
  const phases = [
    { name: 'Baseline', start: 0, end: 60, color: '#1565C0' },
    { name: 'Early Intervention', start: 60, end: 180, color: '#00838F' },
    { name: 'Mid-Treatment', start: 180, end: 270, color: '#2E7D32' },
    { name: 'Discharge Prep', start: 270, end: 365, color: '#F57C00' }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Year-Long Treatment Timeline</Text>
        <Text style={styles.subtitle}>
          Day {daysSinceAdmission} of 365 • {format(admissionDate, 'MMM d, yyyy')} - {format(addDays(admissionDate, 365), 'MMM d, yyyy')}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ width: TIMELINE_WIDTH, padding: 16 }}
        style={styles.scrollView}
      >
        {/* Phase background bands */}
        <View style={styles.phasesContainer}>
          {phases.map((phase, idx) => (
            <View
              key={idx}
              style={[
                styles.phaseBar,
                {
                  left: `${(phase.start / 365) * 100}%`,
                  width: `${((phase.end - phase.start) / 365) * 100}%`,
                  backgroundColor: `${phase.color}15`
                }
              ]}
            >
              <Text style={[styles.phaseLabel, { color: phase.color }]}>
                {phase.name}
              </Text>
            </View>
          ))}
        </View>

        {/* Main timeline bar */}
        <View style={styles.timelineBar}>
          {/* Progress fill */}
          <View
            style={[
              styles.timelineProgress,
              {
                width: `${currentProgress * 100}%`,
                backgroundColor: daysSinceAdmission <= 60 ? '#1565C0' : daysSinceAdmission <= 180 ? '#00838F' : '#2E7D32'
              }
            ]}
          />

          {/* Current day marker */}
          <View
            style={[
              styles.currentDayMarker,
              { left: `${currentProgress * 100}%` }
            ]}
          >
            <View style={styles.currentDayDot} />
            <Text style={styles.currentDayLabel}>Today</Text>
          </View>
        </View>

        {/* Milestones */}
        <View style={styles.milestonesContainer}>
          {milestones.map((milestone, idx) => (
            <View
              key={milestone.key}
              style={[
                styles.milestone,
                {
                  left: `${milestone.position}%`,
                  zIndex: milestone.critical ? 10 : 1
                }
              ]}
            >
              <View
                style={[
                  styles.milestoneDot,
                  {
                    backgroundColor: milestone.isPast ? '#5B8C5A' : milestone.critical ? '#C44536' : '#D4A72C',
                    width: milestone.critical ? 16 : 12,
                    height: milestone.critical ? 16 : 12
                  }
                ]}
              >
                {milestone.isPast && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text
                style={[
                  styles.milestoneLabel,
                  { color: milestone.critical ? '#C44536' : '#666' }
                ]}
              >
                {milestone.label}
              </Text>
              <Text style={styles.milestoneDay}>Day {milestone.day}</Text>
              {!milestone.isPast && milestone.daysUntil >= 0 && (
                <Text style={styles.milestoneDaysUntil}>
                  {milestone.daysUntil}d
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Month markers */}
        <View style={styles.monthMarkers}>
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 365].map((day, idx) => (
            <View
              key={day}
              style={[
                styles.monthMarker,
                { left: `${(day / 365) * 100}%` }
              ]}
            >
              <View style={styles.monthTick} />
              <Text style={styles.monthLabel}>
                {Math.floor(day / 30)}m
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#5B8C5A' }]} />
          <Text style={styles.legendText}>Completed</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#D4A72C' }]} />
          <Text style={styles.legendText}>Upcoming</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#C44536' }]} />
          <Text style={styles.legendText}>Critical</Text>
        </View>
      </View>
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
  scrollView: {
    height: 180
  },
  phasesContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    height: 40,
    flexDirection: 'row'
  },
  phaseBar: {
    position: 'absolute',
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderRadius: 4
  },
  phaseLabel: {
    fontSize: 10,
    fontWeight: '600'
  },
  timelineBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginTop: 90,
    position: 'relative'
  },
  timelineProgress: {
    height: 8,
    borderRadius: 4
  },
  currentDayMarker: {
    position: 'absolute',
    top: -8,
    alignItems: 'center',
    transform: [{ translateX: -2 }]
  },
  currentDayDot: {
    width: 4,
    height: 24,
    backgroundColor: '#1E3A5F',
    borderRadius: 2
  },
  currentDayLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1E3A5F',
    marginTop: 2
  },
  milestonesContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    height: 120
  },
  milestone: {
    position: 'absolute',
    alignItems: 'center',
    width: 60
  },
  milestoneDot: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  checkMark: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold'
  },
  milestoneLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center'
  },
  milestoneDay: {
    fontSize: 8,
    color: '#999',
    marginTop: 1
  },
  milestoneDaysUntil: {
    fontSize: 8,
    color: '#D4A72C',
    fontWeight: '600',
    marginTop: 1
  },
  monthMarkers: {
    marginTop: 12,
    height: 20,
    position: 'relative'
  },
  monthMarker: {
    position: 'absolute',
    alignItems: 'center'
  },
  monthTick: {
    width: 1,
    height: 8,
    backgroundColor: '#ccc'
  },
  monthLabel: {
    fontSize: 8,
    color: '#999',
    marginTop: 2
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0'
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4
  },
  legendText: {
    fontSize: 11,
    color: '#666'
  }
});
