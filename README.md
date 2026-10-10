# সুস্থায়ন (SUSTHAYAN)
> **"আপনার স্বাস্থ্য, আপনার সুরক্ষা, আপনার পরিবার — সর্বদা সংযুক্ত।"**  
> *"Your Health, Your Safety, Your Family — Always Connected."*

An integrated elderly healthcare, encrypted MediVault medical-record vault, nearby hospital discovery, live ICU bed availability, and 1-tap emergency ambulance coordination platform built specifically for elderly seniors living independently.

---

## 🌟 Key Features & Capabilities

### 1. 🏥 MediVault Medical Record Management
- **Categorized Document Archive**: Prescriptions, Blood Reports, Pathology, Diagnostic Scans, Hospital Discharge Summaries, Vaccinations, and Insurance cards.
- **256-Bit Encrypted Storage**: Secure upload, multi-zoom preview, download, and deletion.
- **Time-Limited Access Grants**: Generate temporary QR tokens (valid for 2h, 4h, 24h) with 1-tap revocation and immutable audit trails.
- **Medical Care Timeline**: Chronological interactive history separating user-entered events from certified laboratory reports.
- **Vital Health Summary**: Printable emergency summary with blood pressure & blood glucose trend charts (powered by Recharts).

### 2. 🚨 Rapid Emergency SOS & Family Network
- **1-Tap Emergency Trigger**: Senior-friendly 3-second countdown with immediate abort option.
- **Transparent Data Disclosure**: Granular breakdown of transmitted patient GPS coordinates, allergies, ongoing medications, and blood group.
- **Live Dispatch Tracking**: Multi-stage progress tracking (SOS Received ➔ Bed Allocated ➔ Ambulance Dispatched ➔ Pickup In Progress ➔ Completed).
- **Direct 112 / 108 Hotline Shortcut**: One-click direct calling to national emergency numbers.
- **Indian DLT SMS Gateway Simulation**: Automated SMS notifications to registered guardians and local neighbors.

### 3. 🗺️ Nearby Hospital Radar & Route Calculation
- **GPS Discovery**: Multi-radius filtering (1 km, 3 km, 5 km, 10 km, 25 km).
- **Interactive Radar Map**: Real-time visualization of surrounding hospitals, driving distance (km), and estimated travel time (mins).
- **Verified Partner vs Public Places**: Clear distinction between platform-verified partner hospitals and general map listings.

### 4. 🛏️ Live ICU & Ward Bed Management
- **Hospital Emergency Portal**: Dedicated triage interface for duty doctors and nurses.
- **Bed Statuses**: `AVAILABLE`, `UNAVAILABLE`, `UNKNOWN` with staff accountability timestamps.
- **Bed Categories**: ICU, CCU, HDU, General Ward, NICU, Oxygen-Supported beds.

### 5. 🚑 Ambulance Fleet Coordination
- **Fleet Dispatcher**: Real-time tracking of vehicle registration numbers, ALS driver details, and contact numbers.
- **Status Workflow**: `REQUESTED` ➔ `ACKNOWLEDGED` ➔ `DISPATCHED` ➔ `PICKUP_IN_PROGRESS` ➔ `COMPLETED`.

### 6. ♿ Senior-Friendly & Bilingual Accessibility
- **Full Bengali (বাংলা) & English Support**: Instant toggle across all 25 screens with Unicode rendering.
- **Senior Font Magnifier**: Quick A, A+, A++ font scaling controls.
- **Voice Read-Aloud**: Web Speech API integration for audio narration of medical summaries.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **Charts**: Recharts
- **State & Persistence**: Reactive Context Store with LocalStorage cache + Firebase Auth / Firestore config options
- **Backend / Services**: Firebase Auth, Cloud Firestore, Firebase Storage & DLT-compliant SMS Service

---

## 📂 Project Structure

```
├── src/
│   ├── components/
│   │   ├── Navbar.tsx                   # Top navigation with SOS, Language & Accessibility tools
│   │   ├── Footer.tsx                   # Emergency numbers (112, 108, 14567) and legal links
│   │   └── ToastContainer.tsx           # Floating real-time alert notifications
│   ├── context/
│   │   ├── AppContext.tsx               # Reactive application store, emergency workflow & roles
│   │   └── LanguageContext.tsx          # Bengali/English i18n & Voice narration provider
│   ├── data/
│   │   └── mockData.ts                  # Multi-hospital verified records & emergency demo datasets
│   ├── pages/
│   │   ├── LandingPage.tsx              # Hero, problem breakdown, 6 core feature cards & CTAs
│   │   ├── PatientDashboard.tsx         # 6 quick action cards, active SOS banner, vital summary
│   │   ├── MedicalVault.tsx             # Complete MediVault document organizer & filters
│   │   ├── UploadMedicalDocument.tsx    # Drag-and-drop document upload with validation
│   │   ├── DocumentPreviewModal.tsx     # Full document viewer, zoom, print & audit trail
│   │   ├── MedicalTimeline.tsx          # Chronological consultations & surgeries stream
│   │   ├── MedicalSummary.tsx           # Printable summary with Vitals trend history chart
│   │   ├── InsuranceVault.tsx           # Swasthya Sathi, Mediclaim & Ayushman Bharat vault
│   │   ├── IdDocumentVault.tsx          # Masked Aadhaar & PAN DPDP-compliant manager
│   │   ├── ShareMedicalRecords.tsx      # Time-limited token generator & revocation table
│   │   ├── NearbyHospitalFinder.tsx     # GPS radar map with driving distance & travel times
│   │   ├── EmergencySOS.tsx             # 3s countdown SOS trigger & data disclosure breakdown
│   │   ├── EmergencyTracking.tsx        # Multi-stage live progress & ambulance tracker
│   │   ├── EmergencyContacts.tsx        # Family guardians, local neighbors & doctors
│   │   ├── NotificationCentre.tsx       # Filterable alerts & Indian DLT SMS simulation
│   │   ├── HospitalEmergencyDashboard.tsx # Doctor portal for incoming SOS & bed assignment
│   │   ├── BedAvailabilityManagement.tsx # Live ICU / CCU / Ward bed status updater
│   │   ├── AmbulanceCoordination.tsx    # Paramedic fleet dispatch & driver comms
│   │   ├── AdminDashboard.tsx           # Hospital verification & immutable audit logs
│   │   ├── PrivacyAndConsentSettings.tsx # Granular consent, ZIP archive export & deletion
│   │   ├── HelpAndEmergencyInfo.tsx     # National emergency numbers & first-aid protocols
│   │   ├── PatientRegistration.tsx      # Senior-friendly signup with caregiver co-sign
│   │   └── PatientLogin.tsx             # Role-based login with password reset
│   ├── services/
│   │   ├── firebaseConfig.ts            # Firebase credentials & demo fallback
│   │   └── smsService.ts                # DLT-compliant emergency SMS formatters
│   ├── types/
│   │   └── index.ts                     # TypeScript data schemas and interface models
│   └── i18n/
│       └── translations.ts              # Bengali & English dictionaries
```

---

## 🚀 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

3. Build production bundle:
   ```bash
   npm run build
   ```

---

## 🔒 Security & Privacy Notes

- **Data Minimization**: Only masked Aadhaar (`XXXX-XXXX-1234`) and PAN details are accepted and shown.
- **Time-Limited Grants**: Patient records are shared via short-lived token grants, not permanent public URLs.
- **Audit Logging**: Every emergency record inspection and bed allocation is tracked with timestamps and actor identities.
