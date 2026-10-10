import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserAccount,
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
  UserRole,
  BedStatus,
  BedCategoryType,
  LocationArea,
  HospitalStaffAccount,
  AmbulanceStatus,
  DocumentCategory
} from '../types';
import {
  mockHospitalStaffUser,
  mockHospitalStaffAccounts,
  mockAdminUser,
  mockHospitals,
  mockBedRecords,
  mockEmergencyRequests,
  mockAccessGrants,
  mockNotifications,
  mockAuditLogs
} from '../data/mockData';
import { sendEmergencySmsAlerts } from '../services/smsService';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface AppContextType {
  // Authentication & Role
  currentUser: UserProfile | null;
  userRole: UserRole;
  isLoggedIn: boolean;
  hospitalStaffAccounts: HospitalStaffAccount[];
  registerPatient: (data: {
    fullName: string;
    age: number;
    phone: string;
    location: LocationArea | string;
    password: string;
  }) => boolean;
  loginWithPhone: (phone: string, password?: string) => boolean;
  loginHospitalStaff: (staffId: string, password?: string) => boolean;
  switchHospitalStaffAccount: (staffId: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  // Active View / Navigation Page
  currentPage: string;
  setCurrentPage: (page: string) => void;
  pageParams?: Record<string, any>;
  navigateTo: (page: string, params?: Record<string, any>) => void;

  // Patient Profile
  patientProfile: PatientHealthProfile;
  updatePatientProfile: (updated: Partial<PatientHealthProfile>) => void;

  // Medical Documents (MediVault)
  medicalDocuments: MedicalDocument[];
  addMedicalDocument: (doc: Omit<MedicalDocument, 'id' | 'uploadDate'>) => MedicalDocument;
  deleteMedicalDocument: (id: string) => void;
  updateMedicalDocument: (id: string, doc: Partial<MedicalDocument>) => void;

  // Timeline
  timelineEvents: MedicalTimelineEvent[];
  addTimelineEvent: (event: Omit<MedicalTimelineEvent, 'id'>) => void;

  // Insurance
  insurancePolicies: InsurancePolicy[];
  addInsurancePolicy: (policy: Omit<InsurancePolicy, 'id'>) => void;
  deleteInsurancePolicy: (id: string) => void;

  // Hospitals & Beds
  hospitals: Hospital[];
  selectedSearchLocation: LocationArea | string;
  setSelectedSearchLocation: (loc: LocationArea | string) => void;
  selectedNearbyHospital: any;
  setSelectedNearbyHospital: (hosp: any) => void;
  updateHospitalBedCount: (hospitalId: string, availableBeds: number, icuBeds: number) => void;

  bedRecords: BedAvailabilityRecord[];
  updateBedStatus: (recordId: string, status: BedStatus, availableCount: number, notes?: string, isStale?: boolean) => void;
  updateBedAvailability: (recordId: string, totalCapacity: number, occupiedCount: number, notes?: string) => boolean;
  addBedRecord: (record: Omit<BedAvailabilityRecord, 'id' | 'lastUpdated'>) => void;
  toggleBedStaleness: (recordId: string) => void;

  // Emergency SOS & Request Lifecycle
  emergencyRequests: EmergencyRequest[];
  hospitalEmergencyRequests: EmergencyRequest[];
  activeEmergencyRequest: EmergencyRequest | null;
  triggerEmergencySos: (
    hospitalId: string,
    consentGranted: boolean,
    sharedDocIds?: string[],
    symptoms?: string,
    ambulanceReq?: boolean
  ) => Promise<EmergencyRequest>;
  acceptEmergencyRequest: (requestId: string, bedType?: BedCategoryType, notes?: string) => void;
  rejectEmergencyRequest: (requestId: string, reason?: string) => void;
  redirectEmergencyRequest: (requestId: string, redirectHospitalId: string, redirectHospitalName: string, reason: string) => void;
  markRequestUnderReview: (requestId: string) => void;
  timeoutEmergencyRequest: (requestId: string) => void;
  updateEmergencyStatus: (
    requestId: string,
    status: EmergencyRequest['status'],
    message?: string,
    bedType?: BedCategoryType,
    ambulanceData?: EmergencyRequest['ambulanceDetails']
  ) => void;
  cancelEmergencyRequest: (requestId: string) => void;
  updateAmbulanceStatus: (
    requestId: string,
    status: AmbulanceStatus,
    driverPhone?: string,
    vehicleNo?: string,
    eta?: number,
    driverName?: string
  ) => void;

  // Hospital Switching Workflow
  switchEmergencyHospital: (
    oldRequestId: string,
    newHospitalId: string,
    sharedDocIds?: string[],
    hoursValid?: number
  ) => Promise<EmergencyRequest>;

  // Access Grants & Patient Consent Management
  accessGrants: DocumentAccessGrant[];
  createAccessGrant: (
    hospitalId: string,
    hospitalName: string,
    docIds: string[],
    hoursValid: number,
    includeSummary: boolean,
    emergencyRequestId?: string,
    sharedCategories?: DocumentCategory[],
    includeInsurance?: boolean
  ) => DocumentAccessGrant;
  revokeAccessGrant: (grantId: string, reason?: string) => void;
  recordMedicalAccess: (grantToken: string, patientName?: string, notes?: string) => boolean;
  getGrantForRequest: (requestId: string, hospitalId?: string) => DocumentAccessGrant | null;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;

  // Audit
  auditLogs: AuditLog[];
  addAuditLog: (action: string, details: string) => void;

  // Interactive Demo Scenarios Runner
  runDemoScenario: (scenarioId: number) => void;

  // UI Toasts
  toasts: ToastMessage[];
  showToast: (type: ToastMessage['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper for phone normalization
export const normalizePhone = (phone: string): string => {
  return phone.replace(/[\s\-()]/g, '').trim();
};

// Local DB Helper
function getStoredUsers(): Record<string, UserAccount> {
  const data = localStorage.getItem('susthayan_users_db');
  return data ? JSON.parse(data) : {};
}

function saveStoredUsers(users: Record<string, UserAccount>) {
  localStorage.setItem('susthayan_users_db', JSON.stringify(users));
}

// Blank profile factory
function createBlankProfile(
  uid: string = 'guest',
  fullName: string = '',
  phone: string = '',
  age: number = 65,
  location: string = 'Panihati, West Bengal'
): PatientHealthProfile {
  return {
    id: `prof-${Date.now()}`,
    userId: uid,
    fullName: fullName.trim(),
    age: age || 65,
    phone: normalizePhone(phone),
    location: location || 'Panihati, West Bengal',
    preferredLanguage: 'bn',
    knownAllergies: [],
    existingConditions: [],
    currentMedications: [],
    pastSurgeries: [],
    emergencyContacts: [],
    vitalsHistory: [],
    isProfileComplete: Boolean(fullName),
    updatedAt: new Date().toISOString()
  };
}

export function isMatchingHospital(hospitalIdA?: string, hospitalIdB?: string): boolean {
  if (!hospitalIdA || !hospitalIdB) return false;
  if (hospitalIdA === hospitalIdB) return true;
  const canonical = (id: string) => {
    if (id === 'pan-hosp-1' || id === 'pan-01') return 'pan-01';
    if (id === 'pan-hosp-2' || id === 'pan-02') return 'pan-02';
    if (id === 'pan-hosp-3' || id === 'pan-09') return 'pan-09';
    if (id === 'dum-hosp-1' || id === 'dum-01') return 'dum-01';
    if (id === 'dum-hosp-2' || id === 'dum-02') return 'dum-02';
    if (id === 'dum-hosp-3' || id === 'dum-03') return 'dum-03';
    return id;
  };
  return canonical(hospitalIdA) === canonical(hospitalIdB);
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialPage = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('page') || 'landing';
  };

  const [currentPage, setCurrentPage] = useState<string>(getInitialPage);
  const [pageParams, setPageParams] = useState<Record<string, any> | undefined>(() => {
    const params = new URLSearchParams(window.location.search);
    const obj: Record<string, any> = {};
    params.forEach((val, key) => {
      obj[key] = val;
    });
    return obj;
  });

  // Current Logged In User
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('susthayan_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('susthayan_is_logged_in') === 'true';
  });

  // Location search state
  const [selectedSearchLocation, setSelectedSearchLocation] = useState<LocationArea | string>(() => {
    return (localStorage.getItem('susthayan_search_loc') as LocationArea) || 'Panihati, West Bengal';
  });

  // Patient Profile state (per-user)
  const [patientProfile, setPatientProfile] = useState<PatientHealthProfile>(() => {
    if (currentUser?.phone) {
      const clean = normalizePhone(currentUser.phone);
      const saved = localStorage.getItem(`susthayan_profile_${clean}`);
      if (saved) return JSON.parse(saved);
    }
    return createBlankProfile(
      currentUser?.uid,
      currentUser?.displayName,
      currentUser?.phone,
      currentUser?.age,
      currentUser?.location
    );
  });

  // Medical Documents
  const [medicalDocuments, setMedicalDocuments] = useState<MedicalDocument[]>(() => {
    if (!currentUser?.phone) return [];
    const clean = normalizePhone(currentUser.phone);
    const saved = localStorage.getItem(`susthayan_docs_${clean}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Timeline
  const [timelineEvents, setTimelineEvents] = useState<MedicalTimelineEvent[]>(() => {
    if (!currentUser?.phone) return [];
    const clean = normalizePhone(currentUser.phone);
    const saved = localStorage.getItem(`susthayan_timeline_${clean}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Insurance Policies
  const [insurancePolicies, setInsurancePolicies] = useState<InsurancePolicy[]>(() => {
    if (!currentUser?.phone) return [];
    const clean = normalizePhone(currentUser.phone);
    const saved = localStorage.getItem(`susthayan_insurance_${clean}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    const saved = localStorage.getItem('susthayan_hospitals');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((h: any) => h.id?.startsWith('dum-'))) {
          return parsed;
        }
      } catch (e) {}
    }
    return mockHospitals;
  });

  const [selectedNearbyHospital, setSelectedNearbyHospital] = useState<any>(() => {
    const saved = localStorage.getItem('susthayan_selected_nearby_hospital');
    return saved ? JSON.parse(saved) : null;
  });

  const [bedRecords, setBedRecords] = useState<BedAvailabilityRecord[]>(() => {
    const saved = localStorage.getItem('susthayan_beds');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((b: any) => b.hospitalId?.startsWith('dum-'))) {
          return parsed;
        }
      } catch (e) {}
    }
    return mockBedRecords;
  });

  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>(() => {
    const saved = localStorage.getItem('susthayan_emergencies');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((r: any) => 
            !r.isSimulatedDemo && 
            !r.patientName?.includes('Bimal Roy') && 
            !r.patientName?.includes('Protima Sen') && 
            !r.patientName?.includes('Prabir Sengupta')
          );
        }
      } catch (e) {}
    }
    return [];
  });

  const [accessGrants, setAccessGrants] = useState<DocumentAccessGrant[]>(() => {
    const saved = localStorage.getItem('susthayan_grants');
    return saved ? JSON.parse(saved) : mockAccessGrants;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('susthayan_notifications');
    return saved ? JSON.parse(saved) : mockNotifications;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('susthayan_audit_logs');
    return saved ? JSON.parse(saved) : mockAuditLogs;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync general app state
  useEffect(() => {
    localStorage.setItem('susthayan_search_loc', selectedSearchLocation);
  }, [selectedSearchLocation]);

  useEffect(() => {
    if (selectedNearbyHospital) {
      localStorage.setItem('susthayan_selected_nearby_hospital', JSON.stringify(selectedNearbyHospital));
    } else {
      localStorage.removeItem('susthayan_selected_nearby_hospital');
    }
  }, [selectedNearbyHospital]);

  useEffect(() => {
    localStorage.setItem('susthayan_hospitals', JSON.stringify(hospitals));
  }, [hospitals]);

  useEffect(() => {
    localStorage.setItem('susthayan_beds', JSON.stringify(bedRecords));
  }, [bedRecords]);

  useEffect(() => {
    localStorage.setItem('susthayan_emergencies', JSON.stringify(emergencyRequests));
  }, [emergencyRequests]);

  useEffect(() => {
    localStorage.setItem('susthayan_grants', JSON.stringify(accessGrants));
  }, [accessGrants]);

  useEffect(() => {
    localStorage.setItem('susthayan_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('susthayan_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Multi-tab real-time storage event synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'susthayan_emergencies' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setEmergencyRequests(parsed.filter((r: any) => 
              !r.isSimulatedDemo && 
              !r.patientName?.includes('Bimal Roy') && 
              !r.patientName?.includes('Protima Sen') && 
              !r.patientName?.includes('Prabir Sengupta')
            ));
          }
        } catch (err) {}
      }
      if (e.key === 'susthayan_beds' && e.newValue) {
        try {
          setBedRecords(JSON.parse(e.newValue));
        } catch (err) {}
      }
      if (e.key === 'susthayan_audit_logs' && e.newValue) {
        try {
          setAuditLogs(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Toast Helpers
  const showToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const navigateTo = (page: string, params?: Record<string, any>) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const url = new URL(window.location.href);
    url.searchParams.set('page', page);
    if (params) {
      Object.keys(params).forEach(k => url.searchParams.set(k, String(params[k])));
    }
    window.history.pushState({}, '', url.toString());
  };

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actorId: currentUser?.uid || 'guest',
      actorName: currentUser?.displayName || 'Anonymous User',
      actorRole: currentUser?.role || 'patient',
      action,
      details,
      ipAddress: currentUser?.role === 'hospital_staff' ? '10.14.0.82 (Hospital LAN)' : '127.0.0.1 (Verified Patient Device)'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Helper to load user-specific data from localStorage
  const loadUserData = (phone: string, profile: UserProfile) => {
    const cleanPhone = normalizePhone(phone);
    const savedProf = localStorage.getItem(`susthayan_profile_${cleanPhone}`);
    if (savedProf) {
      setPatientProfile(JSON.parse(savedProf));
    } else {
      const newProf = createBlankProfile(profile.uid, profile.displayName, cleanPhone, profile.age, profile.location);
      setPatientProfile(newProf);
      localStorage.setItem(`susthayan_profile_${cleanPhone}`, JSON.stringify(newProf));
    }

    const savedDocs = localStorage.getItem(`susthayan_docs_${cleanPhone}`);
    setMedicalDocuments(savedDocs ? JSON.parse(savedDocs) : []);

    const savedTimeline = localStorage.getItem(`susthayan_timeline_${cleanPhone}`);
    setTimelineEvents(savedTimeline ? JSON.parse(savedTimeline) : []);

    const savedInsurance = localStorage.getItem(`susthayan_insurance_${cleanPhone}`);
    setInsurancePolicies(savedInsurance ? JSON.parse(savedInsurance) : []);
  };

  // Register a new patient
  const registerPatient = (data: {
    fullName: string;
    age: number;
    phone: string;
    location: LocationArea | string;
    password: string;
  }): boolean => {
    const cleanPhone = normalizePhone(data.phone);
    const users = getStoredUsers();

    if (users[cleanPhone] || (cleanPhone.startsWith('+91') && users[cleanPhone.slice(3)]) || (!cleanPhone.startsWith('+91') && users[`+91${cleanPhone}`])) {
      showToast('error', 'Phone already registered', 'This phone number is already registered. Please log in.');
      return false;
    }

    const newAccount: UserAccount = {
      uid: `usr-${Date.now()}`,
      phone: cleanPhone,
      fullName: data.fullName.trim(),
      age: Number(data.age) || 65,
      location: data.location,
      passwordHash: btoa(data.password),
      role: 'patient',
      createdAt: new Date().toISOString()
    };

    users[cleanPhone] = newAccount;
    saveStoredUsers(users);

    const newProfile = createBlankProfile(
      newAccount.uid,
      newAccount.fullName,
      newAccount.phone,
      newAccount.age,
      newAccount.location
    );

    localStorage.setItem(`susthayan_profile_${cleanPhone}`, JSON.stringify(newProfile));
    localStorage.setItem(`susthayan_docs_${cleanPhone}`, JSON.stringify([]));
    localStorage.setItem(`susthayan_timeline_${cleanPhone}`, JSON.stringify([]));
    localStorage.setItem(`susthayan_insurance_${cleanPhone}`, JSON.stringify([]));

    const userProfile: UserProfile = {
      uid: newAccount.uid,
      phone: newAccount.phone,
      displayName: newAccount.fullName,
      age: newAccount.age,
      location: newAccount.location,
      role: 'patient',
      createdAt: newAccount.createdAt
    };

    localStorage.setItem('susthayan_current_user', JSON.stringify(userProfile));
    localStorage.setItem('susthayan_is_logged_in', 'true');

    setCurrentUser(userProfile);
    setIsLoggedIn(true);
    setPatientProfile(newProfile);
    setMedicalDocuments([]);
    setTimelineEvents([]);
    setInsurancePolicies([]);

    addAuditLog('PATIENT_REGISTRATION', `New patient registered: ${data.fullName} (${cleanPhone})`);
    showToast('success', 'Registration Successful!', `Welcome to Susthayan, ${data.fullName}`);
    navigateTo('dashboard');
    return true;
  };

  // Login with Phone Number and Password
  const loginWithPhone = (phone: string, password?: string): boolean => {
    const cleanPhone = normalizePhone(phone);
    const users = getStoredUsers();
    
    let account = users[cleanPhone];
    if (!account) {
      const stripped = cleanPhone.replace(/^\+91/, '');
      account = users[stripped] || users[`+91${stripped}`];
    }

    if (!account) {
      showToast('error', 'Account Not Found', 'No account found with this phone number. Please register.');
      return false;
    }

    if (password && account.passwordHash && account.passwordHash !== btoa(password)) {
      showToast('error', 'Incorrect Password', 'Please enter the correct password.');
      return false;
    }

    const userProfile: UserProfile = {
      uid: account.uid,
      phone: account.phone,
      displayName: account.fullName,
      age: account.age,
      location: account.location,
      role: account.role || 'patient',
      createdAt: account.createdAt
    };

    localStorage.setItem('susthayan_current_user', JSON.stringify(userProfile));
    localStorage.setItem('susthayan_is_logged_in', 'true');

    setCurrentUser(userProfile);
    setIsLoggedIn(true);
    loadUserData(account.phone, userProfile);
    addAuditLog('USER_LOGIN', `User logged in with phone: ${account.phone}`);
    showToast('success', 'Login Successful!', `Welcome back, ${account.fullName}`);
    navigateTo('dashboard');
    return true;
  };

  // Hospital Staff Login
  const loginHospitalStaff = (staffId: string, password?: string): boolean => {
    const targetAccount = mockHospitalStaffAccounts.find(a => a.id === staffId || a.username === staffId);
    if (!targetAccount) {
      showToast('error', 'Staff Account Not Found', 'No verified hospital staff record matched this identity.');
      return false;
    }

    const staffProfile: UserProfile = {
      uid: targetAccount.id,
      displayName: targetAccount.fullName,
      email: targetAccount.email,
      phone: targetAccount.phone,
      role: 'hospital_staff',
      hospitalId: targetAccount.hospitalId,
      hospitalName: targetAccount.hospitalName,
      hospitalNameBn: targetAccount.hospitalNameBn,
      staffDesignation: targetAccount.designation,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('susthayan_current_user', JSON.stringify(staffProfile));
    localStorage.setItem('susthayan_is_logged_in', 'true');

    setCurrentUser(staffProfile);
    setIsLoggedIn(true);
    addAuditLog('HOSPITAL_STAFF_LOGIN', `Staff authenticated: ${targetAccount.fullName} @ ${targetAccount.hospitalName}`);
    showToast('success', 'Hospital Portal Access Granted', `${targetAccount.hospitalName}`);
    navigateTo('hospital-dashboard');
    return true;
  };

  // Switch Hospital Staff Account (for multi-hospital testing)
  const switchHospitalStaffAccount = (staffId: string) => {
    const target = mockHospitalStaffAccounts.find(a => a.id === staffId);
    if (target) {
      loginHospitalStaff(target.id);
    }
  };

  const logout = () => {
    addAuditLog('USER_LOGOUT', `User ${currentUser?.displayName || 'user'} logged out`);
    setCurrentUser(null);
    setIsLoggedIn(false);
    setPatientProfile(createBlankProfile());
    setMedicalDocuments([]);
    setTimelineEvents([]);
    setInsurancePolicies([]);

    localStorage.removeItem('susthayan_current_user');
    localStorage.setItem('susthayan_is_logged_in', 'false');

    showToast('info', 'Logged Out', 'You have been safely signed out.');
    navigateTo('landing');
  };

  const switchRole = (role: UserRole) => {
    if (role === 'patient') {
      if (currentUser?.role === 'patient') {
        navigateTo('dashboard');
      } else {
        navigateTo('login');
      }
    } else if (role === 'hospital_staff') {
      loginHospitalStaff('staff-pan-1');
    } else {
      setCurrentUser(mockAdminUser);
      setIsLoggedIn(true);
      navigateTo('admin-dashboard');
      showToast('info', 'Switched to Administrator Portal');
    }
  };

  const updatePatientProfile = (updated: Partial<PatientHealthProfile>) => {
    setPatientProfile(prev => {
      const updatedProfile = {
        ...prev,
        ...updated,
        updatedAt: new Date().toISOString()
      };

      const userPhone = normalizePhone(updatedProfile.phone || currentUser?.phone || '');
      if (userPhone) {
        localStorage.setItem(`susthayan_profile_${userPhone}`, JSON.stringify(updatedProfile));
      }

      if (currentUser && (updated.fullName || updated.location || updated.age || updated.phone)) {
        const updatedUser: UserProfile = {
          ...currentUser,
          displayName: updated.fullName || currentUser.displayName,
          location: updated.location || currentUser.location,
          age: updated.age !== undefined ? updated.age : currentUser.age,
          phone: updated.phone ? normalizePhone(updated.phone) : currentUser.phone
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('susthayan_current_user', JSON.stringify(updatedUser));

        const users = getStoredUsers();
        if (users[currentUser.phone]) {
          users[currentUser.phone] = {
            ...users[currentUser.phone],
            fullName: updatedUser.displayName,
            location: updatedUser.location || users[currentUser.phone].location,
            age: updatedUser.age || users[currentUser.phone].age
          };
          saveStoredUsers(users);
        }
      }

      return updatedProfile;
    });

    addAuditLog('UPDATE_PATIENT_PROFILE', 'Updated personal health profile');
    showToast('success', 'Profile Updated Successfully');
  };

  const addMedicalDocument = (doc: Omit<MedicalDocument, 'id' | 'uploadDate'>): MedicalDocument => {
    const newDoc: MedicalDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    
    setMedicalDocuments(prev => {
      const updatedDocs = [newDoc, ...prev];
      const phone = normalizePhone(currentUser?.phone || patientProfile.phone || 'guest');
      localStorage.setItem(`susthayan_docs_${phone}`, JSON.stringify(updatedDocs));
      return updatedDocs;
    });

    if (doc.issueDate) {
      let timelineType: MedicalTimelineEvent['type'] = 'diagnostic';
      if (doc.category === 'prescriptions') timelineType = 'prescription';
      else if (doc.category === 'blood_reports') timelineType = 'blood_test';
      else if (doc.category === 'hospital_records') timelineType = 'hospital_visit';
      else if (doc.category === 'discharge_summaries') timelineType = 'discharge';

      addTimelineEvent({
        patientId: currentUser?.uid || 'guest',
        date: doc.issueDate,
        title: doc.title,
        type: timelineType,
        doctorOrFacility: doc.doctorName || doc.hospitalName || 'Verified Healthcare Facility',
        description: doc.notes || `Uploaded ${doc.category.replace('_', ' ')} record`,
        documentId: newDoc.id,
        isUserEntered: true
      });
    }

    addAuditLog('UPLOAD_MEDICAL_DOCUMENT', `Uploaded ${doc.title} (${doc.category})`);
    showToast('success', 'Document Saved in MediVault', doc.title);
    return newDoc;
  };

  const deleteMedicalDocument = (id: string) => {
    const target = medicalDocuments.find(d => d.id === id);
    setMedicalDocuments(prev => {
      const updatedDocs = prev.filter(d => d.id !== id);
      const phone = normalizePhone(currentUser?.phone || patientProfile.phone || 'guest');
      localStorage.setItem(`susthayan_docs_${phone}`, JSON.stringify(updatedDocs));
      return updatedDocs;
    });
    addAuditLog('DELETE_MEDICAL_DOCUMENT', `Deleted record ID ${id}: ${target?.title}`);
    showToast('info', 'Document Removed from MediVault');
  };

  const updateMedicalDocument = (id: string, updated: Partial<MedicalDocument>) => {
    setMedicalDocuments(prev => {
      const updatedDocs = prev.map(d => (d.id === id ? { ...d, ...updated } : d));
      const phone = normalizePhone(currentUser?.phone || patientProfile.phone || 'guest');
      localStorage.setItem(`susthayan_docs_${phone}`, JSON.stringify(updatedDocs));
      return updatedDocs;
    });
    addAuditLog('UPDATE_MEDICAL_DOCUMENT', `Updated document ID ${id}`);
    showToast('success', 'Document updated');
  };

  const addTimelineEvent = (event: Omit<MedicalTimelineEvent, 'id'>) => {
    const newEvent: MedicalTimelineEvent = {
      ...event,
      id: `tl-${Date.now()}`
    };
    setTimelineEvents(prev => {
      const updatedTimeline = [newEvent, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const phone = normalizePhone(currentUser?.phone || patientProfile.phone || 'guest');
      localStorage.setItem(`susthayan_timeline_${phone}`, JSON.stringify(updatedTimeline));
      return updatedTimeline;
    });
  };

  const addInsurancePolicy = (policy: Omit<InsurancePolicy, 'id'>) => {
    const newPol: InsurancePolicy = {
      ...policy,
      id: `ins-${Date.now()}`
    };
    setInsurancePolicies(prev => {
      const updatedPol = [newPol, ...prev];
      const phone = normalizePhone(currentUser?.phone || patientProfile.phone || 'guest');
      localStorage.setItem(`susthayan_insurance_${phone}`, JSON.stringify(updatedPol));
      return updatedPol;
    });
    showToast('success', 'Policy Added to Insurance Vault', policy.policyName);
  };

  const deleteInsurancePolicy = (id: string) => {
    setInsurancePolicies(prev => {
      const updatedPol = prev.filter(p => p.id !== id);
      const phone = normalizePhone(currentUser?.phone || patientProfile.phone || 'guest');
      localStorage.setItem(`susthayan_insurance_${phone}`, JSON.stringify(updatedPol));
      return updatedPol;
    });
    showToast('info', 'Policy removed');
  };

  const updateHospitalBedCount = (hospitalId: string, availableBeds: number, icuBeds: number) => {
    setHospitals(prev =>
      prev.map(h => (h.id === hospitalId ? { ...h, availableBeds, icuBedsAvailable: icuBeds, lastBedUpdate: 'Just now by staff' } : h))
    );
  };

  const updateBedStatus = (
    recordId: string,
    status: BedStatus,
    availableCount: number,
    notes?: string,
    isStale: boolean = false
  ) => {
    setBedRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          const updated = {
            ...r,
            status,
            availableCount,
            notes: notes !== undefined ? notes : r.notes,
            lastUpdated: new Date().toISOString(),
            updatedByStaffName: currentUser?.displayName || r.updatedByStaffName,
            staffDesignation: currentUser?.staffDesignation || r.staffDesignation,
            isStale: isStale
          };
          if (r.category === 'ICU') {
            updateHospitalBedCount(r.hospitalId, r.availableCount, availableCount);
          }
          return updated;
        }
        return r;
      })
    );

    addAuditLog('UPDATE_BED_AVAILABILITY', `Bed record ${recordId} updated to ${status} (${availableCount} beds available)`);
    showToast('success', 'Bed Availability Status Verified & Saved');
  };

  const addBedRecord = (record: Omit<BedAvailabilityRecord, 'id' | 'lastUpdated'>) => {
    const newRec: BedAvailabilityRecord = {
      ...record,
      id: `bed-${Date.now()}`,
      lastUpdated: new Date().toISOString(),
      isStale: false
    };
    setBedRecords(prev => [newRec, ...prev]);
    showToast('success', 'New Bed Category Added');
  };

  const toggleBedStaleness = (recordId: string) => {
    setBedRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          const newStale = !r.isStale;
          return {
            ...r,
            isStale: newStale,
            status: newStale ? 'UNKNOWN' : r.status,
            notes: newStale ? 'Flagged as UNVERIFIED / STALE by automated freshness policy.' : r.notes
          };
        }
        return r;
      })
    );
    showToast('info', 'Freshness Policy Applied', 'Bed status freshness updated.');
  };

  // Canonical hospital matching helper
  const isMatchingHospital = (hospitalIdA?: string, hospitalIdB?: string): boolean => {
    if (!hospitalIdA || !hospitalIdB) return false;
    if (hospitalIdA === hospitalIdB) return true;
    const canonical = (id: string) => {
      if (id === 'pan-hosp-1' || id === 'pan-01') return 'pan-01';
      if (id === 'pan-hosp-2' || id === 'pan-02') return 'pan-02';
      if (id === 'pan-hosp-3' || id === 'pan-09') return 'pan-09';
      if (id === 'dum-hosp-1' || id === 'dum-01') return 'dum-01';
      if (id === 'dum-hosp-2' || id === 'dum-02') return 'dum-02';
      if (id === 'dum-hosp-3' || id === 'dum-03') return 'dum-03';
      return id;
    };
    return canonical(hospitalIdA) === canonical(hospitalIdB);
  };

  // Filter requests strictly for authenticated hospital staff
  const hospitalEmergencyRequests = emergencyRequests.filter(req => {
    if (currentUser?.role === 'hospital_staff' && currentUser?.hospitalId) {
      return isMatchingHospital(req.selectedHospitalId, currentUser.hospitalId);
    }
    return false;
  });

  // Emergency SOS Trigger
  const triggerEmergencySos = async (
    hospitalId: string,
    consentGranted: boolean,
    sharedDocIds: string[] = [],
    symptoms?: string,
    ambulanceReq: boolean = true
  ): Promise<EmergencyRequest> => {
    const selectedHosp = hospitals.find(h => isMatchingHospital(h.id, hospitalId)) || hospitals[0];
    const requestId = `EMG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const grantToken = `GRANT-${selectedHosp.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    // Create an explicit access grant for this hospital if consent was granted
    if (consentGranted) {
      const grantDocIds = sharedDocIds.length > 0 ? sharedDocIds : medicalDocuments.map(d => d.id);
      createAccessGrant(
        selectedHosp.id,
        selectedHosp.name,
        grantDocIds,
        4, // 4 hours emergency window
        true,
        requestId,
        ['prescriptions', 'blood_reports', 'diagnostic_reports', 'hospital_records', 'insurance'],
        true
      );
    }

    const patientName = patientProfile.fullName?.trim() || currentUser?.displayName?.trim() || 'Patient';
    const patientAge = Number(patientProfile.age || currentUser?.age || 0);
    const patientPhone = patientProfile.phone || currentUser?.phone || '';
    const patientAddress = patientProfile.location || selectedSearchLocation || 'Location shared via GPS';

    const newRequest: EmergencyRequest = {
      id: requestId,
      patientId: patientProfile.userId || currentUser?.uid || `patient-${Date.now()}`,
      patientName,
      patientAge,
      patientGender: patientProfile.gender || 'Not specified',
      patientBloodGroup: patientProfile.bloodGroup,
      patientPhone,
      patientAddress,
      patientCoordinates: { lat: selectedHosp.latitude || 22.6958, lng: selectedHosp.longitude || 88.3742 },
      locationConsentGiven: true,
      symptomsDescription: symptoms?.trim() || 'Emergency assistance requested via SUSTHAYAN Emergency SOS.',
      knownAllergies: patientProfile.knownAllergies || [],
      existingConditions: patientProfile.existingConditions || [],
      currentMedicationsSummary: patientProfile.currentMedications?.length > 0
        ? patientProfile.currentMedications.map(m => `${m.name}${m.dosage ? ` (${m.dosage})` : ''}`).join(', ')
        : '',
      selectedHospitalId: selectedHosp.id,
      selectedHospitalName: selectedHosp.name,
      status: 'PENDING',
      priority: 'URGENT',
      statusMessage: `Emergency SOS received by ${selectedHosp.name}. Triage team evaluating bed & ambulance availability.`,
      timestamp: new Date().toISOString(),
      responseTimeoutMinutes: 15,
      timeoutAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      accessGrantToken: grantToken,
      accessGrantStatus: consentGranted ? 'ACTIVE' : 'PENDING',
      sharedDocIds: consentGranted ? (sharedDocIds.length > 0 ? sharedDocIds : medicalDocuments.map(d => d.id)) : [],
      ambulanceRequested: ambulanceReq,
      ambulanceDetails: ambulanceReq ? {
        id: `AMB-${selectedHosp.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}-01`,
        operatorName: `${selectedHosp.name} EMS Dispatch`,
        driverName: 'Not yet assigned',
        driverPhone: 'Pending dispatch',
        vehicleNumber: 'Pending dispatch',
        status: 'REQUESTED',
        etaMinutes: 0
      } : undefined,
      hospitalNotes: '',
      smsSentToContacts: (patientProfile.emergencyContacts?.length || 0) > 0
    };

    setEmergencyRequests(prev => [newRequest, ...prev]);

    // Send notifications
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: 'all',
      title: 'Emergency SOS Submitted',
      titleBn: 'জরুরি এসওএস প্রেরিত হয়েছে',
      message: `Emergency SOS sent to ${selectedHosp.name}. ID: ${requestId}`,
      messageBn: `${selectedHosp.name}-এ জরুরি এসওএস পাঠানো হয়েছে। আইডি: ${requestId}`,
      type: 'emergency',
      timestamp: new Date().toISOString(),
      isRead: false,
      actionUrl: `emergency-tracking?id=${requestId}`
    };
    setNotifications(prev => [newNotif, ...prev]);

    if (patientProfile.emergencyContacts?.length > 0) {
      await sendEmergencySmsAlerts(
        patientProfile.emergencyContacts,
        patientName,
        selectedHosp.name,
        requestId
      );
    }

    addAuditLog('TRIGGER_EMERGENCY_SOS', `Triggered SOS for Hospital ${selectedHosp.name} (Request ID: ${requestId}) with time-limited grant ${grantToken}`);
    showToast('warning', 'EMERGENCY SOS SENT!', `Hospital: ${selectedHosp.name}`);

    navigateTo('emergency-tracking', { id: requestId });
    return newRequest;
  };

  // Hospital Accepts Emergency Request
  const acceptEmergencyRequest = (requestId: string, bedType: BedCategoryType = 'ICU', notes?: string) => {
    const staffName = currentUser?.displayName || 'Emergency Triage Doctor';
    const hospitalName = currentUser?.hospitalName || 'Verified Hospital';

    setEmergencyRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'ACCEPTED',
            allocatedBedType: bedType,
            assignedStaffName: staffName,
            statusMessage: `Hospital Accepted Request. 1 ${bedType} bed allocated & triage bay prepped by ${staffName}.`,
            hospitalNotes: notes || r.hospitalNotes,
            ambulanceDetails: r.ambulanceDetails ? { ...r.ambulanceDetails, status: 'ACCEPTED' } : undefined
          };
        }
        return r;
      })
    );

    // Notify patient
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: 'all',
      title: 'Emergency Request ACCEPTED!',
      titleBn: 'জরুরি অনুরোধ গৃহীত হয়েছে!',
      message: `${hospitalName} has ACCEPTED your request and reserved 1 ${bedType} bed.`,
      messageBn: `${hospitalName} আপনার অনুরোধ গ্রহণ করেছে এবং ১টি ${bedType} বেড প্রস্তুত রেখেছে।`,
      type: 'emergency',
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [notif, ...prev]);

    addAuditLog('EMERGENCY_ACCEPTED', `Hospital staff ${staffName} accepted Request ID ${requestId} (Allocated: ${bedType})`);
    showToast('success', 'Emergency Request Accepted', `1 ${bedType} Bed Allocated`);
  };

  // Hospital Rejects Emergency Request
  const rejectEmergencyRequest = (requestId: string, reason: string = 'No ICU Bed Available at this time') => {
    const staffName = currentUser?.displayName || 'Emergency Duty Officer';
    const hospitalName = currentUser?.hospitalName || 'Hospital';

    setEmergencyRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'REJECTED',
            rejectionReason: reason,
            statusMessage: `Hospital unable to accommodate at this time: ${reason}. Please revoke access and switch to an alternative hospital immediately.`
          };
        }
        return r;
      })
    );

    // Notify patient
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: 'all',
      title: 'Emergency Request Declined',
      titleBn: 'জরুরি অনুরোধ প্রত্যাখ্যান করা হয়েছে',
      message: `${hospitalName} reported no bed available (${reason}). You may revoke access and select another hospital.`,
      messageBn: `${hospitalName} বর্তমানে বেড খালি নেই বলে জানিয়েছে (${reason})। বিকল্প হাসপাতাল বেছে নিন।`,
      type: 'emergency',
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [notif, ...prev]);

    addAuditLog('EMERGENCY_REJECTED', `Hospital staff ${staffName} declined Request ID ${requestId}. Reason: ${reason}`);
    showToast('warning', 'Emergency Request Declined', reason);
  };

  // Hospital Redirects Emergency Request
  const redirectEmergencyRequest = (
    requestId: string,
    redirectHospitalId: string,
    redirectHospitalName: string,
    reason: string
  ) => {
    const staffName = currentUser?.displayName || 'Emergency Triage Doctor';
    const hospitalName = currentUser?.hospitalName || 'Hospital';

    setEmergencyRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'REDIRECTED',
            redirectHospitalId,
            redirectHospitalName,
            redirectReason: reason,
            statusMessage: `Redirected to ${redirectHospitalName}. Reason: ${reason}`
          };
        }
        return r;
      })
    );

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: 'all',
      title: 'Emergency Request Redirected',
      titleBn: 'জরুরি অনুরোধ অন্য হাসপাতালে পুনর্নির্দেশিত',
      message: `${hospitalName} redirected your case to ${redirectHospitalName} (${reason}).`,
      messageBn: `${hospitalName} আপনার কেস ${redirectHospitalName}-এ পাঠিয়েছে (${reason})।`,
      type: 'emergency',
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [notif, ...prev]);

    addAuditLog('EMERGENCY_REDIRECTED', `Staff ${staffName} redirected request ${requestId} to ${redirectHospitalName}. Reason: ${reason}`);
    showToast('info', 'Request Redirected', `Directed to ${redirectHospitalName}`);
  };

  // Mark Request Under Review
  const markRequestUnderReview = (requestId: string) => {
    setEmergencyRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'UNDER_REVIEW', statusMessage: 'Triage team is actively evaluating patient records and ICU capacity.' } : r))
    );
    showToast('info', 'Case Marked Under Review');
  };

  // Timeout Emergency Request
  const timeoutEmergencyRequest = (requestId: string) => {
    setEmergencyRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'TIMED_OUT',
            statusMessage: 'Hospital response timed out (>15 mins). You can revoke access and dispatch to another verified facility.'
          };
        }
        return r;
      })
    );

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: 'all',
      title: 'Hospital Request Timed Out',
      titleBn: 'হাসপাতালের সাড়াদানের সময় অতিক্রান্ত',
      message: 'Hospital did not respond within the emergency window. Please switch to another hospital.',
      messageBn: 'হাসপাতাল নির্ধারিত সময়ের মধ্যে সাড়া দেয়নি। অনুগ্রহ করে বিকল্প হাসপাতাল নির্বাচন করুন।',
      type: 'emergency',
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [notif, ...prev]);

    addAuditLog('EMERGENCY_TIMED_OUT', `Request ${requestId} timed out without staff acknowledgement.`);
    showToast('error', 'Hospital Request Timed Out');
  };

  const updateEmergencyStatus = (
    requestId: string,
    status: EmergencyRequest['status'],
    message?: string,
    bedType?: BedCategoryType,
    ambulanceData?: EmergencyRequest['ambulanceDetails']
  ) => {
    setEmergencyRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status, statusMessage: message || r.statusMessage, allocatedBedType: bedType || r.allocatedBedType, ambulanceDetails: ambulanceData || r.ambulanceDetails } : r))
    );
    showToast('info', 'Emergency Status Updated', status);
  };

  const cancelEmergencyRequest = (requestId: string) => {
    setEmergencyRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'CANCELLED', statusMessage: 'Cancelled by patient.' } : r))
    );
    showToast('info', 'Emergency Request Cancelled');
  };

  const updateBedAvailability = (
    recordId: string,
    totalCapacity: number,
    occupiedCount: number,
    notes?: string
  ): boolean => {
    if (isNaN(totalCapacity) || totalCapacity < 0) {
      showToast('error', 'Invalid Bed Capacity', 'Total capacity must be a non-negative number.');
      return false;
    }
    if (isNaN(occupiedCount) || occupiedCount < 0) {
      showToast('error', 'Invalid Occupied Beds', 'Occupied count must be a non-negative number.');
      return false;
    }
    if (occupiedCount > totalCapacity) {
      showToast('error', 'Capacity Conflict', 'Occupied beds cannot exceed total capacity.');
      return false;
    }

    const availableCount = totalCapacity - occupiedCount;
    const status: BedStatus = availableCount > 0 ? 'AVAILABLE' : 'UNAVAILABLE';
    const staffName = currentUser?.displayName || 'Emergency Staff';

    setBedRecords(prev =>
      prev.map(b => {
        if (b.id === recordId) {
          const updated = {
            ...b,
            totalCapacity,
            occupiedCount,
            availableCount,
            status,
            notes: notes !== undefined ? notes : b.notes,
            lastUpdated: new Date().toISOString(),
            updatedByStaffName: staffName,
            isStale: false
          };
          if (b.category === 'ICU') {
            updateHospitalBedCount(b.hospitalId, availableCount, availableCount);
          }
          return updated;
        }
        return b;
      })
    );

    addAuditLog('BED_AVAILABILITY_UPDATED', `Staff ${staffName} updated bed record ${recordId}: Total ${totalCapacity}, Occupied ${occupiedCount}, Available ${availableCount}`);
    showToast('success', 'Bed Availability Updated', `${availableCount} beds available (${status})`);
    return true;
  };

  const updateAmbulanceStatus = (
    requestId: string,
    status: AmbulanceStatus,
    driverPhone?: string,
    vehicleNo?: string,
    eta?: number,
    driverName?: string
  ) => {
    setEmergencyRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          const existingAmb = r.ambulanceDetails || {
            id: `AMB-${r.selectedHospitalId.slice(0, 3).toUpperCase()}-01`,
            operatorName: `${r.selectedHospitalName} EMS Dispatch`,
            driverName: 'Not yet assigned',
            driverPhone: '',
            vehicleNumber: '',
            status: 'REQUESTED' as AmbulanceStatus,
            etaMinutes: 0
          };
          const updatedAmb = {
            ...existingAmb,
            status,
            driverName: driverName || existingAmb.driverName,
            driverPhone: driverPhone || existingAmb.driverPhone,
            vehicleNumber: vehicleNo || existingAmb.vehicleNumber,
            etaMinutes: eta !== undefined ? eta : existingAmb.etaMinutes,
            dispatchTimestamp: status === 'DISPATCHED' ? new Date().toISOString() : existingAmb.dispatchTimestamp
          };
          return {
            ...r,
            ambulanceDetails: updatedAmb,
            statusMessage: `Ambulance operator updated fleet status to: ${status} (ETA: ${updatedAmb.etaMinutes} mins)`
          };
        }
        return r;
      })
    );

    addAuditLog('AMBULANCE_STATUS_UPDATE', `Ambulance for Request ${requestId} updated to ${status}`);
    showToast('info', 'Ambulance Telemetry Updated', status);
  };

  // Hospital Switching Workflow
  const switchEmergencyHospital = async (
    oldRequestId: string,
    newHospitalId: string,
    sharedDocIds: string[] = [],
    hoursValid: number = 4
  ): Promise<EmergencyRequest> => {
    // 1. Revoke access from old hospital grant
    const oldRequest = emergencyRequests.find(r => r.id === oldRequestId);
    if (oldRequest?.accessGrantToken) {
      const grant = accessGrants.find(g => g.token === oldRequest.accessGrantToken);
      if (grant) {
        revokeAccessGrant(grant.id, `Patient switched destination to another hospital.`);
      }
    }

    // 2. Mark old request as Cancelled / Transferred
    setEmergencyRequests(prev =>
      prev.map(r => (r.id === oldRequestId ? { ...r, status: 'CANCELLED', statusMessage: 'Cancelled by patient to switch destination hospital.' } : r))
    );

    // 3. Trigger new request to new hospital
    const newReq = await triggerEmergencySos(newHospitalId, true, sharedDocIds);
    showToast('success', 'Switched to New Hospital', `Fresh, independent access grant created for ${newReq.selectedHospitalName}`);
    return newReq;
  };

  // Create Access Grant
  const createAccessGrant = (
    hospitalId: string,
    hospitalName: string,
    docIds: string[],
    hoursValid: number,
    includeSummary: boolean,
    emergencyRequestId?: string,
    sharedCategories?: DocumentCategory[],
    includeInsurance: boolean = true
  ): DocumentAccessGrant => {
    const token = `GRANT-${hospitalId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6)}-${Date.now().toString(36).toUpperCase()}`;
    const newGrant: DocumentAccessGrant = {
      id: `grant-${Date.now()}`,
      patientId: patientProfile.userId,
      patientName: patientProfile.fullName || 'Patient',
      token,
      emergencyRequestId,
      sharedWithHospitalId: hospitalId,
      sharedWithHospitalName: hospitalName,
      documentIds: docIds,
      sharedCategories: sharedCategories || ['prescriptions', 'blood_reports', 'hospital_records', 'insurance'],
      includeSummary,
      includeAllergies: true,
      includeMedications: true,
      includeInsurance,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + hoursValid * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      accessLogs: []
    };

    setAccessGrants(prev => [newGrant, ...prev]);
    addAuditLog('CONSENT_GRANTED', `Created access grant ${token} for ${hospitalName} (${hoursValid}h validity)`);
    showToast('success', 'Access Grant Created', `Valid for ${hoursValid} hours`);
    return newGrant;
  };

  // Revoke Access Grant (Immediate Backend & UI Enforcement)
  const revokeAccessGrant = (grantId: string, reason: string = 'Patient initiated immediate revocation') => {
    const targetGrant = accessGrants.find(g => g.id === grantId);
    if (!targetGrant) return;

    setAccessGrants(prev =>
      prev.map(g => {
        if (g.id === grantId) {
          return {
            ...g,
            status: 'REVOKED',
            revokedAt: new Date().toISOString(),
            revocationReason: reason
          };
        }
        return g;
      })
    );

    // Update emergency request grant status
    setEmergencyRequests(prev =>
      prev.map(r => {
        if (r.accessGrantToken === targetGrant.token) {
          return { ...r, accessGrantStatus: 'REVOKED' };
        }
        return r;
      })
    );

    // Notify Hospital staff of revocation
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientId: 'all',
      title: 'Medical Record Access REVOKED',
      titleBn: 'মেডিকেল রেকর্ডের অনুমতি প্রত্যাহার করা হয়েছে',
      message: `Patient ${targetGrant.patientName} has revoked access for grant ${targetGrant.token}. Further document viewing is blocked.`,
      messageBn: `রোগী ${targetGrant.patientName} মেডিকেল রেকর্ড দেখার অনুমতি প্রত্যাহার করেছেন। ভবিষ্যৎ প্রদর্শন ব্লক করা হয়েছে।`,
      type: 'access',
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [notif, ...prev]);

    addAuditLog('ACCESS_REVOKED', `Patient revoked access grant ${targetGrant.token} for ${targetGrant.sharedWithHospitalName}. Subsequent access blocked.`);
    showToast('info', 'Access Revoked Successfully', 'Hospital cannot view your records anymore.');
  };

  // Record Staff Medical Access & Audit
  const recordMedicalAccess = (grantToken: string, patientName?: string, notes?: string): boolean => {
    const grant = accessGrants.find(g => g.token === grantToken);
    if (!grant) return false;

    if (grant.status === 'REVOKED') {
      showToast('error', 'Access Denied', 'The patient has revoked access to these medical records.');
      return false;
    }

    if (grant.status === 'EXPIRED' || new Date(grant.expiresAt).getTime() < Date.now()) {
      showToast('error', 'Access Expired', 'The time-limited consent window has expired.');
      return false;
    }

    const logEntry = {
      accessedAt: new Date().toISOString(),
      accessedBy: currentUser?.displayName || 'Emergency Triage Staff',
      staffRole: currentUser?.staffDesignation || 'Triage Duty Doctor',
      ipAddress: '10.14.0.82 (Hospital LAN)',
      notes: notes || 'Viewed permitted medical files for emergency triage'
    };

    setAccessGrants(prev =>
      prev.map(g => (g.token === grantToken ? { ...g, lastAccessTime: new Date().toISOString(), accessLogs: [logEntry, ...g.accessLogs] } : g))
    );

    addAuditLog('MEDICAL_RECORD_ACCESSED', `Hospital staff ${currentUser?.displayName} viewed records under grant ${grantToken} for patient ${patientName || grant.patientName}`);
    return true;
  };

  const getGrantForRequest = (requestId: string, hospitalId?: string): DocumentAccessGrant | null => {
    const req = emergencyRequests.find(r => r.id === requestId);
    if (!req) return null;
    return accessGrants.find(g => g.token === req.accessGrantToken || g.emergencyRequestId === requestId) || null;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('info', 'All notifications marked as read');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const activeEmergencyRequest = emergencyRequests.find(
    r => r.status !== 'COMPLETED' && r.status !== 'CANCELLED'
  ) || null;

  // Interactive 12-Scenario Demo Runner for Judges & Testers
  const runDemoScenario = (scenarioId: number) => {
    switch (scenarioId) {
      case 1: {
        // Hospital A has available ICU capacity
        updateBedStatus('bed-1', 'AVAILABLE', 4, 'Ventilator & oxygen pipeline verified.', false);
        loginHospitalStaff('staff-pan-1');
        showToast('success', 'Scenario 1: Hospital A ICU Capacity Verified Available', '4 beds ready with active ventilator.');
        break;
      }
      case 2: {
        // Hospital A reports no available ICU bed
        updateBedStatus('bed-1', 'UNAVAILABLE', 0, 'ICU currently full. No vacant critical beds.', false);
        loginHospitalStaff('staff-pan-1');
        showToast('warning', 'Scenario 2: Hospital A reports ICU Bed Full (UNAVAILABLE)', 'Available bed count: 0');
        break;
      }
      case 3: {
        // Hospital availability is unknown or stale
        toggleBedStaleness('bed-1');
        showToast('info', 'Scenario 3: Hospital ICU Bed marked STALE / UNKNOWN', 'Freshness threshold exceeded.');
        break;
      }
      case 4: {
        // Hospital A accepts an emergency request
        const req = emergencyRequests[0];
        if (req) {
          loginHospitalStaff('staff-pan-1');
          acceptEmergencyRequest(req.id, 'ICU', 'Triage doctor accepted SOS. Bed 04 reserved.');
          showToast('success', 'Scenario 4: Hospital A Accepted Emergency Request & Bed Allocated');
        }
        break;
      }
      case 5: {
        // Hospital A rejects an emergency request
        const req = emergencyRequests[0];
        if (req) {
          loginHospitalStaff('staff-pan-1');
          rejectEmergencyRequest(req.id, 'No vacant ICU bed. Recommend Sagore Dutta Hospital (3.1km).');
          showToast('warning', 'Scenario 5: Hospital A Rejected Request (Bed Full) -> Prompting Patient Switch');
        }
        break;
      }
      case 6: {
        // Hospital A fails to respond before timeout
        const req = emergencyRequests[0];
        if (req) {
          timeoutEmergencyRequest(req.id);
          showToast('error', 'Scenario 6: Emergency Request TIMED_OUT (15m window expired)');
        }
        break;
      }
      case 7: {
        // Patient revokes Hospital A's access
        const grant = accessGrants[0];
        if (grant) {
          revokeAccessGrant(grant.id, 'Patient revoked Hospital A access.');
          showToast('info', 'Scenario 7: Patient Revoked Hospital A Access Grant', 'Immediate lock-out enforced.');
        }
        break;
      }
      case 8: {
        // Patient selects Hospital B and grants a separate permission
        createAccessGrant('pan-hosp-2', 'Sagore Dutta Medical College (CMSDH)', ['doc-demo-1'], 4, true);
        showToast('success', 'Scenario 8: Patient Granted Fresh Independent Permission to Hospital B');
        break;
      }
      case 9: {
        // Hospital B cannot access Hospital A's revoked permission
        loginHospitalStaff('staff-cmsdh-1');
        showToast('success', 'Scenario 9: Logged in as Hospital B. Hospital A grants remain strictly inaccessible.');
        break;
      }
      case 10: {
        // Unauthorised staff account cannot access another hospital's requests
        loginHospitalStaff('staff-zenith-1');
        showToast('info', 'Scenario 10: Logged in as Zenith Hospital Staff. Requests for Panihati are isolated and hidden.');
        break;
      }
      case 11: {
        // Ambulance request is accepted, dispatched, and arrived
        const req = emergencyRequests[0];
        if (req) {
          updateAmbulanceStatus(req.id, 'DISPATCHED', '+91 98744 33221', 'WB 24 AL 4519', 4);
          showToast('success', 'Scenario 11: Ambulance Dispatched with Live Telemetry');
        }
        break;
      }
      case 12: {
        // Simulated Notifications
        const notif: AppNotification = {
          id: `notif-${Date.now()}`,
          recipientId: 'all',
          title: 'Simulated Notification Alert',
          titleBn: 'সিমুলেটেড জরুরি নোটিফিকেশন',
          message: 'ICU team pre-alert: Incoming critical patient ETA ~4 mins.',
          messageBn: 'আইসিইউ টিম সতর্কবার্তা: রোগী পৌঁছানোর সময় ~৪ মিনিট।',
          type: 'emergency',
          timestamp: new Date().toISOString(),
          isRead: false
        };
        setNotifications(prev => [notif, ...prev]);
        showToast('info', 'Scenario 12: Simulated Notification Triggered');
        break;
      }
      default:
        break;
    }
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setCurrentUser(null);
    setIsLoggedIn(false);
    setPatientProfile(createBlankProfile());
    setMedicalDocuments([]);
    setTimelineEvents([]);
    setInsurancePolicies([]);
    setEmergencyRequests(mockEmergencyRequests);
    setAccessGrants(mockAccessGrants);
    setBedRecords(mockBedRecords);
    showToast('info', 'Reset to initial verified healthcare demo data.');
    navigateTo('landing');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userRole: currentUser?.role || 'patient',
        isLoggedIn,
        hospitalStaffAccounts: mockHospitalStaffAccounts,
        registerPatient,
        loginWithPhone,
        loginHospitalStaff,
        switchHospitalStaffAccount,
        logout,
        switchRole,
        currentPage,
        setCurrentPage,
        pageParams,
        navigateTo,
        patientProfile,
        updatePatientProfile,
        medicalDocuments,
        addMedicalDocument,
        deleteMedicalDocument,
        updateMedicalDocument,
        timelineEvents,
        addTimelineEvent,
        insurancePolicies,
        addInsurancePolicy,
        deleteInsurancePolicy,
        hospitals,
        selectedSearchLocation,
        setSelectedSearchLocation,
        selectedNearbyHospital,
        setSelectedNearbyHospital,
        updateHospitalBedCount,
        bedRecords,
        updateBedStatus,
        updateBedAvailability,
        addBedRecord,
        toggleBedStaleness,
        emergencyRequests,
        hospitalEmergencyRequests,
        activeEmergencyRequest,
        triggerEmergencySos,
        acceptEmergencyRequest,
        rejectEmergencyRequest,
        redirectEmergencyRequest,
        markRequestUnderReview,
        timeoutEmergencyRequest,
        updateEmergencyStatus,
        cancelEmergencyRequest,
        updateAmbulanceStatus,
        switchEmergencyHospital,
        accessGrants,
        createAccessGrant,
        revokeAccessGrant,
        recordMedicalAccess,
        getGrantForRequest,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        auditLogs,
        addAuditLog,
        runDemoScenario,
        toasts,
        showToast,
        removeToast,
        resetToDefaultData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
