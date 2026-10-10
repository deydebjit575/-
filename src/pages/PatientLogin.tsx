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
      setErrorMsg('অনুগ্রহ করে আপনার ফোন নম্বর লিখুন (Please enter your phone number).');
      return;
    }

    const success = loginWithPhone(cleanPhone, password);
    if (!success) {
      setErrorMsg('ফোন নম্বর বা পাসওয়ার্ড সঠিক নয়। নতুন হলে নিবন্ধন করুন। (Invalid phone or password).');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-elevated space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950 font-bengali">
            {language === 'bn' ? 'সুস্থায়নে লগইন করুন' : 'Sign in to Susthayan'}
          </h1>
          <p className="text-xs text-slate-500">
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
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {language === 'bn' ? 'ফোন নম্বর (Phone Number) *' : 'Phone Number *'}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                placeholder="9830012345"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 font-mono font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {language === 'bn' ? 'পাসওয়ার্ড (Password) *' : 'Password *'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <span>{language === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Staff/Admin Demo Portals */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {language === 'bn' ? 'তাত্ক্ষণিক প্রাতিষ্ঠানিক পোর্টাল:' : 'Institutional Portals:'}
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => switchRole('hospital_staff')}
              className="py-2 px-3 bg-white border border-cyan-300 hover:bg-cyan-50 text-cyan-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1"
            >
              <Building2 className="w-3.5 h-3.5 text-cyan-600" />
              <span>হাসপাতাল স্টাফ</span>
            </button>
            <button
              type="button"
              onClick={() => switchRole('admin')}
              className="py-2 px-3 bg-white border border-purple-300 hover:bg-purple-50 text-purple-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>অ্যাডমিন পোর্টাল</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100 flex items-center justify-center space-x-1">
          <span>{language === 'bn' ? 'নতুন রোগী?' : 'New patient?'}</span>
          <button
            onClick={() => navigateTo('register')}
            className="font-bold text-teal-700 hover:underline"
          >
            {language === 'bn' ? 'অ্যাকাউন্ট খুলুন (Register)' : 'Register Here'}
          </button>
        </div>
      </div>
    </div>
  );
};
