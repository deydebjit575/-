import {
  UserProfile,
  PatientHealthProfile,
  MedicalDocument,
  MedicalTimelineEvent,
  InsurancePolicy,
  Hospital,
  BedAvailabilityRecord,
  EmergencyRequest,
  DocumentAccessGrant,
  AppNotification,
  AuditLog,
  UserAccount,
  HospitalStaffAccount
} from '../types';
import { allVerifiedHospitals } from './verifiedHospitals';

export const defaultPatientAccounts: Record<string, UserAccount> = {
  '9830011111': {
    uid: 'patient-a-panihati',
    phone: '9830011111',
    fullName: 'অজয় মুখার্জী (Ajay Mukherjee - Patient A)',
    age: 68,
    location: 'Panihati, West Bengal',
    passwordHash: btoa('1234'),
    role: 'patient',
    createdAt: '2024-01-15T10:00:00Z'
  },
  '9830022222': {
    uid: 'patient-b-dumdum',
    phone: '9830022222',
    fullName: 'বিমল সেনগুপ্ত (Bimal Sengupta - Patient B)',
    age: 71,
    location: 'Dum Dum, West Bengal',
    passwordHash: btoa('1234'),
    role: 'patient',
    createdAt: '2024-02-20T10:00:00Z'
  },
  '9830012345': {
    uid: 'patient-demo-default',
    phone: '9830012345',
    fullName: 'অরুণাভ ব্যানার্জী (Arunava Banerjee)',
    age: 66,
    location: 'Panihati, West Bengal',
    passwordHash: btoa('1234'),
    role: 'patient',
    createdAt: '2024-01-01T08:00:00Z'
  }
};

export const mockHospitalStaffAccounts: HospitalStaffAccount[] = [
  {
    id: 'staff-pan-1',
    username: 'panihati.er',
    fullName: 'ডাঃ সুব্রত মুখোপাধ্যায় (Dr. Subrata Mukherjee)',
    designation: 'Emergency Duty Medical Officer (CMO)',
    hospitalId: 'pan-01',
    hospitalName: 'Panihati State General Hospital',
    hospitalNameBn: 'পানিহাটি স্টেট জেনারেল হাসপাতাল',
    phone: '033 2553 1243',
    email: 'emergency.duty@panihati.er.gov.in',
    role: 'hospital_staff',
    isDemoAccount: true
  },
  {
    id: 'staff-cmsdh-1',
    username: 'sagoredutta.er',
    fullName: 'ডাঃ অমিতাভ ঘোষ (Dr. Amitava Ghosh)',
    designation: 'Critical Care & Triage Specialist',
    hospitalId: 'pan-02',
    hospitalName: 'College of Medicine & Sagore Dutta Hospital (CMSDH)',
    hospitalNameBn: 'সাগর দত্ত মেডিকেল কলেজ ও হাসপাতাল',
    phone: '033 2583 5435',
    email: 'triage.incharge@cmsdh.wb.gov.in',
    role: 'hospital_staff',
    isDemoAccount: true
  },
  {
    id: 'staff-dum-1',
    username: 'dumdum.er',
    fullName: 'ডাঃ ইন্দ্রনীল সেনগুপ্ত (Dr. Indranil Sengupta)',
    designation: 'Emergency In-Charge (CMO)',
    hospitalId: 'dum-01',
    hospitalName: 'Dum Dum Municipal Specialized Hospital',
    hospitalNameBn: 'দমদম মিউনিসিপ্যাল স্পেশালাইজড হাসপাতাল',
    phone: '033 2549 2030',
    email: 'emergency@dumdumhospital.org',
    role: 'hospital_staff',
    isDemoAccount: true
  },
  {
    id: 'staff-sdum-1',
    username: 'southdumdum.er',
    fullName: 'ডাঃ অনন্যা বসু (Dr. Ananya Bose)',
    designation: 'Triage & Duty Medical Officer',
    hospitalId: 'dum-02',
    hospitalName: 'South Dum Dum Municipal Hospital',
    hospitalNameBn: 'দক্ষিণ দমদম পুর হাসপাতাল',
    phone: '033 2549 5500',
    email: 'triage@southdumdum.gov.in',
    role: 'hospital_staff',
    isDemoAccount: true
  },
  {
    id: 'staff-ils-1',
    username: 'ils.dumdum',
    fullName: 'ডাঃ রাজেশ শর্মা (Dr. Rajesh Sharma)',
    designation: 'Emergency Medical Director',
    hospitalId: 'dum-03',
    hospitalName: 'ILS Hospitals, Dum Dum',
    hospitalNameBn: 'আই এল এস হসপিটালস, দমদম',
    phone: '033 4031 5000',
    email: 'er.director@ilshospitals.com',
    role: 'hospital_staff',
    isDemoAccount: true
  },
  {
    id: 'staff-zenith-1',
    username: 'zenith.er',
    fullName: 'ডাঃ আর. ব্যানার্জী (Dr. R. Banerjee)',
    designation: 'Senior Emergency Coordinator',
    hospitalId: 'pan-09',
    hospitalName: 'Zenith Super Specialist Hospital',
    hospitalNameBn: 'জেনিথ সুপার স্পেশালিস্ট হাসপাতাল',
    phone: '033 2564 4040',
    email: 'emergency.desk@zenithhospital.in',
    role: 'hospital_staff',
    isDemoAccount: true
  }
];

export const mockHospitalStaffUser: UserProfile = {
  uid: 'staff-pan-1',
  email: 'emergency.duty@panihati.er.gov.in',
  displayName: 'ডাঃ সুব্রত মুখোপাধ্যায় (Dr. Subrata Mukherjee)',
  role: 'hospital_staff',
  phone: '033 2553 1243',
  hospitalId: 'pan-01',
  hospitalName: 'Panihati State General Hospital',
  hospitalNameBn: 'পানিহাটি স্টেট জেনারেল হাসপাতাল',
  staffDesignation: 'Emergency Duty Medical Officer (CMO)',
  createdAt: '2024-11-10T11:00:00Z',
};

export const mockAdminUser: UserProfile = {
  uid: 'admin-001',
  email: 'admin@susthayan.wb.gov.in',
  displayName: 'সাস্টেম অ্যাডমিন (Susthayan Admin Officer)',
  role: 'admin',
  phone: '+91 33 2244 5566',
  createdAt: '2024-01-01T00:00:00Z',
};

export const mockHospitals: Hospital[] = allVerifiedHospitals.map(v => ({
  id: v.id,
  name: v.name,
  nameBn: v.nameBn,
  address: v.address,
  addressBn: v.nameBn,
  phone: v.phone,
  emergencyHelpline: v.phone || '102',
  latitude: v.latitude,
  longitude: v.longitude,
  isVerifiedPartner: true,
  totalBeds: v.totalBeds || 100,
  availableBeds: v.availableBeds || 15,
  icuBedsAvailable: v.icuBedsAvailable || 2,
  ambulanceCount: Math.max(2, Math.floor((v.totalBeds || 50) / 30)),
  distanceKm: v.distanceKm,
  estimatedTravelMins: v.travelTimeMins,
  rating: v.rating || 4.2,
  specialities: v.specialities,
  openHours: v.openHours,
  lastBedUpdate: v.lastBedUpdate || 'Recently verified',
  type: v.type,
  mapsUrl: v.mapsUrl,
  locality: v.locality,
  area: v.area
}));

export const mockBedRecords: BedAvailabilityRecord[] = [
  // Panihati State General Hospital
  {
    id: 'bed-pan-icu',
    hospitalId: 'pan-01',
    hospitalName: 'Panihati State General Hospital',
    category: 'ICU',
    totalCapacity: 20,
    occupiedCount: 18,
    availableCount: 2,
    status: 'AVAILABLE',
    lastUpdated: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updatedByStaffName: 'ডাঃ সুব্রত মুখোপাধ্যায় (Dr. S. Mukherjee)',
    staffDesignation: 'Emergency Duty Officer',
    notes: '2 ICU beds with ventilator and invasive monitor ready.',
    sourceOfVerification: 'Direct Hospital Staff Verification',
    isStale: false
  },
  {
    id: 'bed-pan-gen',
    hospitalId: 'pan-01',
    hospitalName: 'Panihati State General Hospital',
    category: 'GENERAL_WARD',
    totalCapacity: 110,
    occupiedCount: 94,
    availableCount: 16,
    status: 'AVAILABLE',
    lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedByStaffName: 'Sister Bandana Paul',
    staffDesignation: 'Nursing Supervisor',
    notes: 'Male & Female wards operational with central oxygen.',
    sourceOfVerification: 'Direct Ward Floor Log',
    isStale: false
  },
  {
    id: 'bed-pan-er',
    hospitalId: 'pan-01',
    hospitalName: 'Panihati State General Hospital',
    category: 'EMERGENCY_DEPT',
    totalCapacity: 20,
    occupiedCount: 16,
    availableCount: 4,
    status: 'AVAILABLE',
    lastUpdated: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updatedByStaffName: 'ডাঃ সুব্রত মুখোপাধ্যায় (Dr. S. Mukherjee)',
    staffDesignation: 'Emergency Duty Officer',
    notes: 'Triage observation beds equipped with defibrillator and crash cart.',
    sourceOfVerification: 'Direct Hospital Staff Verification',
    isStale: false
  },

  // Dum Dum Municipal Specialized Hospital
  {
    id: 'bed-dum-icu',
    hospitalId: 'dum-01',
    hospitalName: 'Dum Dum Municipal Specialized Hospital',
    category: 'ICU',
    totalCapacity: 15,
    occupiedCount: 13,
    availableCount: 2,
    status: 'AVAILABLE',
    lastUpdated: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    updatedByStaffName: 'ডাঃ ইন্দ্রনীল সেনগুপ্ত (Dr. I. Sengupta)',
    staffDesignation: 'Emergency In-Charge',
    notes: 'Critical care monitors active.',
    sourceOfVerification: 'Municipal Health Desk',
    isStale: false
  },
  {
    id: 'bed-dum-gen',
    hospitalId: 'dum-01',
    hospitalName: 'Dum Dum Municipal Specialized Hospital',
    category: 'GENERAL_WARD',
    totalCapacity: 80,
    occupiedCount: 66,
    availableCount: 14,
    status: 'AVAILABLE',
    lastUpdated: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updatedByStaffName: 'Duty Nursing In-Charge',
    staffDesignation: 'Ward Supervisor',
    notes: 'General IPD beds available under Swasthya Sathi.',
    sourceOfVerification: 'Ward Log',
    isStale: false
  },
  {
    id: 'bed-dum-er',
    hospitalId: 'dum-01',
    hospitalName: 'Dum Dum Municipal Specialized Hospital',
    category: 'EMERGENCY_DEPT',
    totalCapacity: 15,
    occupiedCount: 12,
    availableCount: 3,
    status: 'AVAILABLE',
    lastUpdated: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    updatedByStaffName: 'ডাঃ ইন্দ্রনীল সেনগুপ্ত (Dr. I. Sengupta)',
    staffDesignation: 'Emergency In-Charge',
    notes: 'Emergency stabilization beds ready.',
    sourceOfVerification: 'Emergency Desk',
    isStale: false
  },

  // College of Medicine & Sagore Dutta Hospital (CMSDH)
  {
    id: 'bed-cmsdh-icu',
    hospitalId: 'pan-02',
    hospitalName: 'College of Medicine & Sagore Dutta Hospital (CMSDH)',
    category: 'ICU',
    totalCapacity: 40,
    occupiedCount: 34,
    availableCount: 6,
    status: 'AVAILABLE',
    lastUpdated: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updatedByStaffName: 'ডাঃ অমিতাভ ঘোষ (Dr. A. Ghosh)',
    staffDesignation: 'Critical Care In-Charge',
    notes: 'CCU and Trauma ICU beds functional.',
    sourceOfVerification: 'Medical College Triage Desk',
    isStale: false
  },
  {
    id: 'bed-cmsdh-gen',
    hospitalId: 'pan-02',
    hospitalName: 'College of Medicine & Sagore Dutta Hospital (CMSDH)',
    category: 'GENERAL_WARD',
    totalCapacity: 400,
    occupiedCount: 361,
    availableCount: 39,
    status: 'AVAILABLE',
    lastUpdated: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    updatedByStaffName: 'Central Nursing Admin',
    staffDesignation: 'Ward Controller',
    notes: 'Medical and surgical wards admitting.',
    sourceOfVerification: 'Hospital Management System',
    isStale: false
  },
  {
    id: 'bed-cmsdh-er',
    hospitalId: 'pan-02',
    hospitalName: 'College of Medicine & Sagore Dutta Hospital (CMSDH)',
    category: 'EMERGENCY_DEPT',
    totalCapacity: 60,
    occupiedCount: 52,
    availableCount: 8,
    status: 'AVAILABLE',
    lastUpdated: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updatedByStaffName: 'ডাঃ অমিতাভ ঘোষ (Dr. A. Ghosh)',
    staffDesignation: 'Emergency In-Charge',
    notes: 'Trauma bay & green/yellow/red triage zones active.',
    sourceOfVerification: 'CMSDH Central Bed Management',
    isStale: false
  },

  // South Dum Dum Municipal Hospital
  {
    id: 'bed-sdum-icu',
    hospitalId: 'dum-02',
    hospitalName: 'South Dum Dum Municipal Hospital',
    category: 'ICU',
    totalCapacity: 18,
    occupiedCount: 15,
    availableCount: 3,
    status: 'AVAILABLE',
    lastUpdated: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    updatedByStaffName: 'ডাঃ অনন্যা বসু (Dr. A. Bose)',
    staffDesignation: 'Triage Officer',
    notes: 'Dialysis & cardiac ICU backup available.',
    sourceOfVerification: 'Municipal Health Desk',
    isStale: false
  },
  {
    id: 'bed-sdum-gen',
    hospitalId: 'dum-02',
    hospitalName: 'South Dum Dum Municipal Hospital',
    category: 'GENERAL_WARD',
    totalCapacity: 95,
    occupiedCount: 78,
    availableCount: 17,
    status: 'AVAILABLE',
    lastUpdated: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    updatedByStaffName: 'Nursing Super',
    staffDesignation: 'Ward In-Charge',
    notes: 'General wards running normally.',
    sourceOfVerification: 'Direct Ward Floor Log',
    isStale: false
  },
  {
    id: 'bed-sdum-er',
    hospitalId: 'dum-02',
    hospitalName: 'South Dum Dum Municipal Hospital',
    category: 'EMERGENCY_DEPT',
    totalCapacity: 17,
    occupiedCount: 14,
    availableCount: 3,
    status: 'AVAILABLE',
    lastUpdated: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updatedByStaffName: 'ডাঃ অনন্যা বসু (Dr. A. Bose)',
    staffDesignation: 'Triage Officer',
    notes: 'Emergency holding area.',
    sourceOfVerification: 'Emergency Desk',
    isStale: false
  },

  // ILS Hospitals, Dum Dum
  {
    id: 'bed-ils-icu',
    hospitalId: 'dum-03',
    hospitalName: 'ILS Hospitals, Dum Dum',
    category: 'ICU',
    totalCapacity: 25,
    occupiedCount: 21,
    availableCount: 4,
    status: 'AVAILABLE',
    lastUpdated: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updatedByStaffName: 'ডাঃ রাজেশ শর্মা (Dr. R. Sharma)',
    staffDesignation: 'Emergency Medical Director',
    notes: 'Advanced multi-organ critical care support.',
    sourceOfVerification: 'ILS Central Triage',
    isStale: false
  },
  {
    id: 'bed-ils-gen',
    hospitalId: 'dum-03',
    hospitalName: 'ILS Hospitals, Dum Dum',
    category: 'GENERAL_WARD',
    totalCapacity: 100,
    occupiedCount: 82,
    availableCount: 18,
    status: 'AVAILABLE',
    lastUpdated: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    updatedByStaffName: 'Bed Manager Desk',
    staffDesignation: 'Operations Desk',
    notes: 'Single & twin sharing rooms available.',
    sourceOfVerification: 'HIS System',
    isStale: false
  },
  {
    id: 'bed-ils-er',
    hospitalId: 'dum-03',
    hospitalName: 'ILS Hospitals, Dum Dum',
    category: 'EMERGENCY_DEPT',
    totalCapacity: 15,
    occupiedCount: 11,
    availableCount: 4,
    status: 'AVAILABLE',
    lastUpdated: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updatedByStaffName: 'ডাঃ রাজেশ শর্মা (Dr. R. Sharma)',
    staffDesignation: 'Emergency Medical Director',
    notes: 'Emergency resuscitation beds.',
    sourceOfVerification: 'ER Bay Controller',
    isStale: false
  }
];

// No hardcoded sample emergency requests. All emergency requests are derived from actual patient submissions.
export const mockEmergencyRequests: EmergencyRequest[] = [];

// No fabricated document access grants. Derived from actual user consent.
export const mockAccessGrants: DocumentAccessGrant[] = [];

export const mockNotifications: AppNotification[] = [];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-001',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    actorId: 'sys-core',
    actorName: 'Susthayan Security System',
    actorRole: 'admin',
    action: 'SYSTEM_BOOT',
    details: 'Verified healthcare directory and triage services initialized with multi-hospital isolation.',
    ipAddress: '127.0.0.1 (Verified Local Core)'
  }
];

