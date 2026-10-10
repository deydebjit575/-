import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { Heart, ShieldCheck, PhoneCall, HelpCircle, FileCheck, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const { navigateTo } = useApp();

  return (
    <footer className="bg-navy-950 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl font-bold text-white font-bengali">সুস্থায়ন</span>
                <span className="text-xs font-semibold text-teal-400 uppercase">Susthayan</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'bn'
                ? 'একা বসবাসকারী প্রবীণ মা-বাবাদের চিকিৎসা ইতিহাস সংরক্ষণ, নিকটস্থ হাসপাতাল অনুসন্ধান ও জীবনরক্ষাকারী দ্রুত জরুরি সাড়াদান ব্যবস্থা।'
                : 'Dedicated elderly healthcare & medical vault platform integrating emergency hospital triage, verified ICU bed discovery, and family connection.'}
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>DISHA & ABHA Data Protection Ready</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {language === 'bn' ? 'প্রধান মডিউলসমূহ' : 'Key Modules'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigateTo('medical-vault')} className="hover:text-teal-300 transition-colors">
                  {t('medicalVault')} (MediVault)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('nearby-hospitals')} className="hover:text-teal-300 transition-colors">
                  {t('nearbyHospitals')} & Bed Map
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('timeline')} className="hover:text-teal-300 transition-colors">
                  {t('timeline')}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('medical-summary')} className="hover:text-teal-300 transition-colors">
                  {t('summary')}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('insurance-vault')} className="hover:text-teal-300 transition-colors">
                  {t('insuranceVault')} (Swasthya Sathi)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('share-records')} className="hover:text-teal-300 transition-colors">
                  {t('shareRecords')} (Time-Limited Tokens)
                </button>
              </li>
            </ul>
          </div>

          {/* Hospital & Emergency Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {language === 'bn' ? 'হাসপাতাল ও জরুরি' : 'Hospitals & Emergency'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigateTo('emergency-sos')} className="text-rose-400 hover:text-rose-300 font-semibold transition-colors">
                  🚨 {t('emergencySos')}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('hospital-dashboard')} className="hover:text-teal-300 transition-colors">
                  {t('hospitalPortal')}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('bed-management')} className="hover:text-teal-300 transition-colors">
                  Live ICU & Ward Bed System
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('ambulance-coordination')} className="hover:text-teal-300 transition-colors">
                  Ambulance Dispatch Tracker
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('help')} className="hover:text-teal-300 transition-colors">
                  First Aid Emergency Guide
                </button>
              </li>
            </ul>
          </div>

          {/* National Helplines Box */}
          <div className="space-y-3 bg-navy-900/80 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <PhoneCall className="w-4 h-4" />
              <span>{language === 'bn' ? 'জরুরি জাতীয় হেল্পলাইন' : 'Emergency Hotlines'}</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">জাতীয় জরুরি সেবা (All-in-One):</span>
                <a href="tel:112" className="text-rose-300 font-bold hover:underline">112</a>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">অ্যাম্বুলেন্স সাড়া (Ambulance):</span>
                <a href="tel:108" className="text-emerald-400 font-bold hover:underline">108 / 102</a>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">প্রবীণ নাগরিক সুরক্ষা (Elder Line):</span>
                <a href="tel:14567" className="text-teal-300 font-bold hover:underline">14567</a>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">পুলিশ কন্ট্রোল রুম:</span>
                <a href="tel:100" className="text-blue-300 font-bold hover:underline">100</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} সুস্থায়ন (Susthayan) Healthcare Initiative. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <button onClick={() => navigateTo('settings')} className="hover:text-slate-300 transition-colors">
              {language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
            </button>
            <span>•</span>
            <button onClick={() => navigateTo('help')} className="hover:text-slate-300 transition-colors">
              {language === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service'}
            </button>
            <span>•</span>
            <span className="text-slate-600 flex items-center">
              <Lock className="w-3 h-3 mr-1" /> 256-Bit Encrypted Vault
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
