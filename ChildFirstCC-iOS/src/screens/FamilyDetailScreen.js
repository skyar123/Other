import React, { useState } from 'react';
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
import YearLongTimeline from '../components/YearLongTimeline';
import SixtyDayProgress from '../components/SixtyDayProgress';
import NotesAndSNIFF from '../components/NotesAndSNIFF';

export default function FamilyDetailScreen({ route, navigation }) {
  const { familyId } = route.params;
  const [family, setFamily] = useState(SKYLAR_CASELOAD.find(f => f.id === familyId));
  const [activeTab, setActiveTab] = useState('overview');

  if (!family) {
    return (
      <View style={styles.container}>
        <Text>Family not found</Text>
      </View>
    );
  }

  const currentDate = new Date('2026-01-07');
  const days = differenceInDays(currentDate, new Date(family.admissionDate));
  const overdueAssessments = getOverdueAssessments(family, currentDate);

  const handleSave = (updatedFamily) => {
    setFamily(updatedFamily);
    // In a real app, this would save to a database or API
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerContent}>
          <View style={[styles.avatar, { backgroundColor: family.avatarColor }]}>
            <Text style={styles.avatarText}>{family.codeName.charAt(0)}</Text>
          </View>
          <View style={styles.headerInfo}>
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>{family.codeName}</Text>
              <View style={[styles.phaseBadge, family.phase === 'baseline' && styles.phaseBadgeBaseline]}>
                <Text style={styles.phaseBadgeText}>{family.phase}</Text>
              </View>
              {family.isTwin && (
                <View style={styles.twinBadge}>
                  <Text style={styles.twinBadgeText}>Twin</Text>
                </View>
              )}
            </View>
            <Text style={styles.headerSubtitle}>
              {family.caregiver} • {family.child} ({family.childAge}) • Day {days}
            </Text>
            <Text style={styles.headerDiagnosis}>
              {family.diagnosis || 'No diagnosis yet'}
            </Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'timeline' && styles.activeTab]}
          onPress={() => setActiveTab('timeline')}
        >
          <Text style={[styles.tabText, activeTab === 'timeline' && styles.activeTabText]}>
            Timeline
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notes' && styles.activeTab]}
          onPress={() => setActiveTab('notes')}
        >
          <Text style={[styles.tabText, activeTab === 'notes' && styles.activeTabText]}>
            Notes/SNIFF
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'overview' && (
          <>
            {/* Alerts */}
            {overdueAssessments.length > 0 && (
              <View style={styles.alertCard}>
                <Text style={styles.alertTitle}>🚨 Fidelity Alerts</Text>
                {overdueAssessments.slice(0, 5).map((assessment, idx) => (
                  <View key={idx} style={styles.alertItem}>
                    <Text style={styles.alertItemText}>
                      • {assessment.name} - {assessment.daysOverdue} days overdue
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Unsigned Documents */}
            {family.unsignedDocs && family.unsignedDocs.length > 0 && (
              <View style={styles.unsignedCard}>
                <Text style={styles.unsignedTitle}>✍️ Unsigned Documents</Text>
                {family.unsignedDocs.map((doc, idx) => (
                  <Text key={idx} style={styles.unsignedDoc}>• {doc}</Text>
                ))}
              </View>
            )}

            {/* 60-Day Progress */}
            <SixtyDayProgress family={family} currentDate={currentDate} />

            {/* Quick Info */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Family Information</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Therapist</Text>
                  <Text style={styles.infoValue}>{family.therapist}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>DOB</Text>
                  <Text style={styles.infoValue}>{family.childDOB}</Text>
                </View>
                {family.isTwin && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Twin of</Text>
                    <Text style={styles.infoValue}>{family.twinOf}</Text>
                  </View>
                )}
                {family.relationship && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Relationship</Text>
                    <Text style={styles.infoValue}>{family.relationship}</Text>
                  </View>
                )}
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>CCIS</Text>
                  <Text style={styles.infoValue}>{family.ccisObservations}/4</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>HOPE</Text>
                  <Text style={styles.infoValue}>{family.hopeObservations}/3</Text>
                </View>
              </View>
              {family.notes && (
                <View style={styles.notesBox}>
                  <Text style={styles.notesBoxTitle}>Clinical Notes</Text>
                  <Text style={styles.notesBoxText}>{family.notes}</Text>
                </View>
              )}
            </View>
          </>
        )}

        {activeTab === 'timeline' && (
          <>
            <YearLongTimeline family={family} currentDate={currentDate} />
            <SixtyDayProgress family={family} currentDate={currentDate} />
          </>
        )}

        {activeTab === 'notes' && (
          <NotesAndSNIFF family={family} onSave={handleSave} />
        )}
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
    backgroundColor: '#1E3A5F',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16
  },
  headerTop: {
    marginBottom: 12
  },
  backButton: {
    color: '#fff',
    fontSize: 16
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600'
  },
  headerInfo: {
    flex: 1
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff'
  },
  phaseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  phaseBadgeBaseline: {
    backgroundColor: '#D4A72C'
  },
  phaseBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600'
  },
  twinBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: '#7B1FA2'
  },
  twinBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600'
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 2
  },
  headerDiagnosis: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)'
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  activeTab: {
    borderBottomColor: '#1E3A5F'
  },
  tabText: {
    fontSize: 13,
    color: '#666'
  },
  activeTabText: {
    color: '#1E3A5F',
    fontWeight: '600'
  },
  content: {
    flex: 1
  },
  alertCard: {
    backgroundColor: '#FCEAE8',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#C44536'
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C44536',
    marginBottom: 8
  },
  alertItem: {
    marginBottom: 4
  },
  alertItemText: {
    fontSize: 12,
    color: '#666'
  },
  unsignedCard: {
    backgroundColor: '#FDF8E7',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#D4A72C'
  },
  unsignedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#b8860b',
    marginBottom: 6
  },
  unsignedDoc: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
    marginBottom: 14
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16
  },
  infoItem: {
    minWidth: '45%'
  },
  infoLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 3
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333'
  },
  notesBox: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0'
  },
  notesBoxTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6
  },
  notesBoxText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20
  }
});
