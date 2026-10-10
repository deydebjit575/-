import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  Ambulance,
  PhoneCall,
  MapPin,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Send,
  Navigation,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { AmbulanceStatus } from '../types';

export const AmbulanceCoordination: React.FC = () => {
  const { language, t } = useLanguage();
  const { emergencyRequests, updateEmergencyStatus, showToast } = useApp();

  const [fleetStatus, setFleetStatus] = useState<AmbulanceStatus>('DISPATCHED');
  const [etaMinutes, setEtaMinutes] = useState(6);
  const [driverPhone, setDriverPhone] = useState('+91 98744 33221');
  const [vehicleNo, setVehicleNo] = useState('WB 02 AL 4519');

  const handleUpdateStatus = (newStatus: AmbulanceStatus) => {
    setFleetStatus(newStatus);
    const targetReq = emergencyRequests[0];
    if (targetReq) {
      let emgStatus = targetReq.status;
      if (newStatus === 'DISPATCHED') emgStatus = 'AMBULANCE_DISPATCHED';
      else if (newStatus === 'PICKUP_IN_PROGRESS') emgStatus = 'PICKUP_IN_PROGRESS';
      else if (newStatus === 'COMPLETED') emgStatus = 'COMPLETED';

      updateEmergencyStatus(
        targetReq.id,
        emgStatus,
        `Ambulance operator updated status to: ${newStatus}`,
        undefined,
        {
          id: 'AMB-WB-01',
          operatorName: 'Apollo 24x7 Ambulance Dispatch',
          driverName: 'বিকাশ মণ্ডল (Bikash Mondal)',
          driverPhone,
          vehicleNumber: vehicleNo,
          status: newStatus,
          etaMinutes: newStatus === 'PICKUP_IN_PROGRESS' ? 0 : etaMinutes
        }
      );
    }
    showToast('info', 'Ambulance Status Updated', newStatus);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-amber-700 font-bold text-xs">
              <Ambulance className="w-4 h-4" />
              <span>Critical Care Fleet & Paramedic Command</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-950">
              {language === 'bn' ? 'অ্যাম্বুলেন্স সমন্বয় ও ট্র্যাকিং' : 'Ambulance Coordination Center'}
            </h1>
            <p className="text-xs text-slate-600 max-w-2xl">
              {language === 'bn'
                ? 'অনুমোদিত অপারেটরের মাধ্যমে অ্যাম্বুলেন্স প্রেরণ, লাইভ অবস্থান মনিটরিং ও জিপিএস ইটিএ (ETA) নিয়ন্ত্রণ।'
                : 'Manage ambulance requests, operator dispatch acknowledgements, and live paramedic telemetry.'}
            </p>
          </div>

          <div className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs font-bold flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            <span>Simulation Mode Active</span>
          </div>
        </div>

        {/* Fleet Card & Active Dispatch Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Active Vehicle Live Box */}
          <div className="lg:col-span-6 bg-navy-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-elevated space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                  সক্রিয় মিশন ভেইকল:
                </span>
                <h3 className="text-xl font-black mt-0.5">{vehicleNo}</h3>
              </div>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold rounded-full">
                {fleetStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block">চালক:</span>
                <span className="font-bold text-white text-sm block mt-0.5">বিকাশ মণ্ডল</span>
                <span className="text-[11px] text-teal-400">Apollo ALS Certified</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block">আনুমানিক সময় (ETA):</span>
                <span className="font-black text-amber-300 text-lg block mt-0.5">~{etaMinutes} মিনিট</span>
              </div>
            </div>

            {/* GPS Coordinates telemetry */}
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-rose-400" />
                  গন্তব্য: Block CF-142, Salt Lake
                </span>
                <span className="font-mono text-[10px] text-teal-300">22.5868° N, 88.4125° E</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full w-2/3 animate-pulse"></div>
              </div>
            </div>

            {/* Call button */}
            <a
              href={`tel:${driverPhone}`}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>চালকের সাথে সরাসরি কথা বলুন ({driverPhone})</span>
            </a>
          </div>

          {/* Right: Operator Workflow Status Changer */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
            <h3 className="text-lg font-black text-navy-950 flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-teal-700" />
              <span>{language === 'bn' ? 'অপারেটর স্থিতি রূপান্তর' : 'Operator Workflow Transitions'}</span>
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              প্রকৃত অ্যাম্বুলেন্স অপারেটর যখন পিকআপ গ্রহণ বা রোগী নিয়ে রওনা করবেন, তখন নিচের বোতামের মাধ্যমে স্ট্যাটাস আপডেট করুন।
            </p>

            <div className="space-y-3">
              {[
                { status: 'REQUESTED', labelBn: '১. অনুরোধ গৃহীত (REQUESTED)', desc: 'অপারেটর ডিসপ্যাচ লাইনে অনুরোধ জমা হয়েছে' },
                { status: 'ACKNOWLEDGED', labelBn: '২. চালক নিয়োগ নিশ্চিত (ACKNOWLEDGED)', desc: 'নিকটবর্তী অ্যাম্বুলেন্স ড্রাইভার এক্সেপ্ট করেছে' },
                { status: 'DISPATCHED', labelBn: '৩. রোগী অভিমুখে রওনা (DISPATCHED)', desc: 'অক্সিজেন ও লাইফ সাপোর্ট প্রস্তুত' },
                { status: 'PICKUP_IN_PROGRESS', labelBn: '৪. রোগী বহন ও প্রাথমিক চিকিৎসা (IN TRANSIT)', desc: 'রোগী নিয়ে হাসপাতালে আগমন পথে' },
                { status: 'COMPLETED', labelBn: '৫. হাসপাতালে পৌঁছানো সম্পন্ন (COMPLETED)', desc: 'জরুরি ট্রায়াজ বেডে হস্তান্তর' },
              ].map(item => (
                <button
                  key={item.status}
                  onClick={() => handleUpdateStatus(item.status as AmbulanceStatus)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs flex items-center justify-between ${
                    fleetStatus === item.status
                      ? 'bg-amber-50 border-amber-500 shadow-sm ring-2 ring-amber-500/20 font-bold text-amber-950'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div>
                    <span className="font-bold block text-sm">{item.labelBn}</span>
                    <span className="text-[11px] text-slate-500">{item.desc}</span>
                  </div>
                  {fleetStatus === item.status && (
                    <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
