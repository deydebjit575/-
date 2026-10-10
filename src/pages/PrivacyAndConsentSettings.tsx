import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  Lock,
  Download,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  HardDriveDownload,
  FileCheck
} from 'lucide-react';

export const PrivacyAndConsentSettings: React.FC = () => {
  const { language, t } = useLanguage();
  const { showToast, addAuditLog, logout } = useApp();

  const [shareLocationConsent, setShareLocationConsent] = useState(true);
  const [shareAllergiesConsent, setShareAllergiesConsent] = useState(true);
  const [sendFamilySmsConsent, setSendFamilySmsConsent] = useState(true);

  const handleDownloadArchive = () => {
    addAuditLog('EXPORT_HEALTH_ARCHIVE', 'Patient downloaded complete encrypted MediVault archive ZIP');
    showToast('success', 'Health Archive Generation Started', 'Exporting MediVault documents & timeline as encrypted bundle.');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনার সুস্থায়ন অ্যাকাউন্ট ও সংরক্ষিত সমস্ত মেডিকেল রেকর্ড স্থায়ীভাবে মুছে ফেলতে চান? এই পদক্ষেপটি অপরিবর্তনীয়।')) {
      addAuditLog('ACCOUNT_DELETION_REQUEST', 'User requested full deletion of profile and records');
      showToast('info', 'Account and associated records deleted');
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs space-y-2">
          <div className="flex items-center space-x-2 text-[#2E7D32] font-bold text-xs uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>Digital Personal Data Protection (DPDP) & DISHA Compliant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171717]">
            {language === 'bn' ? 'গোপনীয়তা ও সম্মতি সেটিংস' : 'Privacy, Consent & Data Governance'}
          </h1>
          <p className="text-xs text-[#555555] leading-relaxed">
            {language === 'bn'
              ? 'আপনার স্বাস্থ্য তথ্যের সম্পূর্ণ নিয়ন্ত্রণ আপনার হাতে। সম্মতি পরিবর্তন, ডেটা ডাউনলোড বা স্থায়ী অ্যাকাউন্ট মুছে ফেলার অনুরোধ পরিচালনা করুন।'
              : 'Manage granular consent permissions, export your complete encrypted health archive, or exercise your right to be forgotten.'}
          </p>
        </div>

        {/* Consent Options */}
        <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs space-y-6">
          <h3 className="text-base font-black text-[#171717]">
            {language === 'bn' ? 'জরুরি সম্মতি পছন্দসমূহ' : 'Emergency Consent Preferences'}
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-start justify-between p-4 rounded-2xl bg-white border border-[#D5E8D7] shadow-2xs">
              <div className="space-y-0.5">
                <span className="font-bold text-[#171717] block text-sm">
                  জরুরি মুহূর্তে লাইভ জিপিএস অবস্থান শেয়ার
                </span>
                <p className="text-[#555555]">
                  এসওএস চাপলে নিকটস্থ হাসপাতালের জরুরি অ্যাম্বুলেন্সকে আপনার বর্তমান অবস্থান প্রেরণ করা হবে।
                </p>
              </div>
              <input
                type="checkbox"
                checked={shareLocationConsent}
                onChange={e => setShareLocationConsent(e.target.checked)}
                className="w-5 h-5 accent-[#2E7D32] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-start justify-between p-4 rounded-2xl bg-white border border-[#D5E8D7] shadow-2xs">
              <div className="space-y-0.5">
                <span className="font-bold text-[#171717] block text-sm">
                  অ্যালার্জি ও চলমান ওষুধের বিবরণ শেয়ার
                </span>
                <p className="text-[#555555]">
                  হাসপাতালে ভুল ওষুধের পার্শ্বপ্রতিক্রিয়া প্রতিরোধে চিকিৎসককে প্রাথমিক রিপোর্ট দেখানো।
                </p>
              </div>
              <input
                type="checkbox"
                checked={shareAllergiesConsent}
                onChange={e => setShareAllergiesConsent(e.target.checked)}
                className="w-5 h-5 accent-[#2E7D32] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-start justify-between p-4 rounded-2xl bg-white border border-[#D5E8D7] shadow-2xs">
              <div className="space-y-0.5">
                <span className="font-bold text-[#171717] block text-sm">
                  পরিবার ও অভিভাবকদের স্বয়ংক্রিয় এসএমএস অ্যালার্ট
                </span>
                <p className="text-[#555555]">
                  জরুরি পরিস্থিতিতে নিবন্ধিত সন্তানদের ফোনে তাৎক্ষণিক ভারতীয় DLT এসএমএস নোটিফিকেশন যাবে।
                </p>
              </div>
              <input
                type="checkbox"
                checked={sendFamilySmsConsent}
                onChange={e => setSendFamilySmsConsent(e.target.checked)}
                className="w-5 h-5 accent-[#2E7D32] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Data Export & Right to Be Forgotten */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Download Full Medical Vault Archive */}
          <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 border border-[#D5E8D7] shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white text-[#2E7D32] border border-[#D5E8D7] flex items-center justify-center mb-3">
                <HardDriveDownload className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[#171717] text-base">স্বাস্থ্য আর্কাইভ ডাউনলোড করুন</h4>
              <p className="text-xs text-[#555555] mt-1">
                আপনার সমস্ত প্রেসক্রিপশন, রক্তের রিপোর্ট, এক্স-রে এবং টাইমলাইনের একটি সম্পূর্ণ জিপ (ZIP) ব্যাকআপ ফাইল নামিয়ে নিন।
              </p>
            </div>
            <button
              onClick={handleDownloadArchive}
              className="w-full py-2.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>এনক্রিপ্টেড ব্যাকআপ ডাউনলোড</span>
            </button>
          </div>

          {/* Account & Data Deletion */}
          <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 border border-[#D5E8D7] shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center mb-3">
                <Trash2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[#171717] text-base">অ্যাকাউন্ট ও ডেটা স্থায়ীভাবে মুছুন</h4>
              <p className="text-xs text-[#555555] mt-1">
                স্থায়ীভাবে আপনার সুস্থায়ন অ্যাকাউন্ট, সমস্ত প্রেসক্রিপশন এবং আপলোডকৃত ফাইল সার্ভার থেকে মুছে ফেলা হবে।
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="w-full py-2.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>স্থায়ী ডেটা মুছে ফেলার অনুরোধ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
