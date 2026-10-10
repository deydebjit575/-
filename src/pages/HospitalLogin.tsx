import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Lock,
  User,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Heart,
  Stethoscope,
  Activity,
  Sparkles
} from 'lucide-react';

export const HospitalLogin: React.FC = () => {
  const { language } = useLanguage();
  const { hospitalStaffAccounts, loginHospitalStaff, navigateTo } = useApp();

  const [selectedStaffId, setSelectedStaffId] = useState(hospitalStaffAccounts[0]?.id || 'staff-pan-1');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'quick' | 'custom'>('quick');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const matched = hospitalStaffAccounts.find(
      a => a.username.toLowerCase() === usernameInput.trim().toLowerCase() ||
           a.email.toLowerCase() === usernameInput.trim().toLowerCase() ||
           a.phone.replace(/[\s\-]/g, '') === usernameInput.trim().replace(/[\s\-]/g, '')
    );

    if (!matched) {
      setErrorMsg('No authorized hospital staff record found for this username/email.');
      return;
    }

    loginHospitalStaff(matched.id);
  };

  const handleQuickLogin = (staffId: string) => {
    loginHospitalStaff(staffId);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 flex items-center justify-center relative">
      <div className="max-w-xl w-full bg-[#E8F5E9] border border-[#D5E8D7] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 relative z-10 text-[#171717]">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center mx-auto shadow-md">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-white text-[#2E7D32] text-[11px] font-bold border border-[#D5E8D7]">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#2E7D32]" />
            <span>Authorized Healthcare Personnel Only</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
            {language === 'bn' ? 'হাসপাতাল ট্রায়াজ ও ইআর পোর্টাল' : 'Hospital Emergency Staff Portal'}
          </h1>
          <p className="text-xs text-[#555555] max-w-md mx-auto">
            {language === 'bn'
              ? 'অনুমোদিত জরুরি চিকিৎসক ও ট্রায়াজ ডেস্ক কর্মীদের জন্য সংরক্ষিত প্রবেশদ্বার।'
              : 'Sign in to review incoming emergency SOS requests, verify ICU beds, and coordinate life-saving triage.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-white rounded-2xl border border-[#D5E8D7] text-xs font-bold">
          <button
            onClick={() => setActiveTab('quick')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'quick'
                ? 'bg-[#2E7D32] text-white shadow-sm'
                : 'text-[#555555] hover:text-[#171717]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'দ্রুত পরীক্ষামূলক লগইন (Demo)' : 'Quick Demo Staff Login'}</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'custom'
                ? 'bg-[#2E7D32] text-white shadow-sm'
                : 'text-[#555555] hover:text-[#171717]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'আইডি ও পাসওয়ার্ড' : 'Staff Credentials'}</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {activeTab === 'quick' ? (
          /* Quick Demo Staff Logins */
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#555555] px-1">
              <span>{language === 'bn' ? 'যাচাইকৃত হাসপাতাল নির্বাচন করুন:' : 'Select Verified Partner Hospital:'}</span>
              <span className="text-[10px] font-bold text-[#2E7D32] bg-white px-2 py-0.5 rounded border border-[#D5E8D7]">
                Multi-Tenant Isolated
              </span>
            </div>

            <div className="space-y-2.5">
              {hospitalStaffAccounts.map(account => (
                <div
                  key={account.id}
                  onClick={() => handleQuickLogin(account.id)}
                  className="p-4 rounded-2xl bg-white hover:bg-[#F1F8F2] border border-[#D5E8D7] hover:border-[#2E7D32] cursor-pointer transition-all flex items-center justify-between group shadow-xs"
                >
                  <div className="space-y-1 min-w-0 pr-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-[#171717] group-hover:text-[#2E7D32] transition-colors truncate">
                        {account.hospitalName}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7]">
                        {account.hospitalId}
                      </span>
                    </div>
                    <p className="text-xs text-[#2E7D32] font-semibold">
                      {account.fullName}
                    </p>
                    <p className="text-[11px] text-[#555555]">
                      {account.designation} • 📞 {account.phone}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white font-bold text-xs shrink-0 flex items-center space-x-1 shadow-xs transition-colors"
                  >
                    <span>{language === 'bn' ? 'প্রবেশ' : 'Sign In'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Custom Credentials Login Form */
          <form onSubmit={handleCustomSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                {language === 'bn' ? 'হাসপাতাল স্টাফ ইউজারনেম / ইমেইল *' : 'Staff Username or Email *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#555555] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="panihati.er or sagoredutta.er"
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm text-[#171717] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 font-medium outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                {language === 'bn' ? 'পাসওয়ার্ড (Password) *' : 'Staff Password *'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#555555] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm text-[#171717] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 font-medium outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white font-black text-sm rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <span>{language === 'bn' ? 'হাসপাতাল পোর্টালে লগইন করুন' : 'Sign In to Hospital Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Security and Tenant Notice */}
        <div className="p-3.5 bg-white rounded-2xl border border-[#D5E8D7] text-[11px] text-[#555555] space-y-1">
          <div className="flex items-center text-[#2E7D32] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#2E7D32] shrink-0" />
            <span>Patient-Controlled Confidentiality Rule:</span>
          </div>
          <p>
            Hospital staff can strictly access medical records only when an active, unexpired, unrevoked consent grant exists from the patient.
          </p>
        </div>

        {/* Return to Patient Portal Link */}
        <div className="text-center text-xs text-[#555555] pt-2 border-t border-[#D5E8D7]">
          <span>{language === 'bn' ? 'আপনি কি একজন রোগী বা অভিভাবক?' : 'Are you a patient or family guardian?'}</span>{' '}
          <button
            onClick={() => navigateTo('login')}
            className="font-bold text-[#2E7D32] hover:text-[#256B2A] hover:underline"
          >
            {language === 'bn' ? 'রোগী পোর্টালে ফিরে যান (Patient Portal)' : 'Go to Patient Portal'}
          </button>
        </div>
      </div>
    </div>
  );
};
