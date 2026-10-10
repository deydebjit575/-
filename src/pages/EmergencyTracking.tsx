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
  MapPin
} from 'lucide-react';
import { EmergencyRequestStatus } from '../types';

export const EmergencyTracking: React.FC = () => {
  const { language, t } = useLanguage();
  const {
    emergencyRequests,
    activeEmergencyRequest,
    pageParams,
    cancelEmergencyRequest,
    navigateTo,
    showToast
  } = useApp();

  const requestId = pageParams?.id;
  const currentRequest =
    emergencyRequests.find(r => r.id === requestId) ||
    activeEmergencyRequest ||
    emergencyRequests[0];

  const [simulatedEta, setSimulatedEta] = useState(
    currentRequest?.ambulanceDetails?.etaMinutes || 6
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
        <p className="text-[#555555] text-sm">কোনো সক্রিয় জরুরি অনুরোধ পাওয়া যায়নি।</p>
        <button
          onClick={() => navigateTo('dashboard')}
          className="px-5 py-2.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
        >
          ড্যাশবোর্ডে ফিরে যান
        </button>
      </div>
    );
  }

  const steps: { status: EmergencyRequestStatus; titleBn: string; titleEn: string; descBn: string; descEn: string }[] = [
    {
      status: 'PENDING',
      titleBn: 'এসওএস গৃহীত ও ট্রায়াজ মূল্যায়ন',
      titleEn: 'SOS Created & Triage Evaluation',
      descBn: 'হাসপাতালের জরুরি বিভাগে অনুরোধ পৌঁছেছে।',
      descEn: 'Hospital emergency desk received the alert.'
    },
    {
      status: 'BED_CONFIRMED',
      titleBn: 'আইসিইউ / ওয়ার্ড বেড নিশ্চিত ও সংরক্ষিত',
      titleEn: 'Bed Allocated & Confirmed',
      descBn: 'হাসপাতাল কর্তৃপক্ষ প্রয়োজনীয় বেড প্রস্তুত রেখেছে।',
      descEn: 'Duty doctor confirmed suitable bed availability.'
    },
    {
      status: 'AMBULANCE_DISPATCHED',
      titleBn: 'অ্যাম্বুলেন্স রওনা দিয়েছে',
      titleEn: 'Ambulance Dispatched',
      descBn: 'জরুরি অক্সিজেন সুবিধাযুক্ত অ্যাম্বুলেন্স রওনা হয়েছে।',
      descEn: 'Critical care ambulance en route to your GPS location.'
    },
    {
      status: 'PICKUP_IN_PROGRESS',
      titleBn: 'রোগী পিকআপ ও প্রাথমিক পরিচর্যা',
      titleEn: 'Pickup & En Route to Hospital',
      descBn: 'প্যারামেডিক দল রোগীকে হাসপাতালে নিয়ে যাচ্ছে।',
      descEn: 'Paramedics on board, heading to emergency bay.'
    },
    {
      status: 'COMPLETED',
      titleBn: 'হাসপাতালে নিরাপদে ভর্তি সম্পন্ন',
      titleEn: 'Hospital Admission Completed',
      descBn: 'জরুরি চিকিৎসক দলের তত্ত্বাবধানে চিকিৎসা চলছে।',
      descEn: 'Patient admitted under emergency care.'
    }
  ];

  const getStepIndex = (status: EmergencyRequestStatus) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'ACCEPTED': return 1;
      case 'BED_CONFIRMED': return 1;
      case 'AMBULANCE_REQUESTED': return 1;
      case 'AMBULANCE_DISPATCHED': return 2;
      case 'PICKUP_IN_PROGRESS': return 3;
      case 'COMPLETED': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(currentRequest.status);

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Back Nav */}
        <button
          onClick={() => navigateTo('dashboard')}
          className="flex items-center space-x-2 text-xs font-bold text-[#2E7D32] hover:text-[#256B2A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'bn' ? 'ড্যাশবোর্ডে ফিরে যান' : 'Back to Dashboard'}</span>
        </button>

        {/* Header Status Card */}
        <div className="bg-[#E8F5E9] text-[#171717] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider animate-pulse">
              ● Live Emergency Tracking
            </span>
            <span className="font-mono text-xs text-[#555555]">ID: {currentRequest.id}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#171717]">
            {currentRequest.selectedHospitalName}
          </h1>

          <p className="text-xs text-[#555555]">
            {currentRequest.statusMessage || 'Emergency coordination is actively progressing.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <span className="bg-white text-[#171717] px-3 py-1.5 rounded-xl border border-[#D5E8D7]">
              বিকল্প যোগাযোগ: <strong>+91 33 2320 3040</strong>
            </span>
            <span className="bg-white text-[#171717] px-3 py-1.5 rounded-xl border border-[#D5E8D7]">
              বরাদ্দকৃত বেড: <strong>{currentRequest.allocatedBedType || 'ICU Cardiac Bed'}</strong>
            </span>
          </div>
        </div>

        {/* PROGRESS STEPPER */}
        <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-6">
          <h3 className="text-lg font-black text-[#171717]">
            {language === 'bn' ? 'জরুরি সাড়াদানের অগ্রগতি' : 'Emergency Response Timeline'}
          </h3>

          <div className="space-y-6">
            {steps.map((step, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div key={idx} className="flex items-start space-x-4">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                      isPast
                        ? 'bg-[#2E7D32] text-white'
                        : isCurrent
                        ? 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
                        : 'bg-white text-[#555555] border border-[#D5E8D7]'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>

                  <div className="space-y-0.5">
                    <h4 className={`text-sm font-bold ${isCurrent ? 'text-rose-700' : isPast ? 'text-[#171717]' : 'text-[#555555]'}`}>
                      {language === 'bn' ? step.titleBn : step.titleEn}
                    </h4>
                    <p className="text-xs text-[#555555]">
                      {language === 'bn' ? step.descBn : step.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AMBULANCE & DRIVER DETAILS */}
        {currentRequest.ambulanceDetails && (
          <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D5E8D7]">
              <div className="flex items-center space-x-2">
                <Ambulance className="w-5 h-5 text-[#2E7D32]" />
                <h3 className="font-black text-[#171717] text-base">
                  {language === 'bn' ? 'অ্যাম্বুলেন্স ও ড্রাইভারের বিবরণ' : 'Assigned Critical Care Ambulance'}
                </h3>
              </div>
              <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full font-bold text-xs">
                ETA: ~{simulatedEta} মিনিট
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-[#D5E8D7]">
                <span className="text-[#555555] block">গাড়ির নম্বর:</span>
                <span className="font-black text-[#171717] text-sm mt-0.5 block">
                  {currentRequest.ambulanceDetails.vehicleNumber}
                </span>
                <span className="text-[10px] text-[#2E7D32] font-semibold">ICU on Wheels (Oxygen Ready)</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#D5E8D7]">
                <span className="text-[#555555] block">চালকের নাম:</span>
                <span className="font-bold text-[#171717] text-sm mt-0.5 block">
                  {currentRequest.ambulanceDetails.driverName}
                </span>
                <span className="text-[10px] text-[#555555]">Apollo Emergency Driver</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#D5E8D7] flex flex-col justify-between">
                <span className="text-[#555555] block">সরাসরি ফোন:</span>
                <a
                  href={`tel:${currentRequest.ambulanceDetails.driverPhone}`}
                  className="px-3 py-2 bg-[#2E7D32] hover:bg-[#256B2A] text-white font-bold rounded-xl text-center flex items-center justify-center space-x-1 mt-1 shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{currentRequest.ambulanceDetails.driverPhone}</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Cancel SOS Button */}
        {currentRequest.status !== 'COMPLETED' && currentRequest.status !== 'CANCELLED' && (
          <div className="text-center pt-4">
            <button
              onClick={() => {
                if (window.confirm('আপনি কি নিশ্চিত যে জরুরি অনুরোধটি বাতিল করতে চান?')) {
                  cancelEmergencyRequest(currentRequest.id);
                }
              }}
              className="text-xs font-bold text-[#555555] hover:text-rose-600 transition-colors"
            >
              জরুরি অনুরোধ বাতিল করতে চান? (Cancel SOS)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
