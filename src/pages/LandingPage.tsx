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
  Users,
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
    <div className="min-h-screen bg-slate-50">
      {/* 1. CLEAN HEALTHCARE HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-teal-950 to-navy-950 text-white pt-16 pb-20 px-4 sm:px-6">
        {/* Ambient subtle glow background */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-12">
          {/* Hero Top Content */}
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 bg-teal-800/60 border border-teal-500/40 px-4 py-1.5 rounded-full text-xs font-semibold text-teal-200 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>
                {language === 'bn'
                  ? 'প্রবীণ স্বাস্থ্যসেবা, মেডিকেল ভল্ট ও সমন্বিত জরুরি প্ল্যাটফর্ম'
                  : 'Integrated Elderly Care, MediVault & Emergency Response'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              <span className="text-white block font-bengali">
                {language === 'bn' ? 'সুস্থায়ন' : 'Susthayan Healthcare'}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-200 to-emerald-300 text-2xl sm:text-3xl lg:text-4xl block mt-2 font-bold">
                {language === 'bn'
                  ? 'আপনার স্বাস্থ্য, আপনার নিরাপত্তা, পরিবার সবসময় পাশে'
                  : 'Your Health, Your Safety, Your Family — Always Connected.'}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-teal-100/90 leading-relaxed max-w-3xl mx-auto font-light">
              {language === 'bn'
                ? 'একা বসবাসকারী প্রবীণ নাগরিকদের ব্যক্তিগত মেডিকেল রেকর্ড নিরাপদ রাখা, জরুরি মুহূর্তে নিকটস্থ হাসপাতাল ও বেড অনুসন্ধান এবং তাৎক্ষণিক পরিবারের সাথে সংযুক্ত হওয়ার নির্ভরযোগ্য সমাধান।'
                : 'Empowering elderly patients with private MediVault record storage, GPS-enabled hospital & bed discovery, and instant 1-tap emergency coordination.'}
            </p>

            {/* Main Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-4 items-center justify-center">
              <button
                onClick={() => navigateTo('emergency-sos')}
                className="flex items-center space-x-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 text-white font-extrabold text-sm shadow-emergency transform hover:-translate-y-0.5 transition-all"
              >
                <AlertOctagon className="w-5 h-5 animate-pulse" />
                <span>{language === 'bn' ? 'জরুরি এসওএস (SOS)' : 'Emergency SOS'}</span>
              </button>

              <button
                onClick={() => navigateTo('nearby-hospitals')}
                className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md transition-all"
              >
                <MapPin className="w-4 h-4" />
                <span>{language === 'bn' ? 'নিকটস্থ হাসপাতাল খুঁজুন' : 'Find Nearby Hospitals'}</span>
              </button>

              <button
                onClick={() => navigateTo('medical-vault')}
                className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-200 border border-teal-500/30 text-sm font-bold transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>{language === 'bn' ? 'মেডিকেল ভল্ট (MediVault)' : 'Medical Vault'}</span>
              </button>

              <button
                onClick={handleAudioSummary}
                className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-teal-300 border border-slate-700 transition-colors"
                title="Voice Narration"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 4 Primary Patient Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            {/* Card 1: MediVault */}
            <div
              onClick={() => navigateTo('medical-vault')}
              className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-5 backdrop-blur-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1 flex items-center justify-between">
                <span>{language === 'bn' ? 'মেডিকেল রেকর্ড ভল্ট' : 'MediVault Storage'}</span>
                <ChevronRight className="w-4 h-4 text-teal-300" />
              </h3>
              <p className="text-xs text-teal-100/70">
                {language === 'bn' ? 'প্রেসক্রিপশন ও রিপোর্ট সম্পূর্ণ নিরাপদে সংরক্ষণ ও প্রিভিউ করুন।' : 'Securely store and preview prescriptions, lab reports & scans.'}
              </p>
            </div>

            {/* Card 2: Document Upload */}
            <div
              onClick={() => navigateTo('upload-document')}
              className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-5 backdrop-blur-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1 flex items-center justify-between">
                <span>{language === 'bn' ? 'নতুন নথি আপলোড' : 'Upload Documents'}</span>
                <ChevronRight className="w-4 h-4 text-cyan-300" />
              </h3>
              <p className="text-xs text-teal-100/70">
                {language === 'bn' ? 'PDF, JPG ও PNG ফাইল সহজে আপলোড ও ক্যাটাগরি অনুযায়ী গুছিয়ে রাখুন।' : 'Fast upload for PDF, JPG & PNG documents with instant categorization.'}
              </p>
            </div>

            {/* Card 3: Live Hospital Bed Radar */}
            <div
              onClick={() => navigateTo('nearby-hospitals')}
              className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-5 backdrop-blur-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Bed className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1 flex items-center justify-between">
                <span>{language === 'bn' ? 'নিকটস্থ হাসপাতাল ও বেড' : 'Hospitals & Beds'}</span>
                <ChevronRight className="w-4 h-4 text-emerald-300" />
              </h3>
              <p className="text-xs text-teal-100/70">
                {language === 'bn' ? 'পানিহাটি ও দমদম অঞ্চলের প্রকৃত দূরত্ব ও জরুরি বেড স্ট্যাটাস।' : 'Verified nearby facilities with live distance, map and bed status.'}
              </p>
            </div>

            {/* Card 4: AI Health Assistance */}
            <div
              onClick={() => navigateTo('ai-checkin')}
              className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-5 backdrop-blur-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1 flex items-center justify-between">
                <span>{language === 'bn' ? 'এআই স্বাস্থ্য চেক-ইন' : 'AI Health Check-in'}</span>
                <ChevronRight className="w-4 h-4 text-purple-300" />
              </h3>
              <p className="text-xs text-teal-100/70">
                {language === 'bn' ? 'উপসর্গভিত্তিক প্রাথমিক নির্দেশনা ও ওষুধের মিথস্ক্রিয়া পরীক্ষা।' : 'Symptom assessment guidance and multi-drug interaction checker.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTEGRATED NEARBY HOSPITALS PREVIEW SECTION */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-soft space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-700 flex items-center space-x-1.5">
                <Navigation className="w-3.5 h-3.5" />
                <span>Verified Regional Healthcare Radar</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy-950 mt-1">
                {language === 'bn' ? 'নিকটস্থ যাচাইকৃত হাসপাতাল ও জরুরি বেড' : 'Nearby Verified Hospitals & Emergency Beds'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'bn'
                  ? 'পানিহাটি এবং দমদম অঞ্চলের যাচাইকৃত প্রকৃত হাসপাতালের তালিকা ও লাইভ জরুরি বেডের স্থিতি।'
                  : 'Real, verified facilities around Panihati and Dum Dum with direct phone numbers and verified bed capacity.'}
              </p>
            </div>

            {/* Location Quick Switcher */}
            <div className="flex items-center bg-slate-100 p-1.5 rounded-xl space-x-1 shrink-0">
              <button
                type="button"
                onClick={() => handleSelectArea('Panihati, West Bengal')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  previewLocation.includes('Panihati')
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Panihati (পানিহাটি)
              </button>
              <button
                type="button"
                onClick={() => handleSelectArea('Dum Dum, West Bengal')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  previewLocation.includes('Dum Dum')
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
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
                className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-slate-200">
                      {hosp.type}
                    </span>
                    <span className="text-xs font-black text-teal-800">
                      📍 {hosp.distanceKm} km
                    </span>
                  </div>

                  <h4 className="text-base font-black text-navy-950 line-clamp-1">{hosp.name}</h4>
                  <p className="text-xs text-teal-800 font-bold font-bengali">{hosp.nameBn}</p>
                  <p className="text-xs text-slate-500 line-clamp-2">{hosp.address}</p>

                  {/* Bed status */}
                  <div className="pt-2">
                    {hosp.isBedVerified ? (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center justify-between">
                        <span>জরুরি বেড খালি:</span>
                        <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-xs">
                          {hosp.availableBeds} টি
                        </span>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-slate-200/80 border border-slate-300 rounded-xl text-[11px] font-semibold text-slate-700">
                        Availability not verified — contact hospital
                      </div>
                    )}
                  </div>
                </div>

                {/* Call & Direct Buttons */}
                <div className="pt-3 border-t border-slate-200/60 flex items-center space-x-2 text-xs">
                  <a
                    href={`tel:${hosp.phone.replace(/[^0-9+]/g, '')}`}
                    className="flex-1 text-center py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center justify-center space-x-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>কল করুন</span>
                  </a>
                  <a
                    href={hosp.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-bold"
                    title="Google Maps"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
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
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-navy-950 hover:bg-teal-900 text-white rounded-xl text-xs font-black shadow-md transition-all"
            >
              <span>{language === 'bn' ? 'সকল ১০টি যাচাইকৃত হাসপাতাল ও লাইভ ম্যাপ দেখুন' : 'View All 10+ Hospitals on Live Map'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. SENIOR CITIZEN CHALLENGES & SUSTHAYAN SOLUTIONS */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-700">
            {language === 'bn' ? 'প্রবীণ স্বাস্থ্য সুরক্ষা' : 'Why Susthayan'}
          </h2>
          <h3 className="text-3xl font-black text-navy-950">
            {language === 'bn' ? 'কেন সুস্থায়ন প্রবীণদের জন্য অপরিহার্য?' : 'Designed for Elderly Care & Emergencies'}
          </h3>
          <p className="text-sm text-slate-600">
            {language === 'bn'
              ? 'সন্তানেরা দূরে থাকলেও বাবা-মায়ের চিকিৎসা এবং জরুরি সেবা এক ক্লিকে নিশ্চিত করার আধুনিক প্রযুক্তি।'
              : 'Empowering seniors and distant relatives with transparent, fast, and secure health coordination.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-navy-950">জরুরি ৩ সেকেন্ড এসওএস</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              জরুরি মুহূর্তে একা থাকলে ১ ক্লিকে নিকটস্থ হাসপাতাল এবং অভিভাবকের ফোনে জিপিএস অবস্থান ও অ্যালার্জি তথ্য স্বয়ংক্রিয়ভাবে পৌঁছায়।
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-navy-950">ব্যক্তিগত MediVault ভল্ট</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              কাগজের প্রেসক্রিপশন হারানোর ভয় নেই। সমস্ত প্রেসক্রিপশন, রক্তের রিপোর্ট ও টেস্ট ইতিহাস রোগীর ব্যক্তিগত ভল্টে সুরক্ষিত থাকে।
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
              <Bed className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-navy-950">লাইভ আইসিইউ বেড অনুসন্ধান</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              হাসপাতালে হাসপাতালে ঘুরে সময় নষ্ট নয়; পানিহাটি ও দমদম অঞ্চলের যাচাইকৃত জরুরি বেড ও আইসিইউ স্থিতি সরাসরি জানুন।
            </p>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION / REGISTRATION BANNER */}
      <section className="py-16 px-4 sm:px-6 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-teal-900 via-teal-950 to-navy-950 p-8 sm:p-12 border border-teal-500/30 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
              {language === 'bn' ? 'সম্পূর্ণ বিনামূল্যে যুক্ত হোন' : 'Free Patient Registration'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              {language === 'bn'
                ? 'আপনার পরিবার ও নিজের জন্য তৈরি করুন ডিজিটাল স্বাস্থ্য বলয়'
                : 'Create a Safe, Connected Health Account Today'}
            </h3>
            <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
              {language === 'bn'
                ? 'ফোন নম্বর দিয়ে সহজে অ্যাকাউন্ট খুলুন, প্রেসক্রিপশন সংরক্ষণ করুন এবং জরুরি স্বাস্থ্য সেবায় এক ক্লিকে সংযুক্ত থাকুন।'
                : 'Sign up in seconds with your phone number, organize your medical vault, and discover nearby verified emergency care.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 w-full lg:w-auto">
            <button
              onClick={() => navigateTo('register')}
              className="px-8 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-black text-sm shadow-lg transition-all text-center"
            >
              {language === 'bn' ? 'নতুন একাউন্ট তৈরি করুন' : 'Create Free Account'}
            </button>
            <button
              onClick={() => navigateTo('login')}
              className="px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-600 transition-all text-center"
            >
              {language === 'bn' ? 'লগইন করুন' : 'Sign In'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
