import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  Building,
  KeyRound,
  Download
} from 'lucide-react';

export const IdDocumentVault: React.FC = () => {
  const { language, t } = useLanguage();
  const { patientProfile, updatePatientProfile, showToast } = useApp();

  const [showMaskedAadhaar, setShowMaskedAadhaar] = useState(false);
  const [showMaskedPan, setShowMaskedPan] = useState(false);
  const [editingAadhaar, setEditingAadhaar] = useState(patientProfile.maskedAadhaar || 'XXXX-XXXX-7842');
  const [editingPan, setEditingPan] = useState(patientProfile.maskedPan || 'ABCDE****G');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    updatePatientProfile({
      maskedAadhaar: editingAadhaar,
      maskedPan: editingPan
    });
    setIsEditing(false);
    showToast('success', 'Identity information updated securely');
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-[#2E7D32] font-bold text-xs uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>UIDAI & Indian Health Data Privacy Compliance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171717]">
            {language === 'bn' ? 'সুরক্ষিত পরিচয়পত্র ভল্ট (ID Vault)' : 'Secure Identity Document Vault'}
          </h1>
          <p className="text-xs text-[#555555] leading-relaxed">
            {language === 'bn'
              ? 'আইনি নিয়ম ও গোপনীয়তা নির্দেশিকা মেনে শুধুমাত্র মাস্কড (অর্ধেক গোপন) আধার ও প্যান বিবরণ সংরক্ষণ করা হয়। প্ল্যাটফর্ম কোনো সম্পূর্ণ ১২-সংখ্যার অরক্ষিত আধার সংগ্রহ করে না।'
              : 'Strict data minimization: Susthayan stores only masked Aadhaar (XXXX-XXXX-1234) and PAN identifiers as mandated under Indian Data Protection norms.'}
          </p>
        </div>

        {/* Identity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Masked Aadhaar Card */}
          <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 border border-[#D5E8D7] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D5E8D7]">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-[#2E7D32]" />
                <h3 className="font-bold text-[#171717] text-base">
                  {language === 'bn' ? 'মাস্কড আধার বিবরণ' : 'Masked Aadhaar Card'}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#2E7D32] bg-white px-2 py-0.5 rounded-full border border-[#D5E8D7]">
                UIDAI Compliant
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#D5E8D7] space-y-2 shadow-2xs">
              <span className="text-xs font-bold text-[#555555] block">
                {language === 'bn' ? 'ধারকের নাম:' : 'Cardholder Name:'}
              </span>
              <p className="text-sm font-bold text-[#171717]">{patientProfile.fullName}</p>

              <span className="text-xs font-bold text-[#555555] block pt-2">
                {language === 'bn' ? 'সুরক্ষিত আধার নম্বর:' : 'Secure Masked Aadhaar:'}
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-black text-[#171717] tracking-wider">
                  {showMaskedAadhaar ? (patientProfile.maskedAadhaar || 'XXXX-XXXX-7842') : '•••• •••• 7842'}
                </span>
                <button
                  onClick={() => setShowMaskedAadhaar(!showMaskedAadhaar)}
                  className="text-[#555555] hover:text-[#2E7D32] p-1 cursor-pointer"
                >
                  {showMaskedAadhaar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-[11px] text-[#555555] flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
              <span>
                {language === 'bn' ? 'প্রথম ৮ ডিজিট গোপন (Masked) রাখা হয়েছে।' : 'First 8 digits are securely masked.'}
              </span>
            </div>
          </div>

          {/* Masked PAN Card */}
          <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 border border-[#D5E8D7] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D5E8D7]">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-[#2E7D32]" />
                <h3 className="font-bold text-[#171717] text-base">
                  {language === 'bn' ? 'প্যান কার্ড নম্বর' : 'Masked PAN Card'}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#2E7D32] bg-white px-2 py-0.5 rounded-full border border-[#D5E8D7]">
                ITD Masked
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#D5E8D7] space-y-2 shadow-2xs">
              <span className="text-xs font-bold text-[#555555] block">
                {language === 'bn' ? 'করদাতার নাম:' : 'Taxpayer Name:'}
              </span>
              <p className="text-sm font-bold text-[#171717]">{patientProfile.fullName}</p>

              <span className="text-xs font-bold text-[#555555] block pt-2">
                {language === 'bn' ? 'সুরক্ষিত প্যান নম্বর:' : 'Secure Masked PAN:'}
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-black text-[#171717] tracking-wider">
                  {showMaskedPan ? (patientProfile.maskedPan || 'ABCDE****G') : '•••••****G'}
                </span>
                <button
                  onClick={() => setShowMaskedPan(!showMaskedPan)}
                  className="text-[#555555] hover:text-[#2E7D32] p-1 cursor-pointer"
                >
                  {showMaskedPan ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-[11px] text-[#555555] flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
              <span>
                {language === 'bn' ? 'বীমা ক্যাশলেস ও হাসপাতালের জন্য প্রযোজ্য।' : 'Used for cashless insurance and hospital admissions.'}
              </span>
            </div>
          </div>
        </div>

        {/* Security & Access Audit Guarantee */}
        <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 border border-[#D5E8D7] text-[#171717] space-y-3 shadow-xs">
          <div className="flex items-center space-x-2 text-[#2E7D32] font-bold text-xs uppercase tracking-wider">
            <KeyRound className="w-4 h-4" />
            <span>
              {language === 'bn' ? 'জিরো-ট্রাস্ট ডেটা সুরক্ষা (Zero-Trust Identity Policy)' : 'Zero-Trust Identity Data Governance'}
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-[#171717]">
            {language === 'bn'
              ? 'আপনার তথ্য কোনো বিজ্ঞাপনদাতা বা অননুমোদিত ব্যক্তির সাথে বিনিময় হয় না।'
              : 'Your identity data is never shared with advertisers or third parties.'}
          </h4>
          <p className="text-xs text-[#555555] leading-relaxed">
            {language === 'bn'
              ? 'শুধুমাত্র জরুরি এসওএস বা আপনার স্পষ্ট টাইম-লিমিটেড অনুমোদনে রেজিস্টার্ড পার্টনার হাসপাতালের ট্রায়াজ ডক্টর সাময়িক সময়ের জন্য এই তথ্য পরিদর্শন করতে পারেন।'
              : 'Only verified triage doctors at partner hospitals can view this data during active SOS or with your explicit time-bound permission.'}
          </p>
        </div>
      </div>
    </div>
  );
};
