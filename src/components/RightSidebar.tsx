import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Layers,
  FileText,
  Upload,
  MapPin,
  ShieldCheck,
  Sparkles,
  Pill,
  Building2,
  AlertOctagon,
  Heart,
  Activity,
  Shield,
  FolderOpen,
  Bell,
  PhoneCall,
  Settings,
  LogIn,
  LogOut,
  User,
  Bed,
  Ambulance,
  X,
  Globe,
  ChevronRight
} from 'lucide-react';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    currentPage,
    navigateTo,
    logout,
    activeEmergencyRequest,
    isLoggedIn,
    patientProfile
  } = useApp();

  const { language, setLanguage, t } = useLanguage();

  const isHospitalStaff = currentUser?.role === 'hospital_staff';
  const displayName = isHospitalStaff
    ? currentUser?.displayName || 'Emergency Staff'
    : patientProfile.fullName || currentUser?.displayName || (language === 'bn' ? 'প্রবীণ নাগরিক' : 'Patient');

  const handleNav = (page: string) => {
    navigateTo(page);
    onClose();
  };

  // 1. Core Patient Navigation items (As specifically listed in requirements)
  const corePatientNavItems = [
    { page: 'dashboard', label: language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard', icon: Layers },
    { page: 'medical-vault', label: language === 'bn' ? 'মেডিকেল ভল্ট' : 'MediVault', icon: FileText },
    { page: 'upload-document', label: language === 'bn' ? 'নথি আপলোড' : 'Upload Documents', icon: Upload },
    { page: 'nearby-hospitals', label: language === 'bn' ? 'নিকটস্থ হাসপাতাল' : 'Nearby Hospitals', icon: MapPin },
    { page: 'share-records', label: language === 'bn' ? 'শেয়ার ও অনুমতি' : 'Share & Consent', icon: ShieldCheck },
    { page: 'ai-checkin', label: language === 'bn' ? 'এআই চেক-ইন' : 'AI Check-in', icon: Sparkles },
    { page: 'drug-checker', label: language === 'bn' ? 'ওষুধ পরীক্ষক' : 'Drug Checker', icon: Pill },
  ];

  // 2. Hospital Staff specific links
  const hospitalStaffNavItems = [
    { page: 'hospital-dashboard', label: language === 'bn' ? 'ইআর ট্রায়াজ ড্যাশবোর্ড' : 'Hospital Portal', icon: Building2 },
    { page: 'bed-management', label: language === 'bn' ? 'বেড ব্যবস্থাপনা' : 'Bed Management', icon: Bed },
    { page: 'ambulance-coordination', label: language === 'bn' ? 'অ্যাম্বুলেন্স সমন্বয়' : 'Ambulance Coordination', icon: Ambulance },
    { page: 'nearby-hospitals', label: language === 'bn' ? 'হাসপাতাল নেটওয়ার্ক' : 'Hospitals Directory', icon: MapPin },
    { page: 'emergency-sos', label: language === 'bn' ? 'জরুরি SOS ভিউ' : 'Emergency SOS', icon: AlertOctagon },
  ];

  // 3. Extended Records & Health links
  const extendedPatientRecords = [
    { page: 'timeline', label: language === 'bn' ? 'চিকিৎসা ইতিহাস' : 'Medical Timeline', icon: Activity },
    { page: 'insurance-vault', label: language === 'bn' ? 'বীমা ও স্বাস্থ্য প্রকল্প' : 'Insurance & Schemes', icon: Shield },
    { page: 'id-vault', label: language === 'bn' ? 'পরিচয়পত্র ভল্ট' : 'ID Document Vault', icon: FolderOpen },
    { page: 'notifications', label: language === 'bn' ? 'বিজ্ঞপ্তি' : 'Notifications', icon: Bell },
  ];

  // 4. Public visitor links
  const publicNavItems = [
    { page: 'landing', label: language === 'bn' ? 'মূল পাতা' : 'Home', icon: Layers },
    { page: 'nearby-hospitals', label: language === 'bn' ? 'নিকটস্থ হাসপাতাল' : 'Nearby Hospitals', icon: MapPin },
    { page: 'help', label: language === 'bn' ? 'জরুরি হেল্পলাইন' : 'Help & 112', icon: PhoneCall },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white divide-y divide-[#D5E8D7]">
      {/* Top Header / Title with Language Switcher */}
      <div className="p-4 bg-[#F1F8F2] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] animate-pulse" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1b4332]">
            {language === 'bn' ? 'ন্যাভিগেশন মেনু' : 'Navigation Menu'}
          </h2>
        </div>

        {/* Bengali / English Language Segmented Toggle */}
        <div className="flex items-center bg-[#E8F5E9] border border-[#D5E8D7] rounded-lg p-0.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setLanguage('bn')}
            className={`px-2 py-0.5 rounded transition-all ${
              language === 'bn'
                ? 'bg-[#2E7D32] text-white font-bold shadow-xs'
                : 'text-[#555555] hover:text-[#171717]'
            }`}
            title="বাংলা ভাষায় পরিবর্তন করুন"
          >
            বাংলা
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded transition-all ${
              language === 'en'
                ? 'bg-[#2E7D32] text-white font-bold shadow-xs'
                : 'text-[#555555] hover:text-[#171717]'
            }`}
            title="Switch to English"
          >
            EN
          </button>
        </div>
      </div>

      {/* Main Scrollable Nav List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* Prominent SOS Button */}
        <div>
          <button
            type="button"
            onClick={() => handleNav('emergency-sos')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-white font-black text-xs shadow-sm transition-all ${
              activeEmergencyRequest
                ? 'bg-[#D32F2F] hover:bg-[#B71C1C] animate-sos-pulse'
                : 'bg-[#D32F2F] hover:bg-[#B71C1C]'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <AlertOctagon className="w-4 h-4 text-white animate-bounce shrink-0" />
              <span className="tracking-wide">
                {language === 'bn' ? 'জরুরি এসওএস (SOS)' : 'Emergency SOS'}
              </span>
            </div>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
              3s 🚨
            </span>
          </button>
        </div>

        {/* Portal Switcher Button */}
        {!isHospitalStaff ? (
          <div>
            <button
              type="button"
              onClick={() => handleNav('hospital-dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                currentPage === 'hospital-dashboard'
                  ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#2E7D32]'
                  : 'bg-[#F1F8F2] hover:bg-[#E8F5E9] text-[#2E7D32] border-[#D5E8D7]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                <span>{language === 'bn' ? 'হাসপাতাল পোর্টাল' : 'Hospital Portal'}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#2E7D32]" />
            </button>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => handleNav('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                currentPage === 'dashboard'
                  ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#2E7D32]'
                  : 'bg-[#F1F8F2] hover:bg-[#E8F5E9] text-[#2E7D32] border-[#D5E8D7]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-[#2E7D32] shrink-0" />
                <span>{language === 'bn' ? 'রোগী পোর্টাল' : 'Patient Portal'}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#2E7D32]" />
            </button>
          </div>
        )}

        {/* Main Navigation Section */}
        <div className="space-y-1">
          <p className="px-2 text-[10px] font-extrabold text-[#777777] uppercase tracking-wider">
            {isHospitalStaff
              ? (language === 'bn' ? 'ইআর ও ট্রায়াজ সেবা' : 'Hospital ER Tools')
              : (language === 'bn' ? 'প্রধান ন্যাভিগেশন' : 'Main Navigation')}
          </p>

          {(isHospitalStaff ? hospitalStaffNavItems : isLoggedIn ? corePatientNavItems : publicNavItems).map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                type="button"
                onClick={() => handleNav(item.page)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                  isActive
                    ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7] font-bold shadow-xs'
                    : 'text-[#555555] hover:text-[#171717] hover:bg-[#F1F8F2] border border-transparent font-medium'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#2E7D32]' : 'text-[#555555]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] shrink-0 ml-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Extended Records & Tools (Shown for logged in patients) */}
        {isLoggedIn && !isHospitalStaff && (
          <div className="space-y-1 pt-2 border-t border-[#D5E8D7]">
            <p className="px-2 text-[10px] font-extrabold text-[#777777] uppercase tracking-wider">
              {language === 'bn' ? 'রেকর্ড ও সুরক্ষা ভল্ট' : 'Records & Security'}
            </p>
            {extendedPatientRecords.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => handleNav(item.page)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                    isActive
                      ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7] font-bold shadow-xs'
                      : 'text-[#555555] hover:text-[#171717] hover:bg-[#F1F8F2] border border-transparent font-medium'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#2E7D32]' : 'text-[#777777]'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] shrink-0 ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Common Utility Links */}
        <div className="space-y-1 pt-2 border-t border-[#D5E8D7]">
          <p className="px-2 text-[10px] font-extrabold text-[#777777] uppercase tracking-wider">
            {language === 'bn' ? 'সহায়তা ও সেটিংস' : 'Support & Settings'}
          </p>
          <button
            type="button"
            onClick={() => handleNav('help')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
              currentPage === 'help'
                ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7] font-bold'
                : 'text-[#555555] hover:text-[#171717] hover:bg-[#F1F8F2] font-medium'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#555555] shrink-0" />
            <span className="truncate">{language === 'bn' ? 'সাহায্য ও জরুরি নম্বর' : 'Help & Helplines'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleNav('settings')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
              currentPage === 'settings'
                ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7] font-bold'
                : 'text-[#555555] hover:text-[#171717] hover:bg-[#F1F8F2] font-medium'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-[#555555] shrink-0" />
            <span className="truncate">{language === 'bn' ? 'গোপনীয়তা ও সেটিংস' : 'Privacy & Settings'}</span>
          </button>
        </div>
      </div>

      {/* User Status / Account Footer */}
      <div className="p-3 bg-[#F1F8F2]">
        {isLoggedIn ? (
          <div className="space-y-2">
            <div
              onClick={() => handleNav(isHospitalStaff ? 'hospital-dashboard' : 'profile')}
              className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-white cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white bg-[#2E7D32] shrink-0">
                {displayName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#171717] truncate">{displayName}</p>
                <p className="text-[10px] text-[#555555] truncate font-mono">
                  {currentUser?.email || patientProfile.phone || currentUser?.phone || ''}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors border border-rose-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'লগআউট' : 'Sign Out'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => handleNav('login')}
              className="w-full py-2 px-3 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'রোগী লগইন' : 'Patient Sign In'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleNav('hospital-login')}
              className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7] text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>{language === 'bn' ? 'হাসপাতাল লগইন' : 'Hospital Sign In'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. DESKTOP RIGHT SIDEBAR (Always Docked on the Right Side) */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 border-l border-[#D5E8D7] bg-white sticky top-[73px] h-[calc(100vh-73px)] overflow-hidden z-20 shadow-xs">
        {sidebarContent}
      </aside>

      {/* 2. MOBILE / TABLET RIGHT DRAWER (Sliding in from Right) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative w-72 sm:w-80 max-w-[85vw] h-full bg-white shadow-2xl z-50 flex flex-col border-l border-[#D5E8D7] animate-in slide-in-from-right duration-200">
            {/* Mobile close button header */}
            <div className="flex items-center justify-between p-3.5 border-b border-[#D5E8D7] bg-white">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-[#2E7D32] flex items-center justify-center text-white">
                  <Heart className="w-4 h-4 fill-white" />
                </div>
                <span className="font-bold text-xs text-[#171717]">
                  {language === 'bn' ? 'সুস্থায়ন মেনু' : 'Susthayan Menu'}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#555555] hover:text-[#171717] hover:bg-[#F1F8F2]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
