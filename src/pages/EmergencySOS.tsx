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
  Sparkles,
  FileText,
  AlertTriangle,
  Locate,
  Check,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MedicalDocument } from '../types';

export const EmergencySOS: React.FC = () => {
  const { language, t, speak } = useLanguage();
  const {
    currentUser,
    patientProfile,
    medicalDocuments,
    hospitals,
    submitEmergencySosRequest,
    navigateTo,
    activeEmergencyRequest,
    selectedNearbyHospital,
    pageParams,
    showToast
  } = useApp();

  // 1. Target Hospital Selection
  const [selectedHospitalId, setSelectedHospitalId] = useState(
    pageParams?.hospitalId || selectedNearbyHospital?.id || hospitals[0]?.id || 'pan-01'
  );

  // 2. Patient Information State
  const [patientName, setPatientName] = useState(
    patientProfile.fullName || currentUser?.displayName || 'Patient'
  );
  const [patientPhone, setPatientPhone] = useState(
    patientProfile.phone || currentUser?.phone || ''
  );
  const [patientAge, setPatientAge] = useState<number>(
    patientProfile.age || currentUser?.age || 65
  );
  const [locationMode, setLocationMode] = useState<'GPS' | 'MANUAL'>('GPS');
  const [manualAddress, setManualAddress] = useState(
    patientProfile.address || patientProfile.location || 'Panihati, North 24 Parganas, West Bengal'
  );
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // 3. Current Medical Problem Description (REQUIRED)
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // 4. Structured Condition Fields (OPTIONAL)
  const [mainSymptom, setMainSymptom] = useState('');
  const [problemStartedAt, setProblemStartedAt] = useState('Just now (<15 mins)');
  const [reportedSeverity, setReportedSeverity] = useState<'Mild' | 'Moderate' | 'Severe' | 'Unsure'>('Severe');
  const [consciousnessStatus, setConsciousnessStatus] = useState<'Alert' | 'Confused' | 'Unresponsive' | 'Unsure'>('Alert');
  const [breathingStatus, setBreathingStatus] = useState<'Normal' | 'Difficulty Breathing' | 'Not Breathing Normally' | 'Unsure'>('Normal');
  const [existingConditionsInput, setExistingConditionsInput] = useState(
    patientProfile.existingConditions?.join(', ') || ''
  );
  const [knownAllergiesInput, setKnownAllergiesInput] = useState(
    patientProfile.knownAllergies?.join(', ') || ''
  );
  const [currentMedicationsInput, setCurrentMedicationsInput] = useState(
    patientProfile.currentMedications?.map(m => `${m.name}${m.dosage ? ` (${m.dosage})` : ''}`).join(', ') || ''
  );
  const [relevantMedicalHistory, setRelevantMedicalHistory] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState(
    patientProfile.emergencyContacts?.[0]?.name || ''
  );
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(
    patientProfile.emergencyContacts?.[0]?.phone || ''
  );
  const [ambulanceRequested, setAmbulanceRequested] = useState(true);

  // 5. MediVault Document Selection
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [showOptionalDetails, setShowOptionalDetails] = useState(true);

  // 6. Consent & Submission Guards
  const [isConsentAgreed, setIsConsentAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync selected hospital from query params
  useEffect(() => {
    if (pageParams?.hospitalId) {
      setSelectedHospitalId(pageParams.hospitalId);
    } else if (selectedNearbyHospital?.id) {
      setSelectedHospitalId(selectedNearbyHospital.id);
    }
  }, [pageParams?.hospitalId, selectedNearbyHospital]);

  // Pre-select recent prescriptions and discharge summaries by default
  useEffect(() => {
    if (medicalDocuments && medicalDocuments.length > 0) {
      const defaultDocs = medicalDocuments
        .filter(d => ['prescriptions', 'discharge_summaries', 'blood_reports'].includes(d.category))
        .slice(0, 2)
        .map(d => d.id);
      setSelectedDocIds(defaultDocs);
    }
  }, [medicalDocuments]);

  // GPS Location Detection Handler
  const handleDetectGps = () => {
    setIsDetectingGps(true);
    setGpsError(null);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setGpsCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsDetectingGps(false);
          showToast('success', language === 'bn' ? 'জিপিএস অবস্থান শনাক্ত হয়েছে' : 'GPS Location Detected');
        },
        error => {
          setIsDetectingGps(false);
          setGpsError(
            language === 'bn'
              ? 'জিপিএস অবস্থান পাওয়া যায়নি। অনুগ্রহ করে ঠিকানাটি লিখে দিন।'
              : 'GPS unavailable. Please verify manual address.'
          );
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      setIsDetectingGps(false);
      setGpsError(language === 'bn' ? 'ব্রাউজারে জিপিএস সমর্থিত নয়।' : 'GPS not supported by this browser.');
    }
  };

  const handleToggleDoc = (docId: string) => {
    setSelectedDocIds(prev =>
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  // Submit Emergency Request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!chiefComplaint.trim()) {
      setValidationError(
        language === 'bn'
          ? 'বর্তমান শারীরিক সমস্যা বা লক্ষণটির বিবরণ দেওয়া আবশ্যক।'
          : 'Please describe the current medical problem before submitting.'
      );
      window.scrollTo({ top: 350, behavior: 'smooth' });
      return;
    }

    if (!isConsentAgreed) {
      showToast(
        'error',
        language === 'bn' ? 'সম্মতি প্রদান আবশ্যক' : 'Consent Required',
        language === 'bn'
          ? 'হাসপাতালে জরুরি তথ্য প্রেরণে সম্মতি প্রদান করুন।'
          : 'Please grant consent to share triage data with the hospital.'
      );
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    try {
      const allergiesList = knownAllergiesInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const conditionsList = existingConditionsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      await submitEmergencySosRequest({
        hospitalId: selectedHospitalId,
        consentGranted: isConsentAgreed,
        sharedDocIds: selectedDocIds,
        ambulanceRequested,
        chiefComplaint: chiefComplaint.trim(),
        mainSymptom: mainSymptom.trim() || (language === 'bn' ? 'জরুরি পরিস্থিতি' : 'Emergency Complaint'),
        problemStartedAt,
        reportedSeverity,
        consciousnessStatus,
        breathingStatus,
        knownAllergies: allergiesList,
        existingConditions: conditionsList,
        currentMedications: currentMedicationsInput.trim(),
        relevantMedicalHistory: relevantMedicalHistory.trim(),
        emergencyContactName: emergencyContactName.trim(),
        emergencyContactPhone: emergencyContactPhone.trim(),
        manualAddress: manualAddress.trim(),
        locationSource: locationMode,
        coordinates: gpsCoordinates || undefined
      });
    } catch (err) {
      setIsSubmitting(false);
      showToast('error', 'Submission Failed', 'Please try again or call 112 directly.');
    }
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
                <p className="font-bold text-sm">
                  {language === 'bn' ? 'আপনার একটি জরুরি অনুরোধ বর্তমানে সক্রিয় রয়েছে' : 'An emergency request is currently active'}
                </p>
                <p className="text-xs text-rose-100">
                  {activeEmergencyRequest.selectedHospitalName} • ID: {activeEmergencyRequest.id}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigateTo('emergency-tracking', { id: activeEmergencyRequest.id })}
              className="px-4 py-2 bg-white text-rose-700 rounded-xl font-bold text-xs shadow-xs hover:bg-rose-50 transition-colors"
            >
              {language === 'bn' ? 'লাইভ ট্র্যাকিং দেখুন →' : 'View Live Tracking →'}
            </button>
          </div>
        )}

        {/* PROMINENT EMERGENCY HEADER & 112 DIRECT HOTLINE */}
        <div className="bg-[#E8F5E9] text-[#171717] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-xs font-black uppercase tracking-wider inline-block">
                🚨 Rapid Emergency SOS & Hospital Admission Workflow
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-[#171717]">
                {language === 'bn' ? 'জরুরি চিকিৎসা এসওএস (SOS)' : 'Emergency Medical SOS Request'}
              </h1>
              <p className="text-xs text-[#555555]">
                {language === 'bn'
                  ? 'রোগীর শারীরিক সমস্যা, উপসর্গ ও নির্বাচিত স্বাস্থ্য রেকর্ড সরাসরি হাসপাতালের ট্রায়াজ ডেস্কে প্রেরণ।'
                  : 'Submit immediate patient condition and verified MediVault records directly to the receiving hospital triage desk.'}
              </p>
            </div>

            {/* Direct 112 hotline call */}
            <a
              href="tel:112"
              className="px-6 py-3.5 bg-rose-700 hover:bg-rose-800 text-white font-black text-sm rounded-2xl shadow-sm transition-all flex items-center space-x-2 shrink-0 animate-bounce"
            >
              <PhoneCall className="w-5 h-5 text-white" />
              <span>{language === 'bn' ? 'সরাসরি ১১২ ডায়াল করুন' : 'Call 112 Directly'}</span>
            </a>
          </div>

          {/* CRITICAL SAFETY DISCLAIMER */}
          <div className="p-4 bg-rose-50 border-2 border-rose-400 rounded-2xl text-rose-950 text-xs flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-black text-rose-900">
                {language === 'bn' ? '⚠️ জীবনঘাতী বা সংজ্ঞাহীনতার ক্ষেত্রে সরাসরি ১১২-তে কল করুন' : '⚠️ Immediate Life-Threatening Emergency Warning'}
              </p>
              <p className="text-rose-900 leading-relaxed font-medium">
                {language === 'bn'
                  ? 'যদি রোগী সংজ্ঞাহীন (Unresponsive) হন, স্বাভাবিকভাবে শ্বাস না নেন, বা আশঙ্কাজনক অবস্থায় থাকেন—ওয়েবসাইটে অনুরোধ প্রক্রিয়া করার অপেক্ষা না করে অবিলম্বে ভারতের জরুরি নম্বর ১১২-এ কল করুন।'
                  : 'If the patient or another person is unresponsive, is not breathing normally, or has an immediately life-threatening emergency, please contact India\'s emergency number 112 directly without waiting for website processing.'}
              </p>
            </div>
          </div>
        </div>

        {/* MAIN SOS FORM */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: TARGET HOSPITAL SELECTION */}
          <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-[#171717] font-black text-base">
              <Building className="w-5 h-5 text-[#2E7D32]" />
              <span>{language === 'bn' ? '১. গন্তব্য হাসপাতাল নির্বাচন করুন' : '1. Select Destination Partner Hospital'}</span>
            </div>

            <p className="text-xs text-[#555555]">
              {language === 'bn'
                ? 'অনুরোধটি নির্বাচিত হাসপাতালের ট্রায়াজ ও ইমার্জেন্সি ভর্তি ডেস্কে প্রেরিত হবে:'
                : 'Your emergency request will be transmitted directly to this verified hospital desk:'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                    <div>
                      <h4 className="font-bold text-[#171717] text-sm">{hosp.name}</h4>
                      <p className="text-[11px] text-[#555555]">{hosp.area || 'West Bengal'}</p>
                    </div>
                    <span className="text-xs font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-lg border border-[#D5E8D7]">
                      {hosp.distanceKm} km
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#555555] mt-3 pt-2 border-t border-[#D5E8D7]">
                    <span>
                      {language === 'bn' ? 'আইসিইউ:' : 'ICU Beds:'}{' '}
                      <strong className="text-[#2E7D32] font-black">
                        {hosp.icuBedsAvailable} {language === 'bn' ? 'বেড' : 'Beds'}
                      </strong>
                    </span>
                    <span>~{hosp.estimatedTravelMins} {language === 'bn' ? 'মিনিট' : 'mins ETA'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: PATIENT INFORMATION & LOCATION */}
          <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-5">
            <div className="flex items-center space-x-2 text-[#171717] font-black text-base">
              <Users className="w-5 h-5 text-[#2E7D32]" />
              <span>{language === 'bn' ? '২. রোগীর প্রাথমিক তথ্য ও অবস্থান' : '2. Patient Identity & Emergency Location'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              <div className="p-3.5 bg-white rounded-xl border border-[#D5E8D7] space-y-1">
                <span className="text-[10px] text-[#555555] block uppercase font-bold">
                  {language === 'bn' ? 'রোগীর নাম' : 'Patient Name'}
                </span>
                <input
                  type="text"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  className="w-full text-sm font-bold text-[#171717] bg-transparent border-none p-0 focus:ring-0"
                />
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-[#D5E8D7] space-y-1">
                <span className="text-[10px] text-[#555555] block uppercase font-bold">
                  {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                </span>
                <input
                  type="tel"
                  value={patientPhone}
                  onChange={e => setPatientPhone(e.target.value)}
                  className="w-full text-sm font-bold text-[#171717] bg-transparent border-none p-0 focus:ring-0"
                />
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-[#D5E8D7] space-y-1">
                <span className="text-[10px] text-[#555555] block uppercase font-bold">
                  {language === 'bn' ? 'বয়স ও রক্তের গ্রুপ' : 'Age & Blood Group'}
                </span>
                <p className="text-sm font-bold text-[#171717]">
                  {patientAge} {language === 'bn' ? 'বছর' : 'Yrs'} • {patientProfile.bloodGroup || 'Not set'}
                </p>
              </div>
            </div>

            {/* Location Selector (GPS vs Manual) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#171717]">
                  {language === 'bn' ? 'জরুরি অবস্থান নির্ধারণ:' : 'Incident Location Source:'}
                </span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setLocationMode('GPS')}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                      locationMode === 'GPS'
                        ? 'bg-[#2E7D32] text-white shadow-xs'
                        : 'bg-white text-[#555555] border border-[#D5E8D7]'
                    }`}
                  >
                    {language === 'bn' ? 'লাইভ জিপিএস (GPS)' : 'Live GPS'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocationMode('MANUAL')}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                      locationMode === 'MANUAL'
                        ? 'bg-[#2E7D32] text-white shadow-xs'
                        : 'bg-white text-[#555555] border border-[#D5E8D7]'
                    }`}
                  >
                    {language === 'bn' ? 'ম্যানুয়াল ঠিকানা' : 'Manual Address'}
                  </button>
                </div>
              </div>

              {locationMode === 'GPS' ? (
                <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 text-xs">
                    <MapPin className="w-5 h-5 text-[#2E7D32] shrink-0" />
                    <div>
                      <p className="font-bold text-[#171717]">
                        {gpsCoordinates
                          ? `Lat: ${gpsCoordinates.lat.toFixed(4)}, Lng: ${gpsCoordinates.lng.toFixed(4)}`
                          : manualAddress}
                      </p>
                      <p className="text-[11px] text-[#555555]">
                        {gpsCoordinates
                          ? (language === 'bn' ? 'ডিভাইসের সঠিক জিপিএস পিনযুক্ত' : 'Accurate device GPS pinned')
                          : (language === 'bn' ? 'প্রোফাইলে সংরক্ষিত নিবন্ধিত এলাকা' : 'Profile default address')}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDetectGps}
                    disabled={isDetectingGps}
                    className="px-4 py-2 bg-[#E8F5E9] hover:bg-[#D5E8D7] text-[#2E7D32] font-bold text-xs rounded-xl border border-[#D5E8D7] flex items-center space-x-1.5 transition-colors shrink-0"
                  >
                    <Locate className={`w-4 h-4 ${isDetectingGps ? 'animate-spin' : ''}`} />
                    <span>
                      {isDetectingGps
                        ? (language === 'bn' ? 'শনাক্ত হচ্ছে...' : 'Detecting...')
                        : (language === 'bn' ? 'জিপিএস রিফ্রেশ করুন' : 'Refresh GPS Pin')}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-white rounded-2xl border border-[#D5E8D7]">
                  <label className="block text-[11px] font-bold text-[#555555] mb-1">
                    {language === 'bn' ? 'সম্পূর্ণ ঠিকানা বা ল্যান্ডমার্ক লিখুন:' : 'Enter Complete Address / Landmark:'}
                  </label>
                  <input
                    type="text"
                    value={manualAddress}
                    onChange={e => setManualAddress(e.target.value)}
                    placeholder="e.g. Flat 3B, Panihati Municipality Road, Near Panihati Hospital"
                    className="w-full text-xs font-medium text-[#171717] bg-[#F1F8F2] border border-[#D5E8D7] rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-[#2E7D32]"
                  />
                </div>
              )}

              {gpsError && <p className="text-xs text-rose-700 font-bold">{gpsError}</p>}
            </div>
          </div>

          {/* SECTION 3: DESCRIBE CURRENT MEDICAL PROBLEM (PROMINENT REQUIRED FIELD) */}
          <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border-2 border-[#2E7D32] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="chief-complaint"
                className="text-base sm:text-lg font-black text-[#171717] flex items-center space-x-2"
              >
                <Heart className="w-5 h-5 text-rose-700" />
                <span>
                  {language === 'bn'
                    ? '৩. বর্তমান শারীরিক সমস্যা বা কারণ বর্ণনা করুন *'
                    : '3. Describe Your Current Medical Problem *'}
                </span>
              </label>
              <span className="text-xs font-black uppercase text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-300">
                {language === 'bn' ? 'আবশ্যক (Required)' : 'Required Field'}
              </span>
            </div>

            <p className="text-xs text-[#555555]">
              {language === 'bn'
                ? 'বর্তমানে কী ঘটছে তা বিস্তারিত লিখুন। উদাহরণস্বরূপ: আপনার লক্ষণ, আঘাত, শ্বাসকষ্ট, বুকে অস্বস্তি, হঠাৎ দুর্বলতা বা অন্য কোনো সমস্যা।'
                : 'Explain what is happening right now. For example, describe your symptoms, injury, breathing difficulty, chest discomfort, sudden weakness, or any other emergency concern.'}
            </p>

            <textarea
              id="chief-complaint"
              rows={4}
              value={chiefComplaint}
              onChange={e => {
                setChiefComplaint(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder={
                language === 'bn'
                  ? 'কী সমস্যা হচ্ছে লিখুন। যেমন: তীব্র বুকে ব্যথা, শ্বাস নিতে কষ্ট হচ্ছে, মাথা ঘোরা বা দুর্বলতা...'
                  : 'Explain what is happening right now. For example, describe your symptoms, injury, breathing difficulty, chest discomfort, sudden weakness, or any other emergency concern.'
              }
              className={`w-full text-xs sm:text-sm font-medium text-[#171717] bg-white border rounded-2xl p-4 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#2E7D32] ${
                validationError ? 'border-rose-500 ring-1 ring-rose-500' : 'border-[#D5E8D7]'
              }`}
            />

            {validationError && (
              <p className="text-xs text-rose-700 font-bold flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </p>
            )}

            {/* Quick symptom helper tags */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-[#555555] block mb-2">
                {language === 'bn' ? 'দ্রুত নির্বাচনের ট্যাগ (ক্লিক করুন):' : 'Quick Symptom Tags (click to append):'}
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { en: 'Severe Chest Discomfort', bn: 'তীব্র বুকে অস্বস্তি / ব্যথা' },
                  { en: 'Shortness of Breath', bn: 'তীব্র শ্বাসকষ্ট' },
                  { en: 'Sudden Weakness / Slurred Speech', bn: 'হঠাৎ শরীরের একপাশ অবশ / অসংলগ্ন কথা' },
                  { en: 'Severe Fall / Fracture', bn: 'পড়ে গিয়ে মারাত্মক আঘাত / ফ্র্যাকচার' },
                  { en: 'Uncontrolled High Blood Pressure', bn: 'অত্যধিক রক্তচাপ বৃদ্ধি' },
                  { en: 'High Fever with Shivering', bn: 'তীব্র জ্বর ও কাঁপুনি' }
                ].map(tag => (
                  <button
                    key={tag.en}
                    type="button"
                    onClick={() => {
                      const textToAppend = language === 'bn' ? tag.bn : tag.en;
                      setChiefComplaint(prev => (prev ? `${prev}, ${textToAppend}` : textToAppend));
                      setMainSymptom(tag.en);
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-[#F1F8F2] text-[#171717] rounded-xl border border-[#D5E8D7] text-[11px] font-semibold transition-colors"
                  >
                    + {language === 'bn' ? tag.bn : tag.en}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 4: STRUCTURED CLINICAL FIELDS (OPTIONAL) */}
          <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[#171717] font-black text-base">
                <Sparkles className="w-5 h-5 text-[#2E7D32]" />
                <span>
                  {language === 'bn'
                    ? '৪. কাঠামোগত ক্লিনিক্যাল তথ্য (ঐচ্ছিক)'
                    : '4. Structured Clinical Details (Optional)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowOptionalDetails(!showOptionalDetails)}
                className="text-xs font-bold text-[#2E7D32] flex items-center space-x-1"
              >
                <span>{showOptionalDetails ? (language === 'bn' ? 'লুকান' : 'Hide') : (language === 'bn' ? 'দেখান' : 'Show')}</span>
                {showOptionalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-xs text-[#555555]">
              {language === 'bn'
                ? 'জরুরি পরিস্থিতিতে এই ক্ষেত্রগুলি পূরণ করা বাধ্যতামূলক নয়। তবে উত্তর দিলে হাসপাতাল দ্রুত প্রস্তুতি নিতে পারে।'
                : 'Completing these fields is not mandatory during an emergency, but helps hospital triage prepare beds and teams faster.'}
            </p>

            {showOptionalDetails && (
              <div className="space-y-4 pt-2 text-xs">
                {/* Problem onset & Reported severity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-xl border border-[#D5E8D7] space-y-1">
                    <label className="block text-[11px] font-bold text-[#555555]">
                      {language === 'bn' ? 'কখন সমস্যাটি শুরু হয়েছে?' : 'When did the problem start?'}
                    </label>
                    <select
                      value={problemStartedAt}
                      onChange={e => setProblemStartedAt(e.target.value)}
                      className="w-full text-xs font-bold text-[#171717] bg-transparent border-none p-0 focus:ring-0"
                    >
                      <option value="Just now (<15 mins)">{language === 'bn' ? 'এইমাত্র (< ১৫ মিনিট)' : 'Just now (<15 mins)'}</option>
                      <option value="15-30 mins ago">{language === 'bn' ? '১৫-৩০ মিনিট আগে' : '15-30 mins ago'}</option>
                      <option value="1-2 hours ago">{language === 'bn' ? '১-২ ঘন্টা আগে' : '1-2 hours ago'}</option>
                      <option value="Today morning">{language === 'bn' ? 'আজ সকাল থেকে' : 'Today morning'}</option>
                      <option value=">6 hours ago">{language === 'bn' ? '৬ ঘন্টারও বেশি সময় আগে' : '>6 hours ago'}</option>
                      <option value="Unsure">{language === 'bn' ? 'নিশ্চিত নই' : 'Unsure'}</option>
                    </select>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#D5E8D7] space-y-1">
                    <label className="block text-[11px] font-bold text-[#555555]">
                      {language === 'bn' ? 'তীব্রতা (Severity):' : 'Reported Severity:'}
                    </label>
                    <div className="grid grid-cols-4 gap-1.5 pt-1">
                      {(['Mild', 'Moderate', 'Severe', 'Unsure'] as const).map(sev => (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => setReportedSeverity(sev)}
                          className={`py-1.5 rounded-lg font-bold text-center text-xs transition-colors ${
                            reportedSeverity === sev
                              ? 'bg-[#2E7D32] text-white shadow-xs'
                              : 'bg-[#F1F8F2] text-[#555555] hover:bg-[#E8F5E9]'
                          }`}
                        >
                          {sev}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Consciousness & Breathing Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-xl border border-[#D5E8D7] space-y-1">
                    <label className="block text-[11px] font-bold text-[#555555]">
                      {language === 'bn' ? 'জ্ঞান / সচেতনতার অবস্থা (Consciousness):' : 'Consciousness Status:'}
                    </label>
                    <select
                      value={consciousnessStatus}
                      onChange={e => setConsciousnessStatus(e.target.value as any)}
                      className="w-full text-xs font-bold text-[#171717] bg-transparent border-none p-0 focus:ring-0"
                    >
                      <option value="Alert">{language === 'bn' ? 'সম্পূর্ণ সজাগ (Alert)' : 'Alert'}</option>
                      <option value="Confused">{language === 'bn' ? 'দ্বিধাগ্রস্ত / অসংলগ্ন (Confused)' : 'Confused'}</option>
                      <option value="Unresponsive">{language === 'bn' ? 'সংজ্ঞাহীন / সাড়াহীন (Unresponsive)' : 'Unresponsive'}</option>
                      <option value="Unsure">{language === 'bn' ? 'নিশ্চিত নই (Unsure)' : 'Unsure'}</option>
                    </select>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#D5E8D7] space-y-1">
                    <label className="block text-[11px] font-bold text-[#555555]">
                      {language === 'bn' ? 'শ্বাস-প্রশ্বাসের অবস্থা (Breathing):' : 'Breathing Status:'}
                    </label>
                    <select
                      value={breathingStatus}
                      onChange={e => setBreathingStatus(e.target.value as any)}
                      className="w-full text-xs font-bold text-[#171717] bg-transparent border-none p-0 focus:ring-0"
                    >
                      <option value="Normal">{language === 'bn' ? 'স্বাভাবিক (Normal)' : 'Normal'}</option>
                      <option value="Difficulty Breathing">{language === 'bn' ? 'শ্বাসকষ্ট হচ্ছে (Difficulty Breathing)' : 'Difficulty Breathing'}</option>
                      <option value="Not Breathing Normally">{language === 'bn' ? 'অস্বাভাবিক শ্বাসপ্রশ্বাস (Not Breathing Normally)' : 'Not Breathing Normally'}</option>
                      <option value="Unsure">{language === 'bn' ? 'নিশ্চিত নই (Unsure)' : 'Unsure'}</option>
                    </select>
                  </div>
                </div>

                {/* Chronic Diseases & Allergies */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-xl border border-[#D5E8D7] space-y-1">
                    <label className="block text-[11px] font-bold text-[#555555]">
                      {language === 'bn' ? 'জানা রোগ / অসুস্থতা (Known Diseases):' : 'Known Disease / Chronic Conditions:'}
                    </label>
                    <input
                      type="text"
                      value={existingConditionsInput}
                      onChange={e => setExistingConditionsInput(e.target.value)}
                      placeholder="e.g. Type 2 Diabetes, Hypertension, COPD"
                      className="w-full text-xs font-medium text-[#171717] bg-[#F1F8F2] border border-[#D5E8D7] rounded-lg px-2.5 py-1.5"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#D5E8D7] space-y-1">
                    <label className="block text-[11px] font-bold text-[#555555]">
                      {language === 'bn' ? 'জানা অ্যালার্জি (Allergies):' : 'Known Allergies:'}
                    </label>
                    <input
                      type="text"
                      value={knownAllergiesInput}
                      onChange={e => setKnownAllergiesInput(e.target.value)}
                      placeholder="e.g. Penicillin, Sulfa drugs, None"
                      className="w-full text-xs font-medium text-[#171717] bg-[#F1F8F2] border border-[#D5E8D7] rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                </div>

                {/* Medications & Medical History */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-xl border border-[#D5E8D7] space-y-1">
                    <label className="block text-[11px] font-bold text-[#555555]">
                      {language === 'bn' ? 'বর্তমান ওষুধপত্র (Current Medications):' : 'Current Medications:'}
                    </label>
                    <input
                      type="text"
                      value={currentMedicationsInput}
                      onChange={e => setCurrentMedicationsInput(e.target.value)}
                      placeholder="e.g. Metformin, Amlodipine, Aspirin"
                      className="w-full text-xs font-medium text-[#171717] bg-[#F1F8F2] border border-[#D5E8D7] rounded-lg px-2.5 py-1.5"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#D5E8D7] space-y-1">
                    <label className="block text-[11px] font-bold text-[#555555]">
                      {language === 'bn' ? 'অতিরিক্ত অতীত ইতিহাস (Medical History):' : 'Relevant Past Medical History:'}
                    </label>
                    <input
                      type="text"
                      value={relevantMedicalHistory}
                      onChange={e => setRelevantMedicalHistory(e.target.value)}
                      placeholder="e.g. CABG in 2021, Pacemaker implant"
                      className="w-full text-xs font-medium text-[#171717] bg-[#F1F8F2] border border-[#D5E8D7] rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-xl border border-[#D5E8D7] space-y-1">
                    <label className="block text-[11px] font-bold text-[#555555]">
                      {language === 'bn' ? 'জরুরি যোগাযোগের ব্যক্তি (Contact Name):' : 'Emergency Contact Name:'}
                    </label>
                    <input
                      type="text"
                      value={emergencyContactName}
                      onChange={e => setEmergencyContactName(e.target.value)}
                      placeholder="e.g. Guardian / Relative Name"
                      className="w-full text-xs font-medium text-[#171717] bg-[#F1F8F2] border border-[#D5E8D7] rounded-lg px-2.5 py-1.5"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#D5E8D7] space-y-1">
                    <label className="block text-[11px] font-bold text-[#555555]">
                      {language === 'bn' ? 'জরুরি ফোন নম্বর (Contact Phone):' : 'Emergency Contact Phone:'}
                    </label>
                    <input
                      type="tel"
                      value={emergencyContactPhone}
                      onChange={e => setEmergencyContactPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs font-medium text-[#171717] bg-[#F1F8F2] border border-[#D5E8D7] rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                </div>

                {/* Ambulance Request Toggle */}
                <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#171717] text-xs">
                      {language === 'bn' ? 'হাসপাতালের অ্যাম্বুলেন্স প্রেরণ প্রয়োজন?' : 'Request Hospital Ambulance Dispatch?'}
                    </p>
                    <p className="text-[11px] text-[#555555]">
                      {language === 'bn'
                        ? 'হাসপাতালের লাইফ সাপোর্ট অ্যাম্বুলেন্স টিমকে অনুরোধ পাঠায়'
                        : 'Transmits request to hospital emergency EMS transport desk'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={ambulanceRequested}
                    onChange={e => setAmbulanceRequested(e.target.checked)}
                    className="w-5 h-5 text-[#2E7D32] rounded focus:ring-[#2E7D32]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 5: ATTACH RELEVANT MEDIVAULT INFORMATION */}
          <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-[#171717] font-black text-base">
              <FileText className="w-5 h-5 text-[#2E7D32]" />
              <span>
                {language === 'bn'
                  ? '৫. প্রাসঙ্গিক মেডিভল্ট (MediVault) রেকর্ড সংযুক্ত করুন'
                  : '5. Attach Relevant MediVault Records'}
              </span>
            </div>

            <p className="text-xs text-[#555555]">
              {language === 'bn'
                ? 'শুধুমাত্র আপনি যে নথিগুলি নির্বাচন করবেন তা প্রাপ্তকারী হাসপাতালে ৪ ঘন্টার ট্রায়াজ মূল্যায়নের জন্য শেয়ার করা হবে। আপনার পুরো ভল্ট উন্মুক্ত হবে না।'
                : 'Only records explicitly selected by you will be shared with the receiving hospital under a 4-hour emergency access grant. Your unselected vault records remain private.'}
            </p>

            {medicalDocuments && medicalDocuments.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                  {medicalDocuments.map(doc => {
                    const isSelected = selectedDocIds.includes(doc.id);
                    return (
                      <div
                        key={doc.id}
                        onClick={() => handleToggleDoc(doc.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                          isSelected
                            ? 'bg-white border-[#2E7D32] shadow-xs ring-1 ring-[#2E7D32]'
                            : 'bg-white border-[#D5E8D7] hover:border-[#2E7D32]'
                        }`}
                      >
                        <div className="space-y-1 pr-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7] uppercase">
                            {doc.category.replace('_', ' ')}
                          </span>
                          <h5 className="font-bold text-xs text-[#171717] line-clamp-1">{doc.title}</h5>
                          <p className="text-[10px] text-[#555555]">
                            {doc.issueDate || doc.uploadDate} • {doc.doctorName || doc.hospitalName || 'Clinic'}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#2E7D32] rounded focus:ring-[#2E7D32] shrink-0 mt-1"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#D5E8D7] flex items-center justify-between text-xs">
                  <span className="text-[#555555]">
                    {language === 'bn' ? 'সংযুক্ত নথির সংখ্যা:' : 'Selected Records for Sharing:'}{' '}
                    <strong className="text-[#2E7D32]">{selectedDocIds.length}</strong> / {medicalDocuments.length}
                  </span>
                  <span className="text-[11px] text-[#555555] font-mono">
                    {selectedDocIds.length === 0
                      ? (language === 'bn' ? 'কোনো নথি নির্বাচন করা হয়নি' : 'None selected (OK to proceed)')
                      : (language === 'bn' ? 'অনুমতি টোকেন তৈরি হবে' : 'Time-limited token generated')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-white rounded-2xl border border-[#D5E8D7] text-center text-xs text-[#555555] space-y-1">
                <FileText className="w-8 h-8 text-[#2E7D32] mx-auto opacity-70" />
                <p className="font-bold text-[#171717]">
                  {language === 'bn' ? 'মেডিভল্টে কোনো নথি পাওয়া যায়নি' : 'No MediVault records uploaded yet'}
                </p>
                <p className="text-[11px]">
                  {language === 'bn'
                    ? 'নথি ছাড়াও জরুরি অনুরোধ সফলভাবে জমা দেওয়া যাবে।'
                    : 'Emergency requests can be submitted immediately without attached documents.'}
                </p>
              </div>
            )}
          </div>

          {/* SECTION 6: DATA DISCLOSURE CONSENT & SUBMISSION */}
          <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-5">
            <div className="flex items-center space-x-2 text-[#171717] font-black text-base">
              <ShieldCheck className="w-5 h-5 text-[#2E7D32]" />
              <span>
                {language === 'bn'
                  ? '৬. তথ্য প্রকাশ সম্মতি ও অনুরোধ জমা'
                  : '6. Emergency Data Disclosure & Consent'}
              </span>
            </div>

            <p className="text-xs text-[#555555] leading-relaxed">
              {language === 'bn'
                ? `আমি নিশ্চিত করছি যে জমা দেওয়া শারীরিক সমস্যা, লক্ষণ, অবস্থান এবং নির্বাচিত মেডিকেল নথিগুলি (${selectedHospital.name})-এর জরুরি ট্রায়াজ ডেস্কে ক্লিনিক্যাল মূল্যায়ন ও ভর্তি সমন্বয়ের জন্য সাময়িক সময়ের জন্য ভাগ করে নেওয়া হবে।`
                : `I understand that the submitted medical problem, structured symptoms, incident location, and authorized medical records will be securely shared with ${selectedHospital.name} exclusively for emergency triage and admission assessment.`}
            </p>

            <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] flex items-center space-x-3">
              <input
                type="checkbox"
                id="emergency-consent"
                checked={isConsentAgreed}
                onChange={e => setIsConsentAgreed(e.target.checked)}
                className="w-5 h-5 text-[#2E7D32] rounded focus:ring-[#2E7D32] shrink-0"
              />
              <label htmlFor="emergency-consent" className="text-xs font-bold text-[#171717] cursor-pointer">
                {language === 'bn'
                  ? 'আমি জরুরি চিকিৎসা ও ট্রায়াজ সমন্বয়ের জন্য উল্লেখিত তথ্য শেয়ারের সম্মতি প্রদান করছি *'
                  : 'I grant emergency consent to share the specified medical information and location with the receiving hospital *'}
              </label>
            </div>

            {/* PROMINENT SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center space-x-3 shadow-md transition-all cursor-pointer ${
                  isSubmitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-rose-700 hover:bg-rose-800 text-white hover:shadow-lg'
                }`}
              >
                <AlertOctagon className={`w-6 h-6 ${isSubmitting ? 'animate-spin' : ''}`} />
                <span>
                  {isSubmitting
                    ? (language === 'bn' ? 'অনুরোধ জমা দেওয়া হচ্ছে...' : 'Submitting Emergency Request...')
                    : (language === 'bn' ? 'জরুরি অনুরোধ জমা দিন (Submit Emergency Request)' : 'Submit Emergency Request')}
                </span>
                {!isSubmitting && <ArrowRight className="w-5 h-5 ml-1" />}
              </button>

              <p className="text-center text-[11px] text-[#555555] mt-2">
                {language === 'bn'
                  ? 'অনুরোধটি সংরক্ষিত হবে এবং সরাসরি লাইভ ট্র্যাকিং পেজে নিয়ে যাওয়া হবে।'
                  : 'Request will be persistently saved and you will be redirected to the live tracking page.'}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
