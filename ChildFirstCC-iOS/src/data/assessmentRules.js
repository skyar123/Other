// STRICT ASSESSMENT SCHEDULE RULES - Child First CC Fidelity Requirements

export const TIMELINE_MILESTONES = {
  // Baseline Period (0-60 days)
  INTAKE: { day: 0, label: 'Intake', required: true },
  INITIAL_SNIFF: { day: 0, maxDay: 14, label: 'Initial SNIFF', required: true },
  INITIAL_CCA: { day: 0, maxDay: 14, label: 'Initial CCA', required: true },
  BASELINE_ASSESSMENTS_START: { day: 0, maxDay: 14, label: 'Start Baseline Assessments', required: true },
  BASELINE_COMPLETE: { day: 60, label: '60-Day Baseline Complete', required: true, critical: true },

  // Intervention Period
  NINETY_DAY_TX_PLAN: { day: 90, label: '90-Day Treatment Plan', required: true },
  SNIFF_QUARTERLY_1: { day: 90, label: 'Quarterly SNIFF Update', required: true },
  SIX_MONTH_ASSESSMENTS: { day: 180, label: '6-Month Follow-Up', required: true, critical: true },
  SNIFF_QUARTERLY_2: { day: 180, label: 'Quarterly SNIFF Update', required: true },
  NINE_MONTH_TX_PLAN: { day: 270, label: '9-Month Treatment Plan', required: true },
  SNIFF_QUARTERLY_3: { day: 270, label: 'Quarterly SNIFF Update', required: true },
  TWELVE_MONTH_REVIEW: { day: 365, label: '12-Month Review', required: true, critical: true },
};

export const ASSESSMENT_SCHEDULE = {
  // CORE INTAKE - Week 1-60 days
  coreIntake: {
    title: 'Core Intake',
    timing: { minDay: 0, maxDay: 60 },
    phase: 'baseline',
    color: '#1565C0',
    items: [
      {
        id: 'intake',
        name: 'Intake & Clinical Formulation',
        entry: 'CFCR',
        required: true,
        deadline: { day: 7, critical: true },
        description: 'Complete initial intake and clinical formulation within first week'
      },
      {
        id: 'sniff',
        name: 'SNIFF',
        entry: 'CFCR',
        required: true,
        deadline: { day: 14, critical: true },
        recurring: { frequency: 90, label: 'Quarterly' },
        description: 'Service Needs Inventory - update quarterly (every 90 days)'
      },
      {
        id: 'pq',
        name: 'Parent Questionnaire',
        entry: 'CFCR',
        required: true,
        deadline: { day: 14, critical: true }
      }
    ]
  },

  // CHILD DEVELOPMENT - 60 days
  childDevelopment: {
    title: 'Child Development',
    timing: { minDay: 0, maxDay: 60 },
    phase: 'baseline',
    color: '#00838F',
    items: [
      {
        id: 'asq3',
        name: 'ASQ-3',
        entry: 'ASD',
        required: true,
        deadline: { day: 60, critical: true },
        recurring: { frequency: 180, label: '6-Month' },
        description: 'Ages & Stages Questionnaire - repeat at 6 months'
      },
      {
        id: 'sensory',
        name: 'Sensory Profile',
        entry: 'ASD',
        condition: 'If sensory concerns identified',
        deadline: { day: 60 }
      },
      {
        id: 'mchat',
        name: 'M-CHAT-R/F',
        entry: 'ASD',
        condition: 'Ages 16-30 months OR autism concerns',
        deadline: { day: 60 }
      }
    ]
  },

  // SOCIAL-EMOTIONAL - 60 days
  socialEmotional: {
    title: 'Social-Emotional',
    timing: { minDay: 0, maxDay: 60 },
    phase: 'baseline',
    color: '#00838F',
    items: [
      {
        id: 'bitsea',
        name: 'BITSEA',
        entry: 'ASD',
        ageRange: '12-35 months',
        deadline: { day: 60, critical: true },
        recurring: { frequency: 180, label: '6-Month' },
        description: 'Brief Infant-Toddler Social Emotional Assessment'
      },
      {
        id: 'pkbs',
        name: 'PKBS-2',
        entry: 'ASD',
        ageRange: '36-72 months',
        deadline: { day: 60, critical: true },
        recurring: { frequency: 180, label: '6-Month' },
        description: 'Preschool and Kindergarten Behavior Scales'
      }
    ]
  },

  // CAREGIVER WELLBEING - 60 days
  caregiverWellbeing: {
    title: 'Caregiver Wellbeing',
    timing: { minDay: 0, maxDay: 60 },
    phase: 'baseline',
    color: '#6A1B9A',
    items: [
      {
        id: 'psi',
        name: 'PSI-4-SF',
        entry: 'ASD',
        required: true,
        deadline: { day: 60, critical: true },
        recurring: { frequency: 180, label: '6-Month' },
        description: 'Parenting Stress Index - Short Form'
      },
      {
        id: 'cesd',
        name: 'CESD-R',
        entry: 'CFCR',
        required: true,
        deadline: { day: 60, critical: true },
        recurring: { frequency: 180, label: '6-Month' },
        description: 'Center for Epidemiologic Studies Depression Scale'
      }
    ]
  },

  // TRAUMA ASSESSMENT - 60 days
  traumaAssessment: {
    title: 'Trauma',
    timing: { minDay: 0, maxDay: 60 },
    phase: 'baseline',
    color: '#C62828',
    items: [
      {
        id: 'tesi',
        name: 'TESI-PRR',
        entry: 'CFCR',
        required: true,
        deadline: { day: 60, critical: true },
        description: 'Traumatic Events Screening Inventory - Parent Report Revised'
      },
      {
        id: 'lscr',
        name: 'LSC-R',
        entry: 'CFCR',
        required: true,
        deadline: { day: 60, critical: true },
        description: 'Life Stressor Checklist - Revised'
      },
      {
        id: 'pcl5',
        name: 'PCL-5',
        entry: 'CFCR',
        required: true,
        deadline: { day: 60, critical: true },
        recurring: { frequency: 180, label: '6-Month' },
        description: 'PTSD Checklist for DSM-5'
      }
    ]
  },

  // OBSERVATIONAL - Ongoing throughout baseline
  observational: {
    title: 'Observational',
    timing: { minDay: 0, maxDay: 60 },
    phase: 'baseline',
    color: '#2E7D32',
    items: [
      {
        id: 'ccis',
        name: 'CCIS',
        entry: 'CFCR',
        required: true,
        observations: { required: 4, minPerWeek: 1 },
        deadline: { day: 60, critical: true },
        recurring: { frequency: 180, label: '6-Month', observations: 4 },
        description: 'Complete 4 observations before day 60, then 4 more at 6 months'
      },
      {
        id: 'hope',
        name: 'HOPE',
        entry: 'CFCR',
        required: true,
        observations: { required: 3, spacing: 'weekly' },
        deadline: { day: 21, critical: true },
        description: '3 observations over 3 consecutive weeks'
      }
    ]
  },

  // ADDITIONAL BASELINE
  additionalBaseline: {
    title: 'Additional Baseline',
    timing: { minDay: 0, maxDay: 60 },
    phase: 'baseline',
    color: '#455A64',
    items: [
      { id: 'caregiver_a', name: 'Caregiver A', entry: 'CFCR', required: true, deadline: { day: 60 } },
      { id: 'ycpc', name: 'YCPC', entry: 'CFCR', deadline: { day: 60 } },
      { id: 'wmci', name: 'WMCI', entry: 'CFCR', deadline: { day: 60 } },
      { id: 'angels', name: 'Angels', entry: 'CFCR', deadline: { day: 60 } }
    ]
  },

  // 6-MONTH FOLLOW-UP (Day 180)
  sixMonthFollowUp: {
    title: '6-Month Follow-Up',
    timing: { day: 180, windowStart: 165, windowEnd: 195 },
    phase: 'intervention',
    color: '#7B1FA2',
    items: [
      {
        id: 'asq3_6',
        name: 'ASQ-3',
        entry: 'ASD',
        required: true,
        deadline: { day: 180, critical: true, window: 15 }
      },
      {
        id: 'socialemotional_6',
        name: 'BITSEA/PKBS (age-appropriate)',
        entry: 'ASD',
        required: true,
        deadline: { day: 180, critical: true, window: 15 }
      },
      {
        id: 'ccis_6',
        name: 'CCIS (4 observations)',
        entry: 'CFCR',
        required: true,
        observations: { required: 4 },
        deadline: { day: 180, critical: true }
      },
      {
        id: 'psi_6',
        name: 'PSI-4-SF',
        entry: 'ASD',
        required: true,
        deadline: { day: 180, critical: true, window: 15 }
      },
      {
        id: 'cesd_6',
        name: 'CESD-R',
        entry: 'CFCR',
        required: true,
        deadline: { day: 180, critical: true, window: 15 }
      },
      {
        id: 'pcl5_6',
        name: 'PCL-5',
        entry: 'CFCR',
        required: true,
        deadline: { day: 180, critical: true, window: 15 }
      }
    ]
  },

  // TREATMENT PLANS
  treatmentPlans: {
    title: 'Treatment Plans',
    phase: 'ongoing',
    color: '#F57C00',
    items: [
      {
        id: 'initial_tx_plan',
        name: 'Initial Treatment Plan',
        entry: 'CFCR',
        required: true,
        deadline: { day: 14, critical: true },
        description: 'Complete within 2 weeks of admission'
      },
      {
        id: 'sixty_day_tx_plan',
        name: '60-Day Treatment Plan Review',
        entry: 'CFCR',
        required: true,
        deadline: { day: 60, critical: true }
      },
      {
        id: 'ninety_day_tx_plan',
        name: '90-Day Treatment Plan',
        entry: 'CFCR',
        required: true,
        deadline: { day: 90, critical: true },
        recurring: { frequency: 90, label: 'Quarterly' }
      }
    ]
  }
};

// FIDELITY RULES
export const FIDELITY_RULES = {
  BASELINE_PERIOD: {
    duration: 60,
    description: 'All baseline assessments must be completed within 60 days of admission',
    criticalDeadlines: [
      { item: 'intake', day: 7, penalty: 'Chart audit flag' },
      { item: 'sniff', day: 14, penalty: 'Fidelity violation' },
      { item: 'initial_tx_plan', day: 14, penalty: 'Fidelity violation' },
      { item: 'ccis', day: 60, observations: 4, penalty: 'Baseline incomplete' },
      { item: 'hope', day: 21, observations: 3, penalty: 'Baseline incomplete' }
    ]
  },

  SNIFF_UPDATES: {
    frequency: 90,
    tolerance: 7,
    description: 'SNIFF must be updated every 90 days (±7 days)',
    required: ['baseline', 'quarterly', 'discharge']
  },

  TREATMENT_PLANS: {
    initial: { day: 14, critical: true },
    sixty_day: { day: 60, critical: true },
    quarterly: { frequency: 90, critical: true },
    description: 'Treatment plans required at specific intervals'
  },

  SIX_MONTH_ASSESSMENTS: {
    window: { start: 165, end: 195 },
    description: '6-month assessments due between day 165-195',
    required: ['asq3', 'socialemotional', 'ccis', 'psi', 'cesd', 'pcl5']
  },

  OBSERVATIONS: {
    ccis: {
      baseline: { required: 4, deadline: 60 },
      sixMonth: { required: 4, deadline: 180 }
    },
    hope: {
      required: 3,
      spacing: 'weekly',
      deadline: 21,
      description: '3 observations over 3 consecutive weeks'
    }
  },

  DOCUMENTATION: {
    unsigned_docs_tolerance: 7,
    description: 'Documents must be signed within 7 days of completion',
    critical_docs: ['treatment_plan', 'cca', 'caregiver_a']
  }
};

// Calculate timeline for a family
export function calculateFamilyTimeline(admissionDate) {
  const timeline = [];
  const baseDate = new Date(admissionDate);

  // Add all milestones
  Object.entries(TIMELINE_MILESTONES).forEach(([key, milestone]) => {
    const milestoneDate = new Date(baseDate);
    milestoneDate.setDate(milestoneDate.getDate() + milestone.day);

    timeline.push({
      key,
      ...milestone,
      date: milestoneDate,
      dateString: milestoneDate.toISOString().split('T')[0]
    });
  });

  // Sort by day
  return timeline.sort((a, b) => a.day - b.day);
}

// Check if assessment is overdue
export function isAssessmentOverdue(admissionDate, assessmentId, currentDate = new Date()) {
  const admission = new Date(admissionDate);
  const current = new Date(currentDate);
  const daysSinceAdmission = Math.floor((current - admission) / (1000 * 60 * 60 * 24));

  // Find the assessment in the schedule
  for (const category of Object.values(ASSESSMENT_SCHEDULE)) {
    const item = category.items.find(i => i.id === assessmentId);
    if (item && item.deadline) {
      return daysSinceAdmission > item.deadline.day;
    }
  }

  return false;
}

// Get all overdue assessments for a family
export function getOverdueAssessments(family, currentDate = new Date()) {
  const overdue = [];
  const admission = new Date(family.admissionDate);
  const current = new Date(currentDate);
  const daysSinceAdmission = Math.floor((current - admission) / (1000 * 60 * 60 * 24));

  for (const category of Object.values(ASSESSMENT_SCHEDULE)) {
    for (const item of category.items) {
      if (item.required && item.deadline) {
        const isComplete = family.completedDocs?.includes(item.id);
        const isPastDeadline = daysSinceAdmission > item.deadline.day;

        if (!isComplete && isPastDeadline) {
          overdue.push({
            ...item,
            category: category.title,
            daysOverdue: daysSinceAdmission - item.deadline.day
          });
        }
      }
    }
  }

  return overdue;
}

export default {
  TIMELINE_MILESTONES,
  ASSESSMENT_SCHEDULE,
  FIDELITY_RULES,
  calculateFamilyTimeline,
  isAssessmentOverdue,
  getOverdueAssessments
};
