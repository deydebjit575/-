import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Heart,
  AlertOctagon,
  Building2,
  FileText,
  MapPin,
  LogOut,
  Globe,
  Volume2,
  PhoneCall,
  Menu,
  X,
  Sparkles,
  Layers,
  Upload,
  Pill,
  LogIn,
  ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentPage,
    navigateTo,
    logout,
    activeEmergencyRequest,
    isLoggedIn,
    patientProfile
  } = useApp();

  const {
    language,
    setLanguage,
    t,
    speak,
    fontSizeMultiplier,
    setFontSizeMultiplier
  } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isHospitalStaff = currentUser?.role === 'hospital_staff';
  const displayName = isHospitalStaff
    ? currentUser?.displayName || 'Emergency Staff'
    : patientProfile.fullName || currentUser?.displayName || (language === 'bn' ? 'প্রবীণ নাগরিক' : 'Patient');

  const handleVoiceWelcome = () => {
    if (language === 'bn') {
      speak(`সুস্থায়ন প্ল্যাটফর্মে স্বাগতম ${displayName}। আপনার মেডিকেল ভল্ট ও নিকটস্থ হাসপাতালের তথ্য এখানে প্রস্তুত আছে।`);
    } else {
      speak(`Welcome to Susthayan ${displayName}. Your medical vault and nearby hospital beds are ready.`);
    }
  };

  // Logged-in Patient Links
  const patientNavLinks = [
    { page: 'dashboard', label: language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard', icon: Layers },
    { page: 'medical-vault', label: language === 'bn' ? 'মেডিকেল ভল্ট' : 'MediVault', icon: FileText },
    { page: 'upload-document', label: language === 'bn' ? 'নথি আপলোড' : 'Upload Documents', icon: Upload },
    { page: 'nearby-hospitals', label: language === 'bn' ? 'নিকটস্থ হাসপাতাল' : 'Nearby Hospitals', icon: MapPin },
    { page: 'share-records', label: language === 'bn' ? 'শেয়ার ও অনুমতি' : 'Share & Consent', icon: ShieldCheck },
    { page: 'ai-checkin', label: language === 'bn' ? 'এআই চেক-ইন' : 'AI Check-in', icon: Sparkles },
    { page: 'drug-checker', label: language === 'bn' ? 'ওষুধ পরীক্ষক' : 'Drug Checker', icon: Pill },
  ];

  // Hospital Staff Links
  const hospitalStaffNavLinks = [
    { page: 'hospital-dashboard', label: language === 'bn' ? 'ইআর ট্রায়াজ ড্যাশবোর্ড' : 'Hospital Portal', icon: Building2 },
    { page: 'nearby-hospitals', label: language === 'bn' ? 'হাসপাতাল নেটওয়ার্ক' : 'Hospitals Directory', icon: MapPin },
    { page: 'emergency-sos', label: language === 'bn' ? 'জরুরি SOS ভিউ' : 'Emergency SOS', icon: AlertOctagon },
  ];

  // Public Nav Links
  const publicNavLinks = [
    { page: 'landing', label: language === 'bn' ? 'মূল পাতা' : 'Home', icon: Layers },
    { page: 'nearby-hospitals', label: language === 'bn' ? 'নিকটস্থ হাসপাতাল' : 'Nearby Hospitals', icon: MapPin },
    { page: 'help', label: language === 'bn' ? 'জরুরি হেল্পলাইন' : 'Help & 112', icon: PhoneCall },
  ];

  const visibleLinks = isHospitalStaff
    ? hospitalStaffNavLinks
    : isLoggedIn
    ? patientNavLinks
    : publicNavLinks;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#D5E8D7] shadow-sm">
      {/* Top Senior Accessibility & Emergency Ribbon */}
      <div className="bg-[#1b4332] text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Emergency Hotline Direct Click */}
          <div className="flex items-center space-x-3 text-white">
            <span className="flex items-center text-rose-300 font-semibold animate-pulse">
              <PhoneCall className="w-3.5 h-3.5 mr-1 text-rose-400" />
              {language === 'bn' ? 'জাতীয় জরুরি সাড়া:' : 'National Emergency:'}
            </span>
            <a
              href="tel:112"
              className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold px-2.5 py-0.5 rounded text-xs tracking-wider transition-colors shadow-sm"
              title="Call India Emergency 112"
            >
              📞 112 / 108
            </a>
            <span className="hidden md:inline text-emerald-300/40">|</span>
            <span className="hidden md:inline text-emerald-100">
              {language === 'bn' ? 'প্রবীণ নাগরিক হেল্পলাইন: ১৪৫৬৭' : 'Senior Citizen Helpline: 14567'}
            </span>
          </div>

          {/* Senior Accessibility Adjustments */}
          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={handleVoiceWelcome}
              className="flex items-center space-x-1 px-2 py-0.5 rounded bg-[#2d6a4f] hover:bg-[#256B2A] text-white transition-colors"
              title="Voice Narration"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'bn' ? 'শুনুন' : 'Audio'}</span>
            </button>

            {/* Font Magnifier */}
            <div className="flex items-center bg-[#2d6a4f] rounded px-1.5 py-0.5 space-x-1">
              <span className="text-emerald-200 text-[10px] uppercase font-bold mr-0.5">ফন্ট:</span>
              <button
                onClick={() => setFontSizeMultiplier(1.0)}
                className={`px-1.5 rounded text-xs ${fontSizeMultiplier === 1.0 ? 'bg-white text-[#1b4332] font-black' : 'text-emerald-100 hover:text-white'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSizeMultiplier(1.15)}
                className={`px-1.5 rounded text-xs ${fontSizeMultiplier === 1.15 ? 'bg-white text-[#1b4332] font-black' : 'text-emerald-100 hover:text-white'}`}
              >
                A+
              </button>
              <button
                onClick={() => setFontSizeMultiplier(1.28)}
                className={`px-1.5 rounded text-xs ${fontSizeMultiplier === 1.28 ? 'bg-white text-[#1b4332] font-black' : 'text-emerald-100 hover:text-white'}`}
              >
                A++
              </button>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center space-x-1 px-2.5 py-0.5 rounded bg-[#2E7D32] hover:bg-[#256B2A] text-white font-medium transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18 py-2.5">
          {/* Susthayan Logo & Brand */}
          <div
            onClick={() => navigateTo(isHospitalStaff ? 'hospital-dashboard' : isLoggedIn ? 'dashboard' : 'landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              {isHospitalStaff ? (
                <Building2 className="w-6 h-6 text-white" />
              ) : (
                <Heart className="w-6 h-6 text-white fill-white" />
              )}
            </div>
            <div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-black tracking-tight text-[#171717] font-bengali">
                  সুস্থায়ন
                </span>
                <span className="text-sm font-bold text-[#2E7D32] uppercase tracking-wider font-sans">
                  Susthayan
                </span>
                {isHospitalStaff && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7]">
                    HOSPITAL PORTAL
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#555555] font-medium hidden sm:block">
                {isHospitalStaff
                  ? (language === 'bn' ? 'হাসপাতাল ট্রায়াজ ও আইসিইউ কমান্ড' : 'Hospital Emergency Triage & ICU Command')
                  : (language === 'bn' ? 'প্রবীণ স্বাস্থ্যসেবা ও জরুরি ব্যবস্থা' : 'MediVault Elder Care & Emergency System')}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {visibleLinks.map(link => {
              const Icon = link.icon;
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => navigateTo(link.page)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7] shadow-xs font-bold'
                      : 'text-[#555555] hover:text-[#171717] hover:bg-[#F1F8F2]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#2E7D32]' : 'text-[#555555]'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2.5">
            {/* Direct Hospital Portal Switcher Button */}
            {!isHospitalStaff ? (
              <button
                onClick={() => navigateTo('hospital-dashboard')}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#E8F5E9] hover:bg-[#D5E8D7] text-[#2E7D32] border border-[#D5E8D7] text-xs font-bold transition-all shadow-xs"
                title="Switch to Hospital Triage Portal"
              >
                <Building2 className="w-4 h-4 text-[#2E7D32]" />
                <span>{language === 'bn' ? 'হাসপাতাল পোর্টাল' : 'Hospital Portal'}</span>
              </button>
            ) : (
              <button
                onClick={() => navigateTo('dashboard')}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#E8F5E9] hover:bg-[#D5E8D7] text-[#2E7D32] border border-[#D5E8D7] text-xs font-bold transition-all shadow-xs"
                title="Switch to Patient Portal"
              >
                <Heart className="w-4 h-4 text-[#2E7D32]" />
                <span>{language === 'bn' ? 'রোগী পোর্টাল' : 'Patient Portal'}</span>
              </button>
            )}

            {/* SOS Trigger */}
            <button
              onClick={() => navigateTo('emergency-sos')}
              className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-white font-bold text-xs tracking-wide shadow-sm transition-all ${
                activeEmergencyRequest
                  ? 'bg-[#D32F2F] hover:bg-[#B71C1C] animate-sos-pulse'
                  : 'bg-[#D32F2F] hover:bg-[#B71C1C]'
              }`}
            >
              <AlertOctagon className="w-4 h-4 text-white animate-bounce" />
              <span className="font-extrabold uppercase">
                {language === 'bn' ? 'জরুরি SOS' : 'SOS'}
              </span>
            </button>

            {isLoggedIn ? (
              /* Profile & User dropdown */
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-[#F1F8F2] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white bg-[#2E7D32] border border-[#D5E8D7]">
                    {displayName.charAt(0)}
                  </div>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg border border-[#D5E8D7] py-2 z-50 animate-in fade-in"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-[#D5E8D7] bg-[#F1F8F2]">
                      <p className="text-xs font-bold text-[#171717] truncate">{displayName}</p>
                      <p className="text-[11px] text-[#555555] font-mono">
                        {currentUser?.email || patientProfile.phone || currentUser?.phone}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7]">
                        {isHospitalStaff ? currentUser?.hospitalName?.split(' ')[0] : patientProfile.location || 'Panihati'}
                      </span>
                    </div>

                    {isHospitalStaff ? (
                      <>
                        <button
                          onClick={() => navigateTo('hospital-dashboard')}
                          className="w-full text-left px-4 py-2 text-xs text-[#171717] hover:bg-[#E8F5E9] flex items-center space-x-2"
                        >
                          <Building2 className="w-4 h-4 text-[#2E7D32]" />
                          <span>{language === 'bn' ? 'হাসপাতাল ড্যাশবোর্ড' : 'Hospital Dashboard'}</span>
                        </button>
                        <button
                          onClick={() => navigateTo('dashboard')}
                          className="w-full text-left px-4 py-2 text-xs text-[#2E7D32] hover:bg-[#E8F5E9] flex items-center space-x-2 font-bold"
                        >
                          <Heart className="w-4 h-4 text-[#2E7D32]" />
                          <span>{language === 'bn' ? 'রোগী পোর্টালে স্যুইচ করুন' : 'Switch to Patient Portal'}</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => navigateTo('dashboard')}
                          className="w-full text-left px-4 py-2 text-xs text-[#171717] hover:bg-[#E8F5E9] flex items-center space-x-2"
                        >
                          <Layers className="w-4 h-4 text-[#2E7D32]" />
                          <span>{language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}</span>
                        </button>
                        <button
                          onClick={() => navigateTo('hospital-dashboard')}
                          className="w-full text-left px-4 py-2 text-xs text-[#2E7D32] hover:bg-[#E8F5E9] flex items-center space-x-2 font-bold"
                        >
                          <Building2 className="w-4 h-4 text-[#2E7D32]" />
                          <span>{language === 'bn' ? 'হাসপাতাল পোর্টাল' : 'Hospital Portal'}</span>
                        </button>
                      </>
                    )}

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2 border-t border-[#D5E8D7]"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{language === 'bn' ? 'লগআউট (Sign Out)' : 'Sign Out'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateTo('login')}
                  className="px-3 py-1.5 text-xs font-bold text-[#171717] hover:bg-[#E8F5E9] rounded-xl transition-colors flex items-center space-x-1 border border-[#D5E8D7]"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>{language === 'bn' ? 'লগইন' : 'Sign In'}</span>
                </button>
                <button
                  onClick={() => navigateTo('hospital-login')}
                  className="px-3 py-1.5 text-xs font-bold bg-[#E8F5E9] hover:bg-[#D5E8D7] text-[#2E7D32] rounded-xl border border-[#D5E8D7] transition-colors flex items-center space-x-1"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>{language === 'bn' ? 'হাসপাতাল' : 'Hospital'}</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#171717] lg:hidden hover:bg-[#F1F8F2]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#2E7D32]" /> : <Menu className="w-6 h-6 text-[#2E7D32]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#D5E8D7] bg-white px-4 pt-2 pb-6 space-y-1.5 animate-in slide-in-from-top-2">
          {/* Quick Portal Switcher for Mobile */}
          <div className="grid grid-cols-2 gap-2 pb-2 mb-2 border-b border-[#D5E8D7]">
            <button
              onClick={() => {
                navigateTo('dashboard');
                setMobileMenuOpen(false);
              }}
              className="py-2 px-3 rounded-xl bg-[#E8F5E9] text-[#2E7D32] font-bold text-xs flex items-center justify-center space-x-1 border border-[#D5E8D7]"
            >
              <Heart className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Patient Portal</span>
            </button>
            <button
              onClick={() => {
                navigateTo('hospital-dashboard');
                setMobileMenuOpen(false);
              }}
              className="py-2 px-3 rounded-xl bg-[#F1F8F2] text-[#2E7D32] font-bold text-xs flex items-center justify-center space-x-1 border border-[#D5E8D7]"
            >
              <Building2 className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Hospital Portal</span>
            </button>
          </div>

          {visibleLinks.map(link => {
            const Icon = link.icon;
            const isActive = currentPage === link.page;
            return (
              <button
                key={link.page}
                onClick={() => {
                  navigateTo(link.page);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive
                    ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7] font-bold'
                    : 'text-[#171717] hover:bg-[#F1F8F2]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#2E7D32]' : 'text-[#555555]'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
