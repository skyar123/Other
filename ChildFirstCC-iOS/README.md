# Child First CC - iOS Assessment Timeline App

A comprehensive iOS application for tracking Child First CC family caseloads, assessments, and fidelity requirements with strict timeline enforcement.

## Features

### 📊 Year-Long Timeline Visualization
- Interactive scrollable timeline showing all major milestones across 365 days
- Visual phase indicators (Baseline, Early Intervention, Mid-Treatment, Discharge Prep)
- Critical milestone markers with completion status
- Real-time "current day" indicator
- Color-coded progress (completed, upcoming, overdue)

### 📈 60-Day Baseline Progress Tracking
- Comprehensive progress bar for 60-day baseline period
- Assessment completion breakdown:
  - Required assessments tracking
  - CCIS observations (4 required)
  - HOPE observations (3 required over 3 weeks)
- Overall baseline completion percentage
- Real-time alerts for overdue items

### 📋 Strict Assessment Schedule Enforcement
Based on Child First CC fidelity requirements:

**Core Intake (0-60 days):**
- Intake & Clinical Formulation (Day 7)
- SNIFF (Day 14, then quarterly)
- Parent Questionnaire (Day 14)

**Child Development:**
- ASQ-3 (required, 6-month follow-up)
- M-CHAT-R/F (if indicated)
- Sensory Profile (if indicated)

**Social-Emotional:**
- BITSEA (12-35 months) or PKBS-2 (36-72 months)
- 6-month follow-up required

**Caregiver Wellbeing:**
- PSI-4-SF (required, 6-month follow-up)
- CESD-R (required, 6-month follow-up)

**Trauma:**
- TESI-PRR (required)
- LSC-R (required)
- PCL-5 (required, 6-month follow-up)

**Observational:**
- CCIS: 4 observations before Day 60
- HOPE: 3 observations over 3 consecutive weeks (Day 21 deadline)

**Treatment Plans:**
- Initial: Day 14
- 60-Day Review: Day 60
- Quarterly: Every 90 days

**6-Month Assessments (Day 180 ±15 days):**
- ASQ-3, Social-Emotional, CCIS (4 obs), PSI-4-SF, CESD-R, PCL-5

### 📝 Notes & SNIFF Management
- Rich text note-taking for family observations
- Digital SNIFF (Service Needs Inventory) tracking
- Category-based need organization:
  - Child Development & Early Education
  - Child Behavior & Emotions
  - Child Health
  - Caregiver Support
  - Family Health
  - Adult Mental Health
  - Social Services & Concrete Needs
- Status tracking: Has, Wants, In Progress, Connected
- Priority flagging for critical needs
- Individual notes per service need

### 👨‍👩‍👧 Family Management
- Complete caseload overview (8 families)
- Individual family detail screens
- Real-time fidelity alerts
- Unsigned document tracking
- Twin family handling
- Kinship care indicators

## Installation

### Prerequisites
- Node.js 16+ and npm
- Xcode 14+ (for iOS development)
- Expo CLI (`npm install -g expo-cli`)

### Setup
```bash
cd ChildFirstCC-iOS
npm install
```

### Run on iOS
```bash
npm run ios
```

This will:
1. Start the Metro bundler
2. Launch iOS Simulator
3. Build and run the app

### Run on Device
1. Install Expo Go from the App Store
2. Run `npm start`
3. Scan the QR code with your camera

## Build for Production

### iOS App Store Build
```bash
expo build:ios
```

Follow the prompts to:
1. Sign in to your Apple Developer account
2. Configure app signing
3. Build the app bundle
4. Download the .ipa file for submission

## Project Structure

```
ChildFirstCC-iOS/
├── App.js                          # Main navigation setup
├── src/
│   ├── components/
│   │   ├── YearLongTimeline.js     # 365-day timeline visualization
│   │   ├── SixtyDayProgress.js     # 60-day baseline tracker
│   │   └── NotesAndSNIFF.js        # Notes & SNIFF editor
│   ├── screens/
│   │   ├── DashboardScreen.js      # Main dashboard
│   │   ├── FamilyListScreen.js     # All families list
│   │   └── FamilyDetailScreen.js   # Individual family view
│   └── data/
│       ├── assessmentRules.js      # Fidelity rules & schedule
│       └── familyData.js           # Skylar's caseload data
├── app.json                        # Expo configuration
└── package.json                    # Dependencies
```

## Fidelity Rules

The app strictly enforces Child First CC fidelity requirements:

- **60-Day Baseline**: All baseline assessments must be completed within 60 days
- **SNIFF Updates**: Every 90 days (±7 days tolerance)
- **Treatment Plans**: Initial (Day 14), 60-Day (Day 60), then quarterly
- **6-Month Assessments**: Window of Day 165-195
- **Observations**: CCIS (4 before Day 60), HOPE (3 over 3 weeks)
- **Documentation**: Documents must be signed within 7 days

## Key Features

### Timeline Milestones
- Intake (Day 0)
- Initial SNIFF (Day 0-14)
- Initial CCA (Day 0-14)
- Baseline Complete (Day 60) ⚠️ CRITICAL
- 90-Day Treatment Plan (Day 90)
- 6-Month Assessments (Day 180) ⚠️ CRITICAL
- 9-Month Treatment Plan (Day 270)
- 12-Month Review (Day 365) ⚠️ CRITICAL

### Color Coding
- 🟢 Green: Completed / On Track
- 🟡 Yellow: Due Soon / Warning
- 🔴 Red: Overdue / Critical

## Current Caseload (Skylar Belt, FRP)

1. **Turtle** (Royce Molina) - Day 22, Baseline - 4 critical needs
2. **Firecracker** (Kaizen Reyes) - Day 174, Intervention - 6-month due
3. **Bubbles** (Ezra Guernsey) - Day 280, Intervention - Well-documented
4. **Mermaid** (Harlie Yoder) - Day 265, Intervention - DMDD
5. **Puppy** (Grace Proffitt) - Day 23, Baseline - Twin
6. **Peanut** (Kayden Proffitt) - Day 23, Baseline - Twin
7. **Fairy** (Nylah Harper) - Day 37, Baseline - Trauma dx
8. **Milkshake** (Paxton Cody) - Day 22, Baseline - No dx yet

## Support

For issues or questions, contact the development team or refer to Child First CC documentation.

## License

Proprietary - Child First CC Internal Use Only
