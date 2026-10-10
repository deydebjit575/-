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
      <div className="min-h-screen bg-slate-50 p-8 text-center">
        <p className="text-slate-600">কোনো সক্রিয় জরুরি অনুরোধ পাওয়া যায়নি।</p>
        <button onClick={() => navigateTo('dashboard')} className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold">
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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Back Nav */}
        <button
          onClick={() => navigateTo('dashboard')}
          className="flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'bn' ? 'ড্যাশবোর্ডে ফিরে যান' : 'Back to Dashboard'}</span>
        </button>

        {/* Header Status Card */}
        <div className="bg-gradient-to-r from-rose-900 to-navy-950 text-white rounded-3xl p-6 sm:p-8 border border-rose-600/40 shadow-emergency space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase tracking-wider animate-pulse">
              ● Live Emergency Tracking
            </span>
            <span className="font-mono text-xs text-slate-300">ID: {currentRequest.id}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black">
            {currentRequest.selectedHospitalName}
          </h1>

          <p className="text-xs text-rose-200">
            {currentRequest.statusMessage || 'Emergency coordination is actively progressing.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <span className="bg-white/10 px-3 py-1.5 rounded-xl">
              বিকল্প যোগাযোগ: <strong>+91 33 2320 3040</strong>
            </span>
            <span className="bg-white/10 px-3 py-1.5 rounded-xl">
              বরাদ্দকৃত বেড: <strong>{currentRequest.allocatedBedType || 'ICU Cardiac Bed'}</strong>
            </span>
          </div>
        </div>

        {/* PROGRESS STEPPER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
          <h3 className="text-lg font-black text-navy-950">
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
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>

                  <div className="space-y-0.5">
                    <h4 className={`text-sm font-bold ${isCurrent ? 'text-rose-700' : isPast ? 'text-slate-900' : 'text-slate-400'}`}>
                      {language === 'bn' ? step.titleBn : step.titleEn}
                    </h4>
                    <p className="text-xs text-slate-500">
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Ambulance className="w-5 h-5 text-rose-600" />
                <h3 className="font-black text-navy-950 text-base">
                  {language === 'bn' ? 'অ্যাম্বুলেন্স ও ড্রাইভারের বিবরণ' : 'Assigned Critical Care Ambulance'}
                </h3>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full font-bold text-xs">
                ETA: ~{simulatedEta} মিনিট
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block">গাড়ির নম্বর:</span>
                <span className="font-black text-navy-950 text-sm mt-0.5 block">
                  {currentRequest.ambulanceDetails.vehicleNumber}
                </span>
                <span className="text-[10px] text-teal-700">ICU on Wheels (Oxygen Ready)</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block">চালকের নাম:</span>
                <span className="font-bold text-navy-950 text-sm mt-0.5 block">
                  {currentRequest.ambulanceDetails.driverName}
                </span>
                <span className="text-[10px] text-slate-500">Apollo Emergency Driver</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <span className="text-slate-500 block">সরাসরি ফোন:</span>
                <a
                  href={`tel:${currentRequest.ambulanceDetails.driverPhone}`}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center flex items-center justify-center space-x-1 mt-1 shadow-xs"
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
              className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors"
            >
              জরুরি অনুরোধ বাতিল করতে চান? (Cancel SOS)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
