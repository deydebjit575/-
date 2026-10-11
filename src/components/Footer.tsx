import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { Heart, ShieldCheck, PhoneCall, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const { navigateTo } = useApp();

  return (
    <footer className="bg-white text-[#171717] pt-12 pb-8 border-t border-[#D5E8D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[#D5E8D7]">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white shadow-xs">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div className="flex items-baseline space-x-1.5">
                {language === 'bn' ? (
                  <>
                    <span className="text-xl font-bold text-[#171717] font-bengali">সুস্থায়ন</span>
                    <span className="text-xs font-semibold text-[#2E7D32] uppercase">Susthayan</span>
                  </>
                ) : (
                  <span className="text-xl font-bold text-[#171717] font-sans">Susthayan</span>
                )}
              </div>
            </div>
            <p className="text-xs text-[#555555] leading-relaxed">
              {language === 'bn'
                ? 'একা বসবাসকারী প্রবীণ মা-বাবাদের চিকিৎসা ইতিহাস সংরক্ষণ, নিকটস্থ হাসপাতাল অনুসন্ধান ও জীবনরক্ষাকারী দ্রুত জরুরি সাড়াদান ব্যবস্থা।'
                : 'Dedicated elderly healthcare & medical vault platform integrating emergency hospital triage, verified ICU bed discovery, and family connection.'}
            </p>
            <div className="flex items-center space-x-2 text-xs text-[#2E7D32] bg-[#E8F5E9] border border-[#D5E8D7] px-3 py-1.5 rounded-xl w-fit font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
              <span>{language === 'bn' ? 'দিশা ও আভা ডেটা সুরক্ষা সমর্থিত' : 'DISHA & ABHA Data Protection Ready'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#171717] uppercase tracking-wider">
              {language === 'bn' ? 'প্রধান মডিউলসমূহ' : 'Key Modules'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigateTo('medical-vault')} className="text-[#555555] hover:text-[#2E7D32] transition-colors font-medium">
                  {language === 'bn' ? 'মেডিকেল ভল্ট (MediVault)' : 'Medical Vault (MediVault)'}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('nearby-hospitals')} className="text-[#555555] hover:text-[#2E7D32] transition-colors font-medium">
                  {language === 'bn' ? 'নিকটস্থ হাসপাতাল ও বেড ম্যাপ' : 'Nearby Hospitals & Bed Map'}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('timeline')} className="text-[#555555] hover:text-[#2E7D32] transition-colors font-medium">
                  {language === 'bn' ? 'চিকিৎসা ইতিহাস' : 'Medical Timeline'}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('medical-summary')} className="text-[#555555] hover:text-[#2E7D32] transition-colors font-medium">
                  {language === 'bn' ? 'স্বাস্থ্য সারসংক্ষেপ' : 'Health Summary'}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('insurance-vault')} className="text-[#555555] hover:text-[#2E7D32] transition-colors font-medium">
                  {language === 'bn' ? 'বীমা ও স্বাস্থ্য প্রকল্প (স্বাস্থ্য সাথী)' : 'Insurance & Schemes'}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('share-records')} className="text-[#555555] hover:text-[#2E7D32] transition-colors font-medium">
                  {language === 'bn' ? 'রেকর্ড শেয়ার করুন (টোকেন)' : 'Share Records (Time-Limited Tokens)'}
                </button>
              </li>
            </ul>
          </div>

          {/* Hospital & Emergency Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#171717] uppercase tracking-wider">
              {language === 'bn' ? 'হাসপাতাল ও জরুরি' : 'Hospitals & Emergency'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigateTo('emergency-sos')} className="text-[#D32F2F] hover:text-[#B71C1C] font-bold transition-colors">
                  🚨 {language === 'bn' ? 'জরুরি এসওএস (SOS)' : 'Emergency SOS'}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('hospital-dashboard')} className="text-[#555555] hover:text-[#2E7D32] transition-colors font-medium">
                  {language === 'bn' ? 'হাসপাতাল পোর্টাল' : 'Hospital Portal'}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('bed-management')} className="text-[#555555] hover:text-[#2E7D32] transition-colors font-medium">
                  {language === 'bn' ? 'লাইভ আইসিইউ ও জেনারেল বেড' : 'Live ICU & Ward Bed System'}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('ambulance-coordination')} className="text-[#555555] hover:text-[#2E7D32] transition-colors font-medium">
                  {language === 'bn' ? 'অ্যাম্বুলেন্স সমন্বয় ও ট্র্যাকার' : 'Ambulance Dispatch Tracker'}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('help')} className="text-[#555555] hover:text-[#2E7D32] transition-colors font-medium">
                  {language === 'bn' ? 'প্রাথমিক চিকিৎসা গাইড' : 'First Aid Emergency Guide'}
                </button>
              </li>
            </ul>
          </div>

          {/* National Helplines Box */}
          <div className="space-y-3 bg-[#E8F5E9] p-4 rounded-2xl border border-[#D5E8D7]">
            <div className="flex items-center space-x-2 text-[#D32F2F] font-bold text-xs uppercase tracking-wider">
              <PhoneCall className="w-4 h-4 text-[#D32F2F]" />
              <span>{language === 'bn' ? 'জরুরি জাতীয় হেল্পলাইন' : 'Emergency Hotlines'}</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#D5E8D7]">
                <span className="text-[#555555]">{language === 'bn' ? 'জাতীয় জরুরি সেবা (All-in-One):' : 'National Emergency (All-in-One):'}</span>
                <a href="tel:112" className="text-[#D32F2F] font-bold hover:underline">112</a>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#D5E8D7]">
                <span className="text-[#555555]">{language === 'bn' ? 'অ্যাম্বুলেন্স সাড়া (Ambulance):' : 'Ambulance Response:'}</span>
                <a href="tel:108" className="text-[#2E7D32] font-bold hover:underline">108 / 102</a>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#D5E8D7]">
                <span className="text-[#555555]">{language === 'bn' ? 'প্রবীণ নাগরিক সুরক্ষা (Elder Line):' : 'Elder Line Helpline:'}</span>
                <a href="tel:14567" className="text-[#2E7D32] font-bold hover:underline">14567</a>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#555555]">{language === 'bn' ? 'পুলিশ কন্ট্রোল রুম:' : 'Police Control Room:'}</span>
                <a href="tel:100" className="text-[#1565C0] font-bold hover:underline">100</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#555555] gap-3">
          <p>© {new Date().getFullYear()} {language === 'bn' ? 'সুস্থায়ন স্বাস্থ্য উদ্যোগ। সর্বস্বত্ব সংরক্ষিত।' : 'Susthayan Healthcare Initiative. All rights reserved.'}</p>
          <div className="flex items-center space-x-4">
            <button onClick={() => navigateTo('settings')} className="text-[#555555] hover:text-[#2E7D32] transition-colors">
              {language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
            </button>
            <span>•</span>
            <button onClick={() => navigateTo('help')} className="text-[#555555] hover:text-[#2E7D32] transition-colors">
              {language === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service'}
            </button>
            <span>•</span>
            <span className="text-[#777777] flex items-center">
              <Lock className="w-3 h-3 mr-1 text-[#2E7D32]" /> {language === 'bn' ? '২৫৬-বিট এনক্রিপ্ট করা ভল্ট' : '256-Bit Encrypted Vault'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
