import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  Building2,
  AlertOctagon,
  Bed,
  Ambulance,
  PhoneCall,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  Clock,
  ShieldAlert,
  Search,
  Filter,
  Eye,
  Lock,
  History,
  Activity,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  MapPin,
  ArrowRight,
  Sliders,
  X,
  Phone,
  Info,
  AlertTriangle
} from 'lucide-react';
import {
  BedCategoryType,
  EmergencyRequest,
  DocumentAccessGrant,
  AmbulanceStatus,
  EmergencyRequestStatus,
  MedicalDocument,
  TriagePriority,
  HospitalDepartment,
  HospitalClinicalAssessment
} from '../types';
import { allVerifiedHospitals, isMatchingHospital } from '../data/verifiedHospitals';

export const HospitalEmergencyDashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const {
    currentUser,
    emergencyRequests,
    hospitalEmergencyRequests,
    bedRecords,
    accessGrants,
    medicalDocuments,
    hospitalStaffAccounts,
    switchHospitalStaffAccount,
    acceptEmergencyRequest,
    rejectEmergencyRequest,
    declineEmergencyRequest,
    saveClinicalAssessment,
    respondToClarification,
    confirmAdmission,
    redirectEmergencyRequest,
    markRequestUnderReview,
    updateBedAvailability,
    updateAmbulanceStatus,
    recordMedicalAccess,
    auditLogs,
    showToast,
    navigateTo,
    logout
  } = useApp();

  // Navigation tab in Hospital Dashboard
  const [activeTab, setActiveTab] = useState<'inbox' | 'beds' | 'ambulance' | 'audit'>('inbox');

  // Selected request for details modal or document review modal
  const [detailModalRequest, setDetailModalRequest] = useState<EmergencyRequest | null>(null);
  const [docsModalRequest, setDocsModalRequest] = useState<EmergencyRequest | null>(null);
  const [previewingDoc, setPreviewingDoc] = useState<MedicalDocument | null>(null);

  // Dedicated Clinical Triage & Emergency Assessment Screen Modal State
  const [assessmentModalRequest, setAssessmentModalRequest] = useState<EmergencyRequest | null>(null);
  const [triageNotes, setTriageNotes] = useState('');
  const [triagePriority, setTriagePriority] = useState<TriagePriority>('P2_EMERGENT');
  const [suspectedCareRequirement, setSuspectedCareRequirement] = useState('');
  const [recommendedDept, setRecommendedDept] = useState<HospitalDepartment>('Emergency Department');
  const [icuAssessmentRequired, setIcuAssessmentRequired] = useState<'Yes' | 'No' | 'Undetermined'>('Undetermined');
  const [bedRequirement, setBedRequirement] = useState<'ICU' | 'Emergency Department' | 'General Ward' | 'Other' | 'Undetermined'>('Emergency Department');
  const [bedConfirmedForRequest, setBedConfirmedForRequest] = useState(false);
  const [requestInfoQuestion, setRequestInfoQuestion] = useState('');
  const [declineReasonCategory, setDeclineReasonCategory] = useState('No suitable bed confirmed');

  const handleOpenAssessmentModal = (req: EmergencyRequest) => {
    setAssessmentModalRequest(req);
    setTriageNotes(req.clinicalAssessment?.notes || '');
    setTriagePriority(req.clinicalAssessment?.triagePriority || (req.priority === 'CRITICAL' ? 'P1_RESUSCITATION' : 'P2_EMERGENT'));
    setSuspectedCareRequirement(req.clinicalAssessment?.suspectedCareRequirement || '');
    setRecommendedDept(req.clinicalAssessment?.recommendedDepartment || 'Emergency Department');
    setIcuAssessmentRequired(req.clinicalAssessment?.icuAssessmentRequired || 'Undetermined');
    setBedRequirement(req.clinicalAssessment?.bedRequirement || 'Emergency Department');
    setBedConfirmedForRequest(req.clinicalAssessment?.bedConfirmedStatus === 'CONFIRMED');
    setRequestInfoQuestion('');
  };

  // Search & Filters in Request Inbox
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | EmergencyRequestStatus>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'CRITICAL' | 'URGENT' | 'STANDARD'>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'priority'>('newest');

  // Modal states for Consequential Actions
  const [actionTargetRequest, setActionTargetRequest] = useState<EmergencyRequest | null>(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showRedirectModal, setShowRedirectModal] = useState(false);

  // Accept action inputs
  const [allocatedBedType, setAllocatedBedType] = useState<BedCategoryType>('ICU');
  const [acceptNote, setAcceptNote] = useState('');

  // Decline action inputs
  const [declineReason, setDeclineReason] = useState('No ICU bed currently available at this facility');

  // Redirect action inputs
  const [redirectTargetHospId, setRedirectTargetHospId] = useState('');
  const [redirectReasonInput, setRedirectReasonInput] = useState('Specialized emergency care required; bed confirmed at target hospital');

  // Bed Management Inline/Modal Edit state
  const [editingBedRecordId, setEditingBedRecordId] = useState<string | null>(null);
  const [editTotalCapacity, setEditTotalCapacity] = useState<number>(0);
  const [editOccupiedCount, setEditOccupiedCount] = useState<number>(0);
  const [editBedNotes, setEditBedNotes] = useState<string>('');

  // Ambulance Dispatch Action inputs (per request)
  const [ambulanceFormReqId, setAmbulanceFormReqId] = useState<string | null>(null);
  const [dispatchDriverName, setDispatchDriverName] = useState('');
  const [dispatchDriverPhone, setDispatchDriverPhone] = useState('');
  const [dispatchVehicleNo, setDispatchVehicleNo] = useState('');
  const [dispatchEtaMins, setDispatchEtaMins] = useState<number>(10);

  // Audit filter state
  const [auditFilterAction, setAuditFilterAction] = useState<string>('ALL');

  // Real-time synchronization timestamp
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setLastSyncTime(new Date().toLocaleTimeString());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // 1. HOSPITAL IDENTITY & CONTACT DETAILS
  const currentHospitalInfo = useMemo(() => {
    if (!currentUser?.hospitalId) return null;
    return allVerifiedHospitals.find(h => isMatchingHospital(h.id, currentUser.hospitalId)) || null;
  }, [currentUser?.hospitalId]);

  const hospitalDisplayName = currentUser?.hospitalName || currentHospitalInfo?.name || 'Authorized Hospital';
  const hospitalEmergencyPhone = currentHospitalInfo?.phone || '033 2553 1243';
  const hospitalAreaLocality = currentHospitalInfo?.locality || currentHospitalInfo?.area || 'Kolkata Metropolitan Area';

  // 2. HOSPITAL-SPECIFIC BED RECORDS
  const currentHospitalBeds = useMemo(() => {
    if (!currentUser?.hospitalId) return [];
    return bedRecords.filter(b => isMatchingHospital(b.hospitalId, currentUser.hospitalId));
  }, [bedRecords, currentUser?.hospitalId]);

  // 3. OVERVIEW CARDS: DERIVED DYNAMIC METRIC COUNTS
  const metrics = useMemo(() => {
    const list = hospitalEmergencyRequests;
    const newRequests = list.filter(r => r.status === 'SUBMITTED' || r.status === 'PENDING').length;
    const underReview = list.filter(r => r.status === 'UNDER_REVIEW').length;
    const accepted = list.filter(r => r.status === 'ACCEPTED' || r.status === 'BED_CONFIRMED').length;
    const declinedOrRedirected = list.filter(r => r.status === 'REJECTED' || r.status === 'DECLINED' || r.status === 'REDIRECTED').length;
    const timedOut = list.filter(r => r.status === 'TIMED_OUT').length;

    const icuRecord = currentHospitalBeds.find(b => b.category === 'ICU');
    const availableIcu = icuRecord
      ? Math.max(0, icuRecord.totalCapacity - (icuRecord.occupiedCount ?? (icuRecord.totalCapacity - icuRecord.availableCount)))
      : 0;

    const activeAmbulanceCount = list.filter(
      r => r.ambulanceRequested &&
           r.ambulanceDetails &&
           ['DISPATCHED', 'EN_ROUTE', 'PICKUP_IN_PROGRESS', 'ACCEPTED'].includes(r.ambulanceDetails.status)
    ).length;

    return {
      newRequests,
      underReview,
      accepted,
      declinedOrRedirected,
      timedOut,
      availableIcu,
      icuTotal: icuRecord?.totalCapacity ?? 0,
      hasIcuData: Boolean(icuRecord),
      activeAmbulanceCount
    };
  }, [hospitalEmergencyRequests, currentHospitalBeds]);

  // 4. FILTERED EMERGENCY REQUESTS FOR INBOX
  const filteredRequests = useMemo(() => {
    return hospitalEmergencyRequests
      .filter(req => {
        const query = searchQuery.trim().toLowerCase();
        const matchesQuery =
          !query ||
          req.patientName.toLowerCase().includes(query) ||
          req.id.toLowerCase().includes(query) ||
          req.patientAddress.toLowerCase().includes(query) ||
          (req.symptomsDescription && req.symptomsDescription.toLowerCase().includes(query));

        let matchesStatus = true;
        if (statusFilter !== 'ALL') {
          if (statusFilter === 'SUBMITTED') {
            matchesStatus = req.status === 'SUBMITTED' || req.status === 'PENDING';
          } else if (statusFilter === 'DECLINED') {
            matchesStatus = req.status === 'DECLINED' || req.status === 'REJECTED';
          } else {
            matchesStatus = req.status === statusFilter;
          }
        }

        let matchesPriority = true;
        if (priorityFilter !== 'ALL') {
          matchesPriority = (req.priority || 'STANDARD') === priorityFilter;
        }

        return matchesQuery && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          const rank = (p?: string) => (p === 'CRITICAL' ? 3 : p === 'URGENT' ? 2 : 1);
          return rank(b.priority) - rank(a.priority);
        }
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
  }, [hospitalEmergencyRequests, searchQuery, statusFilter, priorityFilter, sortBy]);

  // 5. AUTHENTICATION & ACCESS GUARD
  if (!currentUser || currentUser.role !== 'hospital_staff') {
    return (
      <div className="min-h-screen bg-white text-[#171717] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#E8F5E9] border border-[#D5E8D7] rounded-3xl p-8 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-white border border-[#D5E8D7] text-[#2E7D32] flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#171717]">
              {language === 'bn' ? 'অনুমোদিত প্রবেশাধিকার প্রয়োজন' : 'Hospital Staff Authorization Required'}
            </h2>
            <p className="text-xs text-[#555555] leading-relaxed">
              {language === 'bn'
                ? 'এই পোর্টালটি শুধুমাত্র যাচাইকৃত হাসপাতাল ইআর ও ট্রায়াজ ডেস্ক কর্মীদের জন্য সংরক্ষিত।'
                : 'This emergency command portal is strictly restricted to verified hospital triage staff and duty medical officers.'}
            </p>
          </div>
          <div className="pt-2 space-y-3">
            <button
              onClick={() => navigateTo('hospital-login')}
              className="w-full py-3.5 px-4 bg-[#2E7D32] hover:bg-[#256B2A] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2"
            >
              <Building2 className="w-4 h-4 text-white" />
              <span>{language === 'bn' ? 'হাসপাতাল স্টাফ লগইন করুন' : 'Sign In as Hospital Staff'}</span>
            </button>
            <button
              onClick={() => navigateTo('landing')}
              className="w-full py-2.5 px-4 bg-white hover:bg-[#F1F8F2] text-[#171717] border border-[#D5E8D7] font-bold text-xs rounded-xl transition-all"
            >
              {language === 'bn' ? 'হোম পেজে ফিরে যান' : 'Return to Home'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleOpenDocReview = (req: EmergencyRequest) => {
    setDocsModalRequest(req);
    if (req.accessGrantToken) {
      recordMedicalAccess(req.accessGrantToken, req.patientName, `Staff opened MediVault review for emergency request ${req.id}`);
    }
  };

  const handleStartEditBed = (recordId: string, currentTotal: number, currentOccupied: number, notes?: string) => {
    setEditingBedRecordId(recordId);
    setEditTotalCapacity(currentTotal);
    setEditOccupiedCount(currentOccupied);
    setEditBedNotes(notes || '');
  };

  const handleSaveBedChanges = (recordId: string) => {
    if (editTotalCapacity < 0 || editOccupiedCount < 0) {
      showToast('error', 'Invalid Bed Input', 'Bed numbers must be non-negative values.');
      return;
    }
    if (editOccupiedCount > editTotalCapacity) {
      showToast('error', 'Capacity Conflict', 'Occupied beds cannot exceed total capacity.');
      return;
    }

    const success = updateBedAvailability(recordId, editTotalCapacity, editOccupiedCount, editBedNotes);
    if (success) {
      setEditingBedRecordId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#171717] py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ================= SECTION A: HOSPITAL HEADER ================= */}
        <header className="bg-[#E8F5E9] rounded-3xl p-6 border border-[#D5E8D7] shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white text-[#2E7D32] border border-[#D5E8D7] text-xs font-bold flex items-center space-x-1.5 shadow-xs">
                <Building2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>SUSTHAYAN Emergency Hospital Portal</span>
              </span>

              <span className="px-2.5 py-0.5 rounded-md bg-white text-[#2E7D32] border border-[#D5E8D7] text-[11px] font-mono font-semibold flex items-center space-x-1 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse"></span>
                <span>Sync Active ({lastSyncTime})</span>
              </span>

              <span className="px-2.5 py-0.5 rounded-md bg-white text-[#555555] border border-[#D5E8D7] text-[11px] font-bold">
                Hospital ID: {currentUser.hospitalId}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight flex items-center space-x-2">
              <span>{hospitalDisplayName}</span>
              {currentHospitalInfo?.isVerifiedPartner && (
                <span title="Verified Healthcare Facility" className="inline-flex text-[#2E7D32]">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
              )}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#555555]">
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Duty Staff:</span>
                <strong className="text-[#171717] ml-1">{currentUser.displayName}</strong>
                <span className="text-[#777777]">({currentUser.staffDesignation || 'Triage Officer'})</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <PhoneCall className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>ER Helpline:</span>
                <strong className="text-[#171717] ml-1">{hospitalEmergencyPhone}</strong>
              </span>
              <span>•</span>
              <span className="text-[#555555] flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-[#2E7D32]" />
                {hospitalAreaLocality}
              </span>
            </div>
          </div>

          {/* Staff Switcher for Multi-Tenant Isolation Testing */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#D5E8D7] space-y-2 shrink-0 w-full lg:w-auto shadow-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#555555]">
              <span>Authorized Hospital Session:</span>
              <span className="text-[10px] text-[#2E7D32] font-semibold">Tenant Switcher</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {hospitalStaffAccounts.map(account => {
                const isActive = currentUser.uid === account.id || currentUser.hospitalId === account.hospitalId;
                return (
                  <button
                    key={account.id}
                    onClick={() => switchHospitalStaffAccount(account.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      isActive
                        ? 'bg-[#2E7D32] text-white shadow-xs'
                        : 'bg-[#F1F8F2] text-[#171717] hover:bg-[#E8F5E9] border border-[#D5E8D7]'
                    }`}
                  >
                    <span>{account.hospitalName.split(' ')[0]}</span>
                    {isActive && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* ================= SECTION B: DASHBOARD OVERVIEW CARDS ================= */}
        <section aria-label="Dashboard Overview Metrics" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {/* 1. New Emergency Requests */}
          <div className="bg-[#E8F5E9] p-4 rounded-2xl border border-[#D5E8D7] shadow-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#D32F2F] uppercase tracking-wider">
                New Requests
              </span>
              <AlertOctagon className="w-4 h-4 text-[#D32F2F]" />
            </div>
            <div className="text-2xl font-black text-[#D32F2F]">{metrics.newRequests}</div>
            <span className="text-[10px] text-[#555555] block">Pending triage</span>
          </div>

          {/* 2. Under Review */}
          <div className="bg-[#E8F5E9] p-4 rounded-2xl border border-[#D5E8D7] shadow-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#171717] uppercase tracking-wider">
                Under Review
              </span>
              <Clock className="w-4 h-4 text-[#2E7D32]" />
            </div>
            <div className="text-2xl font-black text-[#171717]">{metrics.underReview}</div>
            <span className="text-[10px] text-[#555555] block">Staff evaluating</span>
          </div>

          {/* 3. Accepted Requests */}
          <div className="bg-[#E8F5E9] p-4 rounded-2xl border border-[#D5E8D7] shadow-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#2E7D32] uppercase tracking-wider">
                Accepted
              </span>
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
            </div>
            <div className="text-2xl font-black text-[#2E7D32]">{metrics.accepted}</div>
            <span className="text-[10px] text-[#555555] block">Bed reserved</span>
          </div>

          {/* 4. Declined / Redirected */}
          <div className="bg-[#E8F5E9] p-4 rounded-2xl border border-[#D5E8D7] shadow-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#171717] uppercase tracking-wider">
                Declined / Redir
              </span>
              <XCircle className="w-4 h-4 text-[#555555]" />
            </div>
            <div className="text-2xl font-black text-[#171717]">{metrics.declinedOrRedirected}</div>
            <span className="text-[10px] text-[#555555] block">Case redirected</span>
          </div>

          {/* 5. Timed-out Requests */}
          <div className="bg-[#E8F5E9] p-4 rounded-2xl border border-[#D5E8D7] shadow-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#171717] uppercase tracking-wider">
                Timed Out
              </span>
              <History className="w-4 h-4 text-[#555555]" />
            </div>
            <div className="text-2xl font-black text-[#171717]">{metrics.timedOut}</div>
            <span className="text-[10px] text-[#555555] block">&gt;15 min timeout</span>
          </div>

          {/* 6. Available ICU Beds */}
          <div className="bg-[#E8F5E9] p-4 rounded-2xl border border-[#D5E8D7] shadow-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#2E7D32] uppercase tracking-wider">
                Available ICU
              </span>
              <Bed className="w-4 h-4 text-[#2E7D32]" />
            </div>
            <div className="text-2xl font-black text-[#2E7D32]">
              {metrics.hasIcuData ? `${metrics.availableIcu}` : 'N/A'}
            </div>
            <span className="text-[10px] text-[#555555] block">
              {metrics.hasIcuData ? `of ${metrics.icuTotal} capacity` : 'Data not available'}
            </span>
          </div>

          {/* 7. Active Ambulances */}
          <div className="bg-[#E8F5E9] p-4 rounded-2xl border border-[#D5E8D7] shadow-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#2E7D32] uppercase tracking-wider">
                Ambulances
              </span>
              <Ambulance className="w-4 h-4 text-[#2E7D32]" />
            </div>
            <div className="text-2xl font-black text-[#171717]">{metrics.activeAmbulanceCount}</div>
            <span className="text-[10px] text-[#555555] block">Active dispatches</span>
          </div>
        </section>

        {/* ================= SECTION NAVIGATION TABS ================= */}
        <nav aria-label="Portal Navigation" className="flex border-b border-[#D5E8D7] space-x-2 pb-1 overflow-x-auto scrollbar-none">
          {[
            {
              id: 'inbox',
              label: language === 'bn' ? 'জরুরি অনুরোধ ইনবক্স' : 'Emergency Request Inbox',
              icon: AlertOctagon,
              count: hospitalEmergencyRequests.length
            },
            {
              id: 'beds',
              label: language === 'bn' ? 'বেড প্রাপ্যতা ব্যবস্থাপনা' : 'Bed Availability Management',
              icon: Bed,
              count: currentHospitalBeds.length
            },
            {
              id: 'ambulance',
              label: language === 'bn' ? 'অ্যাম্বুলেন্স সমন্বয়' : 'Ambulance Coordination',
              icon: Ambulance,
              count: hospitalEmergencyRequests.filter(r => r.ambulanceRequested).length
            },
            {
              id: 'audit',
              label: language === 'bn' ? 'অডিট ও নিরাপত্তা লগ' : 'Audit Trail & Compliance',
              icon: History,
              count: null
            }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-2xl font-bold text-xs shrink-0 transition-all border ${
                  isActive
                    ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#D5E8D7] shadow-xs'
                    : 'bg-white text-[#555555] border-[#D5E8D7] hover:bg-[#F1F8F2] hover:text-[#171717]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#2E7D32]' : 'text-[#555555]'}`} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive
                        ? 'bg-[#2E7D32] text-white'
                        : 'bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ================= SECTION C: EMERGENCY REQUEST INBOX ================= */}
        {activeTab === 'inbox' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Search and Filters Bar */}
            <div className="bg-[#E8F5E9] p-4 rounded-2xl border border-[#D5E8D7] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#555555] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by patient name, ID, emergency symptoms, or address..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-[#D5E8D7] rounded-xl text-xs text-[#171717] placeholder-slate-400 focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Status Filter */}
                <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#D5E8D7] text-xs">
                  <Filter className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as any)}
                    className="bg-transparent text-[#171717] font-medium text-xs focus:outline-none"
                  >
                    <option value="ALL">All Statuses ({hospitalEmergencyRequests.length})</option>
                    <option value="SUBMITTED">Submitted / Pending</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="DECLINED">Declined / Rejected</option>
                    <option value="REDIRECTED">Redirected</option>
                    <option value="TIMED_OUT">Timed Out</option>
                  </select>
                </div>

                {/* Priority Filter */}
                <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#D5E8D7] text-xs">
                  <Sliders className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <select
                    value={priorityFilter}
                    onChange={e => setPriorityFilter(e.target.value as any)}
                    className="bg-transparent text-[#171717] font-medium text-xs focus:outline-none"
                  >
                    <option value="ALL">All Triage Priorities</option>
                    <option value="CRITICAL">Critical (Red)</option>
                    <option value="URGENT">Urgent (Yellow)</option>
                    <option value="STANDARD">Standard</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#D5E8D7] text-xs">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="bg-transparent text-[#171717] font-medium text-xs focus:outline-none"
                  >
                    <option value="newest">Sort: Newest First</option>
                    <option value="priority">Sort: Highest Priority</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Empty State vs Real Requests */}
            {filteredRequests.length === 0 ? (
              <div className="bg-[#E8F5E9] rounded-3xl p-12 text-center text-[#555555] border border-[#D5E8D7] space-y-3 shadow-xs">
                <AlertOctagon className="w-10 h-10 text-[#2E7D32] mx-auto" />
                <h3 className="text-base font-bold text-[#171717]">No emergency requests yet</h3>
                <p className="text-xs text-[#555555] max-w-md mx-auto leading-relaxed">
                  {hospitalEmergencyRequests.length === 0
                    ? `There are currently no emergency assistance requests routed to ${hospitalDisplayName}. Requests submitted by patients via Nearby Hospitals will appear here in real time.`
                    : 'No requests matched your search or filter criteria. Try clearing filters to see all requests.'}
                </p>
                {hospitalEmergencyRequests.length > 0 && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('ALL');
                      setPriorityFilter('ALL');
                    }}
                    className="mt-2 px-4 py-2 bg-white hover:bg-[#F1F8F2] text-[#2E7D32] border border-[#D5E8D7] rounded-xl text-xs font-bold"
                  >
                    Reset Search & Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRequests.map(req => {
                  const reqGrant = accessGrants.find(
                    g => g.token === req.accessGrantToken || g.emergencyRequestId === req.id
                  );
                  const isConsentRevoked = reqGrant?.status === 'REVOKED' || req.accessGrantStatus === 'REVOKED';
                  const hasConsent = reqGrant?.status === 'ACTIVE' && !isConsentRevoked;
                  const isCritical = req.priority === 'CRITICAL';
                  const isUrgent = req.priority === 'URGENT';

                  return (
                    <article
                      key={req.id}
                      className="bg-[#E8F5E9] rounded-2xl p-5 border border-[#D5E8D7] hover:border-[#2E7D32] transition-all space-y-4 shadow-xs"
                    >
                      {/* Top Header Line */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#D5E8D7] text-xs">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#2E7D32] bg-white px-2.5 py-0.5 rounded-lg border border-[#D5E8D7]">
                            {req.id}
                          </span>

                          {/* Status Badge */}
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                              req.status === 'SUBMITTED' || req.status === 'PENDING'
                                ? 'bg-white text-[#D32F2F] border border-rose-300'
                                : req.status === 'UNDER_REVIEW'
                                ? 'bg-white text-amber-700 border border-amber-300'
                                : req.status === 'ACCEPTED' || req.status === 'BED_CONFIRMED'
                                ? 'bg-[#2E7D32] text-white'
                                : req.status === 'REDIRECTED'
                                ? 'bg-white text-cyan-800 border border-cyan-300'
                                : req.status === 'TIMED_OUT'
                                ? 'bg-white text-purple-800 border border-purple-300'
                                : 'bg-white text-[#555555] border border-[#D5E8D7]'
                            }`}
                          >
                            Status: {req.status}
                          </span>

                          {/* Priority Badge */}
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              isCritical
                                ? 'bg-rose-100 text-[#D32F2F] border border-rose-300 font-black'
                                : isUrgent
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-white text-[#555555] border border-[#D5E8D7]'
                            }`}
                          >
                            {req.priority || 'STANDARD'} PRIORITY
                          </span>

                          {/* Ambulance Badge */}
                          {req.ambulanceRequested && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-[#2E7D32] border border-[#D5E8D7] flex items-center space-x-1">
                              <Ambulance className="w-3 h-3 mr-0.5 text-[#2E7D32]" />
                              <span>Ambulance Requested</span>
                            </span>
                          )}

                          {/* MediVault Docs Badge */}
                          {hasConsent && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-[#2E7D32] border border-[#D5E8D7] flex items-center space-x-1">
                              <FileText className="w-3 h-3 mr-0.5 text-[#2E7D32]" />
                              <span>MediVault Shared</span>
                            </span>
                          )}

                          {isConsentRevoked && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-300">
                              Consent Revoked
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 text-[#555555] text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-[#2E7D32]" />
                          <span>Submitted: {new Date(req.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      {/* Request Body & Content */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* Patient Core Info */}
                        <div className="lg:col-span-4 space-y-1 text-xs">
                          <h4 className="text-base font-bold text-[#171717]">{req.patientName}</h4>
                          <p className="text-[#555555]">
                            Age: <strong className="text-[#171717]">{req.patientAge ? `${req.patientAge} Years` : 'Not specified'}</strong> • Blood Group:{' '}
                            <strong className="text-[#2E7D32]">{req.patientBloodGroup || 'N/A'}</strong>
                          </p>
                          <p className="text-[#555555]">Phone: <strong className="text-[#171717]">{req.patientPhone || 'Not provided'}</strong></p>
                          <p className="text-[#555555] truncate">📍 {req.patientAddress || 'Location coordinates on file'}</p>
                        </div>

                        {/* Emergency Complaint & Condition Parameters */}
                        <div className="lg:col-span-5 space-y-2 text-xs">
                          <div>
                            <span className="text-[11px] font-bold text-[#555555] uppercase tracking-wider block">
                              {language === 'bn' ? 'রোগীর বর্ণিত সমস্যা ও উপসর্গ:' : 'Patient-Reported Problem & Symptoms:'}
                            </span>
                            <p className="bg-white p-3 rounded-xl border border-[#D5E8D7] text-[#171717] font-medium leading-relaxed shadow-xs mt-1">
                              {req.chiefComplaint || req.symptomsDescription || 'Acute medical emergency assistance requested.'}
                            </p>
                          </div>

                          {/* Quick clinical parameter badges */}
                          <div className="flex flex-wrap gap-1.5 text-[11px]">
                            {req.reportedSeverity && (
                              <span className="px-2 py-0.5 rounded-md bg-white border border-[#D5E8D7] font-semibold text-[#171717]">
                                Severity: <strong className={req.reportedSeverity === 'Severe' ? 'text-rose-700' : 'text-[#2E7D32]'}>{req.reportedSeverity}</strong>
                              </span>
                            )}
                            {req.consciousnessStatus && (
                              <span className="px-2 py-0.5 rounded-md bg-white border border-[#D5E8D7] font-semibold text-[#171717]">
                                Consciousness: <strong>{req.consciousnessStatus}</strong>
                              </span>
                            )}
                            {req.breathingStatus && (
                              <span className="px-2 py-0.5 rounded-md bg-white border border-[#D5E8D7] font-semibold text-[#171717]">
                                Breathing: <strong className={req.breathingStatus !== 'Normal' ? 'text-rose-700' : 'text-[#171717]'}>{req.breathingStatus}</strong>
                              </span>
                            )}
                            {req.problemStartedAt && (
                              <span className="px-2 py-0.5 rounded-md bg-white border border-[#D5E8D7] text-[#555555]">
                                Onset: {req.problemStartedAt}
                              </span>
                            )}
                          </div>

                          {/* Allergies & Conditions snippet */}
                          {(req.knownAllergies?.length > 0 || req.existingConditions?.length > 0) && (
                            <div className="p-2 bg-white rounded-lg border border-[#D5E8D7] text-[11px] space-y-0.5">
                              {req.knownAllergies?.length > 0 && (
                                <p className="text-rose-800">
                                  <strong>Allergies:</strong> {req.knownAllergies.join(', ')}
                                </p>
                              )}
                              {req.existingConditions?.length > 0 && (
                                <p className="text-[#555555]">
                                  <strong>Conditions:</strong> {req.existingConditions.join(', ')}
                                </p>
                              )}
                            </div>
                          )}

                          {req.redirectReason && (
                            <p className="text-[11px] text-cyan-800 bg-cyan-50 p-2 rounded-lg border border-cyan-200">
                              Redirect Note: {req.redirectReason} (To: {req.redirectHospitalName || req.redirectHospitalId})
                            </p>
                          )}
                          {req.rejectionReason && (
                            <p className="text-[11px] text-rose-800 bg-rose-50 p-2 rounded-lg border border-rose-200">
                              Decline Reason: {req.rejectionReason}
                            </p>
                          )}
                        </div>

                        {/* Actions Area */}
                        <div className="lg:col-span-3 flex flex-col justify-between space-y-2">
                          <button
                            onClick={() => handleOpenAssessmentModal(req)}
                            className="w-full py-2.5 px-3 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-black shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                          >
                            <Activity className="w-4 h-4 text-white" />
                            <span>{language === 'bn' ? 'ক্লিনিক্যাল ট্রায়াজ ও মূল্যায়ন' : 'Perform Clinical Triage'}</span>
                          </button>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => setDetailModalRequest(req)}
                              className="py-1.5 px-2.5 rounded-xl bg-white hover:bg-[#F1F8F2] text-[#171717] border border-[#D5E8D7] text-xs font-bold transition-all flex items-center justify-center space-x-1"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#2E7D32]" />
                              <span>Details</span>
                            </button>

                            <button
                              onClick={() => handleOpenDocReview(req)}
                              className="py-1.5 px-2.5 rounded-xl bg-white hover:bg-[#F1F8F2] text-[#2E7D32] border border-[#D5E8D7] text-xs font-bold transition-all flex items-center justify-center space-x-1"
                            >
                              <FileText className="w-3.5 h-3.5 text-[#2E7D32]" />
                              <span>Vault Docs</span>
                            </button>
                          </div>

                          {/* Quick status indicator or actions */}
                          {req.status === 'ACCEPTED_FOR_COORDINATION' || req.status === 'ACCEPTED' ? (
                            <div className="p-2 bg-white rounded-xl border border-[#D5E8D7] text-[#2E7D32] text-xs font-bold text-center">
                              ✓ Accepted for Coordination
                            </div>
                          ) : req.status === 'ADMISSION_CONFIRMED' ? (
                            <div className="p-2 bg-emerald-100 rounded-xl border border-emerald-300 text-emerald-900 text-xs font-bold text-center">
                              ✓ Admission Confirmed
                            </div>
                          ) : req.status === 'UNABLE_TO_ACCOMMODATE' || req.status === 'REJECTED' ? (
                            <div className="p-2 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 text-xs font-bold text-center">
                              ✕ Unable to Accommodate
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-1.5 pt-1">
                              <button
                                onClick={() => {
                                  setActionTargetRequest(req);
                                  setShowAcceptModal(true);
                                }}
                                className="py-1.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center space-x-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                <span>Accept</span>
                              </button>

                              <button
                                onClick={() => {
                                  setActionTargetRequest(req);
                                  setShowDeclineModal(true);
                                }}
                                className="py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
                              >
                                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                <span>Decline</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= SECTION E: HOSPITAL BED AVAILABILITY MANAGEMENT ================= */}
        {activeTab === 'beds' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="bg-[#E8F5E9] rounded-3xl p-6 border border-[#D5E8D7] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-[#2E7D32] font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                  <span>Real-Time Hospital Bed Governance</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#171717]">
                  Bed Availability & Capacity Management
                </h2>
                <p className="text-xs text-[#555555] max-w-2xl leading-relaxed">
                  Duty medical staff must verify and maintain real bed occupancy for Intensive Care Units (ICU), General Wards, and Emergency Departments (ER). Updates persist and automatically sync across the emergency network.
                </p>
              </div>

              <div className="px-3.5 py-1.5 bg-white border border-[#D5E8D7] text-[#2E7D32] rounded-xl text-xs font-bold shrink-0">
                Hospital: {hospitalDisplayName}
              </div>
            </div>

            {/* Bed Category Cards (ICU, General Ward, Emergency Dept) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentHospitalBeds.map(record => {
                const isEditing = editingBedRecordId === record.id;
                const totalCap = record.totalCapacity;
                const occupied = record.occupiedCount ?? Math.max(0, record.totalCapacity - record.availableCount);
                const available = Math.max(0, totalCap - occupied);
                const isAvailable = available > 0 && record.status === 'AVAILABLE';

                return (
                  <div
                    key={record.id}
                    className="bg-[#E8F5E9] rounded-2xl p-5 border border-[#D5E8D7] shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-[#D5E8D7]">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase bg-white text-[#2E7D32] border border-[#D5E8D7]">
                          {record.category === 'ICU'
                            ? 'ICU (Intensive Care)'
                            : record.category === 'GENERAL_WARD'
                            ? 'General Ward'
                            : record.category === 'EMERGENCY_DEPT'
                            ? 'Emergency Dept (ER)'
                            : record.category}
                        </span>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isAvailable
                              ? 'bg-white text-[#2E7D32] border border-[#D5E8D7]'
                              : 'bg-white text-rose-700 border border-rose-300'
                          }`}
                        >
                          {isAvailable ? 'AVAILABLE' : 'FULL / OCCUPIED'}
                        </span>
                      </div>

                      {/* Display Mode vs Edit Mode */}
                      {!isEditing ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-3 bg-white rounded-xl border border-[#D5E8D7]">
                              <span className="text-[10px] text-[#555555] block uppercase font-bold">Total</span>
                              <span className="text-xl font-black text-[#171717]">{totalCap}</span>
                            </div>

                            <div className="p-3 bg-white rounded-xl border border-[#D5E8D7]">
                              <span className="text-[10px] text-[#555555] block uppercase font-bold">Occupied</span>
                              <span className="text-xl font-black text-amber-700">{occupied}</span>
                            </div>

                            <div className="p-3 bg-white rounded-xl border border-[#D5E8D7]">
                              <span className="text-[10px] text-[#555555] block uppercase font-bold">Available</span>
                              <span className="text-xl font-black text-[#2E7D32]">{available}</span>
                            </div>
                          </div>

                          {record.notes && (
                            <p className="text-xs text-[#555555] italic bg-white p-2.5 rounded-xl border border-[#D5E8D7]">
                              "{record.notes}"
                            </p>
                          )}

                          <div className="text-[11px] text-[#555555] pt-2 border-t border-[#D5E8D7] space-y-0.5">
                            <p>Last verified: <strong className="text-[#171717]">{new Date(record.lastUpdated).toLocaleTimeString()}</strong></p>
                            <p>Staff: <strong className="text-[#171717]">{record.updatedByStaffName}</strong></p>
                            <p className="text-[#2E7D32] text-[10px]">Source: {record.sourceOfVerification || 'Direct Duty MO Verification'}</p>
                          </div>
                        </div>
                      ) : (
                        /* Editing Form */
                        <div className="space-y-3 text-xs bg-white p-4 rounded-xl border border-[#D5E8D7]">
                          <h4 className="font-bold text-[#171717]">Edit Bed Capacity & Occupancy</h4>

                          <div>
                            <label className="block text-[#171717] font-medium mb-1">Total Capacity:</label>
                            <input
                              type="number"
                              min={0}
                              value={editTotalCapacity}
                              onChange={e => setEditTotalCapacity(parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-1.5 bg-white border border-[#D5E8D7] rounded-lg text-[#171717] font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[#171717] font-medium mb-1">Occupied Beds:</label>
                            <input
                              type="number"
                              min={0}
                              max={editTotalCapacity}
                              value={editOccupiedCount}
                              onChange={e => setEditOccupiedCount(parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-1.5 bg-white border border-[#D5E8D7] rounded-lg text-[#171717] font-bold"
                            />
                          </div>

                          <div className="p-2 bg-[#F1F8F2] rounded-lg border border-[#D5E8D7] flex justify-between items-center text-xs">
                            <span className="text-[#555555]">Calculated Available:</span>
                            <span className="font-black text-[#2E7D32] text-sm">
                              {Math.max(0, editTotalCapacity - editOccupiedCount)}
                            </span>
                          </div>

                          <div>
                            <label className="block text-[#171717] font-medium mb-1">Operational Notes (Optional):</label>
                            <input
                              type="text"
                              value={editBedNotes}
                              onChange={e => setEditBedNotes(e.target.value)}
                              placeholder="e.g., 2 beds reserved for incoming trauma"
                              className="w-full px-3 py-1.5 bg-white border border-[#D5E8D7] rounded-lg text-[#171717] text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2">
                      {!isEditing ? (
                        <button
                          onClick={() => handleStartEditBed(record.id, totalCap, occupied, record.notes)}
                          className="w-full py-2 bg-white hover:bg-[#F1F8F2] text-[#2E7D32] border border-[#D5E8D7] rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1"
                        >
                          <span>Update Bed Capacity</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </button>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setEditingBedRecordId(null)}
                            className="py-2 bg-white hover:bg-[#F1F8F2] text-[#555555] border border-[#D5E8D7] rounded-xl text-xs font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveBedChanges(record.id)}
                            className="py-2 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-xl text-xs font-bold shadow-xs"
                          >
                            Save Updates
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= SECTION F: AMBULANCE COORDINATION ================= */}
        {activeTab === 'ambulance' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="bg-[#E8F5E9] rounded-3xl p-6 border border-[#D5E8D7] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-[#2E7D32] font-bold text-xs">
                  <Ambulance className="w-4 h-4 text-[#2E7D32]" />
                  <span>Ambulance Telemetry & Dispatch Coordination</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#171717]">
                  Hospital Emergency Fleet Coordination
                </h2>
                <p className="text-xs text-[#555555] max-w-2xl leading-relaxed">
                  Coordinate ambulance dispatch, assign paramedical teams, and track operational transport status for incoming emergency patients.
                </p>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-[#D5E8D7] text-[11px] text-[#555555] flex items-center space-x-2">
                <Info className="w-4 h-4 text-[#2E7D32] shrink-0" />
                <span>Notice: Live GPS tracking is unavailable; telemetry reflects operator-updated dispatch status.</span>
              </div>
            </div>

            {/* List of ambulance-requested cases */}
            {hospitalEmergencyRequests.filter(r => r.ambulanceRequested).length === 0 ? (
              <div className="bg-[#E8F5E9] rounded-3xl p-12 text-center text-[#555555] border border-[#D5E8D7] space-y-2">
                <Ambulance className="w-10 h-10 text-[#2E7D32] mx-auto" />
                <h3 className="text-base font-bold text-[#171717]">No active ambulance requests</h3>
                <p className="text-xs text-[#555555] max-w-md mx-auto">
                  Currently, no emergency requests requiring ambulance dispatch have been directed to {hospitalDisplayName}.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hospitalEmergencyRequests
                  .filter(r => r.ambulanceRequested)
                  .map(req => {
                    const currentStatus = req.ambulanceDetails?.status || 'REQUESTED';
                    const isAssigning = ambulanceFormReqId === req.id;

                    return (
                      <div
                        key={req.id}
                        className="bg-[#E8F5E9] rounded-2xl p-5 border border-[#D5E8D7] shadow-xs space-y-4"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-[#D5E8D7]">
                          <div>
                            <span className="font-bold text-[#171717] text-sm block">{req.patientName}</span>
                            <span className="text-[11px] text-[#555555]">Request ID: {req.id}</span>
                          </div>

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              currentStatus === 'DISPATCHED' || currentStatus === 'EN_ROUTE'
                                ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                                : currentStatus === 'ARRIVED'
                                ? 'bg-emerald-100 text-[#2E7D32] border border-emerald-300'
                                : currentStatus === 'COMPLETED'
                                ? 'bg-white text-[#555555] border border-[#D5E8D7]'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {currentStatus}
                          </span>
                        </div>

                        {/* Location / Patient Destination */}
                        <div className="text-xs text-[#171717] bg-white p-3 rounded-xl border border-[#D5E8D7] space-y-1">
                          <p>📍 <strong>Pickup Destination:</strong> {req.patientAddress}</p>
                          <p>📞 <strong>Patient Contact:</strong> {req.patientPhone}</p>
                        </div>

                        {/* Existing Assigned Vehicle Info if any */}
                        {req.ambulanceDetails?.vehicleNumber ? (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 bg-white rounded-xl border border-[#D5E8D7]">
                              <span className="text-[#555555] text-[10px] block">Vehicle Number:</span>
                              <strong className="text-[#171717]">{req.ambulanceDetails.vehicleNumber}</strong>
                            </div>
                            <div className="p-2.5 bg-white rounded-xl border border-[#D5E8D7]">
                              <span className="text-[#555555] text-[10px] block">Assigned Driver:</span>
                              <strong className="text-[#171717]">{req.ambulanceDetails.driverName || 'Operator Staff'}</strong>
                              <span className="block text-[10px] text-[#555555]">{req.ambulanceDetails.driverPhone}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-[#555555] italic">No specific vehicle number assigned yet.</p>
                        )}

                        {/* Status Progression Controls */}
                        <div className="space-y-2 pt-2 border-t border-[#D5E8D7] text-xs">
                          <span className="text-[11px] font-bold text-[#555555] uppercase tracking-wider block">
                            Advance Mission Status:
                          </span>

                          <div className="grid grid-cols-3 gap-1.5">
                            {(['REQUESTED', 'DISPATCHED', 'EN_ROUTE', 'ARRIVED', 'COMPLETED', 'CANCELLED'] as AmbulanceStatus[]).map(st => (
                              <button
                                key={st}
                                onClick={() => {
                                  updateAmbulanceStatus(
                                    req.id,
                                    st,
                                    req.ambulanceDetails?.driverPhone || dispatchDriverPhone,
                                    req.ambulanceDetails?.vehicleNumber || dispatchVehicleNo,
                                    req.ambulanceDetails?.etaMinutes || dispatchEtaMins,
                                    req.ambulanceDetails?.driverName || dispatchDriverName
                                  );
                                }}
                                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
                                  currentStatus === st
                                    ? 'bg-[#2E7D32] text-white shadow-xs'
                                    : 'bg-white text-[#171717] hover:bg-[#F1F8F2] border border-[#D5E8D7]'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>

                          {/* Quick assign vehicle toggler */}
                          {!isAssigning ? (
                            <button
                              onClick={() => {
                                setAmbulanceFormReqId(req.id);
                                setDispatchDriverName(req.ambulanceDetails?.driverName || '');
                                setDispatchDriverPhone(req.ambulanceDetails?.driverPhone || '');
                                setDispatchVehicleNo(req.ambulanceDetails?.vehicleNumber || '');
                              }}
                              className="text-[11px] text-[#2E7D32] hover:underline pt-1 block font-bold"
                            >
                              + Assign or Edit Driver & Vehicle Details
                            </button>
                          ) : (
                            <div className="p-3 bg-white rounded-xl border border-[#D5E8D7] space-y-2 pt-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] text-[#555555] block mb-0.5">Driver Name:</label>
                                  <input
                                    type="text"
                                    value={dispatchDriverName}
                                    onChange={e => setDispatchDriverName(e.target.value)}
                                    placeholder="e.g. Subir Das"
                                    className="w-full px-2 py-1 bg-white border border-[#D5E8D7] rounded text-xs text-[#171717]"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-[#555555] block mb-0.5">Driver Phone:</label>
                                  <input
                                    type="text"
                                    value={dispatchDriverPhone}
                                    onChange={e => setDispatchDriverPhone(e.target.value)}
                                    placeholder="e.g. +91 98765 43210"
                                    className="w-full px-2 py-1 bg-white border border-[#D5E8D7] rounded text-xs text-[#171717]"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] text-[#555555] block mb-0.5">Vehicle Number:</label>
                                <input
                                  type="text"
                                  value={dispatchVehicleNo}
                                  onChange={e => setDispatchVehicleNo(e.target.value)}
                                  placeholder="e.g. WB 24 AL 1234"
                                  className="w-full px-2 py-1 bg-white border border-[#D5E8D7] rounded text-xs text-[#171717]"
                                />
                              </div>
                              <div className="flex justify-end space-x-2 pt-1">
                                <button
                                  onClick={() => setAmbulanceFormReqId(null)}
                                  className="px-2.5 py-1 bg-white border border-[#D5E8D7] rounded text-[#555555] text-[11px]"
                                >
                                  Close
                                </button>
                                <button
                                  onClick={() => {
                                    updateAmbulanceStatus(
                                      req.id,
                                      'DISPATCHED',
                                      dispatchDriverPhone,
                                      dispatchVehicleNo,
                                      dispatchEtaMins,
                                      dispatchDriverName
                                    );
                                    setAmbulanceFormReqId(null);
                                  }}
                                  className="px-3 py-1 bg-[#2E7D32] hover:bg-[#256B2A] rounded text-white text-[11px] font-bold"
                                >
                                  Save & Dispatch
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* ================= SECTION G: AUDIT TRAIL ================= */}
        {activeTab === 'audit' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="bg-[#E8F5E9] rounded-3xl p-6 border border-[#D5E8D7] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-[#2E7D32] font-bold text-xs">
                  <History className="w-4 h-4 text-[#2E7D32]" />
                  <span>Immutable Audit Log & Data Protection Compliance</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#171717]">
                  Hospital Access & Emergency Decision Trail
                </h2>
                <p className="text-xs text-[#555555] max-w-2xl leading-relaxed">
                  Every request receipt, triage decision, bed update, and MediVault record access is cryptographically recorded with actor identity, timestamp, and purpose. Medical content is sanitized to prevent leakage.
                </p>
              </div>

              {/* Action Filter */}
              <div className="bg-white px-3 py-1.5 rounded-xl border border-[#D5E8D7] text-xs shrink-0">
                <select
                  value={auditFilterAction}
                  onChange={e => setAuditFilterAction(e.target.value)}
                  className="bg-transparent text-[#171717] font-bold text-xs focus:outline-none"
                >
                  <option value="ALL">All Recorded Actions ({auditLogs.length})</option>
                  <option value="EMERGENCY_SOS_TRIGGERED">Emergency Requests</option>
                  <option value="EMERGENCY_REQUEST_ACCEPTED">Accepted Cases</option>
                  <option value="EMERGENCY_REQUEST_REJECTED">Declined Cases</option>
                  <option value="BED_AVAILABILITY_UPDATED">Bed Updates</option>
                  <option value="MEDICAL_RECORDS_ACCESSED">Vault Access</option>
                </select>
              </div>
            </div>

            {/* Audit Logs Table / List */}
            <div className="bg-[#E8F5E9] rounded-2xl border border-[#D5E8D7] overflow-hidden shadow-xs">
              <div className="divide-y divide-[#D5E8D7] max-h-[600px] overflow-y-auto">
                {auditLogs
                  .filter(log => auditFilterAction === 'ALL' || log.action === auditFilterAction)
                  .map(log => (
                    <div key={log.id} className="p-4 bg-white hover:bg-[#F1F8F2] transition-colors text-xs space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-[#2E7D32] font-bold bg-[#E8F5E9] px-2 py-0.5 rounded border border-[#D5E8D7]">
                          {log.action}
                        </span>
                        <span className="text-[11px] text-[#555555] font-mono">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[#171717]">{log.details}</p>
                      <div className="flex items-center space-x-3 text-[11px] text-[#555555] pt-0.5">
                        <span>Staff Actor: <strong className="text-[#171717]">{log.actorName}</strong> ({log.actorRole})</span>
                        {log.ipAddress && <span>• IP: <span className="font-mono">{log.ipAddress}</span></span>}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ================= MODAL: HOSPITAL EMERGENCY TRIAGE & CLINICAL ASSESSMENT ================= */}
      {assessmentModalRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-[#D5E8D7] shadow-2xl overflow-hidden text-[#171717] flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#D5E8D7] bg-[#E8F5E9] flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white text-[#2E7D32] border border-[#D5E8D7]">
                    🏥 Clinical Emergency Triage Desk
                  </span>
                  <span className="text-[11px] font-mono text-[#555555]">
                    ID: <strong className="text-[#2E7D32]">{assessmentModalRequest.id}</strong>
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#171717]">
                  {assessmentModalRequest.patientName}
                </h3>
                <p className="text-xs text-[#555555]">
                  Status: <strong className="text-[#171717] uppercase">{assessmentModalRequest.status}</strong> • Submitted: {new Date(assessmentModalRequest.timestamp).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setAssessmentModalRequest(null)}
                className="p-2 rounded-xl bg-white text-[#555555] hover:text-[#171717] border border-[#D5E8D7] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs bg-white">
              {/* 1. Patient Reported Condition Summary */}
              <div className="bg-[#F1F8F2] rounded-2xl p-4 border border-[#D5E8D7] space-y-3">
                <span className="text-[11px] font-black text-[#2E7D32] uppercase tracking-wider block">
                  1. Patient-Reported Emergency Medical Problem:
                </span>
                <p className="p-3 bg-white rounded-xl border border-[#D5E8D7] text-sm font-semibold text-[#171717] leading-relaxed">
                  "{assessmentModalRequest.chiefComplaint || assessmentModalRequest.symptomsDescription || 'Acute emergency assistance requested.'}"
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
                  <div className="p-2 bg-white rounded-lg border border-[#D5E8D7]">
                    <span className="text-[10px] text-[#555555] block uppercase">Reported Severity</span>
                    <strong className="text-[#171717]">{assessmentModalRequest.reportedSeverity || 'Severe'}</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-[#D5E8D7]">
                    <span className="text-[10px] text-[#555555] block uppercase">Consciousness</span>
                    <strong className="text-[#171717]">{assessmentModalRequest.consciousnessStatus || 'Alert'}</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-[#D5E8D7]">
                    <span className="text-[10px] text-[#555555] block uppercase">Breathing Status</span>
                    <strong className={assessmentModalRequest.breathingStatus !== 'Normal' ? 'text-rose-700 font-bold' : 'text-[#171717]'}>
                      {assessmentModalRequest.breathingStatus || 'Normal'}
                    </strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-[#D5E8D7]">
                    <span className="text-[10px] text-[#555555] block uppercase">Problem Onset</span>
                    <strong className="text-[#171717]">{assessmentModalRequest.problemStartedAt || 'Recent'}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                  <p className="text-[#171717] bg-white p-2 rounded-lg border border-[#D5E8D7]">
                    <strong>Known Allergies:</strong> {assessmentModalRequest.knownAllergies?.length > 0 ? assessmentModalRequest.knownAllergies.join(', ') : 'None documented'}
                  </p>
                  <p className="text-[#171717] bg-white p-2 rounded-lg border border-[#D5E8D7]">
                    <strong>Existing Conditions:</strong> {assessmentModalRequest.existingConditions?.length > 0 ? assessmentModalRequest.existingConditions.join(', ') : 'None documented'}
                  </p>
                </div>

                {assessmentModalRequest.patientAddress && (
                  <p className="text-[11px] text-[#555555] bg-white p-2 rounded-lg border border-[#D5E8D7]">
                    📍 Incident Location: <strong>{assessmentModalRequest.patientAddress}</strong>
                  </p>
                )}
              </div>

              {/* 2. Decision Support Indicators (Red Flags) */}
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-amber-900 font-black text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>DECISION-SUPPORT INDICATORS (Clinical Decision Support Only)</span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                  Notice: These automated indicators highlight patient-reported red flags to support clinical review. They are decision-support indicators, NOT confirmed diagnoses or autonomous clinical triage decisions. A qualified healthcare professional must make the final clinical assessment and admission decision.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {assessmentModalRequest.reportedSeverity === 'Severe' && (
                    <span className="px-2 py-0.5 rounded-md bg-white border border-rose-300 text-rose-800 text-[10px] font-bold">
                      🚩 High Patient-Reported Severity
                    </span>
                  )}
                  {assessmentModalRequest.breathingStatus !== 'Normal' && (
                    <span className="px-2 py-0.5 rounded-md bg-white border border-rose-300 text-rose-800 text-[10px] font-bold">
                      🚩 Abnormal / Difficult Breathing Flagged
                    </span>
                  )}
                  {assessmentModalRequest.consciousnessStatus !== 'Alert' && (
                    <span className="px-2 py-0.5 rounded-md bg-white border border-rose-300 text-rose-800 text-[10px] font-bold">
                      🚩 Altered Mental / Consciousness Status Flagged
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md bg-white border border-amber-300 text-amber-800 text-[10px] font-bold">
                    ✓ Full Clinical Assessment Required by Duty MO
                  </span>
                </div>
              </div>

              {/* 3. Qualified Clinical Assessment Fields */}
              <div className="bg-[#E8F5E9] rounded-2xl p-4 sm:p-5 border border-[#D5E8D7] space-y-4">
                <span className="text-[11px] font-black text-[#171717] uppercase tracking-wider block">
                  3. Hospital Staff Clinical Assessment & Admission Planning:
                </span>

                {/* Triage Priority Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-[#171717] mb-1.5">
                    Triage Priority Classification *:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'P1_RESUSCITATION', label: 'P1 - Immediate / Resuscitation', color: 'bg-rose-700 text-white border-rose-800' },
                      { id: 'P2_EMERGENT', label: 'P2 - Very Urgent / Emergent', color: 'bg-amber-600 text-white border-amber-700' },
                      { id: 'P3_URGENT', label: 'P3 - Urgent Care', color: 'bg-yellow-500 text-black border-yellow-600' },
                      { id: 'P4_STANDARD', label: 'P4 - Standard / Non-Urgent', color: 'bg-[#2E7D32] text-white border-[#256B2A]' }
                    ].map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setTriagePriority(p.id as any)}
                        className={`p-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                          triagePriority === p.id
                            ? `${p.color} ring-2 ring-black/20 shadow-xs font-black`
                            : 'bg-white text-[#555555] border-[#D5E8D7] hover:bg-[#F1F8F2]'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Department & ICU assessment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-3 bg-white rounded-xl border border-[#D5E8D7] space-y-1">
                    <label className="block text-[11px] font-bold text-[#171717]">
                      Recommended Department *:
                    </label>
                    <select
                      value={recommendedDept}
                      onChange={e => setRecommendedDept(e.target.value as any)}
                      className="w-full text-xs font-bold text-[#171717] bg-[#F1F8F2] border border-[#D5E8D7] rounded-lg p-2 focus:ring-1 focus:ring-[#2E7D32]"
                    >
                      <option value="Emergency Department">Emergency Department</option>
                      <option value="General Medicine">General Medicine</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Respiratory Medicine">Respiratory Medicine</option>
                      <option value="Trauma and Orthopaedics">Trauma and Orthopaedics</option>
                      <option value="Other">Other</option>
                      <option value="Undetermined">Undetermined</option>
                    </select>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#D5E8D7] space-y-1">
                    <label className="block text-[11px] font-bold text-[#171717]">
                      ICU Assessment Required *:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {(['Yes', 'No', 'Undetermined'] as const).map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setIcuAssessmentRequired(opt)}
                          className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                            icuAssessmentRequired === opt
                              ? 'bg-[#2E7D32] text-white shadow-xs'
                              : 'bg-[#F1F8F2] text-[#555555] hover:bg-[#E8F5E9]'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bed Requirement & Live Hospital Availability Verification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-3 bg-white rounded-xl border border-[#D5E8D7] space-y-1">
                    <label className="block text-[11px] font-bold text-[#171717]">
                      Bed Requirement *:
                    </label>
                    <select
                      value={bedRequirement}
                      onChange={e => setBedRequirement(e.target.value as any)}
                      className="w-full text-xs font-bold text-[#171717] bg-[#F1F8F2] border border-[#D5E8D7] rounded-lg p-2 focus:ring-1 focus:ring-[#2E7D32]"
                    >
                      <option value="ICU">ICU (Intensive Care Unit)</option>
                      <option value="Emergency Department">Emergency Department (Observation)</option>
                      <option value="General Ward">General Ward</option>
                      <option value="Other">Other Specialized Unit</option>
                      <option value="Undetermined">Undetermined</option>
                    </select>
                  </div>

                  {/* Bed verification check against real bedRecords */}
                  <div className="p-3 bg-white rounded-xl border border-[#D5E8D7] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#171717]">Live Bed Availability:</span>
                      <span className="text-[10px] text-[#2E7D32] font-semibold">Hospital Inventory</span>
                    </div>
                    {(() => {
                      const matchedBed = currentHospitalBeds.find(b => b.category === (bedRequirement === 'ICU' ? 'ICU' : 'GENERAL_WARD'));
                      const isAvail = matchedBed && matchedBed.availableCount > 0 && matchedBed.status === 'AVAILABLE';
                      return (
                        <div className="p-2 bg-[#F1F8F2] rounded-lg text-[11px] space-y-1 border border-[#D5E8D7]">
                          <p>
                            Category: <strong>{matchedBed?.category || bedRequirement}</strong> • Status:{' '}
                            <strong className={isAvail ? 'text-[#2E7D32]' : 'text-rose-700'}>
                              {isAvail ? `AVAILABLE (${matchedBed?.availableCount} beds)` : (matchedBed ? 'UNAVAILABLE (0 available)' : 'UNKNOWN')}
                            </strong>
                          </p>
                          <div className="flex items-center space-x-2 pt-1">
                            <input
                              type="checkbox"
                              id="bed-confirm-check"
                              checked={bedConfirmedForRequest}
                              onChange={e => setBedConfirmedForRequest(e.target.checked)}
                              className="w-4 h-4 text-[#2E7D32] rounded focus:ring-[#2E7D32]"
                            />
                            <label htmlFor="bed-confirm-check" className="text-[11px] font-bold text-[#171717] cursor-pointer">
                              Confirm Suitable Bed for this Request
                            </label>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Clinical Notes & Suspected Care */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-[#171717]">
                    Initial Clinical Assessment Notes:
                  </label>
                  <textarea
                    rows={2}
                    value={triageNotes}
                    onChange={e => setTriageNotes(e.target.value)}
                    placeholder="Enter qualified clinical observations, initial vitals, suspected pathology..."
                    className="w-full text-xs text-[#171717] bg-white border border-[#D5E8D7] rounded-xl p-3 focus:ring-1 focus:ring-[#2E7D32]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#171717]">
                    Suspected Care Requirement:
                  </label>
                  <input
                    type="text"
                    value={suspectedCareRequirement}
                    onChange={e => setSuspectedCareRequirement(e.target.value)}
                    placeholder="e.g. Immediate cardiac monitoring, stat ECG, IV analgesia, stroke protocol"
                    className="w-full text-xs text-[#171717] bg-white border border-[#D5E8D7] rounded-xl p-2.5"
                  />
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#D5E8D7] flex items-center justify-between text-[11px] text-[#555555]">
                  <span>Responsible Staff: <strong className="text-[#171717]">{currentUser.displayName}</strong> ({currentUser.staffDesignation || 'Triage Duty MO'})</span>
                  <span>Timestamp: <strong>{new Date().toLocaleTimeString()}</strong></span>
                </div>
              </div>

              {/* 4. Request Additional Information from Patient */}
              <div className="bg-[#F1F8F2] rounded-2xl p-4 border border-[#D5E8D7] space-y-2">
                <label className="block text-[11px] font-black text-[#171717] uppercase tracking-wider">
                  4. Request More Information from Patient (Optional):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={requestInfoQuestion}
                    onChange={e => setRequestInfoQuestion(e.target.value)}
                    placeholder="Ask patient clarification (e.g. Can the patient walk? Any blood-thinning meds taken today?)..."
                    className="flex-1 text-xs text-[#171717] bg-white border border-[#D5E8D7] rounded-xl px-3 py-2"
                  />
                  <button
                    type="button"
                    disabled={!requestInfoQuestion.trim()}
                    onClick={() => {
                      respondToClarification(assessmentModalRequest.id, requestInfoQuestion.trim(), 'hospital', currentUser.displayName);
                      setRequestInfoQuestion('');
                      setAssessmentModalRequest(null);
                    }}
                    className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 disabled:bg-gray-300 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    Send to Patient
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Action Controls Footer */}
            <div className="p-4 sm:p-5 border-t border-[#D5E8D7] bg-[#F1F8F2] flex flex-wrap items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const req = assessmentModalRequest;
                  setAssessmentModalRequest(null);
                  handleOpenDocReview(req);
                }}
                className="px-3.5 py-2 bg-white hover:bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7] rounded-xl text-xs font-bold flex items-center space-x-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Review MediVault Docs</span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                {/* Save Draft Assessment */}
                <button
                  type="button"
                  onClick={() => {
                    const assessment: HospitalClinicalAssessment = {
                      notes: triageNotes,
                      triagePriority,
                      suspectedCareRequirement,
                      recommendedDepartment: recommendedDept,
                      icuAssessmentRequired,
                      bedRequirement,
                      bedConfirmedStatus: bedConfirmedForRequest ? 'CONFIRMED' : 'PENDING',
                      assessedByStaffName: currentUser.displayName,
                      assessedByStaffId: currentUser.uid,
                      assessmentTimestamp: new Date().toISOString()
                    };
                    saveClinicalAssessment(assessmentModalRequest.id, assessment, 'UNDER_ASSESSMENT');
                    setAssessmentModalRequest(null);
                  }}
                  className="px-3.5 py-2 bg-white hover:bg-[#E8F5E9] text-[#171717] border border-[#D5E8D7] rounded-xl text-xs font-bold"
                >
                  Save Triage Draft
                </button>

                {/* Unable to Accommodate */}
                <button
                  type="button"
                  onClick={() => {
                    const req = assessmentModalRequest;
                    setAssessmentModalRequest(null);
                    setActionTargetRequest(req);
                    setShowDeclineModal(true);
                  }}
                  className="px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold"
                >
                  Unable to Accommodate
                </button>

                {/* Accept for Coordination */}
                <button
                  type="button"
                  onClick={() => {
                    const assessment: HospitalClinicalAssessment = {
                      notes: triageNotes,
                      triagePriority,
                      suspectedCareRequirement,
                      recommendedDepartment: recommendedDept,
                      icuAssessmentRequired,
                      bedRequirement,
                      bedConfirmedStatus: bedConfirmedForRequest ? 'CONFIRMED' : 'PENDING',
                      assessedByStaffName: currentUser.displayName,
                      assessedByStaffId: currentUser.uid,
                      assessmentTimestamp: new Date().toISOString()
                    };
                    saveClinicalAssessment(assessmentModalRequest.id, assessment, 'ACCEPTED_FOR_COORDINATION');
                    acceptEmergencyRequest(
                      assessmentModalRequest.id,
                      bedRequirement === 'ICU' ? 'ICU' : 'GENERAL_WARD',
                      triageNotes,
                      recommendedDept,
                      bedConfirmedForRequest
                    );
                    setAssessmentModalRequest(null);
                  }}
                  className="px-4 py-2 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-xl text-xs font-black shadow-xs flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Accept for Coordination</span>
                </button>

                {/* Confirm Formal Admission */}
                <button
                  type="button"
                  onClick={() => {
                    confirmAdmission(
                      assessmentModalRequest.id,
                      recommendedDept,
                      bedRequirement === 'ICU' ? 'ICU' : 'GENERAL_WARD',
                      triageNotes
                    );
                    setAssessmentModalRequest(null);
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-xs"
                >
                  Confirm Admission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PATIENT REQUEST DETAILS (SECTION D) ================= */}
      {detailModalRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#D5E8D7] shadow-2xl overflow-hidden text-[#171717] flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#D5E8D7] bg-[#E8F5E9] flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32]">
                  Emergency Request Full Profile
                </span>
                <h3 className="text-xl font-black text-[#171717]">{detailModalRequest.patientName}</h3>
                <p className="text-xs text-[#555555]">
                  ID: <span className="font-mono text-[#2E7D32] font-bold">{detailModalRequest.id}</span> • Status: <strong className="text-[#171717]">{detailModalRequest.status}</strong>
                </p>
              </div>
              <button
                onClick={() => setDetailModalRequest(null)}
                className="p-2 rounded-xl bg-white text-[#555555] hover:text-[#171717] border border-[#D5E8D7]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Scrollable */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs bg-white">
              {/* Patient Core Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#E8F5E9] rounded-xl border border-[#D5E8D7]">
                  <span className="text-[10px] text-[#555555] block uppercase font-bold">Age</span>
                  <strong className="text-sm text-[#171717]">{detailModalRequest.patientAge ? `${detailModalRequest.patientAge} Years` : 'Not specified'}</strong>
                </div>
                <div className="p-3 bg-[#E8F5E9] rounded-xl border border-[#D5E8D7]">
                  <span className="text-[10px] text-[#555555] block uppercase font-bold">Blood Group</span>
                  <strong className="text-sm text-[#2E7D32]">{detailModalRequest.patientBloodGroup || 'Not reported'}</strong>
                </div>
                <div className="p-3 bg-[#E8F5E9] rounded-xl border border-[#D5E8D7]">
                  <span className="text-[10px] text-[#555555] block uppercase font-bold">Contact Phone</span>
                  <strong className="text-sm text-[#171717]">{detailModalRequest.patientPhone || 'N/A'}</strong>
                </div>
              </div>

              {/* Symptoms & Chief Complaint */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#555555] uppercase tracking-wider">
                  Emergency Complaint & Symptoms:
                </span>
                <div className="p-4 bg-[#F1F8F2] rounded-xl border border-[#D5E8D7] text-[#171717] leading-relaxed">
                  {detailModalRequest.symptomsDescription || 'No detailed symptoms description provided with initial SOS.'}
                </div>
              </div>

              {/* Known Clinical Sensitivities & Allergies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-[#E8F5E9] rounded-xl border border-[#D5E8D7] space-y-1">
                  <span className="font-bold text-[#D32F2F] text-[11px] block">Reported Drug Allergies:</span>
                  <p className="text-[#171717]">
                    {detailModalRequest.knownAllergies.length > 0 ? detailModalRequest.knownAllergies.join(', ') : 'None documented'}
                  </p>
                </div>
                <div className="p-4 bg-[#E8F5E9] rounded-xl border border-[#D5E8D7] space-y-1">
                  <span className="font-bold text-[#2E7D32] text-[11px] block">Existing Chronic Conditions:</span>
                  <p className="text-[#171717]">
                    {detailModalRequest.existingConditions.length > 0 ? detailModalRequest.existingConditions.join(', ') : 'None documented'}
                  </p>
                </div>
              </div>

              {/* Current Daily Medications */}
              {detailModalRequest.currentMedicationsSummary && (
                <div className="p-4 bg-[#E8F5E9] rounded-xl border border-[#D5E8D7] space-y-1">
                  <span className="font-bold text-[#171717] text-[11px] block">Current Prescribed Medications:</span>
                  <p className="text-[#555555]">{detailModalRequest.currentMedicationsSummary}</p>
                </div>
              )}

              {/* Patient Location */}
              <div className="p-4 bg-[#F1F8F2] rounded-xl border border-[#D5E8D7] space-y-1">
                <span className="font-bold text-[#171717] text-[11px] block">Patient Incident Location:</span>
                <p className="text-[#555555]">📍 {detailModalRequest.patientAddress}</p>
              </div>

              {/* Consent Information */}
              <div className="p-3.5 bg-[#E8F5E9] rounded-xl border border-[#D5E8D7] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-[#2E7D32]">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                  <span>Consent Status: <strong>{detailModalRequest.accessGrantStatus || 'PENDING'}</strong></span>
                </div>
                <span className="text-[#555555] font-mono text-[11px]">Token: {detailModalRequest.accessGrantToken || 'None'}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-[#D5E8D7] bg-[#F1F8F2] flex justify-between items-center">
              <button
                onClick={() => {
                  const req = detailModalRequest;
                  setDetailModalRequest(null);
                  handleOpenDocReview(req);
                }}
                className="px-4 py-2 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-xl text-xs font-bold flex items-center space-x-1"
              >
                <FileText className="w-3.5 h-3.5 text-white" />
                <span>Review Shared MediVault Records</span>
              </button>

              <button
                onClick={() => setDetailModalRequest(null)}
                className="px-4 py-2 bg-white hover:bg-[#E8F5E9] text-[#171717] border border-[#D5E8D7] rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: MEDIVAULT SHARED DOCUMENTS (SECTION 6) ================= */}
      {docsModalRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#D5E8D7] shadow-2xl overflow-hidden text-[#171717] flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[#D5E8D7] bg-[#E8F5E9] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32]">
                  Consent-Governed Medical Vault Access
                </span>
                <h3 className="text-xl font-black text-[#171717]">{docsModalRequest.patientName}</h3>
                <p className="text-xs text-[#555555]">
                  Emergency Request ID: <span className="font-mono text-[#2E7D32] font-bold">{docsModalRequest.id}</span>
                </p>
              </div>
              <button
                onClick={() => {
                  setDocsModalRequest(null);
                  setPreviewingDoc(null);
                }}
                className="p-2 rounded-xl bg-white text-[#555555] hover:text-[#171717] border border-[#D5E8D7]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs bg-white">
              {/* Check Consent Status */}
              {(() => {
                const grant = accessGrants.find(
                  g => g.token === docsModalRequest.accessGrantToken || g.emergencyRequestId === docsModalRequest.id
                );
                const isRevoked = grant?.status === 'REVOKED' || docsModalRequest.accessGrantStatus === 'REVOKED';

                if (isRevoked) {
                  return (
                    <div className="p-6 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 space-y-2">
                      <div className="flex items-center space-x-2 text-[#D32F2F] font-black text-base">
                        <ShieldAlert className="w-5 h-5 text-[#D32F2F]" />
                        <span>ACCESS REVOKED BY PATIENT</span>
                      </div>
                      <p className="text-xs text-rose-800 leading-relaxed">
                        The patient has revoked authorization for this emergency request. In strict accordance with the Digital Personal Data Protection (DPDP) Act and patient privacy rights, access to medical records is completely blocked.
                      </p>
                      {grant?.revocationReason && (
                        <p className="text-[11px] text-rose-700">
                          Recorded Reason: {grant.revocationReason}
                        </p>
                      )}
                    </div>
                  );
                }

                // If active consent exists, find only the documents explicitly shared
                const sharedDocIds = grant?.documentIds || docsModalRequest.sharedDocIds || [];
                const authorizedDocs = medicalDocuments.filter(d => sharedDocIds.includes(d.id));

                if (authorizedDocs.length === 0) {
                  return (
                    <div className="p-8 text-center text-[#555555] bg-[#E8F5E9] rounded-2xl border border-[#D5E8D7] space-y-2">
                      <FileText className="w-8 h-8 text-[#2E7D32] mx-auto" />
                      <h4 className="font-bold text-[#171717] text-sm">No MediVault documents shared</h4>
                      <p className="text-xs text-[#555555] max-w-md mx-auto">
                        The patient submitted this emergency assistance request without attaching explicit MediVault documents, or no documents have been shared for this specific authorization grant.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    <div className="p-3 bg-[#E8F5E9] rounded-xl border border-[#D5E8D7] text-xs text-[#2E7D32] flex items-center justify-between">
                      <span className="flex items-center space-x-1.5 font-bold">
                        <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                        <span>Valid Patient Consent Active. Shared Documents: <strong>{authorizedDocs.length}</strong></span>
                      </span>
                      <span className="text-[11px] text-[#555555]">
                        Expires: {grant?.expiresAt ? new Date(grant.expiresAt).toLocaleTimeString() : 'In 4 hours'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {authorizedDocs.map(doc => (
                        <div
                          key={doc.id}
                          className="p-4 bg-[#F1F8F2] rounded-xl border border-[#D5E8D7] hover:border-[#2E7D32] transition-all flex items-center justify-between"
                        >
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-[#2E7D32] border border-[#D5E8D7] uppercase">
                              {doc.category.replace('_', ' ')}
                            </span>
                            <h4 className="font-bold text-sm text-[#171717]">{doc.title}</h4>
                            <p className="text-[11px] text-[#555555]">
                              Issued: {doc.issueDate || 'Recent'} • {doc.doctorName || doc.hospitalName || 'Verified Clinic'}
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              setPreviewingDoc(doc);
                              if (grant?.token) {
                                recordMedicalAccess(grant.token, docsModalRequest.patientName, `Staff viewed document "${doc.title}"`);
                              }
                            }}
                            className="px-3 py-1.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-xl text-xs font-bold flex items-center space-x-1 shrink-0"
                          >
                            <Eye className="w-3.5 h-3.5 text-white" />
                            <span>Preview</span>
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Document Preview Snippet Modal/Section */}
                    {previewingDoc && (
                      <div className="p-4 bg-[#E8F5E9] rounded-2xl border border-[#D5E8D7] space-y-3 mt-4 animate-in fade-in">
                        <div className="flex items-center justify-between pb-2 border-b border-[#D5E8D7]">
                          <h4 className="font-bold text-[#171717] text-sm flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-[#2E7D32]" />
                            <span>Preview: {previewingDoc.title}</span>
                          </h4>
                          <button
                            onClick={() => setPreviewingDoc(null)}
                            className="text-xs text-[#555555] hover:text-[#171717]"
                          >
                            Close Preview
                          </button>
                        </div>
                        <div className="p-3 bg-white rounded-xl text-xs text-[#171717] space-y-2 border border-[#D5E8D7]">
                          <p><strong>Category:</strong> {previewingDoc.category}</p>
                          <p><strong>Doctor/Facility:</strong> {previewingDoc.doctorName || previewingDoc.hospitalName || 'Clinical Diagnostic'}</p>
                          {previewingDoc.notes && <p><strong>Notes:</strong> {previewingDoc.notes}</p>}
                          <div className="p-2.5 bg-[#E8F5E9] rounded-lg border border-[#D5E8D7] text-[11px] text-[#2E7D32]">
                            ✓ Document verified under patient digital consent. Access timestamp has been recorded in the compliance audit trail.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="p-4 border-t border-[#D5E8D7] bg-[#F1F8F2] flex justify-end">
              <button
                onClick={() => {
                  setDocsModalRequest(null);
                  setPreviewingDoc(null);
                }}
                className="px-4 py-2 bg-white hover:bg-[#E8F5E9] text-[#171717] border border-[#D5E8D7] rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ACCEPT CONFIRMATION ================= */}
      {showAcceptModal && actionTargetRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#D5E8D7] shadow-2xl space-y-5 text-[#171717]">
            <h3 className="text-lg font-black flex items-center space-x-2 text-[#2E7D32]">
              <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
              <span>Confirm Acceptance of Emergency Request</span>
            </h3>

            <p className="text-xs text-[#555555]">
              Accepting will allocate hospital bed capacity and notify patient <strong>{actionTargetRequest.patientName}</strong> in real-time.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#171717] font-bold mb-1">Select Bed Category to Allocate:</label>
                <select
                  value={allocatedBedType}
                  onChange={e => setAllocatedBedType(e.target.value as BedCategoryType)}
                  className="w-full px-3 py-2 bg-white border border-[#D5E8D7] rounded-xl text-[#171717] font-bold"
                >
                  <option value="ICU">ICU (Intensive Care Unit Bed)</option>
                  <option value="GENERAL_WARD">General Ward Bed</option>
                  <option value="EMERGENCY_DEPT">Emergency Dept (ER) Observation Bed</option>
                  <option value="CCU">CCU (Coronary Care Bed)</option>
                  <option value="HDU">HDU (High Dependency Bed)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#171717] font-bold mb-1">Triage Staff Note (Optional):</label>
                <input
                  type="text"
                  placeholder="e.g. Ventilator ready, trauma team alerted"
                  value={acceptNote}
                  onChange={e => setAcceptNote(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D5E8D7] rounded-xl text-[#171717] text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-[#D5E8D7]">
              <button
                onClick={() => {
                  setShowAcceptModal(false);
                  setActionTargetRequest(null);
                }}
                className="px-4 py-2 bg-white hover:bg-[#F1F8F2] text-[#555555] border border-[#D5E8D7] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  acceptEmergencyRequest(actionTargetRequest.id, allocatedBedType, acceptNote);
                  setShowAcceptModal(false);
                  setActionTargetRequest(null);
                }}
                className="px-5 py-2 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Confirm & Accept Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: DECLINE CONFIRMATION ================= */}
      {showDeclineModal && actionTargetRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#D5E8D7] shadow-2xl space-y-5 text-[#171717]">
            <h3 className="text-lg font-black flex items-center space-x-2 text-[#D32F2F]">
              <XCircle className="w-5 h-5 text-[#D32F2F]" />
              <span>Decline Emergency Request</span>
            </h3>

            <p className="text-xs text-[#555555]">
              Please provide a clinical or operational reason. The patient will be notified immediately to re-route to an alternative hospital without delay.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#171717] font-bold mb-1">Reason for Declining *:</label>
                <input
                  type="text"
                  required
                  value={declineReason}
                  onChange={e => setDeclineReason(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D5E8D7] rounded-xl text-[#171717] text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-[#D5E8D7]">
              <button
                onClick={() => {
                  setShowDeclineModal(false);
                  setActionTargetRequest(null);
                }}
                className="px-4 py-2 bg-white hover:bg-[#F1F8F2] text-[#555555] border border-[#D5E8D7] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  rejectEmergencyRequest(actionTargetRequest.id, declineReason);
                  setShowDeclineModal(false);
                  setActionTargetRequest(null);
                }}
                className="px-5 py-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Decline & Notify Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: REDIRECT CONFIRMATION ================= */}
      {showRedirectModal && actionTargetRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#D5E8D7] shadow-2xl space-y-5 text-[#171717]">
            <h3 className="text-lg font-black flex items-center space-x-2 text-[#2E7D32]">
              <ArrowRight className="w-5 h-5 text-[#2E7D32]" />
              <span>Redirect Emergency Request</span>
            </h3>

            <p className="text-xs text-[#555555]">
              Redirect this patient's emergency request to another verified hospital facility with capacity.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#171717] font-bold mb-1">Select Target Hospital *:</label>
                <select
                  value={redirectTargetHospId}
                  onChange={e => setRedirectTargetHospId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D5E8D7] rounded-xl text-[#171717] font-bold"
                >
                  <option value="">-- Choose Hospital --</option>
                  {allVerifiedHospitals
                    .filter(h => !isMatchingHospital(h.id, currentUser.hospitalId))
                    .map(h => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.area})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-[#171717] font-bold mb-1">Redirection Reason *:</label>
                <input
                  type="text"
                  required
                  value={redirectReasonInput}
                  onChange={e => setRedirectReasonInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D5E8D7] rounded-xl text-[#171717] text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-[#D5E8D7]">
              <button
                onClick={() => {
                  setShowRedirectModal(false);
                  setActionTargetRequest(null);
                }}
                className="px-4 py-2 bg-white hover:bg-[#F1F8F2] text-[#555555] border border-[#D5E8D7] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!redirectTargetHospId) {
                    showToast('error', 'Select Hospital', 'Please select a destination hospital to redirect to.');
                    return;
                  }
                  const targetHosp = allVerifiedHospitals.find(h => h.id === redirectTargetHospId);
                  redirectEmergencyRequest(
                    actionTargetRequest.id,
                    redirectTargetHospId,
                    targetHosp?.name || redirectTargetHospId,
                    redirectReasonInput
                  );
                  setShowRedirectModal(false);
                  setActionTargetRequest(null);
                }}
                className="px-5 py-2 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Confirm Redirection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
