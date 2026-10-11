import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  AlertOctagon,
  Ambulance,
  Building,
  CheckCircle2,
  Clock,
  PhoneCall,
  User,
  ShieldAlert,
  ArrowLeft,
  XCircle,
  MapPin,
  MessageSquare,
  Send,
  AlertTriangle,
  Building2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileText,
  Activity
} from 'lucide-react';
import { EmergencyRequestStatus } from '../types';

export const EmergencyTracking: React.FC = () => {
  const { language, t } = useLanguage();
  const {
    emergencyRequests,
    activeEmergencyRequest,
    pageParams,
    cancelEmergencyRequest,
    respondToClarification,
    hospitals,
    navigateTo,
    showToast
  } = useApp();

  const requestId = pageParams?.id;
  const currentRequest =
    emergencyRequests.find(r => r.id === requestId) ||
    activeEmergencyRequest ||
    emergencyRequests[0];

  const [clarificationReply, setClarificationReply] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  const [simulatedEta, setSimulatedEta] = useState(
    currentRequest?.ambulanceDetails?.etaMinutes || 8
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedEta(prev => Math.max(1, prev - 1));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!currentRequest) {
    return (
      <div className="min-h-screen bg-white p-8 text-center flex flex-col items-center justify-center space-y-4">
        <p className="text-[#555555] text-sm">
          {language === 'bn' ? 'কোনো সক্রিয় জরুরি অনুরোধ পাওয়া যায়নি।' : 'No active emergency request found.'}
        </p>
        <button
          onClick={() => navigateTo('dashboard')}
          className="px-5 py-2.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
        >
          {language === 'bn' ? 'ড্যাশবোর্ডে ফিরে যান' : 'Back to Dashboard'}
        </button>
      </div>
    );
  }

  // Find destination hospital details
  const targetHospital = hospitals.find(
    h => h.id === currentRequest.selectedHospitalId || h.name === currentRequest.selectedHospitalName
  );

  // Status mapping and visual indicators
  const getStatusBadge = (status: EmergencyRequestStatus) => {
    switch (status) {
      case 'PENDING_REVIEW':
      case 'PENDING':
      case 'SUBMITTED':
        return {
          labelEn: 'Awaiting Triage Review',
          labelBn: 'ট্রায়াজ পর্যালোচনার অপেক্ষায়',
          color: 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse',
          descEn: 'The emergency request has been safely received by the hospital desk and is queued for medical review. A doctor has not yet reviewed it.',
          descBn: 'অনুরোধটি হাসপাতালের ইআর ডেস্কে নিরাপদে পৌঁছেছে এবং পর্যালোচনার অপেক্ষায় রয়েছে। চিকিৎসক এখনও পর্যালোচনা করেননি।'
        };
      case 'UNDER_ASSESSMENT':
      case 'UNDER_REVIEW':
        return {
          labelEn: 'Under Clinical Assessment',
          labelBn: 'ক্লিনিক্যাল মূল্যায়নাধীন',
          color: 'bg-blue-100 text-blue-900 border-blue-300',
          descEn: 'Qualified hospital triage staff is actively evaluating symptoms, condition severity, and bed availability.',
          descBn: 'হাসপাতালের জরুরি ট্রায়াজ চিকিৎসক দল লক্ষণ, তীব্রতা ও শয্যার প্রাপ্যতা পর্যালোচনা করছেন।'
        };
      case 'MORE_INFORMATION_REQUIRED':
        return {
          labelEn: 'More Information Required',
          labelBn: 'অতিরিক্ত তথ্য প্রয়োজন',
          color: 'bg-purple-100 text-purple-900 border-purple-300',
          descEn: 'The hospital has sent a clarification question. Please review and reply below.',
          descBn: 'হাসপাতাল অতিরিক্ত তথ্যের জন্য একটি প্রশ্ন পাঠিয়েছে। অনুগ্রহ করে নিচে উত্তর দিন।'
        };
      case 'ACCEPTED_FOR_COORDINATION':
      case 'ACCEPTED':
        return {
          labelEn: 'Accepted for Coordination',
          labelBn: 'সমন্বয়ের জন্য গৃহীত',
          color: 'bg-[#E8F5E9] text-[#2E7D32] border-[#D5E8D7]',
          descEn: 'The hospital has accepted the case for emergency coordination. Note: This does not represent guaranteed admission or confirmed ICU bed until formally verified.',
          descBn: 'হাসপাতাল প্রাথমিক সমন্বয়ের জন্য অনুরোধ গ্রহণ করেছে। চূড়ান্ত নিশ্চিতকরণ ছাড়া এটি গ্যারান্টিযুক্ত ভর্তি হিসেবে গণ্য নয়।'
        };
      case 'ADMISSION_CONFIRMED':
      case 'BED_CONFIRMED':
        return {
          labelEn: 'Hospital Admission Confirmed',
          labelBn: 'হাসপাতালে ভর্তি নিশ্চিত',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          descEn: 'Authorized hospital staff has formally verified bed availability and confirmed emergency admission.',
          descBn: 'হাসপাতাল কর্তৃপক্ষ শয্যা যাচাই করে জরুরি ভর্তি নিশ্চিত করেছেন।'
        };
      case 'UNABLE_TO_ACCOMMODATE':
      case 'REJECTED':
      case 'DECLINED':
        return {
          labelEn: 'Unable to Accommodate',
          labelBn: 'গ্রহণে অপারগ',
          color: 'bg-rose-100 text-rose-900 border-rose-300',
          descEn: 'The hospital cannot accommodate the request. Please view alternative facilities below or call 112 immediately.',
          descBn: 'হাসপাতাল বর্তমানে রোগী গ্রহণে অপারগ। অনুগ্রহ করে বিকল্প হাসপাতাল দেখুন বা অবিলম্বে ১১২-এ কল করুন।'
        };
      case 'TIMED_OUT':
        return {
          labelEn: 'Response Timed Out',
          labelBn: 'সময় অতিক্রান্ত',
          color: 'bg-rose-100 text-rose-900 border-rose-300',
          descEn: 'Hospital did not respond within the emergency window. Please switch to an alternative hospital.',
          descBn: 'নির্ধারিত সময়ে হাসপাতাল সাড়া দেয়নি। বিকল্প হাসপাতাল নির্বাচন করুন।'
        };
      default:
        return {
          labelEn: status,
          labelBn: status,
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          descEn: currentRequest.statusMessage || '',
          descBn: currentRequest.statusMessage || ''
        };
    }
  };

  const statusBadge = getStatusBadge(currentRequest.status);

  // Send clarification reply handler
  const handleSendClarification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clarificationReply.trim()) return;

    setIsSendingReply(true);
    respondToClarification(
      currentRequest.id,
      clarificationReply.trim(),
      'patient',
      currentRequest.patientName
    );
    setClarificationReply('');
    setIsSendingReply(false);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Back Nav & Quick Help */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateTo('dashboard')}
            className="flex items-center space-x-2 text-xs font-bold text-[#2E7D32] hover:text-[#256B2A] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'bn' ? 'ড্যাশবোর্ডে ফিরে যান' : 'Back to Dashboard'}</span>
          </button>

          <a
            href="tel:112"
            className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? '১১২ হেল্পলাইন' : 'Dial 112'}</span>
          </a>
        </div>

        {/* HEADER EMERGENCY TRACKING BANNER */}
        <div className="bg-[#E8F5E9] text-[#171717] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className={`px-3 py-1 rounded-full border text-xs font-black uppercase tracking-wider ${statusBadge.color}`}>
              ● {language === 'bn' ? statusBadge.labelBn : statusBadge.labelEn}
            </span>
            <span className="font-mono text-xs text-[#555555] bg-white px-2.5 py-1 rounded-lg border border-[#D5E8D7]">
              Request ID: <strong className="text-[#2E7D32]">{currentRequest.id}</strong>
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#171717]">
              {currentRequest.selectedHospitalName}
            </h1>
            <p className="text-xs text-[#555555] mt-1">
              {language === 'bn' ? 'জমা দেওয়ার সময়:' : 'Submitted at:'}{' '}
              <strong>{new Date(currentRequest.timestamp).toLocaleString()}</strong>
            </p>
          </div>

          {/* Status Message / Hospital Response */}
          <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] space-y-1">
            <span className="text-[10px] font-bold text-[#555555] uppercase block">
              {language === 'bn' ? 'হাসপাতালের সাড়াদান ও বর্তমান অবস্থা:' : 'Hospital Response & Progress:'}
            </span>
            <p className="text-xs font-semibold text-[#171717] leading-relaxed">
              {language === 'bn' ? statusBadge.descBn : statusBadge.descEn}
            </p>
            {currentRequest.statusMessage && (
              <p className="text-xs text-[#555555] pt-1 border-t border-[#D5E8D7] italic">
                "{currentRequest.statusMessage}"
              </p>
            )}
          </div>

          {/* VERIFIED HOSPITAL CONTACT */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <span className="bg-white text-[#171717] px-3.5 py-2 rounded-xl border border-[#D5E8D7] flex items-center space-x-2">
              <PhoneCall className="w-4 h-4 text-[#2E7D32]" />
              <span>
                {language === 'bn' ? 'জরুরি হেল্পলাইন:' : 'Hospital Emergency Helpline:'}{' '}
                <strong>{targetHospital?.phone || '033 2553 1243'}</strong>
              </span>
            </span>

            {targetHospital?.mapsUrl && (
              <a
                href={targetHospital.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-white hover:bg-[#F1F8F2] text-[#2E7D32] px-3.5 py-2 rounded-xl border border-[#D5E8D7] flex items-center space-x-1 font-bold transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>{language === 'bn' ? 'হাসপাতালের রুট ম্যাপ' : 'Directions & Route'}</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            )}
          </div>
        </div>

        {/* SECTION: PATIENT REPORTED MEDICAL PROBLEM SUMMARY */}
        <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-[#171717] font-black text-base">
            <Activity className="w-5 h-5 text-[#2E7D32]" />
            <span>
              {language === 'bn'
                ? 'রোগীর প্রেরিত শারীরিক সমস্যা ও লক্ষণ'
                : 'Patient-Reported Medical Problem & Triage Parameters'}
            </span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] space-y-2">
            <span className="text-[10px] text-[#555555] block uppercase font-bold">
              {language === 'bn' ? 'বর্ণিত শারীরিক সমস্যা:' : 'Reported Chief Complaint:'}
            </span>
            <p className="text-xs sm:text-sm font-bold text-[#171717] leading-relaxed">
              {currentRequest.chiefComplaint || currentRequest.symptomsDescription || 'Emergency request submitted.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-[#D5E8D7]">
              <span className="text-[10px] text-[#555555] block uppercase font-bold">
                {language === 'bn' ? 'তীব্রতা' : 'Reported Severity'}
              </span>
              <strong className="text-[#171717] text-xs">{currentRequest.reportedSeverity || 'Severe'}</strong>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#D5E8D7]">
              <span className="text-[10px] text-[#555555] block uppercase font-bold">
                {language === 'bn' ? 'জ্ঞান / সচেতনতা' : 'Consciousness'}
              </span>
              <strong className="text-[#171717] text-xs">{currentRequest.consciousnessStatus || 'Alert'}</strong>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#D5E8D7]">
              <span className="text-[10px] text-[#555555] block uppercase font-bold">
                {language === 'bn' ? 'শ্বাস-প্রশ্বাস' : 'Breathing Status'}
              </span>
              <strong className="text-[#171717] text-xs">{currentRequest.breathingStatus || 'Normal'}</strong>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#D5E8D7]">
              <span className="text-[10px] text-[#555555] block uppercase font-bold">
                {language === 'bn' ? 'শুরুর সময়' : 'Problem Onset'}
              </span>
              <strong className="text-[#171717] text-xs">{currentRequest.problemStartedAt || 'Recent'}</strong>
            </div>
          </div>
        </div>

        {/* SECTION: HOSPITAL CLINICAL ASSESSMENT & ADMISSION STATUS */}
        <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-[#171717] font-black text-base">
            <Building2 className="w-5 h-5 text-[#2E7D32]" />
            <span>
              {language === 'bn'
                ? 'হাসপাতালের ক্লিনিক্যাল মূল্যায়ন ও শয্যা নিশ্চিতকরণ'
                : 'Hospital Clinical Assessment & Admission Status'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Department */}
            <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] space-y-1">
              <span className="text-[10px] text-[#555555] block uppercase font-bold">
                {language === 'bn' ? 'নির্ধারিত বিভাগ' : 'Assigned Department'}
              </span>
              <p className="text-sm font-black text-[#171717]">
                {currentRequest.clinicalAssessment?.recommendedDepartment || (language === 'bn' ? 'মূল্যায়ন চলছে...' : 'Pending Evaluation')}
              </p>
              <span className="text-[10px] text-[#555555]">
                {currentRequest.clinicalAssessment?.assessedByStaffName ? `By ${currentRequest.clinicalAssessment.assessedByStaffName}` : 'Triage duty desk'}
              </span>
            </div>

            {/* ICU Assessment Requirement */}
            <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] space-y-1">
              <span className="text-[10px] text-[#555555] block uppercase font-bold">
                {language === 'bn' ? 'আইসিইউ মূল্যায়নের প্রয়োজন?' : 'ICU Care Assessment'}
              </span>
              <p className="text-sm font-black text-[#171717]">
                {currentRequest.clinicalAssessment?.icuAssessmentRequired
                  ? `${currentRequest.clinicalAssessment.icuAssessmentRequired}`
                  : (language === 'bn' ? 'অনির্ধারিত' : 'Undetermined')}
              </p>
              <span className="text-[10px] text-[#555555]">
                Clinical triage decision support
              </span>
            </div>

            {/* Verified Bed Confirmation Status */}
            <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] space-y-1">
              <span className="text-[10px] text-[#555555] block uppercase font-bold">
                {language === 'bn' ? 'শয্যা নিশ্চিতকরণের অবস্থা' : 'Bed Confirmation Status'}
              </span>
              {currentRequest.clinicalAssessment?.bedConfirmedStatus === 'CONFIRMED' || currentRequest.status === 'ADMISSION_CONFIRMED' ? (
                <div className="text-[#2E7D32] font-black text-sm flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                  <span>
                    {language === 'bn'
                      ? `নিশ্চিত (${currentRequest.allocatedBedType || 'ICU'})`
                      : `Confirmed (${currentRequest.allocatedBedType || 'ICU'})`}
                  </span>
                </div>
              ) : (
                <p className="text-xs font-bold text-amber-800">
                  {language === 'bn'
                    ? 'হাসপাতাল কর্তৃপক্ষ কর্তৃক শয্যা এখনও নিশ্চিত করা হয়নি।'
                    : 'Bed availability has not yet been verified by the hospital.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION: CLARIFICATION MESSAGES & PATIENT RESPONSE (Q&A THREAD) */}
        <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-5">
          <div className="flex items-center space-x-2 text-[#171717] font-black text-base">
            <MessageSquare className="w-5 h-5 text-[#2E7D32]" />
            <span>
              {language === 'bn'
                ? 'হাসপাতাল যোগাযোগ ও অতিরিক্ত তথ্য আদান-প্রদান'
                : 'Hospital Clarification Messages & Responses'}
            </span>
          </div>

          <p className="text-xs text-[#555555]">
            {language === 'bn'
              ? 'হাসপাতালের ট্রায়াজ কর্মী কোনো অতিরিক্ত তথ্যের প্রয়োজন বোধ করলে এখানে প্রশ্ন করতে পারেন। নিচে আপনার উত্তর প্রদান করুন:'
              : 'If clinical triage staff requests additional medical details, questions will appear here. Submit your response below:'}
          </p>

          {/* Conversation history */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {currentRequest.clarificationMessages && currentRequest.clarificationMessages.length > 0 ? (
              currentRequest.clarificationMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                    msg.sender === 'hospital'
                      ? 'bg-purple-50 border-purple-200 text-purple-950 ml-0 mr-6'
                      : 'bg-white border-[#D5E8D7] text-[#171717] ml-6 mr-0'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-[11px]">
                    <span className={msg.sender === 'hospital' ? 'text-purple-800' : 'text-[#2E7D32]'}>
                      {msg.sender === 'hospital' ? `🏥 Hospital Staff (${msg.senderName})` : `👤 Patient (${msg.senderName})`}
                    </span>
                    <span className="text-[#555555] font-normal">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="leading-relaxed font-medium">{msg.message}</p>
                </div>
              ))
            ) : (
              <div className="p-4 bg-white rounded-xl border border-[#D5E8D7] text-center text-xs text-[#555555]">
                {language === 'bn'
                  ? 'এখনও পর্যন্ত হাসপাতালের কোনো অতিরিক্ত প্রশ্ন নেই।'
                  : 'No clarification questions requested by the hospital at this time.'}
              </div>
            )}
          </div>

          {/* Interactive reply box */}
          <form onSubmit={handleSendClarification} className="space-y-2 pt-2">
            <label className="block text-[11px] font-bold text-[#171717]">
              {language === 'bn'
                ? 'হাসপাতালে উত্তর বা অতিরিক্ত তথ্য পাঠান:'
                : 'Send Clarification or Update to Hospital Staff:'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={clarificationReply}
                onChange={e => setClarificationReply(e.target.value)}
                placeholder={
                  language === 'bn'
                    ? 'আপনার উত্তর লিখুন (যেমন: শ্বাসকষ্ট বাড়ছে, নতুন কোনো লক্ষণ)...'
                    : 'Type your clarification (e.g. breathing worsening, recent medication taken)...'
                }
                className="flex-1 text-xs text-[#171717] bg-white border border-[#D5E8D7] rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-[#2E7D32]"
              />
              <button
                type="submit"
                disabled={!clarificationReply.trim() || isSendingReply}
                className="px-4 py-2.5 bg-[#2E7D32] hover:bg-[#256B2A] disabled:bg-gray-300 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'পাঠান' : 'Reply'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* SECTION: IF HOSPITAL UNABLE TO ACCOMMODATE -> SHOW ALTERNATIVE HOSPITALS */}
        {(currentRequest.status === 'UNABLE_TO_ACCOMMODATE' ||
          currentRequest.status === 'REJECTED' ||
          currentRequest.status === 'DECLINED' ||
          currentRequest.status === 'TIMED_OUT') && (
          <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center space-x-2 text-rose-900 font-black text-base">
              <AlertTriangle className="w-5 h-5 text-rose-700" />
              <span>
                {language === 'bn'
                  ? 'বিকল্প হাসপাতাল ও জরুরি পরবর্তী পদক্ষেপ'
                  : 'Alternative Facilities & Recommended Emergency Steps'}
              </span>
            </div>

            <p className="text-xs text-rose-900 leading-relaxed font-medium">
              {language === 'bn'
                ? `নির্বাচিত হাসপাতালটি এই মুহূর্তে অনুরোধ গ্রহণ করতে অপারগ: "${currentRequest.rejectionReason || 'শয্যার অপ্রতুলতা'}"। সময় নষ্ট না করে অবিলম্বে বিকল্প সুবিধায় যোগাযোগ করুন:`
                : `The selected hospital was unable to accommodate this request (${currentRequest.rejectionReason || 'Facility at full capacity'}). Please switch immediately to an alternative verified facility:`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {hospitals
                .filter(h => h.id !== currentRequest.selectedHospitalId)
                .slice(0, 3)
                .map(altHosp => (
                  <div
                    key={altHosp.id}
                    className="p-4 bg-white rounded-2xl border border-rose-200 shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-[#171717]">{altHosp.name}</h4>
                        <span className="text-xs font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-lg border border-[#D5E8D7]">
                          {altHosp.distanceKm} km
                        </span>
                      </div>
                      <p className="text-[11px] text-[#555555] mt-1">{altHosp.address}</p>
                      <p className="text-[11px] text-[#555555] mt-0.5">
                        {language === 'bn' ? 'আনুমানিক সময়:' : 'Estimated Travel:'} ~{altHosp.estimatedTravelMins} mins
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-[#D5E8D7]">
                      <a
                        href={`tel:${altHosp.phone}`}
                        className="flex-1 py-2 bg-[#2E7D32] text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1 shadow-xs"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'সরাসরি কল' : 'Call Hospital'}</span>
                      </a>
                      <button
                        onClick={() => navigateTo('emergency-sos', { hospitalId: altHosp.id })}
                        className="flex-1 py-2 bg-white hover:bg-[#F1F8F2] text-[#171717] border border-[#D5E8D7] rounded-xl font-bold text-xs"
                      >
                        {language === 'bn' ? 'নতুন এসওএস' : 'Switch SOS'}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* SECTION: NEXT STEPS & CLINICAL SAFETY GUIDANCE */}
        <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-4 text-xs">
          <h3 className="text-sm font-black text-[#171717] flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
            <span>{language === 'bn' ? 'জরুরি পরিস্থিতিতে রোগীর জন্য পরামর্শ' : 'Emergency Safety Next Steps'}</span>
          </h3>

          <ul className="space-y-2 text-[#555555] list-disc list-inside">
            <li>
              {language === 'bn'
                ? 'রোগীর কাছে পরিবারের প্রাপ্তবয়স্ক সদস্য বা প্রতিবেশী উপস্থিত থাকুন।'
                : 'Ensure a family guardian or caregiver remains by the patient\'s side.'}
            </li>
            <li>
              {language === 'bn'
                ? 'রোগীর ফোন সর্বদা সচল ও চার্জযুক্ত রাখুন যাতে হাসপাতালের ট্রায়াজ দল যোগাযোগ করতে পারে।'
                : 'Keep the patient phone reachable so hospital triage staff and ambulance dispatchers can contact you.'}
            </li>
            <li>
              {language === 'bn'
                ? 'যদি জরুরি অস্ত্রোপচারের প্রয়োজন হতে পারে, চিকিৎসকের পরামর্শ ছাড়া মুখে জল বা খাবার দেওয়া থেকে বিরত থাকুন।'
                : 'Do not administer heavy food or fluids orally without medical advice in case emergency surgery is needed.'}
            </li>
            <li>
              {language === 'bn'
                ? 'অবস্থার অবনতি হলে অপেক্ষা না করে সাথে সাথে ১১২ ডায়াল করুন।'
                : 'If symptoms rapidly deteriorate, do not hesitate to dial 112 directly.'}
            </li>
          </ul>
        </div>

        {/* CANCEL EMERGENCY REQUEST BUTTON */}
        {currentRequest.status !== 'COMPLETED' && currentRequest.status !== 'CANCELLED' && (
          <div className="text-center pt-2">
            <button
              onClick={() => {
                const confirmMsg =
                  language === 'bn'
                    ? 'আপনি কি নিশ্চিত যে জরুরি অনুরোধটি বাতিল করতে চান?'
                    : 'Are you sure you want to cancel this emergency request?';
                if (window.confirm(confirmMsg)) {
                  cancelEmergencyRequest(currentRequest.id);
                }
              }}
              className="text-xs font-bold text-[#555555] hover:text-rose-600 transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'জরুরি অনুরোধ বাতিল করতে চান? (Cancel Request)' : 'Cancel This Emergency Request'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
