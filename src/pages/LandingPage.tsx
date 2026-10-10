import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  Heart,
  ShieldCheck,
  AlertOctagon,
  FileText,
  MapPin,
  Clock,
  PhoneCall,
  Activity,
  Ambulance,
  Lock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Bed,
  ArrowRight,
  Phone,
  Search,
  ExternalLink,
  Pill,
  UploadCloud,
  Navigation,
  Volume2
} from 'lucide-react';
import { getVerifiedHospitalsByLocation } from '../data/verifiedHospitals';

export const LandingPage: React.FC = () => {
  const { language, t, speak } = useLanguage();
  const { navigateTo, setSelectedSearchLocation } = useApp();

  const [previewLocation, setPreviewLocation] = useState('Panihati, West Bengal');

  const handleAudioSummary = () => {
    if (language === 'bn') {
      speak('সুস্থায়ন প্ল্যাটফর্মে স্বাগতম। এটি প্রবীণদের স্বাস্থ্য সুরক্ষা, মেডিকেল রেকর্ড ভল্ট এবং এক স্পর্শে নিকটস্থ হাসপাতালে জরুরি সাহায্য পাওয়ার একটি সমন্বিত মাধ্যম।');
    } else {
      speak('Welcome to Susthayan. An integrated elderly healthcare platform for secure medical records, nearby verified hospitals, and emergency hospital assistance.');
    }
  };

  const previewHospitals = getVerifiedHospitalsByLocation(previewLocation).slice(0, 3);

  const handleSelectArea = (area: string) => {
    setPreviewLocation(area);
    setSelectedSearchLocation(area);
  };

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      {/* 1. CLEAN MODERN MEDICAL HERO SECTION */}
      <section className="py-12 lg:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Hero Copy & Calls-to-Action */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 bg-[#E8F5E9] border border-[#D5E8D7] px-4 py-1.5 rounded-full text-xs font-bold text-[#2E7D32]">
              <Sparkles className="w-4 h-4 text-[#2E7D32]" />
              <span>
                {language === 'bn'
                  ? 'প্রবীণ স্বাস্থ্যসেবা, ডিজিটাল ভল্ট ও জরুরি সাড়া ব্যবস্থা'
                  : 'Elderly Healthcare, MediVault & Verified Hospital Triage'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#171717] leading-[1.15]">
              <span className="font-bengali block">
                {language === 'bn' ? 'সুস্থায়ন' : 'Susthayan'}
              </span>
              <span className="text-[#2E7D32] text-2xl sm:text-3xl lg:text-4xl font-extrabold block mt-2">
                {language === 'bn'
                  ? 'আপনার স্বাস্থ্য, আপনার নিরাপত্তা, পরিবার সবসময় পাশে'
                  : 'Care for Elders. Peace of Mind for Families.'}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#555555] leading-relaxed max-w-2xl font-normal">
              {language === 'bn'
                ? 'একা বসবাসকারী প্রবীণ বাবা-মায়ের প্রেসক্রিপশন ও রিপোর্ট সুরক্ষিত রাখার ডিজিটাল ভল্ট, নিকটস্থ যাচাইকৃত হাসপাতালের আইসিইউ বেড অনুসন্ধান এবং এক ক্লিকে জরুরি সাহায্য পাওয়ার সমন্বিত প্ল্যাটফর্ম।'
                : 'A clean, trustworthy digital healthcare platform designed for seniors living alone. Store medical prescriptions in MediVault, find verified nearby ICU beds in Panihati & Dum Dum, and send 1-tap emergency assistance requests.'}
            </p>

            {/* Main Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-3.5 items-center">
              {/* Emergency SOS */}
              <button
                onClick={() => navigateTo('emergency-sos')}
                className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-extrabold text-sm shadow-sm transition-all"
              >
                <AlertOctagon className="w-5 h-5 text-white animate-pulse" />
                <span>{language === 'bn' ? 'জরুরি এসওএস (SOS)' : 'Emergency SOS'}</span>
              </button>

              {/* Nearby Hospitals */}
              <button
                onClick={() => navigateTo('nearby-hospitals')}
                className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white font-bold text-sm shadow-sm transition-all"
              >
                <MapPin className="w-4 h-4 text-white" />
                <span>{language === 'bn' ? 'নিকটস্থ হাসপাতাল' : 'Find Nearby Hospitals'}</span>
              </button>

              {/* MediVault */}
              <button
                onClick={() => navigateTo('medical-vault')}
                className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-white hover:bg-[#F1F8F2] text-[#2E7D32] border border-[#D5E8D7] text-sm font-bold transition-all shadow-xs"
              >
                <FileText className="w-4 h-4 text-[#2E7D32]" />
                <span>{language === 'bn' ? 'মেডিকেল ভল্ট' : 'MediVault Storage'}</span>
              </button>

              {/* Voice Narration */}
              <button
                onClick={handleAudioSummary}
                className="p-3.5 rounded-xl bg-[#E8F5E9] hover:bg-[#D5E8D7] text-[#2E7D32] border border-[#D5E8D7] transition-colors"
                title="Voice Narration"
              >
                <Volume2 className="w-5 h-5 text-[#2E7D32]" />
              </button>
            </div>

            {/* Trust Metrics Bar */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#555555] border-t border-[#D5E8D7]">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                <span>Verified Hospital Partner Network</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                <span>Patient-Controlled DPDP Consent</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-[#2E7D32]" />
                <span>256-Bit Encrypted MediVault</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Medical Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-[#E8F5E9] p-3 rounded-3xl border border-[#D5E8D7] shadow-sm">
              <div className="overflow-hidden rounded-2xl relative">
                <img
                  src="/images/doctor_consult.jpg"
                  alt="Doctor consulting an elderly patient"
                  className="w-full h-80 sm:h-96 object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white space-y-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#2E7D32] text-white text-[10px] font-bold uppercase tracking-wider">
                      Verified Healthcare
                    </span>
                    <p className="text-xs sm:text-sm font-bold">
                      Compassionate geriatric consultation & rapid emergency assistance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-10">
          {/* Card 1: MediVault */}
          <div
            onClick={() => navigateTo('medical-vault')}
            className="bg-[#E8F5E9] hover:bg-[#D5E8D7]/60 border border-[#D5E8D7] rounded-2xl p-5 transition-all cursor-pointer group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-white text-[#2E7D32] flex items-center justify-center mb-3 shadow-xs group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 text-[#2E7D32]" />
            </div>
            <h3 className="text-sm font-bold text-[#171717] mb-1 flex items-center justify-between">
              <span>{language === 'bn' ? 'মেডিকেল রেকর্ড ভল্ট' : 'MediVault Storage'}</span>
              <ChevronRight className="w-4 h-4 text-[#2E7D32]" />
            </h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              {language === 'bn' ? 'প্রেসক্রিপশন ও রক্তের রিপোর্ট সম্পূর্ণ নিরাপদে সংরক্ষণ ও প্রিভিউ করুন।' : 'Securely store and preview prescriptions, lab reports & diagnostics.'}
            </p>
          </div>

          {/* Card 2: Document Upload */}
          <div
            onClick={() => navigateTo('upload-document')}
            className="bg-[#E8F5E9] hover:bg-[#D5E8D7]/60 border border-[#D5E8D7] rounded-2xl p-5 transition-all cursor-pointer group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-white text-[#2E7D32] flex items-center justify-center mb-3 shadow-xs group-hover:scale-105 transition-transform">
              <UploadCloud className="w-5 h-5 text-[#2E7D32]" />
            </div>
            <h3 className="text-sm font-bold text-[#171717] mb-1 flex items-center justify-between">
              <span>{language === 'bn' ? 'নতুন নথি আপলোড' : 'Upload Documents'}</span>
              <ChevronRight className="w-4 h-4 text-[#2E7D32]" />
            </h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              {language === 'bn' ? 'PDF, JPG ও PNG ফাইল সহজে আপলোড ও ক্যাটাগরি অনুযায়ী গুছিয়ে রাখুন।' : 'Fast upload for PDF, JPG & PNG documents with instant categorization.'}
            </p>
          </div>

          {/* Card 3: Live Hospital Bed Radar */}
          <div
            onClick={() => navigateTo('nearby-hospitals')}
            className="bg-[#E8F5E9] hover:bg-[#D5E8D7]/60 border border-[#D5E8D7] rounded-2xl p-5 transition-all cursor-pointer group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-white text-[#2E7D32] flex items-center justify-center mb-3 shadow-xs group-hover:scale-105 transition-transform">
              <Bed className="w-5 h-5 text-[#2E7D32]" />
            </div>
            <h3 className="text-sm font-bold text-[#171717] mb-1 flex items-center justify-between">
              <span>{language === 'bn' ? 'নিকটস্থ হাসপাতাল ও বেড' : 'Hospitals & Beds'}</span>
              <ChevronRight className="w-4 h-4 text-[#2E7D32]" />
            </h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              {language === 'bn' ? 'পানিহাটি ও দমদম অঞ্চলের প্রকৃত দূরত্ব ও জরুরি বেড স্থিতি।' : 'Verified nearby facilities with live distance, map and bed status.'}
            </p>
          </div>

          {/* Card 4: AI Health Assistance */}
          <div
            onClick={() => navigateTo('ai-checkin')}
            className="bg-[#E8F5E9] hover:bg-[#D5E8D7]/60 border border-[#D5E8D7] rounded-2xl p-5 transition-all cursor-pointer group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-white text-[#2E7D32] flex items-center justify-center mb-3 shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-[#2E7D32]" />
            </div>
            <h3 className="text-sm font-bold text-[#171717] mb-1 flex items-center justify-between">
              <span>{language === 'bn' ? 'এআই স্বাস্থ্য চেক-ইন' : 'AI Health Check-in'}</span>
              <ChevronRight className="w-4 h-4 text-[#2E7D32]" />
            </h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              {language === 'bn' ? 'উপসর্গভিত্তিক প্রাথমিক নির্দেশনা ও ওষুধের মিথস্ক্রিয়া পরীক্ষা।' : 'Symptom assessment guidance and multi-drug interaction checker.'}
            </p>
          </div>
        </div>
      </section>

      {/* 2. INTEGRATED NEARBY HOSPITALS PREVIEW SECTION */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#D5E8D7]">
        <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-10 border border-[#D5E8D7] shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-4 border-b border-[#D5E8D7]">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] flex items-center space-x-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Verified Regional Healthcare Network</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#171717] mt-1">
                {language === 'bn' ? 'নিকটস্থ যাচাইকৃত হাসপাতাল ও জরুরি বেড' : 'Nearby Verified Hospitals & Emergency Beds'}
              </h2>
              <p className="text-xs text-[#555555] mt-1">
                {language === 'bn'
                  ? 'পানিহাটি এবং দমদম অঞ্চলের যাচাইকৃত প্রকৃত হাসপাতালের তালিকা ও লাইভ জরুরি বেডের স্থিতি।'
                  : 'Real, verified facilities around Panihati and Dum Dum with direct phone numbers and verified bed capacity.'}
              </p>
            </div>

            {/* Location Quick Switcher */}
            <div className="flex items-center bg-white p-1.5 rounded-xl border border-[#D5E8D7] space-x-1 shrink-0">
              <button
                type="button"
                onClick={() => handleSelectArea('Panihati, West Bengal')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  previewLocation.includes('Panihati')
                    ? 'bg-[#2E7D32] text-white shadow-xs'
                    : 'text-[#555555] hover:text-[#171717]'
                }`}
              >
                Panihati (পানিহাটি)
              </button>
              <button
                type="button"
                onClick={() => handleSelectArea('Dum Dum, West Bengal')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  previewLocation.includes('Dum Dum')
                    ? 'bg-[#2E7D32] text-white shadow-xs'
                    : 'text-[#555555] hover:text-[#171717]'
                }`}
              >
                Dum Dum (দমদম)
              </button>
            </div>
          </div>

          {/* 3 Hospital Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewHospitals.map(hosp => (
              <div
                key={hosp.id}
                className="bg-white rounded-2xl p-5 border border-[#D5E8D7] hover:border-[#2E7D32] transition-all flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7]">
                      {hosp.type}
                    </span>
                    <span className="text-xs font-black text-[#2E7D32]">
                      📍 {hosp.distanceKm} km
                    </span>
                  </div>

                  <h4 className="text-base font-black text-[#171717] line-clamp-1">{hosp.name}</h4>
                  <p className="text-xs text-[#2E7D32] font-bold font-bengali">{hosp.nameBn}</p>
                  <p className="text-xs text-[#555555] line-clamp-2">{hosp.address}</p>

                  {/* Bed status */}
                  <div className="pt-2">
                    {hosp.isBedVerified ? (
                      <div className="p-2.5 bg-[#E8F5E9] border border-[#D5E8D7] rounded-xl text-xs font-bold text-[#171717] flex items-center justify-between">
                        <span className="text-[#555555]">জরুরি বেড খালি:</span>
                        <span className="px-2 py-0.5 bg-[#2E7D32] text-white rounded text-xs font-black">
                          {hosp.availableBeds} টি
                        </span>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-[#F1F8F2] border border-[#D5E8D7] rounded-xl text-[11px] font-semibold text-[#555555]">
                        Availability not verified — contact hospital
                      </div>
                    )}
                  </div>
                </div>

                {/* Call & Direct Buttons */}
                <div className="pt-3 border-t border-[#D5E8D7] flex items-center space-x-2 text-xs">
                  <a
                    href={`tel:${hosp.phone.replace(/[^0-9+]/g, '')}`}
                    className="flex-1 text-center py-2 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-xl font-bold flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-white" />
                    <span>কল করুন</span>
                  </a>
                  <a
                    href={hosp.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-white border border-[#D5E8D7] hover:bg-[#F1F8F2] text-[#171717] rounded-xl font-bold"
                    title="Google Maps"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#555555]" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                setSelectedSearchLocation(previewLocation);
                navigateTo('nearby-hospitals');
              }}
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-xl text-xs font-black shadow-sm transition-all"
            >
              <span>{language === 'bn' ? 'সকল ১০টি যাচাইকৃত হাসপাতাল ও লাইভ ম্যাপ দেখুন' : 'View All 10+ Hospitals on Live Map'}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. SENIOR CITIZEN CHALLENGES & SUSTHAYAN SOLUTIONS WITH VISUALS */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#D5E8D7]">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#2E7D32]">
            {language === 'bn' ? 'প্রবীণ স্বাস্থ্য সুরক্ষা' : 'Why Susthayan'}
          </h2>
          <h3 className="text-3xl font-black text-[#171717]">
            {language === 'bn' ? 'কেন সুস্থায়ন প্রবীণদের জন্য অপরিহার্য?' : 'Designed for Elderly Care & Emergencies'}
          </h3>
          <p className="text-sm text-[#555555]">
            {language === 'bn'
              ? 'সন্তানেরা দূরে থাকলেও বাবা-মায়ের চিকিৎসা এবং জরুরি সেবা এক ক্লিকে নিশ্চিত করার আধুনিক প্রযুক্তি।'
              : 'Empowering seniors and distant family members with transparent, fast, and secure health coordination.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Emergency SOS */}
          <div className="bg-[#E8F5E9] rounded-2xl p-6 border border-[#D5E8D7] space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-white border border-[#D5E8D7] flex items-center justify-center text-[#D32F2F]">
              <AlertOctagon className="w-6 h-6 text-[#D32F2F]" />
            </div>
            <h4 className="text-lg font-bold text-[#171717]">জরুরি ৩ সেকেন্ড এসওএস</h4>
            <p className="text-xs text-[#555555] leading-relaxed">
              জরুরি মুহূর্তে একা থাকলে ১ ক্লিকে নিকটস্থ হাসপাতাল এবং অভিভাবকের ফোনে জিপিএস অবস্থান ও অ্যালার্জি তথ্য স্বয়ংক্রিয়ভাবে পৌঁছায়।
            </p>
          </div>

          {/* Card 2: MediVault */}
          <div className="bg-[#E8F5E9] rounded-2xl p-6 border border-[#D5E8D7] space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-white border border-[#D5E8D7] flex items-center justify-center text-[#2E7D32]">
              <FileText className="w-6 h-6 text-[#2E7D32]" />
            </div>
            <h4 className="text-lg font-bold text-[#171717]">ব্যক্তিগত MediVault ভল্ট</h4>
            <p className="text-xs text-[#555555] leading-relaxed">
              কাগজের প্রেসক্রিপশন হারানোর ভয় নেই। সমস্ত প্রেসক্রিপশন, রক্তের রিপোর্ট ও টেস্ট ইতিহাস রোগীর ব্যক্তিগত ভল্টে সুরক্ষিত থাকে।
            </p>
          </div>

          {/* Card 3: Bed radar */}
          <div className="bg-[#E8F5E9] rounded-2xl p-6 border border-[#D5E8D7] space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-white border border-[#D5E8D7] flex items-center justify-center text-[#2E7D32]">
              <Bed className="w-6 h-6 text-[#2E7D32]" />
            </div>
            <h4 className="text-lg font-bold text-[#171717]">লাইভ আইসিইউ বেড অনুসন্ধান</h4>
            <p className="text-xs text-[#555555] leading-relaxed">
              হাসপাতালে হাসপাতালে ঘুরে সময় নষ্ট নয়; পানিহাটি ও দমদম অঞ্চলের যাচাইকৃত জরুরি বেড ও আইসিইউ স্থিতি সরাসরি জানুন।
            </p>
          </div>
        </div>
      </section>

      {/* 4. MEDIVAULT & EMERGENCY SPOTLIGHT FEATURE WITH IMAGERY */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#D5E8D7]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Visual Image */}
          <div className="bg-[#E8F5E9] p-4 rounded-3xl border border-[#D5E8D7] shadow-sm">
            <img
              src="/images/medivault_vault.jpg"
              alt="MediVault secure digital health records illustration"
              className="w-full h-72 sm:h-80 object-cover rounded-2xl"
            />
          </div>

          {/* Right: Description Box */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
              <span>Digital Health Locker</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#171717]">
              {language === 'bn' ? 'সম্পূর্ণ নিরাপদ ও রোগী-নিয়ন্ত্রিত তথ্য সুরক্ষা' : 'Privacy-First, Patient-Controlled Medical Storage'}
            </h3>
            <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
              {language === 'bn'
                ? 'হাসপাতালে ডাক্তার দেখানোর সময় পুরো ফাইল বয়ে বেড়ানোর প্রয়োজন নেই। যেকোনো সময় নির্দিষ্ট সময়সীমার টোকেন তৈরি করে ডাক্তারের সাথে নিরাপদে ফাইল শেয়ার ও প্রত্যাহার করতে পারবেন।'
                : 'Share specific prescriptions with doctors using time-limited tokens. Access can be immediately revoked anytime from the Patient Portal in strict alignment with DPDP guidelines.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigateTo('medical-vault')}
                className="px-6 py-3 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                {language === 'bn' ? 'মেডিকেল ভল্ট খুলুন' : 'Open MediVault'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION / REGISTRATION BANNER */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#D5E8D7]">
        <div className="rounded-3xl bg-[#E8F5E9] p-8 sm:p-12 border border-[#D5E8D7] flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-2 max-w-2xl text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32]">
              {language === 'bn' ? 'সম্পূর্ণ বিনামূল্যে যুক্ত হোন' : 'Free Patient Registration'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#171717]">
              {language === 'bn'
                ? 'আপনার পরিবার ও নিজের জন্য তৈরি করুন ডিজিটাল স্বাস্থ্য বলয়'
                : 'Create a Safe, Connected Health Account Today'}
            </h3>
            <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
              {language === 'bn'
                ? 'ফোন নম্বর দিয়ে সহজে অ্যাকাউন্ট খুলুন, প্রেসক্রিপশন সংরক্ষণ করুন এবং জরুরি স্বাস্থ্য সেবায় এক ক্লিকে সংযুক্ত থাকুন।'
                : 'Sign up in seconds with your phone number, organize your medical vault, and discover nearby verified emergency care.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={() => navigateTo('register')}
              className="px-8 py-3.5 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white font-black text-sm shadow-sm transition-all text-center"
            >
              {language === 'bn' ? 'নতুন একাউন্ট তৈরি করুন' : 'Create Free Account'}
            </button>
            <button
              onClick={() => navigateTo('login')}
              className="px-8 py-3.5 rounded-xl bg-white hover:bg-[#F1F8F2] text-[#171717] font-bold text-sm border border-[#D5E8D7] transition-all text-center"
            >
              {language === 'bn' ? 'লগইন করুন' : 'Sign In'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
