import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  FileText,
  MapPin,
  Share2,
  AlertOctagon,
  User,
  Heart,
  ShieldCheck,
  ArrowRight,
  PlusCircle,
  Eye,
  CheckCircle,
  Layers,
  Sparkles,
  Pill,
  FolderOpen,
  Upload,
  RefreshCw,
  GitBranch,
  Check,
  X,
  AlertTriangle,
  Building2,
  Clock,
  CheckCircle2,
  PhoneCall,
  Info
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const {
    patientProfile,
    currentUser,
    medicalDocuments,
    activeEmergencyRequest,
    navigateTo,
    toggleAutoRerouting,
    manuallyRerouteEmergencyRequest,
    hospitals,
    showToast
  } = useApp();

  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showManualSelectModal, setShowManualSelectModal] = useState(false);
  const [selectedManualHospId, setSelectedManualHospId] = useState('');
  const [isSubmittingManualReroute, setIsSubmittingManualReroute] = useState(false);

  const isAutoRerouteOn = Boolean(patientProfile.autoRerouteEnabled);

  const handleToggleClick = () => {
    if (!isAutoRerouteOn) {
      // Need explicit consent and data disclosure before enabling
      setShowConsentModal(true);
    } else {
      // Patient turning it OFF
      toggleAutoRerouting(false);
    }
  };

  const handleConfirmEnable = () => {
    toggleAutoRerouting(true);
    setShowConsentModal(false);
  };

  const eligibleManualHospitals = hospitals.filter(h => {
    if (!activeEmergencyRequest) return true;
    const isCurrent = h.id === activeEmergencyRequest.selectedHospitalId;
    const isDeclined = activeEmergencyRequest.declinedHospitalIds?.some(d => d === h.id);
    return !isCurrent && !isDeclined;
  });

  const handleManualRerouteSubmit = async (targetHospitalId: string) => {
    if (!activeEmergencyRequest) return;
    setIsSubmittingManualReroute(true);
    try {
      await manuallyRerouteEmergencyRequest(activeEmergencyRequest.id, targetHospitalId);
      showToast('success', 'Emergency Request Forwarded', 'Your request and documents have been forwarded to the partner hospital.');
      setShowManualSelectModal(false);
    } catch (err) {
      showToast('error', 'Forwarding Failed', 'Could not forward request. Please try again.');
    } finally {
      setIsSubmittingManualReroute(false);
    }
  };

  const patientName = patientProfile.fullName || currentUser?.displayName || 'Patient';

  const quickActionCards = [
    {
      id: 'vault',
      page: 'medical-vault',
      title: language === 'bn' ? 'আমার মেডিকেল ভল্ট' : 'My Medical Vault',
      subtitle: medicalDocuments.length === 0
        ? (language === 'bn' ? 'বর্তমানে খালি (Upload Now)' : 'Empty Vault (0 Docs)')
        : `${medicalDocuments.length} ${language === 'bn' ? 'টি নথি সংরক্ষিত' : 'documents stored'}`,
      icon: FileText
    },
    {
      id: 'hospitals',
      page: 'nearby-hospitals',
      title: language === 'bn' ? 'নিকটস্থ হাসপাতাল খুঁজুন' : 'Nearby Hospitals',
      subtitle: `${patientProfile.location || 'Panihati & Dum Dum'}`,
      icon: MapPin
    },
    {
      id: 'ai-checkin',
      page: 'ai-checkin',
      title: language === 'bn' ? 'এআই স্বাস্থ্য চেক-ইন' : 'AI Health Check-in',
      subtitle: language === 'bn' ? 'উপসর্গভিত্তিক মূল্যায়ন' : 'Symptom Assessment',
      icon: Sparkles
    },
    {
      id: 'drug-checker',
      page: 'drug-checker',
      title: language === 'bn' ? 'ওষুধ মিথস্ক্রিয়া পরীক্ষক' : 'Drug Interaction Checker',
      subtitle: language === 'bn' ? 'ওষুধের নিরাপত্তা যাচাই' : 'Medication Safety',
      icon: Pill
    },
    {
      id: 'sos',
      page: 'emergency-sos',
      title: language === 'bn' ? 'জরুরি এসওএস (SOS)' : 'Emergency SOS',
      subtitle: language === 'bn' ? 'শারীরিক অবস্থা ও ট্রায়াজ রিপোর্টিং' : 'Condition Reporting & Triage',
      icon: AlertOctagon,
      isEmergency: true
    },
    {
      id: 'profile',
      page: 'profile',
      title: language === 'bn' ? 'আমার প্রোফাইল' : 'My Profile',
      subtitle: `${patientProfile.age || 65}Y • ${patientProfile.phone || ''}`,
      icon: User
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#171717] py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 1. PROMINENT SMART AUTO-REROUTING TOGGLE CARD */}
        <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-7 border-2 border-[#A5D6A7] shadow-sm relative overflow-hidden transition-all">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className={`p-3.5 rounded-2xl shrink-0 transition-colors ${
                isAutoRerouteOn ? 'bg-[#2E7D32] text-white shadow-xs' : 'bg-white text-gray-500 border border-[#D5E8D7]'
              }`}>
                <RefreshCw className={`w-7 h-7 ${isAutoRerouteOn ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                    {language === 'bn' ? 'স্মার্ট অটো-রিরাউটিং (Smart Auto-Rerouting)' : 'Smart Auto-Rerouting'}
                  </h2>

                  {/* Persistent State Display Pill */}
                  <span
                    id="auto-rerouting-status-badge"
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase transition-all ${
                      isAutoRerouteOn
                        ? 'bg-[#2E7D32] text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-gray-300'
                    }`}
                  >
                    {isAutoRerouteOn ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-white mr-1.5 animate-ping" />
                        <Check className="w-3.5 h-3.5 mr-1 text-white" />
                        {language === 'bn' ? 'অটো-রিরাউটিং সক্রিয় (Auto-Rerouting Enabled)' : 'Auto-Rerouting Enabled'}
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-gray-400 mr-1.5" />
                        <X className="w-3.5 h-3.5 mr-1 text-gray-500" />
                        {language === 'bn' ? 'অটো-রিরাউটিং নিষ্ক্রিয় (Auto-Rerouting Disabled)' : 'Auto-Rerouting Disabled'}
                      </>
                    )}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#444444] max-w-2xl leading-relaxed">
                  {language === 'bn'
                    ? 'কোনো হাসপাতাল আপনার ভর্তির অনুরোধ গ্রহণে অপারগ হলে, সুস্থায়ন স্বয়ংক্রিয়ভাবে আপনার অনুরোধ এবং প্রয়োজনীয় নথি পরবর্তী উপযুক্ত পার্টনার হাসপাতালে পাঠিয়ে দেবে।'
                    : 'If a hospital declines your admission request, Susthayan will automatically forward your request and documents to the next eligible partner hospital.'}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#555555]">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <span>{language === 'bn' ? 'রোগী নিয়ন্ত্রিত সম্মতি ও নিরাপত্তা' : 'Patient-Controlled Consent'}</span>
                  </span>
                  <span>•</span>
                  <span>{language === 'bn' ? 'ডিফল্ট: নতুন রোগীর জন্য বন্ধ (OFF)' : 'Default: OFF for new patients'}</span>
                  <span>•</span>
                  <span>{language === 'bn' ? 'যেকোনো সময় পরিবর্তনযোগ্য' : 'Changeable anytime'}</span>
                </div>
              </div>
            </div>

            {/* Big Interactive Sliding Switch */}
            <div className="flex flex-col items-end sm:items-center md:items-end gap-2 shrink-0 self-end md:self-center">
              <div className="flex items-center space-x-3 bg-white px-4 py-2.5 rounded-2xl border border-[#D5E8D7] shadow-xs">
                <span className="text-xs font-bold text-[#555555]">
                  {isAutoRerouteOn ? (language === 'bn' ? 'চালু (ON)' : 'ON') : (language === 'bn' ? 'বন্ধ (OFF)' : 'OFF')}
                </span>
                <button
                  type="button"
                  role="switch"
                  id="dashboard-auto-reroute-toggle"
                  aria-checked={isAutoRerouteOn}
                  onClick={handleToggleClick}
                  className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:ring-offset-2 ${
                    isAutoRerouteOn ? 'bg-[#2E7D32]' : 'bg-gray-300'
                  }`}
                >
                  <span className="sr-only">Toggle Smart Auto-Rerouting</span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isAutoRerouteOn ? 'translate-x-8' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <span className="text-[11px] text-[#666666] font-medium text-right">
                {isAutoRerouteOn
                  ? (language === 'bn' ? 'ক্লিক করে বন্ধ করুন' : 'Click to turn OFF')
                  : (language === 'bn' ? 'ক্লিক করে চালু ও সম্মতি দিন' : 'Click to enable & consent')}
              </span>
            </div>
          </div>
        </div>

        {/* 2. ACTIVE EMERGENCY NOTIFICATION BANNER IF IN PROGRESS */}
        {activeEmergencyRequest && (
          <div className={`rounded-3xl p-5 sm:p-7 shadow-sm border transition-all animate-in fade-in slide-in-from-top-4 space-y-5 ${
            activeEmergencyRequest.status === 'DECLINED' || activeEmergencyRequest.status === 'UNABLE_TO_ACCOMMODATE' || activeEmergencyRequest.status === 'REJECTED'
              ? 'bg-rose-50 border-rose-300 text-[#171717]'
              : activeEmergencyRequest.status === 'NO_ELIGIBLE_HOSPITALS'
              ? 'bg-amber-50 border-amber-300 text-[#171717]'
              : activeEmergencyRequest.status === 'ACCEPTED' || activeEmergencyRequest.status === 'ACCEPTED_FOR_COORDINATION' || activeEmergencyRequest.status === 'ADMISSION_CONFIRMED'
              ? 'bg-[#E8F5E9] border-[#A5D6A7] text-[#171717]'
              : 'bg-[#D32F2F] text-white border-rose-600'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-2xl shrink-0 mt-0.5 ${
                  activeEmergencyRequest.status === 'DECLINED' || activeEmergencyRequest.status === 'UNABLE_TO_ACCOMMODATE'
                    ? 'bg-rose-200 text-rose-800'
                    : activeEmergencyRequest.status === 'NO_ELIGIBLE_HOSPITALS'
                    ? 'bg-amber-200 text-amber-900'
                    : activeEmergencyRequest.status === 'ACCEPTED' || activeEmergencyRequest.status === 'ADMISSION_CONFIRMED'
                    ? 'bg-emerald-200 text-emerald-900'
                    : 'bg-white/20 text-white'
                }`}>
                  {activeEmergencyRequest.status === 'DECLINED' ? (
                    <AlertTriangle className="w-8 h-8 text-rose-700" />
                  ) : activeEmergencyRequest.status === 'ACCEPTED' ? (
                    <CheckCircle2 className="w-8 h-8 text-[#2E7D32]" />
                  ) : (
                    <AlertOctagon className="w-8 h-8 animate-pulse" />
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Pill */}
                    {activeEmergencyRequest.status === 'DECLINED' || activeEmergencyRequest.status === 'UNABLE_TO_ACCOMMODATE' ? (
                      <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-xs">
                        {language === 'bn' ? 'অনুরোধ প্রত্যাখ্যাত (Request Declined)' : 'Request Declined'}
                      </span>
                    ) : activeEmergencyRequest.status === 'NO_ELIGIBLE_HOSPITALS' ? (
                      <span className="px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-black uppercase tracking-wider">
                        {language === 'bn' ? 'উপযুক্ত কোনো হাসপাতাল পাওয়া যায়নি' : 'No Eligible Hospitals Remaining'}
                      </span>
                    ) : activeEmergencyRequest.status === 'ACCEPTED' || activeEmergencyRequest.status === 'ADMISSION_CONFIRMED' ? (
                      <span className="px-3 py-1 rounded-full bg-[#2E7D32] text-white text-xs font-black uppercase tracking-wider">
                        {language === 'bn' ? 'ভর্তি অনুমোদিত (Admission Confirmed)' : 'Admission Confirmed'}
                      </span>
                    ) : (activeEmergencyRequest.attemptCount && activeEmergencyRequest.attemptCount > 1) ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-xs">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{language === 'bn' ? 'স্বয়ংক্রিয়ভাবে প্রেরিত — উত্তরের অপেক্ষায়' : 'Automatically Forwarded — Awaiting Response'}</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-white text-[#D32F2F] text-xs font-black uppercase tracking-wider">
                        {language === 'bn' ? 'জরুরি অনুরোধ প্রক্রিয়াধীন (Awaiting Response)' : 'Awaiting Response'}
                      </span>
                    )}

                    {/* Auto-Reroute indicator */}
                    {activeEmergencyRequest.autoRerouteEnabled ? (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center space-x-1 ${
                        activeEmergencyRequest.status === 'DECLINED' ? 'bg-rose-200 text-rose-800' : 'bg-emerald-600 text-white'
                      }`}>
                        <RefreshCw className="w-3 h-3 shrink-0" />
                        <span>{language === 'bn' ? 'অটো-রিরাউটিং চালু' : 'Auto-Rerouting ON'}</span>
                        {activeEmergencyRequest.attemptCount && activeEmergencyRequest.attemptCount > 1 && (
                          <span className="bg-white/20 px-1 py-0.2 rounded text-[10px]">
                            #{activeEmergencyRequest.attemptCount}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-gray-200 text-gray-800 text-xs font-bold flex items-center space-x-1">
                        <span>{language === 'bn' ? 'অটো-রিরাউটিং বন্ধ' : 'Auto-Rerouting OFF'}</span>
                      </span>
                    )}

                    <span className={`text-xs font-mono ${
                      activeEmergencyRequest.status === 'DECLINED' ? 'text-rose-700' : 'text-rose-100'
                    }`}>
                      ID: {activeEmergencyRequest.id}
                    </span>
                  </div>

                  {/* Destination Hospital name line */}
                  <div className="space-y-0.5 mt-1">
                    {activeEmergencyRequest.status === 'DECLINED' ? (
                      <div>
                        <span className="text-xs text-rose-700 font-bold uppercase block">
                          {language === 'bn' ? 'প্রত্যাখ্যানকারী হাসপাতাল:' : 'Declined By Facility:'}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-rose-900">
                          {activeEmergencyRequest.selectedHospitalName}
                        </h3>
                      </div>
                    ) : activeEmergencyRequest.originalHospitalName && activeEmergencyRequest.originalHospitalName !== activeEmergencyRequest.selectedHospitalName ? (
                      <div>
                        <div className={`flex items-center space-x-2 text-xs ${
                          activeEmergencyRequest.status === 'ACCEPTED' ? 'text-[#2E7D32]' : 'text-rose-200'
                        }`}>
                          <span>{language === 'bn' ? 'আসল গন্তব্য:' : 'Originally Selected:'}</span>
                          <span className="font-semibold line-through">{activeEmergencyRequest.originalHospitalName}</span>
                          <span>→</span>
                          <span className="font-bold">{language === 'bn' ? 'বর্তমান প্রাপক:' : 'Currently Receiving:'}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black">
                          {activeEmergencyRequest.selectedHospitalName}
                        </h3>
                      </div>
                    ) : (
                      <div>
                        <span className={`text-[11px] uppercase font-bold block ${
                          activeEmergencyRequest.status === 'ACCEPTED' ? 'text-[#2E7D32]' : 'text-rose-200'
                        }`}>
                          {language === 'bn' ? 'গন্তব্য পার্টনার হাসপাতাল:' : 'Destination Partner Hospital:'}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black">
                          {activeEmergencyRequest.selectedHospitalName}
                        </h3>
                      </div>
                    )}
                  </div>

                  {/* Reason & Status message */}
                  {activeEmergencyRequest.rejectionReason && (
                    <div className="p-2.5 rounded-xl bg-white/90 border border-rose-300 text-xs text-rose-900 font-medium">
                      <strong>{language === 'bn' ? 'প্রত্যাখ্যানের কারণ:' : 'Decline Reason:'}</strong> {activeEmergencyRequest.rejectionReason}
                    </div>
                  )}

                  <p className={`text-xs ${
                    activeEmergencyRequest.status === 'DECLINED'
                      ? 'text-rose-800'
                      : activeEmergencyRequest.status === 'ACCEPTED'
                      ? 'text-[#2E7D32] font-semibold'
                      : 'text-rose-100'
                  }`}>
                    {activeEmergencyRequest.statusMessage || 'Hospital triage team is coordinating assistance.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons for this request */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 self-stretch sm:self-auto">
                {activeEmergencyRequest.status === 'DECLINED' && (
                  <button
                    onClick={() => setShowManualSelectModal(true)}
                    className="px-5 py-3 bg-[#2E7D32] hover:bg-[#256B2A] text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Building2 className="w-4 h-4 text-white" />
                    <span>{language === 'bn' ? 'অন্য হাসপাতাল নির্বাচন করুন' : 'Select Another Hospital'}</span>
                  </button>
                )}

                {activeEmergencyRequest.status === 'NO_ELIGIBLE_HOSPITALS' && (
                  <a
                    href="tel:112"
                    className="px-5 py-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2"
                  >
                    <PhoneCall className="w-4 h-4 text-white" />
                    <span>{language === 'bn' ? '১১২ এ সরাসরি কল করুন' : 'Call 112 Helpline'}</span>
                  </a>
                )}

                <button
                  onClick={() => navigateTo('emergency-tracking', { id: activeEmergencyRequest.id })}
                  className={`px-5 py-3 font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                    activeEmergencyRequest.status === 'DECLINED'
                      ? 'bg-white hover:bg-rose-100 text-rose-800 border border-rose-300'
                      : activeEmergencyRequest.status === 'ACCEPTED'
                      ? 'bg-white hover:bg-[#F1F8F2] text-[#2E7D32] border border-[#A5D6A7]'
                      : 'bg-white text-[#D32F2F] hover:bg-rose-50'
                  }`}
                >
                  <span>{language === 'bn' ? 'লাইভ ট্র্যাকিং ও টাইমলাইন দেখুন' : 'View Live Tracking & Timeline'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3. STEP-BY-STEP FORWARDING TIMELINE ON PATIENT DASHBOARD */}
            {activeEmergencyRequest.autoRerouteHistory && activeEmergencyRequest.autoRerouteHistory.length > 0 && (
              <div className={`pt-4 border-t space-y-2 text-xs ${
                activeEmergencyRequest.status === 'DECLINED'
                  ? 'border-rose-200'
                  : activeEmergencyRequest.status === 'ACCEPTED'
                  ? 'border-[#A5D6A7]'
                  : 'border-rose-500/60'
              }`}>
                <div className="flex items-center justify-between pb-1">
                  <span className={`text-[11px] font-black uppercase tracking-wider flex items-center space-x-1.5 ${
                    activeEmergencyRequest.status === 'DECLINED' ? 'text-rose-800' : 'text-rose-100'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'অনুরোধ ও ফরওয়ার্ডিং টাইমলাইন:' : 'Request & Forwarding Timeline:'}</span>
                  </span>

                  {activeEmergencyRequest.forwardingTimestamp && (
                    <span className="text-[11px] font-mono opacity-80">
                      {language === 'bn' ? 'সর্বশেষ আপডেট:' : 'Last Activity:'}{' '}
                      <strong>{new Date(activeEmergencyRequest.forwardingTimestamp).toLocaleTimeString()}</strong>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 overflow-x-auto py-1">
                  {activeEmergencyRequest.autoRerouteHistory.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <div className={`p-2 rounded-xl flex items-center space-x-2 shrink-0 border ${
                        step.status === 'ACCEPTED'
                          ? 'bg-emerald-700 text-white border-emerald-600'
                          : step.status === 'DECLINED'
                          ? 'bg-rose-800 text-rose-100 border-rose-700'
                          : 'bg-white text-[#171717] border-white/60 font-bold'
                      }`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                          step.status === 'ACCEPTED'
                            ? 'bg-white text-emerald-800'
                            : step.status === 'DECLINED'
                            ? 'bg-white/20 text-white'
                            : 'bg-[#2E7D32] text-white'
                        }`}>
                          {step.status === 'ACCEPTED' ? '✓' : step.status === 'DECLINED' ? '✕' : step.attemptNumber}
                        </div>
                        <div className="text-[11px] leading-tight">
                          <p className="font-bold truncate max-w-[150px]">{step.hospitalName}</p>
                          <p className="text-[10px] opacity-80">
                            {step.status === 'DECLINED' ? (step.declineReason || 'Declined') : step.status === 'ACCEPTED' ? 'Accepted' : 'Awaiting Response'}
                          </p>
                        </div>
                      </div>

                      {idx < activeEmergencyRequest.autoRerouteHistory!.length - 1 && (
                        <span className="opacity-70 text-sm font-bold shrink-0">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TOP WELCOME & SENIOR STATUS BANNER */}
        <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 text-[#171717] shadow-xs border border-[#D5E8D7] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-white text-[#2E7D32] border border-[#D5E8D7] text-xs font-bold shadow-xs">
                  {language === 'bn' ? 'সুস্থায়ন স্বাস্থ্য ড্যাশবোর্ড' : 'Susthayan Health Dashboard'}
                </span>
                <span className="flex items-center text-xs text-[#2E7D32] font-semibold">
                  <CheckCircle className="w-3.5 h-3.5 mr-1 text-[#2E7D32]" />
                  {language === 'bn' ? 'নিবন্ধিত একাউন্ট' : 'Registered Patient'}
                </span>
              </div>

              {/* Exact Name Display */}
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#171717] font-bengali">
                {language === 'bn' ? `স্বাগতম, ${patientName}` : `Welcome, ${patientName}`}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#555555]">
                <span>
                  {language === 'bn' ? 'বয়স:' : 'Age:'} <strong className="text-[#171717]">{patientProfile.age || currentUser?.age || 65} {language === 'bn' ? 'বছর' : 'Years'}</strong>
                </span>
                <span>•</span>
                <span>📞 <strong className="text-[#171717]">{patientProfile.phone || currentUser?.phone}</strong></span>
                <span>•</span>
                <span className="bg-white px-2 py-0.5 rounded font-bold text-[#2E7D32] border border-[#D5E8D7]">
                  📍 {patientProfile.location || currentUser?.location || 'Panihati, West Bengal'}
                </span>
              </div>
            </div>

            {/* Quick Action Pill Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigateTo('upload-document')}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white font-bold text-xs shadow-xs transition-all"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>{language === 'bn' ? 'নতুন নথি আপলোড' : 'Upload Document'}</span>
              </button>

              <button
                onClick={() => navigateTo('ai-checkin')}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-white hover:bg-[#F1F8F2] text-[#171717] border border-[#D5E8D7] text-xs font-bold transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#2E7D32]" />
                <span>{language === 'bn' ? 'এআই চেক-ইন' : 'AI Check-in'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 6 MAIN QUICK ACTION CARDS */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-[#171717] flex items-center space-x-2">
              <Layers className="w-5 h-5 text-[#2E7D32]" />
              <span>{language === 'bn' ? 'প্রধান স্বাস্থ্য সেবাসমূহ' : 'Key Health Actions'}</span>
            </h2>
            <span className="text-xs text-[#555555] font-medium">
              {language === 'bn' ? 'সহজ ও স্পষ্ট এক ক্লিকে এক্সেস' : 'Quick Access Cards'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {quickActionCards.map(card => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => navigateTo(card.page)}
                  className="bg-[#E8F5E9] p-6 rounded-3xl border border-[#D5E8D7] hover:border-[#2E7D32] transition-all cursor-pointer shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-3 rounded-2xl bg-white border border-[#D5E8D7] shadow-xs">
                        <Icon className={`w-6 h-6 ${card.isEmergency ? 'text-[#D32F2F]' : 'text-[#2E7D32]'}`} />
                      </div>
                      <span className="text-xs font-bold text-[#555555] bg-white px-2.5 py-1 rounded-lg border border-[#D5E8D7]">
                        {card.subtitle}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-[#171717]">
                      {card.title}
                    </h3>
                  </div>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      navigateTo(card.page);
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5 ${
                      card.isEmergency
                        ? 'bg-[#D32F2F] hover:bg-[#B71C1C] text-white'
                        : 'bg-[#2E7D32] hover:bg-[#256B2A] text-white'
                    }`}
                  >
                    <span>{language === 'bn' ? 'প্রবেশ করুন' : 'Open Section'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* PATIENT-CONTROLLED HOSPITAL ACCESS & PERMISSIONS SECTION */}
        <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#D5E8D7]">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-[#2E7D32] font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                <span>Patient-Controlled Hospital Permissions & Privacy</span>
              </div>
              <h3 className="text-xl font-black text-[#171717]">
                {language === 'bn' ? 'হাসপাতাল অনুমতি ও অ্যাক্সেস নিয়ন্ত্রণ (Access Management)' : 'Hospital Access & Permission Control'}
              </h3>
            </div>

            <button
              onClick={() => navigateTo('share-records')}
              className="px-4 py-2 bg-white hover:bg-[#F1F8F2] text-[#2E7D32] border border-[#D5E8D7] rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs"
            >
              <Share2 className="w-4 h-4 text-[#2E7D32]" />
              <span>{language === 'bn' ? 'নতুন হাসপাতালকে অনুমতি দিন' : 'Grant New Hospital Access'}</span>
            </button>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] text-xs text-[#171717] space-y-1">
            <p className="font-bold flex items-center text-[#2E7D32]">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-[#2E7D32]" />
              {language === 'bn' ? 'আপনার নিয়ন্ত্রণ, আপনার গোপনীয়তা:' : 'Your Health Privacy Right:'}
            </p>
            <p className="text-[#555555] leading-relaxed">
              {language === 'bn'
                ? 'হাসপাতাল শুধুমাত্র আপনার অনুমোদিত সময় পর্যন্ত মেডিকেল নথি দেখতে পারে। "অনুমতি প্রত্যাহার" বাটনে চাপলে প্ল্যাটফর্মে হাসপাতালের ভবিষ্যৎ অ্যাক্সেস সাথে সাথে বন্ধ হয়ে যায়।'
                : 'Hospital staff can only access your records within your approved time window. Revoking access instantly blocks any future viewing through the platform.'}
            </p>
          </div>

          {/* Access Grants List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                id: 'grant-pan-8921',
                hospitalName: 'Panihati State General Hospital',
                token: 'GRANT-PAN-8921',
                status: 'ACTIVE',
                validity: 'Valid for 4 Hours',
                expiresAt: 'In 3 hours 45 mins',
                docsCount: 3,
                lastAccess: 'Viewed 5 mins ago by Duty Officer'
              },
              {
                id: 'grant-cmsdh-4412',
                hospitalName: 'Sagore Dutta Medical College (CMSDH)',
                token: 'GRANT-CMSDH-4412',
                status: 'REVOKED',
                validity: 'Expired / Revoked',
                expiresAt: 'Revoked by Patient',
                docsCount: 1,
                lastAccess: 'Blocked'
              }
            ].map(grant => (
              <div
                key={grant.id}
                className="p-5 rounded-2xl border border-[#D5E8D7] bg-white space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-[#171717] truncate max-w-[220px]">
                    {grant.hospitalName}
                  </h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    grant.status === 'ACTIVE'
                      ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7]'
                      : 'bg-rose-50 text-rose-700 border border-rose-300'
                  }`}>
                    {grant.status === 'ACTIVE'
                      ? (language === 'bn' ? 'সক্রিয়' : 'ACTIVE')
                      : (language === 'bn' ? 'প্রত্যাহারকৃত' : 'REVOKED')}
                  </span>
                </div>

                <div className="text-xs text-[#555555] space-y-1">
                  <p>{language === 'bn' ? 'টোকেন:' : 'Token:'} <span className="font-mono font-bold text-[#171717]">{grant.token}</span></p>
                  <p>{language === 'bn' ? 'মেয়াদ:' : 'Duration:'} <span className="font-medium text-[#171717]">{language === 'bn' ? (grant.id === 'grant-pan-8921' ? '৩ ঘণ্টা ৪৫ মিনিট বাকি' : 'রোগী কর্তৃক প্রত্যাহারকৃত') : grant.expiresAt}</span></p>
                  <p>{language === 'bn' ? 'সংযুক্ত রেকর্ড:' : 'Attached Records:'} <strong className="text-[#2E7D32]">{language === 'bn' ? `${grant.docsCount} টি নথি` : `${grant.docsCount} Documents`}</strong> {language === 'bn' ? '(প্রেসক্রিপশন ও রক্ত পরীক্ষা)' : '(Prescriptions & Blood Tests)'}</p>
                  <p className="text-[11px] text-[#777777]">{language === 'bn' ? 'পরিদর্শন স্থিতি:' : 'Access Status:'} {language === 'bn' ? (grant.id === 'grant-pan-8921' ? '৫ মিনিট আগে অন-ডিউটি অফিসার কর্তৃক পরিদর্শিত' : 'ব্লক করা হয়েছে') : grant.lastAccess}</p>
                </div>

                {grant.status === 'ACTIVE' ? (
                  <div className="pt-2 border-t border-[#D5E8D7] flex justify-end">
                    <button
                      onClick={() => navigateTo('share-records')}
                      className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold text-xs rounded-xl transition-all"
                    >
                      {language === 'bn' ? 'অনুমতি প্রত্যাহার করুন' : 'Revoke Access'}
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-[#D5E8D7] text-[11px] text-rose-600 font-bold">
                    {language === 'bn' ? '✓ ভবিষ্যৎ এক্সেস সম্পূর্ণ ব্লক করা হয়েছে' : '✓ Future access completely blocked'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MEDIVAULT RECORDS SECTION */}
        <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#D5E8D7]">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#2E7D32]" />
              <h3 className="text-base font-black text-[#171717]">
                {language === 'bn' ? 'সংরক্ষিত মেডিকেল রেকর্ডস (MediVault)' : 'Saved MediVault Records'}
              </h3>
            </div>
            {medicalDocuments.length > 0 && (
              <button
                onClick={() => navigateTo('medical-vault')}
                className="text-xs font-bold text-[#2E7D32] hover:underline"
              >
                {language === 'bn' ? 'সব নথি দেখুন →' : 'View All →'}
              </button>
            )}
          </div>

          {medicalDocuments.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#D5E8D7] space-y-3">
              <FolderOpen className="w-12 h-12 text-[#2E7D32] mx-auto opacity-70" />
              <h4 className="font-bold text-[#171717] text-base">
                {language === 'bn' ? 'আপনার মেডিকেল ভল্ট বর্তমানে খালি' : 'Your Medical Vault is Empty'}
              </h4>
              <p className="text-xs text-[#555555] max-w-sm mx-auto">
                {language === 'bn'
                  ? 'প্রেসক্রিপশন বা রক্তের রিপোর্ট সংরক্ষণ করতে নিচের বোতামে চাপ দিন।'
                  : 'Upload your first medical document to securely organize your health records.'}
              </p>
              <button
                onClick={() => navigateTo('upload-document')}
                className="px-6 py-2.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center space-x-1.5"
              >
                <Upload className="w-4 h-4 text-white" />
                <span>{language === 'bn' ? 'নথি আপলোড করুন' : 'Upload Documents'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {medicalDocuments.slice(0, 3).map(doc => (
                <div
                  key={doc.id}
                  onClick={() => navigateTo('document-preview', { id: doc.id })}
                  className="p-4 rounded-2xl border border-[#D5E8D7] bg-white hover:border-[#2E7D32] transition-all flex items-center justify-between cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-[#2E7D32]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#171717] truncate group-hover:text-[#2E7D32]">
                        {doc.title}
                      </h4>
                      <p className="text-[11px] text-[#555555]">
                        {doc.uploadDate} • {doc.category.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-[#555555] group-hover:text-[#2E7D32] shrink-0 ml-2" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CONSENT & DATA DISCLOSURE MODAL FOR SMART AUTO-REROUTING */}
        {showConsentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#D5E8D7] max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#D5E8D7]">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-[#E8F5E9] rounded-2xl text-[#2E7D32]">
                    <ShieldCheck className="w-7 h-7 text-[#2E7D32]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#171717]">
                      {language === 'bn' ? 'স্মার্ট অটো-রিরাউটিং সম্মতি ও তথ্যের প্রকাশ' : 'Enable Smart Auto-Rerouting'}
                    </h3>
                    <p className="text-xs text-[#555555]">
                      {language === 'bn' ? 'স্বয়ংক্রিয় ফরওয়ার্ডিং ও নথি শেয়ারিং সংক্রান্ত তথ্য' : 'Information & Medical Document Sharing Consent'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowConsentModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Detailed Disclosure Items */}
              <div className="space-y-4 text-xs text-[#333333] leading-relaxed">
                <div className="p-4 bg-[#E8F5E9] rounded-2xl border border-[#D5E8D7] space-y-2">
                  <h4 className="font-bold text-sm text-[#2E7D32] flex items-center space-x-1.5">
                    <RefreshCw className="w-4 h-4 text-[#2E7D32]" />
                    <span>{language === 'bn' ? 'কিভাবে কাজ করে?' : 'How Automatic Forwarding Works'}</span>
                  </h4>
                  <p className="text-[#444444]">
                    {language === 'bn'
                      ? 'যদি আপনার প্রাথমিক হাসপাতাল আইসিইউ বেড বা প্রয়োজনীয় চিকিৎসাসেবার অভাবে অনুরোধ গ্রহণে অপারগ হয়, সুস্থায়ন তাৎক্ষণিকভাবে নিকটস্থ যোগ্য পার্টনার হাসপাতালে আপনার অনুরোধ স্বয়ংক্রিয়ভাবে পাঠিয়ে দেবে। আপনাকে পুনরায় ফর্ম পূরণ বা নথি আপলোড করতে হবে না।'
                      : 'If your selected hospital declines admission due to lack of ICU beds, general beds, or required emergency resources, Susthayan will automatically forward your request and documents to the next eligible partner hospital near your location.'}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <h4 className="font-bold text-sm text-[#171717]">
                    {language === 'bn' ? 'পরবর্তী হাসপাতালের সাথে যা যা শেয়ার করা হবে:' : 'Patient Information & Documents Shared:'}
                  </h4>

                  <div className="grid grid-cols-1 gap-2.5">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center font-bold shrink-0 mt-0.5">1</div>
                      <div>
                        <strong className="text-[#171717] block">
                          {language === 'bn' ? 'জরুরি প্রোফাইল ও যোগাযোগের তথ্য' : 'Emergency Profile & Contact Details'}
                        </strong>
                        <span className="text-[#666666]">
                          {language === 'bn' ? 'নাম, বয়স, রক্তের গ্রুপ, জরুরি যোগাযোগের নম্বর ও অবস্থান।' : 'Patient name, age, blood group, emergency contact numbers, and saved location.'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center font-bold shrink-0 mt-0.5">2</div>
                      <div>
                        <strong className="text-[#171717] block">
                          {language === 'bn' ? 'ক্লিনিক্যাল ট্রায়াজ ও উপসর্গ রিপোর্ট' : 'Clinical Triage & Symptom Report'}
                        </strong>
                        <span className="text-[#666666]">
                          {language === 'bn' ? 'উপসর্গের বিবরণ, তীব্রতা, শ্বাসকষ্ট ও সচেতনতার মাত্রা, অ্যালার্জি ও বর্তমান ওষুধ।' : 'Reported emergency symptoms, severity level, consciousness, breathing state, allergies, and existing conditions.'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center font-bold shrink-0 mt-0.5">3</div>
                      <div>
                        <strong className="text-[#171717] block">
                          {language === 'bn' ? 'অনুমোদিত মেডিকেল ভল্ট নথিপত্র' : 'Authorized MediVault Documents'}
                        </strong>
                        <span className="text-[#666666]">
                          {language === 'bn' ? 'অনুরোধের সাথে সংযুক্ত প্রেসক্রিপশন ও ডায়াগনস্টিক রিপোর্ট (৪ ঘণ্টার এনক্রিপ্টেড টোকেনের মাধ্যমে সুরক্ষিত)।' : 'Selected prescriptions and test reports attached to your emergency request under strict 4-hour expiring access tokens.'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <Info className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{language === 'bn' ? 'গোপনীয়তা ও অনুমতি প্রত্যাহার অধিকার' : 'Your Privacy & Consent Control'}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    {language === 'bn'
                      ? 'যে হাসপাতাল অনুরোধ প্রত্যাখ্যান করবে, তাদের অ্যাক্সেস টোকেন তাৎক্ষণিকভাবে প্রত্যাহার করা হবে। আপনি যেকোনো সময় এই ড্যাশবোর্ড থেকে এই টগল বন্ধ করতে পারেন।'
                      : 'Access tokens for declined hospitals are immediately revoked. You can turn this toggle OFF at any time from your Patient Dashboard to stop future automatic forwarding.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#D5E8D7]">
                <button
                  type="button"
                  onClick={() => setShowConsentModal(false)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
                >
                  {language === 'bn' ? 'বাতিল করুন' : 'Cancel'}
                </button>
                <button
                  type="button"
                  id="confirm-enable-auto-reroute"
                  onClick={handleConfirmEnable}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Check className="w-4 h-4 text-white" />
                  <span>{language === 'bn' ? 'আমি সম্মত ও চালু করুন' : 'Confirm & Enable Auto-Rerouting'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MANUAL HOSPITAL SELECTION MODAL (When Request is Declined and Auto-Rerouting was OFF) */}
        {showManualSelectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#D5E8D7] max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#D5E8D7]">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-[#E8F5E9] rounded-2xl text-[#2E7D32]">
                    <Building2 className="w-7 h-7 text-[#2E7D32]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#171717]">
                      {language === 'bn' ? 'বিকল্প পার্টনার হাসপাতাল নির্বাচন করুন' : 'Select Another Partner Hospital'}
                    </h3>
                    <p className="text-xs text-[#555555]">
                      {language === 'bn' ? 'আপনার বর্তমান জরুরি অনুরোধ ও নথি সরাসরি নতুন হাসপাতালে প্রেরিত হবে' : 'Forward your existing request and documents to another verified hospital'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowManualSelectModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {activeEmergencyRequest && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 flex items-center justify-between">
                  <div>
                    <span className="font-bold block">Previous Decline:</span>
                    <span>{activeEmergencyRequest.selectedHospitalName} ({activeEmergencyRequest.rejectionReason || 'Bed unavailable'})</span>
                  </div>
                  <span className="font-mono text-[10px] text-rose-600 font-bold bg-white px-2 py-1 rounded">
                    ID: {activeEmergencyRequest.id}
                  </span>
                </div>
              )}

              {/* Hospital List */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#555555] uppercase tracking-wider block">
                  {language === 'bn' ? 'উপলব্ধ পার্টনার হাসপাতালসমূহ (পাণিহাটি ও দমদম নেটওয়ার্ক):' : 'Available Partner Hospitals (Panihati & Dum Dum):'}
                </span>

                <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-1">
                  {eligibleManualHospitals.map(hosp => (
                    <div
                      key={hosp.id}
                      className="p-4 rounded-2xl border border-[#D5E8D7] bg-[#F1F8F2]/60 hover:bg-[#E8F5E9] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-black text-[#171717]">{hosp.name}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-[#2E7D32] border border-[#D5E8D7]">
                            📍 {hosp.locality || hosp.area || 'Panihati'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#555555]">
                          <span>{hosp.distanceKm} km away • ~{hosp.estimatedTravelMins} mins</span>
                          <span>•</span>
                          <span className="text-[#2E7D32] font-bold">
                            ICU Beds: {hosp.icuBedsAvailable ?? hosp.availableBeds ?? 'Available'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isSubmittingManualReroute}
                        onClick={() => handleManualRerouteSubmit(hosp.id)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmittingManualReroute ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Forwarding...</span>
                          </>
                        ) : (
                          <>
                            <span>{language === 'bn' ? 'এখানে পাঠান' : 'Forward Here'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternative Action: Open Full Form */}
              <div className="pt-3 border-t border-[#D5E8D7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-[#666666]">
                  {language === 'bn' ? 'তথ্য পরিবর্তন করতে চান?' : 'Need to modify symptoms or documents?'}
                </span>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setShowManualSelectModal(false);
                      navigateTo('emergency-sos');
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-gray-700 font-bold transition-all text-center"
                  >
                    {language === 'bn' ? 'সম্পূর্ণ ফর্ম খুলুন' : 'Open Emergency SOS Form'}
                  </button>
                  <button
                    onClick={() => setShowManualSelectModal(false)}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 font-bold transition-all"
                  >
                    {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
