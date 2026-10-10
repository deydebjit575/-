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
  const { patientProfile, updatePatientProfile, showToast, addAuditLog } = useApp();

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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-3">
          <div className="flex items-center space-x-2 text-teal-700 font-bold text-xs">
            <Lock className="w-4 h-4" />
            <span>UIDAI & Indian Health Data Privacy Compliance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950">
            {language === 'bn' ? 'সুরক্ষিত পরিচয়পত্র ভল্ট (ID Vault)' : 'Secure Identity Document Vault'}
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'bn'
              ? 'আইনি নিয়ম ও গোপনীয়তা নির্দেশিকা মেনে শুধুমাত্র মাস্কড (অর্ধেক গোপন) আধার ও প্যান বিবরণ সংরক্ষণ করা হয়। প্ল্যাটফর্ম কোনো সম্পূর্ণ ১২-সংখ্যার অরক্ষিত আধার সংগ্রহ করে না।'
              : 'Strict data minimization: Susthayan stores only masked Aadhaar (XXXX-XXXX-1234) and PAN identifiers as mandated under Indian Data Protection norms.'}
          </p>
        </div>

        {/* Identity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Masked Aadhaar Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-navy-950 text-base">
                  {language === 'bn' ? 'মাস্কড আধার বিবরণ' : 'Masked Aadhaar Card'}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                UIDAI Compliant
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-500 block">ধারকের নাম:</span>
              <p className="text-sm font-bold text-slate-900">{patientProfile.fullName}</p>

              <span className="text-xs font-bold text-slate-500 block pt-2">সুরক্ষিত আধার নম্বর:</span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-black text-navy-950 tracking-wider">
                  {showMaskedAadhaar ? (patientProfile.maskedAadhaar || 'XXXX-XXXX-7842') : '•••• •••• 7842'}
                </span>
                <button
                  onClick={() => setShowMaskedAadhaar(!showMaskedAadhaar)}
                  className="text-slate-500 hover:text-teal-700 p-1"
                >
                  {showMaskedAadhaar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>প্রথম ৮ ডিজিট গোপন (Masked) রাখা হয়েছে।</span>
            </div>
          </div>

          {/* Masked PAN Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-indigo-700" />
                <h3 className="font-bold text-navy-950 text-base">
                  {language === 'bn' ? 'প্যান কার্ড নম্বর' : 'Masked PAN Card'}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                ITD Masked
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-500 block">করদাতার নাম:</span>
              <p className="text-sm font-bold text-slate-900">{patientProfile.fullName}</p>

              <span className="text-xs font-bold text-slate-500 block pt-2">সুরক্ষিত প্যান নম্বর:</span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-black text-navy-950 tracking-wider">
                  {showMaskedPan ? (patientProfile.maskedPan || 'ABCDE****G') : '•••••****G'}
                </span>
                <button
                  onClick={() => setShowMaskedPan(!showMaskedPan)}
                  className="text-slate-500 hover:text-indigo-700 p-1"
                >
                  {showMaskedPan ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>বীমা ক্যাশলেস ও হাসপাতালের জন্য প্রযোজ্য।</span>
            </div>
          </div>
        </div>

        {/* Security & Access Audit Guarantee */}
        <div className="bg-gradient-to-r from-teal-900 to-navy-950 rounded-3xl p-6 text-white space-y-3">
          <div className="flex items-center space-x-2 text-teal-300 font-bold text-xs">
            <KeyRound className="w-4 h-4" />
            <span>জিরো-ট্রাস্ট ডেটা সুরক্ষা (Zero-Trust Identity Policy)</span>
          </div>
          <h4 className="text-lg font-bold">আপনার তথ্য কোনো বিজ্ঞাপনদাতা বা অননুমোদিত ব্যক্তির সাথে বিনিময় হয় না।</h4>
          <p className="text-xs text-teal-100 leading-relaxed">
            শুধুমাত্র জরুরি এসওএস বা আপনার স্পষ্ট টাইম-লিমিটেড অনুমোদনে রেজিস্টার্ড পার্টনার হাসপাতালের ট্রায়াজ ডক্টর সাময়িক সময়ের জন্য এই তথ্য পরিদর্শন করতে পারেন।
          </p>
        </div>
      </div>
    </div>
  );
};
