import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp, normalizePhone } from '../context/AppContext';
import {
  Heart,
  User,
  Phone,
  Lock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  LogIn
} from 'lucide-react';
import { LocationArea } from '../types';

export const PatientRegistration: React.FC = () => {
  const { language } = useLanguage();
  const { registerPatient, navigateTo } = useApp();

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState<LocationArea>('Panihati, West Bengal');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsAlreadyRegistered(false);

    if (!fullName.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে আপনার সম্পূর্ণ নাম লিখুন।' : 'Please enter your full name.');
      return;
    }

    if (!age || Number(age) < 1 || Number(age) > 120) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে সঠিক বয়স লিখুন।' : 'Please enter a valid age.');
      return;
    }

    const cleanPhone = normalizePhone(phone);
    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে সঠিক ফোন নম্বর প্রদান করুন।' : 'Please enter a valid phone number.');
      return;
    }

    if (password.length < 4) {
      setErrorMsg(language === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।' : 'Password must be at least 4 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(language === 'bn' ? 'পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না।' : 'Passwords do not match.');
      return;
    }

    const success = registerPatient({
      fullName: fullName.trim(),
      age: Number(age),
      phone: cleanPhone,
      location,
      password
    });

    if (!success) {
      setIsAlreadyRegistered(true);
      setErrorMsg(
        language === 'bn'
          ? 'এই ফোন নম্বর দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট খোলা রয়েছে। অনুগ্রহ করে সরাসরি লগইন করুন।'
          : 'This phone number is already registered. Please Sign In directly.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-lg w-full bg-[#E8F5E9] rounded-3xl p-6 sm:p-10 border border-[#D5E8D7] shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center mx-auto shadow-sm">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171717] font-bengali">
            {language === 'bn' ? 'সুস্থায়ন রোগী নিবন্ধন' : 'Register as Patient'}
          </h1>
          <p className="text-xs text-[#555555]">
            {language === 'bn'
              ? 'আপনার জরুরি চিকিৎসা ভল্ট ও নিকটস্থ হাসপাতাল সেবা সক্রিয় করতে ফর্মটি পূরণ করুন।'
              : 'Create your private MediVault and emergency response account.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex flex-col space-y-2 animate-in fade-in">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
            {isAlreadyRegistered && (
              <button
                type="button"
                onClick={() => navigateTo('login')}
                className="mt-1 self-start inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'লগইন পাতায় যান' : 'Go to Login'}</span>
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              {language === 'bn' ? 'সম্পূর্ণ নাম *' : 'Full Name *'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#555555] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder={language === 'bn' ? 'যেমন: অজয় মুখার্জী' : 'e.g. Anirban Mukherjee'}
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm text-[#171717] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 font-medium outline-hidden"
              />
            </div>
          </div>

          {/* Age & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                {language === 'bn' ? 'বয়স *' : 'Age *'}
              </label>
              <input
                type="number"
                required
                min={1}
                max={120}
                placeholder="68"
                value={age}
                onChange={e => setAge(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm text-[#171717] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 font-medium outline-hidden"
              />
            </div>

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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm text-[#171717] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 font-medium font-mono outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Location Dropdown */}
          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              {language === 'bn' ? 'অবস্থান এলাকা *' : 'Location Area *'}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#555555] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={location}
                onChange={e => setLocation(e.target.value as LocationArea)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5E8D7] text-sm focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 bg-white font-bold text-[#171717] outline-hidden"
              >
                <option value="Panihati, West Bengal">
                  {language === 'bn' ? 'পানিহাটি, পশ্চিমবঙ্গ' : 'Panihati, West Bengal'}
                </option>
                <option value="Dum Dum, West Bengal">
                  {language === 'bn' ? 'দমদম, পশ্চিমবঙ্গ' : 'Dum Dum, West Bengal'}
                </option>
              </select>
            </div>
            <p className="text-[11px] text-[#555555] mt-1">
              {language === 'bn'
                ? 'আপনার নির্বাচিত এলাকার ভিত্তিতে নিকটস্থ জরুরি হাসপাতাল ও সেবা সমন্বয় করা হবে।'
                : 'Hospital discovery will default to your locality.'}
            </p>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                {language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন *' : 'Confirm Password *'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#555555] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm text-[#171717] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 font-medium outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white font-black text-sm rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <span>{language === 'bn' ? 'অ্যাকাউন্ট তৈরি ও ড্যাশবোর্ডে প্রবেশ' : 'Create Account & Proceed'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-[#555555] pt-3 border-t border-[#D5E8D7] flex items-center justify-center space-x-1">
          <span>{language === 'bn' ? 'ইতোমধ্যে অ্যাকাউন্ট রয়েছে?' : 'Already have an account?'}</span>
          <button
            onClick={() => navigateTo('login')}
            className="font-bold text-[#2E7D32] hover:underline"
          >
            {language === 'bn' ? 'লগইন করুন' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};
