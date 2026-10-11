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
          driverName: language === 'bn' ? 'বিকাশ মণ্ডল' : 'Bikash Mondal',
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
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#2E7D32] font-bold text-xs uppercase tracking-wider">
              <Ambulance className="w-4 h-4" />
              <span>Critical Care Fleet & Paramedic Command</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#171717]">
              {language === 'bn' ? 'অ্যাম্বুলেন্স সমন্বয় ও ট্র্যাকিং' : 'Ambulance Coordination Center'}
            </h1>
            <p className="text-xs text-[#555555] max-w-2xl">
              {language === 'bn'
                ? 'অনুমোদিত অপারেটরের মাধ্যমে অ্যাম্বুলেন্স প্রেরণ, লাইভ অবস্থান মনিটরিং ও জিপিএস ইটিএ (ETA) নিয়ন্ত্রণ।'
                : 'Manage ambulance requests, operator dispatch acknowledgements, and live paramedic telemetry.'}
            </p>
          </div>

          <div className="px-4 py-2 bg-white border border-[#D5E8D7] text-[#2E7D32] rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] animate-ping"></span>
            <span>Simulation Mode Active</span>
          </div>
        </div>

        {/* Fleet Card & Active Dispatch Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Active Vehicle Live Box */}
          <div className="lg:col-span-6 bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#D5E8D7]">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#555555] font-bold">
                  {language === 'bn' ? 'সক্রিয় মিশন ভেইকল:' : 'Active Mission Vehicle:'}
                </span>
                <h3 className="text-xl font-black text-[#171717] mt-0.5">{vehicleNo}</h3>
              </div>
              <span className="px-3 py-1 bg-white border border-[#D5E8D7] text-[#2E7D32] text-xs font-bold rounded-full shadow-2xs">
                {fleetStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-[#D5E8D7] shadow-2xs">
                <span className="text-[#555555] block">{language === 'bn' ? 'চালক:' : 'Driver:'}</span>
                <span className="font-bold text-[#171717] text-sm block mt-0.5">
                  {language === 'bn' ? 'বিকাশ মণ্ডল' : 'Bikash Mondal'}
                </span>
                <span className="text-[11px] text-[#2E7D32] font-semibold">Apollo ALS Certified</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#D5E8D7] shadow-2xs">
                <span className="text-[#555555] block">{language === 'bn' ? 'আনুমানিক সময় (ETA):' : 'Estimated Time (ETA):'}</span>
                <span className="font-black text-[#2E7D32] text-lg block mt-0.5">
                  ~{etaMinutes} {language === 'bn' ? 'মিনিট' : 'mins'}
                </span>
              </div>
            </div>

            {/* GPS Coordinates telemetry */}
            <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] space-y-2 text-xs shadow-2xs">
              <div className="flex justify-between items-center text-[#555555]">
                <span className="flex items-center font-medium">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-rose-600" />
                  {language === 'bn' ? 'গন্তব্য: Block CF-142, Salt Lake' : 'Destination: Block CF-142, Salt Lake'}
                </span>
                <span className="font-mono text-[10px] text-[#2E7D32]">22.5868° N, 88.4125° E</span>
              </div>
              <div className="w-full bg-[#E8F5E9] rounded-full h-2 overflow-hidden border border-[#D5E8D7]">
                <div className="bg-[#2E7D32] h-2 rounded-full w-2/3 animate-pulse"></div>
              </div>
            </div>

            {/* Call button */}
            <a
              href={`tel:${driverPhone}`}
              className="w-full py-3 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-colors cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{language === 'bn' ? `চালকের সাথে সরাসরি কথা বলুন (${driverPhone})` : `Call Driver Directly (${driverPhone})`}</span>
            </a>
          </div>

          {/* Right: Operator Workflow Status Changer */}
          <div className="lg:col-span-6 bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs space-y-6">
            <h3 className="text-lg font-black text-[#171717] flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-[#2E7D32]" />
              <span>{language === 'bn' ? 'অপারেটর স্থিতি রূপান্তর' : 'Operator Workflow Transitions'}</span>
            </h3>

            <p className="text-xs text-[#555555] leading-relaxed">
              {language === 'bn'
                ? 'প্রকৃত অ্যাম্বুলেন্স অপারেটর যখন পিকআপ গ্রহণ বা রোগী নিয়ে রওনা করবেন, তখন নিচের বোতামের মাধ্যমে স্ট্যাটাস আপডেট করুন।'
                : 'Update mission progress as driver accepts, dispatches, reaches patient, or transfers to triage.'}
            </p>

            <div className="space-y-3">
              {[
                {
                  status: 'REQUESTED',
                  label: language === 'bn' ? '১. অনুরোধ গৃহীত (REQUESTED)' : '1. Request Received (REQUESTED)',
                  desc: language === 'bn' ? 'অপারেটর ডিসপ্যাচ লাইনে অনুরোধ জমা হয়েছে' : 'SOS logged into regional dispatch queue'
                },
                {
                  status: 'ACKNOWLEDGED',
                  label: language === 'bn' ? '২. চালক নিয়োগ নিশ্চিত (ACKNOWLEDGED)' : '2. Driver Assigned (ACKNOWLEDGED)',
                  desc: language === 'bn' ? 'নিকটবর্তী অ্যাম্বুলেন্স ড্রাইভার এক্সেপ্ট করেছে' : 'Nearest available crew accepted mission'
                },
                {
                  status: 'DISPATCHED',
                  label: language === 'bn' ? '৩. রোগী অভিমুখে রওনা (DISPATCHED)' : '3. En Route to Patient (DISPATCHED)',
                  desc: language === 'bn' ? 'অক্সিজেন ও লাইফ সাপোর্ট প্রস্তুত' : 'Oxygen and life support ready on wheels'
                },
                {
                  status: 'PICKUP_IN_PROGRESS',
                  label: language === 'bn' ? '৪. রোগী বহন ও প্রাথমিক চিকিৎসা (IN TRANSIT)' : '4. Patient In Transit (IN TRANSIT)',
                  desc: language === 'bn' ? 'রোগী নিয়ে হাসপাতালে আগমন পথে' : 'En route to hospital triage with telemetry'
                },
                {
                  status: 'COMPLETED',
                  label: language === 'bn' ? '৫. হাসপাতালে পৌঁছানো সম্পন্ন (COMPLETED)' : '5. Patient Transferred (COMPLETED)',
                  desc: language === 'bn' ? 'জরুরি ট্রায়াজ বেডে হস্তান্তর' : 'Patient admitted into emergency cardiac triage'
                },
              ].map(item => (
                <button
                  key={item.status}
                  onClick={() => handleUpdateStatus(item.status as AmbulanceStatus)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs flex items-center justify-between cursor-pointer ${
                    fleetStatus === item.status
                      ? 'bg-white border-[#2E7D32] shadow-xs ring-2 ring-[#2E7D32]/20 font-bold text-[#171717]'
                      : 'bg-white/80 border-[#D5E8D7] hover:bg-white text-[#171717]'
                  }`}
                >
                  <div>
                    <span className="font-bold block text-sm text-[#171717]">{item.label}</span>
                    <span className="text-[11px] text-[#555555]">{item.desc}</span>
                  </div>
                  {fleetStatus === item.status && (
                    <CheckCircle2 className="w-5 h-5 text-[#2E7D32] shrink-0 ml-2" />
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
