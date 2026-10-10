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
  RefreshCw,
  Lock,
  AlertTriangle,
  History,
  Activity,
  Layers,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  MapPin,
  ArrowRight,
  Sliders,
  X,
  Phone,
  AlertCircle,
  Share2,
  Calendar,
  Info,
  LogOut,
  ArrowUpRight
} from 'lucide-react';
import {
  BedCategoryType,
  EmergencyRequest,
  DocumentAccessGrant,
  AmbulanceStatus,
  EmergencyRequestStatus,
  MedicalDocument
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
    // Update sync clock periodically
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

  // 3. OVERVIEW CARDS: DERIVED DYNAMIC METRIC COUNTS (Strictly zero hardcoded numbers)
  const metrics = useMemo(() => {
    const list = hospitalEmergencyRequests;
    const newRequests = list.filter(r => r.status === 'SUBMITTED' || r.status === 'PENDING').length;
    const underReview = list.filter(r => r.status === 'UNDER_REVIEW').length;
    const accepted = list.filter(r => r.status === 'ACCEPTED' || r.status === 'BED_CONFIRMED').length;
    const declinedOrRedirected = list.filter(r => r.status === 'REJECTED' || r.status === 'DECLINED' || r.status === 'REDIRECTED').length;
    const timedOut = list.filter(r => r.status === 'TIMED_OUT').length;

    // ICU record
    const icuRecord = currentHospitalBeds.find(b => b.category === 'ICU');
    const availableIcu = icuRecord
      ? Math.max(0, icuRecord.totalCapacity - (icuRecord.occupiedCount ?? (icuRecord.totalCapacity - icuRecord.availableCount)))
      : 0;

    // Active ambulances
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
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">
              {language === 'bn' ? 'অনুমোদিত প্রবেশাধিকার প্রয়োজন' : 'Hospital Staff Authorization Required'}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'bn'
                ? 'এই পোর্টালটি শুধুমাত্র যাচাইকৃত হাসপাতাল ইআর ও ট্রায়াজ ডেস্ক কর্মীদের জন্য সংরক্ষিত।'
                : 'This emergency command portal is strictly restricted to verified hospital triage staff and duty medical officers.'}
            </p>
          </div>
          <div className="pt-2 space-y-3">
            <button
              onClick={() => navigateTo('hospital-login')}
              className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center space-x-2"
            >
              <Building2 className="w-4 h-4" />
              <span>{language === 'bn' ? 'হাসপাতাল স্টাফ লগইন করুন' : 'Sign In as Hospital Staff'}</span>
            </button>
            <button
              onClick={() => navigateTo('landing')}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all"
            >
              {language === 'bn' ? 'হোম পেজে ফিরে যান' : 'Return to Home'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Helper to open Document review modal
  const handleOpenDocReview = (req: EmergencyRequest) => {
    setDocsModalRequest(req);
    if (req.accessGrantToken) {
      recordMedicalAccess(req.accessGrantToken, req.patientName, `Staff opened MediVault review for emergency request ${req.id}`);
    }
  };

  // Helper to start inline editing bed record
  const handleStartEditBed = (recordId: string, currentTotal: number, currentOccupied: number, notes?: string) => {
    setEditingBedRecordId(recordId);
    setEditTotalCapacity(currentTotal);
    setEditOccupiedCount(currentOccupied);
    setEditBedNotes(notes || '');
  };

  // Helper to save bed record changes
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
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ================= SECTION A: HOSPITAL HEADER ================= */}
        <header className="bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-bold flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-teal-400" />
                <span>SUSTHAYAN Emergency Hospital Portal</span>
              </span>

              <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-teal-300 border border-slate-700 text-[11px] font-mono font-semibold flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                <span>Sync Active ({lastSyncTime})</span>
              </span>

              <span className="px-2.5 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800 text-[11px] font-bold">
                Hospital ID: {currentUser.hospitalId}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-2">
              <span>{hospitalDisplayName}</span>
              {currentHospitalInfo?.isVerifiedPartner && (
                <span title="Verified Healthcare Facility" className="inline-flex text-teal-400">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
              )}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-teal-400" />
                <span>Duty Staff:</span>
                <strong className="text-white ml-1">{currentUser.displayName}</strong>
                <span className="text-slate-400">({currentUser.staffDesignation || 'Triage Officer'})</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                <span>ER Helpline:</span>
                <strong className="text-white ml-1">{hospitalEmergencyPhone}</strong>
              </span>
              <span>•</span>
              <span className="text-slate-400 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
                {hospitalAreaLocality}
              </span>
            </div>
          </div>

          {/* Staff Switcher for Multi-Tenant Isolation Testing */}
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-2 shrink-0 w-full lg:w-auto">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span>Authorized Hospital Session:</span>
              <span className="text-[10px] text-teal-400 font-medium">Tenant Switcher</span>
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
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 ring-1 ring-teal-400'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <span>{account.hospitalName.split(' ')[0]}</span>
                    {isActive && <CheckCircle2 className="w-3 h-3 text-teal-200" />}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* ================= SECTION B: DASHBOARD OVERVIEW CARDS ================= */}
        <section aria-label="Dashboard Overview Metrics" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {/* 1. New Emergency Requests */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 hover:border-rose-900/50 transition-all space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                New Requests
              </span>
              <AlertOctagon className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400">{metrics.newRequests}</div>
            <span className="text-[10px] text-slate-400 block">Pending triage</span>
          </div>

          {/* 2. Under Review */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 hover:border-amber-900/50 transition-all space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Under Review
              </span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{metrics.underReview}</div>
            <span className="text-[10px] text-slate-400 block">Staff evaluating</span>
          </div>

          {/* 3. Accepted Requests */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 hover:border-emerald-900/50 transition-all space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                Accepted
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">{metrics.accepted}</div>
            <span className="text-[10px] text-slate-400 block">Bed reserved</span>
          </div>

          {/* 4. Declined / Redirected */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Declined / Redir
              </span>
              <XCircle className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-slate-300">{metrics.declinedOrRedirected}</div>
            <span className="text-[10px] text-slate-400 block">Case redirected</span>
          </div>

          {/* 5. Timed-out Requests */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 hover:border-purple-900/50 transition-all space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                Timed Out
              </span>
              <History className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-400">{metrics.timedOut}</div>
            <span className="text-[10px] text-slate-400 block">&gt;15 min timeout</span>
          </div>

          {/* 6. Available ICU Beds */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 hover:border-teal-900/50 transition-all space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
                Available ICU
              </span>
              <Bed className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-teal-400">
              {metrics.hasIcuData ? `${metrics.availableIcu}` : 'N/A'}
            </div>
            <span className="text-[10px] text-slate-400 block">
              {metrics.hasIcuData ? `of ${metrics.icuTotal} capacity` : 'Data not available'}
            </span>
          </div>

          {/* 7. Active Ambulances */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 hover:border-cyan-900/50 transition-all space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                Ambulances
              </span>
              <Ambulance className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-400">{metrics.activeAmbulanceCount}</div>
            <span className="text-[10px] text-slate-400 block">Active dispatches</span>
          </div>
        </section>

        {/* ================= SECTION NAVIGATION TABS ================= */}
        <nav aria-label="Portal Navigation" className="flex border-b border-slate-800 space-x-2 pb-1 overflow-x-auto scrollbar-none">
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
                    ? 'bg-teal-600 text-white border-teal-500 shadow-lg shadow-teal-600/20'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive
                        ? 'bg-white text-teal-900'
                        : 'bg-slate-800 text-teal-300 border border-slate-700'
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
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by patient name, ID, emergency symptoms, or address..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Status Filter */}
                <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as any)}
                    className="bg-transparent text-white font-medium text-xs focus:outline-none"
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
                <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={priorityFilter}
                    onChange={e => setPriorityFilter(e.target.value as any)}
                    className="bg-transparent text-white font-medium text-xs focus:outline-none"
                  >
                    <option value="ALL">All Triage Priorities</option>
                    <option value="CRITICAL">Critical (Red)</option>
                    <option value="URGENT">Urgent (Yellow)</option>
                    <option value="STANDARD">Standard</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="bg-transparent text-white font-medium text-xs focus:outline-none"
                  >
                    <option value="newest">Sort: Newest First</option>
                    <option value="priority">Sort: Highest Priority</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Empty State vs Real Requests */}
            {filteredRequests.length === 0 ? (
              <div className="bg-slate-900/50 rounded-3xl p-12 text-center text-slate-400 border border-slate-800 space-y-3">
                <AlertOctagon className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No emergency requests yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
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
                    className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl text-xs font-bold"
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
                      className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
                    >
                      {/* Top Header Line */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-teal-300 bg-teal-950/80 px-2.5 py-0.5 rounded-lg border border-teal-800">
                            {req.id}
                          </span>

                          {/* Status Badge */}
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                              req.status === 'SUBMITTED' || req.status === 'PENDING'
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : req.status === 'UNDER_REVIEW'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : req.status === 'ACCEPTED' || req.status === 'BED_CONFIRMED'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : req.status === 'REDIRECTED'
                                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                                : req.status === 'TIMED_OUT'
                                ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            Status: {req.status}
                          </span>

                          {/* Priority Badge */}
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              isCritical
                                ? 'bg-rose-950 text-rose-400 border border-rose-800 font-black'
                                : isUrgent
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {req.priority || 'STANDARD'} PRIORITY
                          </span>

                          {/* Ambulance Badge */}
                          {req.ambulanceRequested && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center space-x-1">
                              <Ambulance className="w-3 h-3 mr-0.5" />
                              <span>Ambulance Requested</span>
                            </span>
                          )}

                          {/* MediVault Docs Badge */}
                          {hasConsent && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-800 flex items-center space-x-1">
                              <FileText className="w-3 h-3 mr-0.5" />
                              <span>MediVault Shared</span>
                            </span>
                          )}

                          {isConsentRevoked && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                              Consent Revoked
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 text-slate-400 text-[11px]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Submitted: {new Date(req.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      {/* Request Body & Content */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* Patient Core Info */}
                        <div className="lg:col-span-4 space-y-1 text-xs">
                          <h4 className="text-base font-bold text-white">{req.patientName}</h4>
                          <p className="text-slate-300">
                            Age: <strong>{req.patientAge ? `${req.patientAge} Years` : 'Not specified'}</strong> • Blood Group:{' '}
                            <strong className="text-teal-300">{req.patientBloodGroup || 'N/A'}</strong>
                          </p>
                          <p className="text-slate-400">Phone: <strong>{req.patientPhone || 'Not provided'}</strong></p>
                          <p className="text-slate-400 truncate">📍 {req.patientAddress || 'Location coordinates on file'}</p>
                        </div>

                        {/* Emergency Complaint */}
                        <div className="lg:col-span-5 space-y-1.5 text-xs">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Emergency Complaint / Chief Symptoms:
                          </span>
                          <p className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-200 leading-relaxed">
                            {req.symptomsDescription || 'Acute medical emergency assistance requested.'}
                          </p>
                          {req.redirectReason && (
                            <p className="text-[11px] text-cyan-300 bg-cyan-950/60 p-2 rounded-lg border border-cyan-800">
                              Redirect Note: {req.redirectReason} (To: {req.redirectHospitalName || req.redirectHospitalId})
                            </p>
                          )}
                          {req.rejectionReason && (
                            <p className="text-[11px] text-rose-300 bg-rose-950/60 p-2 rounded-lg border border-rose-800">
                              Decline Reason: {req.rejectionReason}
                            </p>
                          )}
                        </div>

                        {/* Actions Area */}
                        <div className="lg:col-span-3 flex flex-col justify-between space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => setDetailModalRequest(req)}
                              className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center justify-center space-x-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Details</span>
                            </button>

                            <button
                              onClick={() => handleOpenDocReview(req)}
                              className="py-2 px-2.5 rounded-xl bg-teal-950/70 hover:bg-teal-900/80 text-teal-300 border border-teal-800 text-xs font-bold transition-all flex items-center justify-center space-x-1"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Vault Docs</span>
                            </button>
                          </div>

                          {/* Action Decision Buttons */}
                          {(req.status === 'SUBMITTED' || req.status === 'PENDING' || req.status === 'UNDER_REVIEW') ? (
                            <div className="space-y-1.5 pt-1">
                              <div className="grid grid-cols-2 gap-1.5">
                                <button
                                  onClick={() => {
                                    setActionTargetRequest(req);
                                    setShowAcceptModal(true);
                                  }}
                                  className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-1"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Accept</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setActionTargetRequest(req);
                                    setShowDeclineModal(true);
                                  }}
                                  className="py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Decline</span>
                                </button>
                              </div>

                              <button
                                onClick={() => {
                                  setActionTargetRequest(req);
                                  setShowRedirectModal(true);
                                }}
                                className="w-full py-1.5 bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                                <span>Redirect Hospital</span>
                              </button>

                              {req.status !== 'UNDER_REVIEW' && (
                                <button
                                  onClick={() => markRequestUnderReview(req.id)}
                                  className="w-full text-center text-[11px] text-slate-400 hover:text-amber-300 transition-colors py-0.5"
                                >
                                  Mark Under Review
                                </button>
                              )}
                            </div>
                          ) : req.status === 'ACCEPTED' ? (
                            <div className="p-2.5 bg-emerald-950/50 rounded-xl border border-emerald-800/80 text-emerald-300 text-xs font-bold text-center">
                              ✓ Accepted ({req.allocatedBedType || 'Bed Allocated'})
                            </div>
                          ) : (
                            <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs text-center font-medium">
                              Case Concluded ({req.status})
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
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Real-Time Hospital Bed Governance</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Bed Availability & Capacity Management
                </h2>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  Duty medical staff must verify and maintain real bed occupancy for Intensive Care Units (ICU), General Wards, and Emergency Departments (ER). Updates persist and automatically sync across the emergency network.
                </p>
              </div>

              <div className="px-3.5 py-1.5 bg-teal-950 border border-teal-800 text-teal-300 rounded-xl text-xs font-bold shrink-0">
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
                    className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-soft flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase bg-slate-950 text-teal-300 border border-slate-800">
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
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {isAvailable ? 'AVAILABLE' : 'FULL / OCCUPIED'}
                        </span>
                      </div>

                      {/* Display Mode vs Edit Mode */}
                      {!isEditing ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                              <span className="text-[10px] text-slate-400 block uppercase font-bold">Total</span>
                              <span className="text-xl font-black text-white">{totalCap}</span>
                            </div>

                            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                              <span className="text-[10px] text-slate-400 block uppercase font-bold">Occupied</span>
                              <span className="text-xl font-black text-amber-400">{occupied}</span>
                            </div>

                            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                              <span className="text-[10px] text-slate-400 block uppercase font-bold">Available</span>
                              <span className="text-xl font-black text-teal-400">{available}</span>
                            </div>
                          </div>

                          {record.notes && (
                            <p className="text-xs text-slate-400 italic bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                              "{record.notes}"
                            </p>
                          )}

                          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 space-y-0.5">
                            <p>Last verified: <strong>{new Date(record.lastUpdated).toLocaleTimeString()}</strong></p>
                            <p>Staff: <strong>{record.updatedByStaffName}</strong></p>
                            <p className="text-teal-400/90 text-[10px]">Source: {record.sourceOfVerification || 'Direct Duty MO Verification'}</p>
                          </div>
                        </div>
                      ) : (
                        /* Editing Form */
                        <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-xl border border-teal-500/40">
                          <h4 className="font-bold text-teal-300">Edit Bed Capacity & Occupancy</h4>

                          <div>
                            <label className="block text-slate-300 font-medium mb-1">Total Capacity:</label>
                            <input
                              type="number"
                              min={0}
                              value={editTotalCapacity}
                              onChange={e => setEditTotalCapacity(parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 font-medium mb-1">Occupied Beds:</label>
                            <input
                              type="number"
                              min={0}
                              max={editTotalCapacity}
                              value={editOccupiedCount}
                              onChange={e => setEditOccupiedCount(parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
                            />
                          </div>

                          <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                            <span className="text-slate-400">Calculated Available:</span>
                            <span className="font-black text-teal-400 text-sm">
                              {Math.max(0, editTotalCapacity - editOccupiedCount)}
                            </span>
                          </div>

                          <div>
                            <label className="block text-slate-300 font-medium mb-1">Operational Notes (Optional):</label>
                            <input
                              type="text"
                              value={editBedNotes}
                              onChange={e => setEditBedNotes(e.target.value)}
                              placeholder="e.g., 2 beds reserved for incoming trauma"
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
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
                          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1"
                        >
                          <span>Update Bed Capacity</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </button>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setEditingBedRecordId(null)}
                            className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveBedChanges(record.id)}
                            className="py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-md"
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
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
                  <Ambulance className="w-4 h-4" />
                  <span>Ambulance Telemetry & Dispatch Coordination</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Hospital Emergency Fleet Coordination
                </h2>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  Coordinate ambulance dispatch, assign paramedical teams, and track operational transport status for incoming emergency patients.
                </p>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2">
                <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Notice: Live GPS tracking is unavailable; telemetry reflects operator-updated dispatch status.</span>
              </div>
            </div>

            {/* List of ambulance-requested cases */}
            {hospitalEmergencyRequests.filter(r => r.ambulanceRequested).length === 0 ? (
              <div className="bg-slate-900/50 rounded-3xl p-12 text-center text-slate-400 border border-slate-800 space-y-2">
                <Ambulance className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No active ambulance requests</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
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
                        className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-soft space-y-4"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                          <div>
                            <span className="font-bold text-white text-sm block">{req.patientName}</span>
                            <span className="text-[11px] text-slate-400">Request ID: {req.id}</span>
                          </div>

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              currentStatus === 'DISPATCHED' || currentStatus === 'EN_ROUTE'
                                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                                : currentStatus === 'ARRIVED'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : currentStatus === 'COMPLETED'
                                ? 'bg-slate-800 text-slate-300 border border-slate-700'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {currentStatus}
                          </span>
                        </div>

                        {/* Location / Patient Destination */}
                        <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                          <p>📍 <strong>Pickup Destination:</strong> {req.patientAddress}</p>
                          <p>📞 <strong>Patient Contact:</strong> {req.patientPhone}</p>
                        </div>

                        {/* Existing Assigned Vehicle Info if any */}
                        {req.ambulanceDetails?.vehicleNumber ? (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                              <span className="text-slate-400 text-[10px] block">Vehicle Number:</span>
                              <strong className="text-white">{req.ambulanceDetails.vehicleNumber}</strong>
                            </div>
                            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                              <span className="text-slate-400 text-[10px] block">Assigned Driver:</span>
                              <strong className="text-white">{req.ambulanceDetails.driverName || 'Operator Staff'}</strong>
                              <span className="block text-[10px] text-slate-400">{req.ambulanceDetails.driverPhone}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">No specific vehicle number assigned yet.</p>
                        )}

                        {/* Status Progression Controls */}
                        <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
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
                                    ? 'bg-cyan-600 text-white shadow-md'
                                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
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
                              className="text-[11px] text-cyan-400 hover:underline pt-1 block"
                            >
                              + Assign or Edit Driver & Vehicle Details
                            </button>
                          ) : (
                            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 pt-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] text-slate-400 block mb-0.5">Driver Name:</label>
                                  <input
                                    type="text"
                                    value={dispatchDriverName}
                                    onChange={e => setDispatchDriverName(e.target.value)}
                                    placeholder="e.g. Subir Das"
                                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-400 block mb-0.5">Driver Phone:</label>
                                  <input
                                    type="text"
                                    value={dispatchDriverPhone}
                                    onChange={e => setDispatchDriverPhone(e.target.value)}
                                    placeholder="e.g. +91 98765 43210"
                                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400 block mb-0.5">Vehicle Number:</label>
                                <input
                                  type="text"
                                  value={dispatchVehicleNo}
                                  onChange={e => setDispatchVehicleNo(e.target.value)}
                                  placeholder="e.g. WB 24 AL 1234"
                                  className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                                />
                              </div>
                              <div className="flex justify-end space-x-2 pt-1">
                                <button
                                  onClick={() => setAmbulanceFormReqId(null)}
                                  className="px-2.5 py-1 bg-slate-800 rounded text-slate-300 text-[11px]"
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
                                  className="px-3 py-1 bg-cyan-600 rounded text-white text-[11px] font-bold"
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
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs">
                  <History className="w-4 h-4" />
                  <span>Immutable Audit Log & Data Protection Compliance</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Hospital Access & Emergency Decision Trail
                </h2>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  Every request receipt, triage decision, bed update, and MediVault record access is cryptographically recorded with actor identity, timestamp, and purpose. Medical content is sanitized to prevent leakage.
                </p>
              </div>

              {/* Action Filter */}
              <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs shrink-0">
                <select
                  value={auditFilterAction}
                  onChange={e => setAuditFilterAction(e.target.value)}
                  className="bg-transparent text-white font-bold text-xs focus:outline-none"
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
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-soft">
              <div className="divide-y divide-slate-800 max-h-[600px] overflow-y-auto">
                {auditLogs
                  .filter(log => auditFilterAction === 'ALL' || log.action === auditFilterAction)
                  .map(log => (
                    <div key={log.id} className="p-4 hover:bg-slate-850/40 transition-colors text-xs space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-teal-300 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {log.action}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-200">{log.details}</p>
                      <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-0.5">
                        <span>Staff Actor: <strong className="text-slate-300">{log.actorName}</strong> ({log.actorRole})</span>
                        {log.ipAddress && <span>• IP: <span className="font-mono">{log.ipAddress}</span></span>}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ================= MODAL: PATIENT REQUEST DETAILS (SECTION D) ================= */}
      {detailModalRequest && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-800 shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                  Emergency Request Full Profile
                </span>
                <h3 className="text-xl font-black text-white">{detailModalRequest.patientName}</h3>
                <p className="text-xs text-slate-400">
                  ID: <span className="font-mono text-teal-300">{detailModalRequest.id}</span> • Status: <strong className="text-white">{detailModalRequest.status}</strong>
                </p>
              </div>
              <button
                onClick={() => setDetailModalRequest(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Scrollable */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Patient Core Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Age</span>
                  <strong className="text-sm text-white">{detailModalRequest.patientAge ? `${detailModalRequest.patientAge} Years` : 'Not specified'}</strong>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Blood Group</span>
                  <strong className="text-sm text-teal-300">{detailModalRequest.patientBloodGroup || 'Not reported'}</strong>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Contact Phone</span>
                  <strong className="text-sm text-white">{detailModalRequest.patientPhone || 'N/A'}</strong>
                </div>
              </div>

              {/* Symptoms & Chief Complaint */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Emergency Complaint & Symptoms:
                </span>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-200 leading-relaxed">
                  {detailModalRequest.symptomsDescription || 'No detailed symptoms description provided with initial SOS.'}
                </div>
              </div>

              {/* Known Clinical Sensitivities & Allergies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-bold text-rose-300 text-[11px] block">Reported Drug Allergies:</span>
                  <p className="text-slate-300">
                    {detailModalRequest.knownAllergies.length > 0 ? detailModalRequest.knownAllergies.join(', ') : 'None documented'}
                  </p>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-bold text-teal-300 text-[11px] block">Existing Chronic Conditions:</span>
                  <p className="text-slate-300">
                    {detailModalRequest.existingConditions.length > 0 ? detailModalRequest.existingConditions.join(', ') : 'None documented'}
                  </p>
                </div>
              </div>

              {/* Current Daily Medications */}
              {detailModalRequest.currentMedicationsSummary && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-300 text-[11px] block">Current Prescribed Medications:</span>
                  <p className="text-slate-200">{detailModalRequest.currentMedicationsSummary}</p>
                </div>
              )}

              {/* Patient Location */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-slate-300 text-[11px] block">Patient Incident Location:</span>
                <p className="text-slate-200">📍 {detailModalRequest.patientAddress}</p>
              </div>

              {/* Consent Information */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-teal-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Consent Status: <strong>{detailModalRequest.accessGrantStatus || 'PENDING'}</strong></span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">Token: {detailModalRequest.accessGrantToken || 'None'}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-800 bg-slate-950 flex justify-between items-center">
              <button
                onClick={() => {
                  const req = detailModalRequest;
                  setDetailModalRequest(null);
                  handleOpenDocReview(req);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl text-xs font-bold flex items-center space-x-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Review Shared MediVault Records</span>
              </button>

              <button
                onClick={() => setDetailModalRequest(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: MEDIVAULT SHARED DOCUMENTS (SECTION 6) ================= */}
      {docsModalRequest && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-800 shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                  Consent-Governed Medical Vault Access
                </span>
                <h3 className="text-xl font-black text-white">{docsModalRequest.patientName}</h3>
                <p className="text-xs text-slate-400">
                  Emergency Request ID: <span className="font-mono text-teal-300">{docsModalRequest.id}</span>
                </p>
              </div>
              <button
                onClick={() => {
                  setDocsModalRequest(null);
                  setPreviewingDoc(null);
                }}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Check Consent Status */}
              {(() => {
                const grant = accessGrants.find(
                  g => g.token === docsModalRequest.accessGrantToken || g.emergencyRequestId === docsModalRequest.id
                );
                const isRevoked = grant?.status === 'REVOKED' || docsModalRequest.accessGrantStatus === 'REVOKED';

                if (isRevoked) {
                  return (
                    <div className="p-6 rounded-2xl bg-rose-950/80 border border-rose-800 text-white space-y-2">
                      <div className="flex items-center space-x-2 text-rose-400 font-black text-base">
                        <ShieldAlert className="w-5 h-5 text-rose-500" />
                        <span>ACCESS REVOKED BY PATIENT</span>
                      </div>
                      <p className="text-xs text-rose-200 leading-relaxed">
                        The patient has revoked authorization for this emergency request. In strict accordance with the Digital Personal Data Protection (DPDP) Act and patient privacy rights, access to medical records is completely blocked.
                      </p>
                      {grant?.revocationReason && (
                        <p className="text-[11px] text-rose-300">
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
                    <div className="p-8 text-center text-slate-400 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                      <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                      <h4 className="font-bold text-white text-sm">No MediVault documents shared</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        The patient submitted this emergency assistance request without attaching explicit MediVault documents, or no documents have been shared for this specific authorization grant.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    <div className="p-3 bg-teal-950/60 rounded-xl border border-teal-800 text-xs text-teal-300 flex items-center justify-between">
                      <span className="flex items-center space-x-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Valid Patient Consent Active. Shared Documents: <strong>{authorizedDocs.length}</strong></span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Expires: {grant?.expiresAt ? new Date(grant.expiresAt).toLocaleTimeString() : 'In 4 hours'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {authorizedDocs.map(doc => (
                        <div
                          key={doc.id}
                          className="p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-teal-500/50 transition-all flex items-center justify-between"
                        >
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-teal-300 border border-slate-700 uppercase">
                              {doc.category.replace('_', ' ')}
                            </span>
                            <h4 className="font-bold text-sm text-white">{doc.title}</h4>
                            <p className="text-[11px] text-slate-400">
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
                            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shrink-0"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Document Preview Snippet Modal/Section */}
                    {previewingDoc && (
                      <div className="p-4 bg-slate-950 rounded-2xl border border-teal-500/50 space-y-3 mt-4 animate-in fade-in">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <h4 className="font-bold text-white text-sm flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-teal-400" />
                            <span>Preview: {previewingDoc.title}</span>
                          </h4>
                          <button
                            onClick={() => setPreviewingDoc(null)}
                            className="text-xs text-slate-400 hover:text-white"
                          >
                            Close Preview
                          </button>
                        </div>
                        <div className="p-3 bg-slate-900 rounded-xl text-xs text-slate-200 space-y-2">
                          <p><strong>Category:</strong> {previewingDoc.category}</p>
                          <p><strong>Doctor/Facility:</strong> {previewingDoc.doctorName || previewingDoc.hospitalName || 'Clinical Diagnostic'}</p>
                          {previewingDoc.notes && <p><strong>Notes:</strong> {previewingDoc.notes}</p>}
                          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-teal-300">
                            ✓ Document verified under patient digital consent. Access timestamp has been recorded in the compliance audit trail.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                onClick={() => {
                  setDocsModalRequest(null);
                  setPreviewingDoc(null);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ACCEPT CONFIRMATION ================= */}
      {showAcceptModal && actionTargetRequest && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-800 shadow-2xl space-y-5 text-white">
            <h3 className="text-lg font-black flex items-center space-x-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <span>Confirm Acceptance of Emergency Request</span>
            </h3>

            <p className="text-xs text-slate-300">
              Accepting will allocate hospital bed capacity and notify patient <strong>{actionTargetRequest.patientName}</strong> in real-time.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Select Bed Category to Allocate:</label>
                <select
                  value={allocatedBedType}
                  onChange={e => setAllocatedBedType(e.target.value as BedCategoryType)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold"
                >
                  <option value="ICU">ICU (Intensive Care Unit Bed)</option>
                  <option value="GENERAL_WARD">General Ward Bed</option>
                  <option value="EMERGENCY_DEPT">Emergency Dept (ER) Observation Bed</option>
                  <option value="CCU">CCU (Coronary Care Bed)</option>
                  <option value="HDU">HDU (High Dependency Bed)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Triage Staff Note (Optional):</label>
                <input
                  type="text"
                  placeholder="e.g. Ventilator ready, trauma team alerted"
                  value={acceptNote}
                  onChange={e => setAcceptNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowAcceptModal(false);
                  setActionTargetRequest(null);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  acceptEmergencyRequest(actionTargetRequest.id, allocatedBedType, acceptNote);
                  setShowAcceptModal(false);
                  setActionTargetRequest(null);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Confirm & Accept Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: DECLINE CONFIRMATION ================= */}
      {showDeclineModal && actionTargetRequest && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-800 shadow-2xl space-y-5 text-white">
            <h3 className="text-lg font-black flex items-center space-x-2 text-rose-400">
              <XCircle className="w-5 h-5" />
              <span>Decline Emergency Request</span>
            </h3>

            <p className="text-xs text-slate-300">
              Please provide a clinical or operational reason. The patient will be notified immediately to re-route to an alternative hospital without delay.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Reason for Declining *:</label>
                <input
                  type="text"
                  required
                  value={declineReason}
                  onChange={e => setDeclineReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowDeclineModal(false);
                  setActionTargetRequest(null);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  rejectEmergencyRequest(actionTargetRequest.id, declineReason);
                  setShowDeclineModal(false);
                  setActionTargetRequest(null);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Decline & Notify Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: REDIRECT CONFIRMATION ================= */}
      {showRedirectModal && actionTargetRequest && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-800 shadow-2xl space-y-5 text-white">
            <h3 className="text-lg font-black flex items-center space-x-2 text-cyan-400">
              <ArrowRight className="w-5 h-5" />
              <span>Redirect Emergency Request</span>
            </h3>

            <p className="text-xs text-slate-300">
              Redirect this patient's emergency request to another verified hospital facility with capacity.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Select Target Hospital *:</label>
                <select
                  value={redirectTargetHospId}
                  onChange={e => setRedirectTargetHospId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold"
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
                <label className="block text-slate-300 font-bold mb-1">Redirection Reason *:</label>
                <input
                  type="text"
                  required
                  value={redirectReasonInput}
                  onChange={e => setRedirectReasonInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowRedirectModal(false);
                  setActionTargetRequest(null);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
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
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-md"
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
