import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  AlertOctagon,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Heart,
  Pill,
  Users,
  Building,
  ArrowRight,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';

export const EmergencySOS: React.FC = () => {
  const { language, t, speak } = useLanguage();
  const {
    patientProfile,
    hospitals,
    triggerEmergencySos,
    navigateTo,
    activeEmergencyRequest,
    selectedNearbyHospital,
    pageParams
  } = useApp();

  const [selectedHospitalId, setSelectedHospitalId] = useState(
    pageParams?.hospitalId || selectedNearbyHospital?.id || hospitals[0]?.id || 'pan-01'
  );
  const [symptomsInput, setSymptomsInput] = useState('');
  const [ambulanceRequested, setAmbulanceRequested] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isConsentAgreed, setIsConsentAgreed] = useState(true);

  // Sync selected hospital from query params or nearby selection
  useEffect(() => {
    if (pageParams?.hospitalId) {
      setSelectedHospitalId(pageParams.hospitalId);
    } else if (selectedNearbyHospital?.id) {
      setSelectedHospitalId(selectedNearbyHospital.id);
    }
  }, [pageParams?.hospitalId, selectedNearbyHospital]);

  // Countdown timer trigger
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      // Execute SOS
      triggerEmergencySos(selectedHospitalId, isConsentAgreed, [], symptomsInput, ambulanceRequested);
    }
    return () => clearTimeout(timer);
  }, [countdown, selectedHospitalId, isConsentAgreed, symptomsInput, ambulanceRequested]);

  const handleStartCountdown = () => {
    if (language === 'bn') {
      speak('জরুরি সাহায্য সক্রিয় করা হচ্ছে। নিকটস্থ হাসপাতালে বার্তা পাঠানো হচ্ছে।');
    } else {
      speak('Emergency assistance initiating in three seconds.');
    }
    setCountdown(3);
  };

  const handleCancelCountdown = () => {
    setCountdown(null);
  };

  const selectedHospital = hospitals.find(h => h.id === selectedHospitalId) || hospitals[0];

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ACTIVE EMERGENCY BANNER */}
        {activeEmergencyRequest && (
          <div className="bg-rose-700 text-white p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
              <div>
                <p className="font-bold text-sm">আপনার একটি জরুরি অনুরোধ বর্তমানে সক্রিয় রয়েছে</p>
                <p className="text-xs text-rose-100">{activeEmergencyRequest.selectedHospitalName}</p>
              </div>
            </div>
            <button
              onClick={() => navigateTo('emergency-tracking', { id: activeEmergencyRequest.id })}
              className="px-4 py-2 bg-white text-rose-700 rounded-xl font-bold text-xs shadow-xs"
            >
              লাইভ ট্র্যাকিং দেখুন →
            </button>
          </div>
        )}

        {/* PROMINENT EMERGENCY HEADER & 112 DIRECT DIAL */}
        <div className="bg-[#E8F5E9] text-[#171717] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider inline-block">
                🚨 Rapid Emergency Response System
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-[#171717]">
                {language === 'bn' ? 'জরুরি চিকিৎসা এসওএস (SOS)' : 'Emergency Hospital SOS'}
              </h1>
              <p className="text-xs text-[#555555]">
                {language === 'bn'
                  ? 'এক স্পর্শে নিকটস্থ হাসপাতালের জরুরি টিম ও পরিবারের কাছে লাইভ অবস্থান ও মেডিকেল সারসংক্ষেপ প্রেরণ।'
                  : 'Instantly notify partner hospitals and family guardians with live GPS location & vital medical profile.'}
              </p>
            </div>

            {/* Direct 112 hotline call */}
            <a
              href="tel:112"
              className="px-6 py-3.5 bg-rose-700 hover:bg-rose-800 text-white font-black text-sm rounded-2xl shadow-sm transition-all flex items-center space-x-2 shrink-0 animate-bounce"
            >
              <PhoneCall className="w-5 h-5" />
              <span>{language === 'bn' ? 'সরাসরি ১১২ ডায়াল করুন' : 'Call 112 Directly'}</span>
            </a>
          </div>

          {/* MAIN BIG SOS TRIGGER BUTTON */}
          <div className="text-center py-6">
            {countdown !== null ? (
              <div className="space-y-4 animate-in zoom-in-95">
                <div className="w-32 h-32 rounded-full bg-rose-700 text-white flex items-center justify-center font-black text-5xl mx-auto shadow-lg animate-ping">
                  {countdown}
                </div>
                <p className="text-lg font-bold text-rose-700">
                  {language === 'bn' ? 'এসওএস পাঠানো হচ্ছে... বাতিল করতে নিচে চাপুন' : 'Dispatching SOS... Press Cancel to abort'}
                </p>
                <button
                  onClick={handleCancelCountdown}
                  className="px-8 py-3 bg-white text-[#171717] border border-[#D5E8D7] font-black text-sm rounded-xl shadow-xs hover:bg-[#F1F8F2]"
                >
                  {t('cancel')}
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartCountdown}
                className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-rose-700 hover:bg-rose-800 text-white font-black text-2xl sm:text-3xl shadow-lg transform hover:scale-105 transition-all flex flex-col items-center justify-center mx-auto space-y-2 border-4 border-white/60 animate-sos-pulse cursor-pointer"
              >
                <AlertOctagon className="w-12 h-12 text-white" />
                <span className="tracking-wider uppercase font-black">
                  {language === 'bn' ? 'জরুরি SOS' : 'TRIGGER SOS'}
                </span>
                <span className="text-[11px] font-normal text-rose-100">
                  {language === 'bn' ? '৩ সেকেন্ড কাউন্টডাউন' : '3s Countdown'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* SELECT TARGET PARTNER HOSPITAL */}
        <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-[#171717] font-black text-base">
            <Building className="w-5 h-5 text-[#2E7D32]" />
            <span>{language === 'bn' ? 'গন্তব্য হাসপাতাল নির্বাচন করুন' : 'Select Destination Hospital'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hospitals.map(hosp => (
              <div
                key={hosp.id}
                onClick={() => setSelectedHospitalId(hosp.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedHospitalId === hosp.id
                    ? 'bg-white border-[#2E7D32] shadow-sm ring-2 ring-[#2E7D32]/30'
                    : 'bg-white border-[#D5E8D7] hover:border-[#2E7D32]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-[#171717] text-sm">{hosp.name}</h4>
                  <span className="text-xs font-bold text-[#2E7D32]">{hosp.distanceKm} km</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#555555] mt-2">
                  <span>
                    {language === 'bn' ? 'উপলব্ধ আইসিইউ:' : 'Available ICU:'} <strong className="text-[#2E7D32]">{hosp.icuBedsAvailable} {language === 'bn' ? 'বেড' : 'Beds'}</strong>
                  </span>
                  <span>~{hosp.estimatedTravelMins} {language === 'bn' ? 'মিনিট সময়' : 'mins ETA'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DATA DISCLOSURE & CONSENT BREAKDOWN */}
        <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-[#171717] font-black text-base">
            <ShieldCheck className="w-5 h-5 text-[#2E7D32]" />
            <span>{language === 'bn' ? 'জরুরি মুহূর্তে প্রেরিতব্য তথ্যের বিবরণ ও সম্মতি' : 'Emergency Data Disclosure & Consent'}</span>
          </div>

          <p className="text-xs text-[#555555]">
            {language === 'bn'
              ? 'জরুরি এসওএস সক্রিয় করার সময় নির্বাচিত হাসপাতালের জরুরি ট্রায়াজ টিমকে চিকিৎসা সহায়তার স্বার্থে নিম্নলিখিত তথ্যাদি সাময়িক সময়ের জন্য দেওয়া হবে:'
              : 'During this emergency trigger, the following vital records will be securely transmitted to the hospital triage desk:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-[#D5E8D7] flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[#2E7D32]" />
              <span className="text-[#171717]"><strong>{language === 'bn' ? 'লাইভ অবস্থান:' : 'Live Location:'}</strong> {patientProfile.address}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#D5E8D7] flex items-center space-x-2">
              <Heart className="w-4 h-4 text-[#2E7D32]" />
              <span className="text-[#171717]"><strong>{language === 'bn' ? 'রক্তের গ্রুপ ও বয়স:' : 'Blood Group & Age:'}</strong> {patientProfile.bloodGroup} • {patientProfile.age} {language === 'bn' ? 'বছর' : 'Years'}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#D5E8D7] flex items-center space-x-2">
              <Pill className="w-4 h-4 text-[#2E7D32]" />
              <span className="text-[#171717]"><strong>{language === 'bn' ? 'অ্যালার্জি ও ওষুধ:' : 'Allergies & Meds:'}</strong> {patientProfile.knownAllergies.join(', ')}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#D5E8D7] flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#2E7D32]" />
              <span className="text-[#171717]"><strong>{language === 'bn' ? 'এসএমএস অ্যালার্ট:' : 'SMS Alert:'}</strong> {patientProfile.emergencyContacts.length} {language === 'bn' ? 'জন অভিভাবক' : 'Guardians'}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#D5E8D7] flex items-center space-x-3">
            <input
              type="checkbox"
              id="emergency-consent"
              checked={isConsentAgreed}
              onChange={e => setIsConsentAgreed(e.target.checked)}
              className="w-4 h-4 text-[#2E7D32] rounded focus:ring-[#2E7D32]"
            />
            <label htmlFor="emergency-consent" className="text-xs font-bold text-[#171717] cursor-pointer">
              {language === 'bn' ? 'আমি জরুরি চিকিৎসা সমন্বয়ের জন্য উল্লেখিত তথ্য শেয়ারের সম্মতি প্রদান করছি' : 'I grant emergency consent for hospital triage coordination'}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
