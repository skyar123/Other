import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import { format } from 'date-fns';
import { SNIFF_CATEGORIES, NEED_STATUS_TYPES } from '../data/familyData';

export default function NotesAndSNIFF({ family, onSave }) {
  const [activeTab, setActiveTab] = useState('notes');
  const [notes, setNotes] = useState(family.notes || '');
  const [sniffData, setSniffData] = useState(family.needs || {});
  const [selectedCategory, setSelectedCategory] = useState('childDevelopment');

  const handleSaveNotes = () => {
    onSave({ ...family, notes });
    Alert.alert('Success', 'Notes saved successfully');
  };

  const handleSaveSNIFF = () => {
    onSave({ ...family, needs: sniffData });
    Alert.alert('Success', 'SNIFF updated successfully');
  };

  const updateNeedStatus = (needId, status) => {
    const updated = { ...sniffData };
    if (status === 'none') {
      delete updated[needId];
    } else {
      updated[needId] = {
        ...updated[needId],
        status,
        updatedAt: new Date().toISOString()
      };
    }
    setSniffData(updated);
  };

  const updateNeedNote = (needId, note) => {
    const updated = { ...sniffData };
    if (updated[needId]) {
      updated[needId] = { ...updated[needId], note };
    } else {
      updated[needId] = { note, status: 'wantsHelp' };
    }
    setSniffData(updated);
  };

  const togglePriority = (needId) => {
    const updated = { ...sniffData };
    if (updated[needId]) {
      updated[needId] = {
        ...updated[needId],
        priority: !updated[needId].priority
      };
      setSniffData(updated);
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notes' && styles.activeTab]}
          onPress={() => setActiveTab('notes')}
        >
          <Text style={[styles.tabText, activeTab === 'notes' && styles.activeTabText]}>
            📝 Notes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sniff' && styles.activeTab]}
          onPress={() => setActiveTab('sniff')}
        >
          <Text style={[styles.tabText, activeTab === 'sniff' && styles.activeTabText]}>
            📋 SNIFF
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'notes' ? (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Family Notes</Text>
            <Text style={styles.sectionSubtitle}>
              Clinical notes, observations, and important information
            </Text>

            <TextInput
              style={styles.notesInput}
              multiline
              numberOfLines={10}
              value={notes}
              onChangeText={setNotes}
              placeholder="Enter notes here...&#10;&#10;• Family dynamics&#10;• Clinical observations&#10;• Important contacts&#10;• Special considerations"
              placeholderTextColor="#999"
              textAlignVertical="top"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveNotes}>
              <Text style={styles.saveButtonText}>💾 Save Notes</Text>
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                💡 Tip: Include caregiver nicknames, bio parent info, household composition,
                behavioral triggers, and any special considerations
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.sniffSection}>
            <Text style={styles.sectionTitle}>SNIFF - Service Needs Inventory</Text>
            <Text style={styles.sectionSubtitle}>
              Last updated: {family.needs ? format(new Date(), 'MMM d, yyyy') : 'Not yet completed'}
            </Text>

            {/* Category selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
              {Object.entries(SNIFF_CATEGORIES).map(([key, cat]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.categoryTab,
                    selectedCategory === key && styles.activeCategoryTab
                  ]}
                  onPress={() => setSelectedCategory(key)}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text style={[
                    styles.categoryTabText,
                    selectedCategory === key && styles.activeCategoryTabText
                  ]}>
                    {cat.title.split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Selected category items */}
            <View style={styles.categoryContent}>
              <Text style={styles.categoryTitle}>
                {SNIFF_CATEGORIES[selectedCategory].icon} {SNIFF_CATEGORIES[selectedCategory].title}
              </Text>

              {SNIFF_CATEGORIES[selectedCategory].items.map((item) => {
                const currentNeed = sniffData[item.id];
                return (
                  <View key={item.id} style={styles.needItem}>
                    <View style={styles.needHeader}>
                      <Text style={styles.needName}>{item.name}</Text>
                      {currentNeed?.priority && (
                        <View style={styles.priorityBadge}>
                          <Text style={styles.priorityText}>!</Text>
                        </View>
                      )}
                    </View>

                    {/* Status selector */}
                    <View style={styles.statusButtons}>
                      {Object.entries(NEED_STATUS_TYPES).map(([statusKey, statusInfo]) => (
                        <TouchableOpacity
                          key={statusKey}
                          style={[
                            styles.statusButton,
                            currentNeed?.status === statusKey && {
                              backgroundColor: statusInfo.color,
                              borderColor: statusInfo.color
                            }
                          ]}
                          onPress={() => updateNeedStatus(item.id, statusKey)}
                        >
                          <Text style={[
                            styles.statusButtonText,
                            currentNeed?.status === statusKey && styles.statusButtonTextActive
                          ]}>
                            {statusInfo.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                      {currentNeed && (
                        <TouchableOpacity
                          style={styles.clearButton}
                          onPress={() => updateNeedStatus(item.id, 'none')}
                        >
                          <Text style={styles.clearButtonText}>✕</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Note input */}
                    {currentNeed && (
                      <View style={styles.noteSection}>
                        <TextInput
                          style={styles.noteInput}
                          placeholder="Add note (provider, referral status, etc.)"
                          placeholderTextColor="#999"
                          value={currentNeed.note || ''}
                          onChangeText={(text) => updateNeedNote(item.id, text)}
                        />
                        <TouchableOpacity
                          style={[
                            styles.priorityToggle,
                            currentNeed.priority && styles.priorityToggleActive
                          ]}
                          onPress={() => togglePriority(item.id)}
                        >
                          <Text style={styles.priorityToggleText}>
                            {currentNeed.priority ? '⚡ Priority' : 'Mark Priority'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveSNIFF}>
              <Text style={styles.saveButtonText}>💾 Save SNIFF Update</Text>
            </TouchableOpacity>

            <View style={styles.fidelityBox}>
              <Text style={styles.fidelityTitle}>📋 Fidelity Requirement</Text>
              <Text style={styles.fidelityText}>
                SNIFF must be completed at baseline, quarterly (every 90 days), and discharge
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f6f3'
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
    fontSize: 14,
    color: '#666'
  },
  activeTabText: {
    color: '#1E3A5F',
    fontWeight: '600'
  },
  content: {
    flex: 1
  },
  notesSection: {
    padding: 16
  },
  sniffSection: {
    padding: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A5F',
    marginBottom: 4
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16
  },
  notesInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16
  },
  saveButton: {
    backgroundColor: '#5B8C5A',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600'
  },
  infoBox: {
    backgroundColor: '#E8F0F7',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#1E3A5F'
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18
  },
  categoryTabs: {
    marginBottom: 16
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center'
  },
  activeCategoryTab: {
    backgroundColor: '#1E3A5F'
  },
  categoryIcon: {
    marginRight: 6,
    fontSize: 14
  },
  categoryTabText: {
    fontSize: 12,
    color: '#666'
  },
  activeCategoryTabText: {
    color: '#fff',
    fontWeight: '600'
  },
  categoryContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E3A5F',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  needItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5'
  },
  needHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  needName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    flex: 1
  },
  priorityBadge: {
    backgroundColor: '#C44536',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff'
  },
  statusButtonText: {
    fontSize: 11,
    color: '#666'
  },
  statusButtonTextActive: {
    color: '#fff',
    fontWeight: '600'
  },
  clearButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#f0f0f0'
  },
  clearButtonText: {
    fontSize: 11,
    color: '#999'
  },
  noteSection: {
    marginTop: 8
  },
  noteInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 10,
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 6
  },
  priorityToggle: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start'
  },
  priorityToggleActive: {
    backgroundColor: '#FDF8E7',
    borderWidth: 1,
    borderColor: '#D4A72C'
  },
  priorityToggleText: {
    fontSize: 11,
    color: '#666'
  },
  fidelityBox: {
    backgroundColor: '#E5F2F2',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2A7B7B'
  },
  fidelityTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2A7B7B',
    marginBottom: 4
  },
  fidelityText: {
    fontSize: 11,
    color: '#666',
    lineHeight: 16
  }
});
