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
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 flex items-center justify-center relative overflow-hidden">
      {/* Background glowing medical grid accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-xl w-full bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative z-10 text-white">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold border border-teal-500/30">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            <span>Authorized Healthcare Personnel Only</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {language === 'bn' ? 'হাসপাতাল ট্রায়াজ ও ইআর পোর্টাল' : 'Hospital Emergency Staff Portal'}
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {language === 'bn'
              ? 'অনুমোদিত জরুরি চিকিৎসক ও ট্রায়াজ ডেস্ক কর্মীদের জন্য সংরক্ষিত প্রবেশদ্বার।'
              : 'Sign in to review incoming emergency SOS requests, verify ICU beds, and coordinate life-saving triage.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('quick')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'quick'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'দ্রুত পরীক্ষামূলক লগইন (Demo)' : 'Quick Demo Staff Login'}</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'custom'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'আইডি ও পাসওয়ার্ড' : 'Staff Credentials'}</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-600/50 text-rose-200 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {activeTab === 'quick' ? (
          /* Quick Demo Staff Logins */
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>{language === 'bn' ? 'যাচাইকৃত হাসপাতাল নির্বাচন করুন:' : 'Select Verified Partner Hospital:'}</span>
              <span className="text-[10px] font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                Multi-Tenant Isolated
              </span>
            </div>

            <div className="space-y-2.5">
              {hospitalStaffAccounts.map(account => (
                <div
                  key={account.id}
                  onClick={() => handleQuickLogin(account.id)}
                  className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="space-y-1 min-w-0 pr-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors truncate">
                        {account.hospitalName}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {account.hospitalId}
                      </span>
                    </div>
                    <p className="text-xs text-teal-400 font-medium">
                      {account.fullName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {account.designation} • 📞 {account.phone}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shrink-0 flex items-center space-x-1 shadow-sm"
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
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {language === 'bn' ? 'হাসপাতাল স্টাফ ইউজারনেম / ইমেইল *' : 'Staff Username or Email *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="panihati.er or sagoredutta.er"
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {language === 'bn' ? 'পাসওয়ার্ড (Password) *' : 'Staff Password *'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-black text-sm rounded-xl shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>{language === 'bn' ? 'হাসপাতাল পোর্টালে লগইন করুন' : 'Sign In to Hospital Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Security and Tenant Notice */}
        <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center text-teal-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-teal-400 shrink-0" />
            <span>Patient-Controlled Confidentiality Rule:</span>
          </div>
          <p>
            Hospital staff can strictly access medical records only when an active, unexpired, unrevoked consent grant exists from the patient.
          </p>
        </div>

        {/* Return to Patient Portal Link */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span>{language === 'bn' ? 'আপনি কি একজন রোগী বা অভিভাবক?' : 'Are you a patient or family guardian?'}</span>{' '}
          <button
            onClick={() => navigateTo('login')}
            className="font-bold text-teal-400 hover:text-teal-300 hover:underline"
          >
            {language === 'bn' ? 'রোগী পোর্টালে ফিরে যান (Patient Portal)' : 'Go to Patient Portal'}
          </button>
        </div>
      </div>
    </div>
  );
};
