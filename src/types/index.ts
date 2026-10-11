export type UserRole = 'patient' | 'hospital_staff' | 'admin';

export type Language = 'bn' | 'en';

export type LocationArea = 'Panihati, West Bengal' | 'Dum Dum, West Bengal';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type BedStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'UNKNOWN';

export type BedCategoryType = 'ICU' | 'CCU' | 'HDU' | 'GENERAL_WARD' | 'EMERGENCY_DEPT' | 'NICU' | 'OXYGEN_SUPPORTED';

export type DocumentCategory = 
  | 'prescriptions'
  | 'blood_reports'
  | 'diagnostic_reports'
  | 'hospital_records'
  | 'discharge_summaries'
  | 'insurance'
  | 'health_schemes'
  | 'id_documents'
  | 'other';

export type EmergencyRequestStatus = 
  | 'SUBMITTED'
  | 'PENDING'
  | 'PENDING_REVIEW'
  | 'AWAITING_RESPONSE'
  | 'UNDER_ASSESSMENT'
  | 'UNDER_REVIEW'
  | 'MORE_INFORMATION_REQUIRED'
  | 'ACCEPTED_FOR_COORDINATION'
  | 'ACCEPTED'
  | 'AUTOMATICALLY_FORWARDED'
  | 'UNABLE_TO_ACCOMMODATE'
  | 'NO_ELIGIBLE_HOSPITALS'
  | 'REJECTED'
  | 'DECLINED'
  | 'BED_CONFIRMATION_PENDING'
  | 'ADMISSION_CONFIRMED'
  | 'REFERRED_TO_ANOTHER_FACILITY'
  | 'REDIRECTED'
  | 'TIMED_OUT'
  | 'CANCELLED'
  | 'BED_CONFIRMED'
  | 'AMBULANCE_REQUESTED'
  | 'AMBULANCE_DISPATCHED'
  | 'PICKUP_IN_PROGRESS'
  | 'COMPLETED';

export interface AutoRerouteHistoryEntry {
  attemptNumber: number;
  hospitalId: string;
  hospitalName: string;
  timestamp: string;
  status: 'SUBMITTED' | 'FORWARDED' | 'DECLINED' | 'ACCEPTED' | 'AWAITING_RESPONSE';
  declineReason?: string;
  respondedAt?: string;
  notes?: string;
}

export type TriagePriority = 'P1_RESUSCITATION' | 'P2_EMERGENT' | 'P3_URGENT' | 'P4_STANDARD';

export type HospitalDepartment =
  | 'Emergency Department'
  | 'General Medicine'
  | 'Cardiology'
  | 'Neurology'
  | 'Respiratory Medicine'
  | 'Trauma and Orthopaedics'
  | 'Other'
  | 'Undetermined';

export interface HospitalClinicalAssessment {
  notes: string;
  triagePriority: TriagePriority;
  suspectedCareRequirement?: string;
  recommendedDepartment: HospitalDepartment;
  icuAssessmentRequired: 'Yes' | 'No' | 'Undetermined';
  bedRequirement: 'ICU' | 'Emergency Department' | 'General Ward' | 'Other' | 'Undetermined';
  bedConfirmedStatus?: 'CONFIRMED' | 'UNCONFIRMED' | 'NOT_AVAILABLE' | 'PENDING';
  additionalInfoRequired?: string;
  assessedByStaffName: string;
  assessedByStaffId: string;
  assessmentTimestamp: string;
  decision?: 'ACCEPTED' | 'UNABLE_TO_ACCOMMODATE' | 'MORE_INFO_REQUESTED' | 'ADMISSION_CONFIRMED';
  decisionReason?: string;
}

export interface ClarificationMessage {
  id: string;
  sender: 'hospital' | 'patient';
  senderName: string;
  message: string;
  timestamp: string;
}

export type AmbulanceStatus =
  | 'IDLE'
  | 'NOT_REQUESTED'
  | 'REQUESTED'
  | 'ACKNOWLEDGED'
  | 'ACCEPTED'
  | 'DISPATCHED'
  | 'EN_ROUTE'
  | 'PICKUP_IN_PROGRESS'
  | 'ARRIVED'
  | 'ARRIVED_AT_HOSPITAL'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED';

export type AccessGrantStatus = 'PENDING' | 'ACTIVE' | 'REVOKED' | 'EXPIRED';

export interface UserAccount {
  uid: string;
  phone: string;
  fullName: string;
  age: number;
  location: LocationArea | string;
  passwordHash?: string;
  role: UserRole;
  createdAt: string;
  autoRerouteEnabled?: boolean;
}

export interface UserProfile {
  uid: string;
  phone: string;
  displayName: string;
  email?: string;
  age?: number;
  location?: LocationArea | string;
  role: UserRole;
  photoURL?: string;
  hospitalId?: string;
  hospitalName?: string;
  hospitalNameBn?: string;
  staffDesignation?: string;
  createdAt: string;
  autoRerouteEnabled?: boolean;
}

export interface HospitalStaffAccount {
  id: string;
  username: string;
  fullName: string;
  designation: string;
  hospitalId: string;
  hospitalName: string;
  hospitalNameBn: string;
  phone: string;
  email: string;
  role: 'hospital_staff';
  isDemoAccount: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
  canReceiveSosSms: boolean;
  canViewMedicalSummary: boolean;
  city?: string;
  notes?: string;
}

export interface PatientHealthProfile {
  id: string;
  userId: string;
  fullName: string;
  fullNameBn?: string;
  dateOfBirth?: string;
  age: number;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  phone: string;
  email?: string;
  location?: LocationArea | string;
  address?: string;
  city?: string;
  pinCode?: string;
  bloodGroup?: BloodGroup;
  knownAllergies: string[];
  existingConditions: string[];
  currentMedications: {
    name: string;
    dosage: string;
    frequency: string;
    startDate?: string;
    prescribedBy?: string;
  }[];
  pastSurgeries: {
    procedure: string;
    year: string;
    hospital?: string;
    notes?: string;
  }[];
  treatingDoctor?: {
    name: string;
    speciality: string;
    hospital: string;
    phone: string;
  };
  preferredLanguage: Language;
  trustedNeighborOrCaregiver?: {
    name: string;
    phone: string;
    relation: string;
    address: string;
  };
  swasthyaSathiNo?: string;
  ayushmanBharatId?: string;
  maskedAadhaar?: string;
  maskedPan?: string;
  emergencyContacts: EmergencyContact[];
  vitalsHistory: {
    date: string;
    systolicBP: number;
    diastolicBP: number;
    bloodGlucose: number;
    heartRate: number;
    spO2: number;
  }[];
  isProfileComplete: boolean;
  autoRerouteEnabled?: boolean;
  updatedAt: string;
}

export interface MedicalDocument {
  id: string;
  patientId: string;
  title: string;
  category: DocumentCategory;
  fileUrl: string;
  fileType: 'pdf' | 'jpeg' | 'png' | 'jpg' | 'other';
  fileSizeKb: number;
  uploadDate: string;
  issueDate?: string;
  doctorName?: string;
  hospitalName?: string;
  notes?: string;
  isLabVerified?: boolean;
  tags: string[];
  storagePath?: string;
}

export interface MedicalTimelineEvent {
  id: string;
  patientId: string;
  date: string;
  title: string;
  titleBn?: string;
  type: 'consultation' | 'prescription' | 'blood_test' | 'diagnostic' | 'hospital_visit' | 'surgery' | 'admission' | 'discharge' | 'vaccination';
  doctorOrFacility: string;
  description: string;
  documentId?: string;
  isUserEntered: boolean;
}

export interface InsurancePolicy {
  id: string;
  patientId: string;
  provider: string;
  policyName: string;
  policyNumber: string;
  validFrom: string;
  validTill: string;
  tpaName?: string;
  sumInsured: number;
  cashlessHelpline: string;
  documentUrl?: string;
  category: 'mediclaim' | 'swasthya_sathi' | 'ayushman_bharat' | 'corporate';
}

export interface VerifiedHospital {
  id: string;
  name: string;
  nameBn: string;
  type: 'Hospital' | 'Nursing Home' | 'Medical College & Hospital' | 'Diagnostic & Clinic';
  area: 'Panihati' | 'Dum Dum';
  locality: string;
  address: string;
  phone: string;
  distanceKm: number;
  distanceFromJisKm?: number;
  travelTimeMins: number;
  mapsUrl: string;
  verifiedDate: string;
  rating?: number;
  openHours: string;
  specialities: string[];
  isVerifiedPartner: boolean;
  latitude: number;
  longitude: number;
  emergencyAvailable?: boolean;
  totalBeds?: number;
  availableBeds?: number;
  icuBedsAvailable?: number;
  isBedVerified?: boolean;
  bedSource?: string;
  lastBedUpdate?: string;
}

export interface Hospital {
  id: string;
  name: string;
  nameBn: string;
  address: string;
  addressBn?: string;
  phone: string;
  emergencyHelpline: string;
  latitude: number;
  longitude: number;
  isVerifiedPartner: boolean;
  totalBeds: number;
  availableBeds: number;
  icuBedsAvailable: number;
  ambulanceCount: number;
  distanceKm?: number;
  estimatedTravelMins?: number;
  rating: number;
  specialities: string[];
  openHours: string;
  lastBedUpdate: string;
  type?: string;
  mapsUrl?: string;
  locality?: string;
  area?: string;
}

export interface BedAvailabilityRecord {
  id: string;
  hospitalId: string;
  hospitalName: string;
  category: BedCategoryType;
  totalCapacity: number;
  occupiedCount?: number;
  availableCount: number;
  status: BedStatus;
  lastUpdated: string;
  updatedByStaffName: string;
  staffDesignation?: string;
  notes?: string;
  sourceOfVerification?: string;
  isStale?: boolean;
}

export interface EmergencyRequest {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender?: string;
  patientBloodGroup?: BloodGroup;
  patientPhone: string;
  patientAddress: string;
  patientCoordinates?: {
    lat: number;
    lng: number;
  };
  locationConsentGiven?: boolean;
  symptomsDescription?: string;
  knownAllergies: string[];
  existingConditions: string[];
  currentMedicationsSummary: string;
  selectedHospitalId: string;
  selectedHospitalName: string;
  status: EmergencyRequestStatus;
  statusMessage?: string;
  timestamp: string;
  priority?: 'CRITICAL' | 'URGENT' | 'STANDARD';
  responseTimeoutMinutes?: number;
  timeoutAt?: string;
  allocatedBedType?: BedCategoryType;
  assignedStaffName?: string;
  accessGrantToken: string;
  accessGrantStatus?: AccessGrantStatus;
  sharedDocIds?: string[];
  rejectionReason?: string;
  redirectReason?: string;
  redirectHospitalId?: string;
  redirectHospitalName?: string;
  ambulanceRequested: boolean;
  ambulanceDetails?: {
    id: string;
    operatorName: string;
    driverName: string;
    driverPhone: string;
    vehicleNumber: string;
    status: AmbulanceStatus;
    etaMinutes: number;
    currentLocation?: { lat: number; lng: number };
    dispatchTimestamp?: string;
  };
  // Patient condition reporting fields
  chiefComplaint?: string;
  mainSymptom?: string;
  problemStartedAt?: string;
  reportedSeverity?: 'Mild' | 'Moderate' | 'Severe' | 'Unsure';
  consciousnessStatus?: 'Alert' | 'Confused' | 'Unresponsive' | 'Unsure';
  breathingStatus?: 'Normal' | 'Difficulty Breathing' | 'Not Breathing Normally' | 'Unsure';
  relevantMedicalHistory?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  locationSource?: 'GPS' | 'MANUAL';
  consentStatementAgreed?: boolean;
  consentScope?: string[];

  // Clinical assessment & hospital triage fields
  clinicalAssessment?: HospitalClinicalAssessment;
  clarificationMessages?: ClarificationMessage[];

  // Smart Auto-Rerouting fields
  autoRerouteEnabled?: boolean;
  autoRerouteHistory?: AutoRerouteHistoryEntry[];
  attemptCount?: number;
  declinedHospitalIds?: string[];
  originalHospitalId?: string;
  originalHospitalName?: string;
  forwardingTimestamp?: string;

  hospitalNotes?: string;
  smsSentToContacts: boolean;
  isSimulatedDemo?: boolean;
}

export interface DocumentAccessGrant {
  id: string;
  patientId: string;
  patientName: string;
  token: string;
  emergencyRequestId?: string;
  sharedWithHospitalId?: string;
  sharedWithHospitalName: string;
  documentIds: string[];
  sharedCategories?: DocumentCategory[];
  includeSummary: boolean;
  includeAllergies: boolean;
  includeMedications: boolean;
  includeInsurance?: boolean;
  createdAt: string;
  expiresAt: string;
  status: AccessGrantStatus;
  revokedAt?: string;
  revocationReason?: string;
  lastAccessTime?: string;
  accessLogs: {
    accessedAt: string;
    accessedBy: string;
    staffRole?: string;
    ipAddress?: string;
    notes?: string;
  }[];
}

export interface AppNotification {
  id: string;
  recipientId: string;
  title: string;
  titleBn: string;
  message: string;
  messageBn: string;
  type: 'emergency' | 'bed' | 'ambulance' | 'vault' | 'access' | 'system';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  details: string;
  ipAddress: string;
}

// MediVault AI Health Check-in
export interface HealthCheckinResult {
  riskLevel: 'Low' | 'Moderate' | 'Seek Prompt Care' | 'Emergency Alert';
  primaryAssessment: string;
  recommendedActions: string[];
  lifestyleAndHomeCare: string[];
  urgencyWarning: string;
  suggestedDoctorSpeciality: string;
}

// MediVault Drug Interaction Result
export interface DrugInteractionResult {
  drug1: string;
  drug2: string;
  severity: 'High' | 'Moderate' | 'Minor' | 'None';
  description: string;
  mechanism: string;
  clinicalAdvice: string;
}

