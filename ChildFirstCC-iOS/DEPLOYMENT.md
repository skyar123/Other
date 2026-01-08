# iOS Deployment Guide - Child First CC

## Quick Start (Development)

### 1. Install Dependencies
```bash
cd ChildFirstCC-iOS
npm install
```

### 2. Run on iOS Simulator
```bash
npm run ios
```

### 3. Run on Physical Device
1. Install **Expo Go** from App Store
2. Run `npm start`
3. Scan QR code with Camera app

## Production Deployment

### Prerequisites
- Apple Developer Account ($99/year)
- Xcode 14+ installed on Mac
- Valid provisioning profile

### Method 1: Expo Build Service (Recommended)

#### Step 1: Configure App
Edit `app.json`:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.childfirst.cc",
      "buildNumber": "1.0.0"
    }
  }
}
```

#### Step 2: Build for TestFlight
```bash
expo build:ios -t archive
```

Choose:
- Let Expo handle certificates (easier)
- Or provide your own

#### Step 3: Download .ipa
Once build completes, download the .ipa file

#### Step 4: Upload to TestFlight
1. Open Xcode
2. Go to Window > Organizer
3. Click "Distribute App"
4. Upload to App Store Connect

### Method 2: EAS Build (New Expo System)

#### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

#### Step 2: Configure EAS
```bash
eas build:configure
```

#### Step 3: Build for iOS
```bash
eas build --platform ios
```

#### Step 4: Submit to App Store
```bash
eas submit --platform ios
```

## App Store Submission Checklist

### 1. App Information
- **App Name**: Child First CC Companion
- **Subtitle**: Family Caseload & Assessment Tracker
- **Category**: Medical / Productivity
- **Content Rating**: 17+ (Medical/Healthcare data)

### 2. Privacy Policy
Required for medical/healthcare apps. Must include:
- What data is collected
- How data is used
- Who has access
- HIPAA compliance statement

### 3. Screenshots Required
- 6.5" Display (iPhone 14 Pro Max): 3-8 screenshots
- 5.5" Display (iPhone 8 Plus): 3-8 screenshots
- 12.9" Display (iPad Pro): 3-8 screenshots

Recommended screenshots:
1. Dashboard with stats
2. Family list view
3. Year-long timeline
4. 60-day progress tracker
5. Family detail with alerts
6. SNIFF editor

### 4. App Store Description

**Short Description:**
Track Child First CC family caseloads with strict assessment timelines, fidelity alerts, and comprehensive documentation tools.

**Full Description:**
Child First CC Companion provides clinical care coordinators with powerful tools to manage family caseloads, track assessment deadlines, and maintain fidelity to program requirements.

**Key Features:**
- 📊 Year-long timeline visualization with all major milestones
- 📈 60-day baseline progress tracking with real-time completion status
- ⏰ Automatic fidelity alerts for overdue assessments
- 📋 Digital SNIFF (Service Needs Inventory) with priority tracking
- 📝 Clinical notes and family documentation
- ✍️ Unsigned document alerts
- 👨‍👩‍👧 Complete caseload management

Built specifically for Child First CC program fidelity requirements including baseline assessments, quarterly SNIFF updates, treatment plans, and 6-month follow-ups.

**Keywords:**
child first, clinical care coordination, assessment tracking, fidelity, case management, healthcare, social work, family services

### 5. App Review Information
**Notes for Reviewer:**
This app is designed for licensed clinical care coordinators working in the Child First CC program. It contains sample data for demonstration purposes.

**Demo Account:**
Username: demo@childfirst.cc
Password: demo2026

## Post-Deployment

### 1. TestFlight Beta Testing
1. Go to App Store Connect
2. Select your app
3. Go to TestFlight tab
4. Add internal testers (up to 100)
5. Share link or invite via email

### 2. Monitor Crashes
Use Expo's built-in error tracking:
```bash
expo diagnostics
```

### 3. Update App
When releasing updates:
1. Increment `buildNumber` in app.json
2. Run build command
3. Upload new version

## Troubleshooting

### Build Fails
```bash
expo doctor
```

### Certificate Issues
```bash
expo build:ios --clear-credentials
```

### App Rejected
Common reasons:
- Missing privacy policy
- Insufficient app functionality
- Crashes on startup
- Missing user data protection

## Security Considerations

⚠️ **IMPORTANT for Production:**

1. **Remove Sample Data**
   - Replace hardcoded `SKYLAR_CASELOAD` with API integration
   - Implement secure authentication

2. **Add Encryption**
   - Use `expo-secure-store` for sensitive data
   - Implement HTTPS-only API calls

3. **HIPAA Compliance**
   - Enable encryption at rest
   - Implement audit logging
   - Add session timeouts
   - Require strong passwords

4. **User Authentication**
   - Implement OAuth 2.0 or similar
   - Add biometric login (Face ID/Touch ID)
   - Session management

Example:
```javascript
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('userToken', token);
const token = await SecureStore.getItemAsync('userToken');
```

## Next Steps

1. **Backend Integration**
   - Create REST API for family data
   - Implement real-time sync
   - Add offline support

2. **Enhanced Features**
   - Push notifications for deadlines
   - Document upload/storage
   - Export reports to PDF
   - Calendar integration

3. **Analytics**
   - Track assessment completion rates
   - Monitor fidelity across caseload
   - Generate compliance reports

## Support

For deployment assistance:
- Expo Documentation: https://docs.expo.dev
- App Store Connect: https://appstoreconnect.apple.com
- Child First CC Technical Support: [contact info]
