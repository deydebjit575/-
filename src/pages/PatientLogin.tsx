import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp, normalizePhone } from '../context/AppContext';
import {
  Heart,
  Phone,
  Lock,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../types';

export const PatientLogin: React.FC = () => {
  const { language } = useLanguage();
  const { loginWithPhone, switchRole, navigateTo } = useApp();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanPhone = normalizePhone(phone);
    if (!cleanPhone) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে আপনার ফোন নম্বর লিখুন।' : 'Please enter your phone number.');
      return;
    }

    const success = loginWithPhone(cleanPhone, password);
    if (!success) {
      setErrorMsg(language === 'bn' ? 'ফোন নম্বর বা পাসওয়ার্ড সঠিক নয়। নতুন হলে নিবন্ধন করুন।' : 'Invalid phone number or password. Please register if you are new.');
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-[#E8F5E9] rounded-3xl p-6 sm:p-10 border border-[#D5E8D7] shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center mx-auto shadow-sm">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171717] font-bengali">
            {language === 'bn' ? 'সুস্থায়নে লগইন করুন' : 'Sign in to Susthayan'}
          </h1>
          <p className="text-xs text-[#555555]">
            {language === 'bn'
              ? 'আপনার নিবন্ধিত ফোন নম্বর এবং পাসওয়ার্ড দিয়ে প্রবেশ করুন।'
              : 'Sign in with your registered phone number and password.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              {language === 'bn' ? 'ফোন নম্বর *' : 'Phone Number *'}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#555555] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                placeholder="9830012345"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm text-[#171717] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 font-mono font-medium outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              {language === 'bn' ? 'পাসওয়ার্ড *' : 'Password *'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#555555] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm text-[#171717] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 font-medium outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white font-black text-sm rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2"
          >
            <span>{language === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Patient Test Logins for Location-Based Testing */}
        <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] space-y-2.5 text-center">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#555555] uppercase tracking-wider block">
              {language === 'bn' ? 'টেস্ট রোগী লগইন (অবস্থান পরীক্ষা):' : 'Location Test Logins (Acceptance 1 & 2):'}
            </span>
            <span className="text-[10px] text-[#2E7D32] font-bold">1-Click</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => loginWithPhone('9830011111', '1234')}
              className="p-2.5 bg-[#F1F8F2] border border-[#D5E8D7] hover:border-[#2E7D32] hover:bg-[#E8F5E9] text-left rounded-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#171717]">Patient A</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Panihati</span>
              </div>
              <p className="text-[11px] text-[#555555] mt-0.5">অজয় মুখার্জী • Location A</p>
            </button>
            <button
              type="button"
              onClick={() => loginWithPhone('9830022222', '1234')}
              className="p-2.5 bg-[#F1F8F2] border border-[#D5E8D7] hover:border-[#2E7D32] hover:bg-[#E8F5E9] text-left rounded-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#171717]">Patient B</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">Dum Dum</span>
              </div>
              <p className="text-[11px] text-[#555555] mt-0.5">বিমল সেনগুপ্ত • Location B</p>
            </button>
          </div>
        </div>

        {/* Quick Staff/Admin Demo Portals */}
        <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] space-y-2.5 text-center">
          <span className="text-[11px] font-bold text-[#555555] uppercase tracking-wider block">
            {language === 'bn' ? 'তাত্ক্ষণিক প্রাতিষ্ঠানিক পোর্টাল:' : 'Institutional Portals:'}
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => switchRole('hospital_staff')}
              className="py-2 px-3 bg-[#F1F8F2] border border-[#D5E8D7] hover:bg-[#E8F5E9] text-[#171717] rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1"
            >
              <Building2 className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>{language === 'bn' ? 'হাসপাতাল স্টাফ' : 'Hospital Staff'}</span>
            </button>
            <button
              type="button"
              onClick={() => switchRole('admin')}
              className="py-2 px-3 bg-[#F1F8F2] border border-[#D5E8D7] hover:bg-[#E8F5E9] text-[#171717] rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>{language === 'bn' ? 'অ্যাডমিন পোর্টাল' : 'Admin Portal'}</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-[#555555] pt-2 border-t border-[#D5E8D7] flex items-center justify-center space-x-1">
          <span>{language === 'bn' ? 'নতুন রোগী?' : 'New patient?'}</span>
          <button
            onClick={() => navigateTo('register')}
            className="font-bold text-[#2E7D32] hover:underline"
          >
            {language === 'bn' ? 'অ্যাকাউন্ট খুলুন' : 'Register Here'}
          </button>
        </div>
      </div>
    </div>
  );
};
