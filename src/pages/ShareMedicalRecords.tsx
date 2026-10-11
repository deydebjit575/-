import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  Share2,
  Clock,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  XCircle,
  Copy,
  AlertTriangle,
  Building,
  KeyRound,
  Trash2,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { DocumentCategory } from '../types';

export const ShareMedicalRecords: React.FC = () => {
  const { language, t } = useLanguage();
  const {
    medicalDocuments,
    hospitals,
    accessGrants,
    createAccessGrant,
    revokeAccessGrant,
    showToast,
    pageParams,
    navigateTo
  } = useApp();

  const [selectedHospitalId, setSelectedHospitalId] = useState(hospitals[0]?.id || '');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>(() => {
    return pageParams?.docId ? [pageParams.docId] : medicalDocuments.map(d => d.id);
  });
  const [selectedCategories, setSelectedCategories] = useState<DocumentCategory[]>([
    'prescriptions',
    'blood_reports',
    'hospital_records',
    'insurance'
  ]);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeInsurance, setIncludeInsurance] = useState(true);
  const [validityHours, setValidityHours] = useState(4);
  const [newlyCreatedToken, setNewlyCreatedToken] = useState<string | null>(null);

  const toggleDoc = (id: string) => {
    setSelectedDocIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleCategory = (cat: DocumentCategory) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleGenerateGrant = (e: React.FormEvent) => {
    e.preventDefault();
    const hosp = hospitals.find(h => h.id === selectedHospitalId) || hospitals[0];

    const grant = createAccessGrant(
      hosp.id,
      hosp.name,
      selectedDocIds,
      validityHours,
      includeSummary,
      undefined,
      selectedCategories,
      includeInsurance
    );

    setNewlyCreatedToken(grant.token);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('success', 'Grant token copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-[#2E7D32] font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
            <span>Patient-Controlled Confidentiality & Authorization Protocol</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171717]">
            {language === 'bn' ? 'হাসপাতাল-নির্দিষ্ট মেডিকেল রেকর্ড শেয়ার ও অনুমতি' : 'Hospital-Specific Record Sharing & Access Control'}
          </h1>
          <p className="text-xs text-[#555555] leading-relaxed max-w-3xl">
            {language === 'bn'
              ? 'রোগী হিসেবে আপনি সম্পূর্ণ নিয়ন্ত্রণ রাখেন। নির্বাচিত হাসপাতাল শুধুমাত্র আপনার অনুমোদিত ক্যাটাগরি ও নথি নির্দিষ্ট সময়ের (২, ৪ বা ২৪ ঘণ্টা) জন্য দেখতে পারবে। যেকোনো মুহূর্তে "অনুমতি প্রত্যাহার" বাটন চাপলে প্ল্যাটফর্মে হাসপাতালের ভবিষ্যৎ প্রবেশাধিকার তাৎক্ষণিকভাবে বন্ধ হয়ে যাবে।'
              : 'You have full control over your health data. Create time-limited, encrypted permission grants for specific hospitals. Revoke access at any time with immediate effect.'}
          </p>
        </div>

        {/* HOSPITAL SWITCHING WORKFLOW GUIDE BANNER */}
        <div className="bg-[#E8F5E9] text-[#171717] rounded-3xl p-6 border border-[#D5E8D7] shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-[#2E7D32] font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#2E7D32]" />
            <span>Hospital Switching & Permission Isolation Workflow</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-white rounded-2xl border border-[#D5E8D7] space-y-1 shadow-xs">
              <span className="font-bold text-[#2E7D32] block">
                {language === 'bn' ? '১. হাসপাতাল নির্বাচন' : '1. Select Hospital'}
              </span>
              <p className="text-[#555555] text-[11px]">
                {language === 'bn'
                  ? 'হাসপাতাল A বেছে নিয়ে নির্দিষ্ট কিছু নথি শেয়ারের অনুমতি দিন।'
                  : 'Choose Hospital A and grant permission to share selected records.'}
              </p>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-[#D5E8D7] space-y-1 shadow-xs">
              <span className="font-bold text-[#2E7D32] block">
                {language === 'bn' ? '২. আইসিইউ ও ট্রায়াজ যাচাই' : '2. ICU & Triage Verification'}
              </span>
              <p className="text-[#555555] text-[11px]">
                {language === 'bn'
                  ? 'হাসপাতাল A বেড যাচাই করবে। বেড খালি না থাকলে রোগী বার্তা পাবেন।'
                  : 'Hospital A verifies beds. Patient receives notice if no bed is vacant.'}
              </p>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-[#D5E8D7] space-y-1 shadow-xs">
              <span className="font-bold text-[#2E7D32] block">
                {language === 'bn' ? '৩. এক ক্লিকে অনুমতি প্রত্যাহার' : '3. One-Click Revoke Access'}
              </span>
              <p className="text-[#555555] text-[11px]">
                {language === 'bn'
                  ? 'হাসপাতাল A-এর অনুমতি সাথে সাথে প্রত্যাহার করে অ্যাক্সেস ব্লক করুন।'
                  : 'Instantly revoke Hospital A access and block further record inspection.'}
              </p>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-[#D5E8D7] space-y-1 shadow-xs">
              <span className="font-bold text-[#2E7D32] block">
                {language === 'bn' ? '৪. হাসপাতাল B-তে নতুন গ্রান্ট' : '4. New Grant for Hospital B'}
              </span>
              <p className="text-[#555555] text-[11px]">
                {language === 'bn'
                  ? 'হাসপাতাল B সম্পূর্ণ নতুন অনুমতি পাবে; পূর্ববর্তী গ্রান্ট কখনো শেয়ার হবে না।'
                  : 'Hospital B receives an entirely new grant; previous access is never shared.'}
              </p>
            </div>
          </div>
        </div>

        {/* Generator Form & Active Grants Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Create New Grant */}
          <div className="lg:col-span-6 bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-6">
            <h3 className="text-lg font-black text-[#171717] flex items-center space-x-2">
              <Share2 className="w-5 h-5 text-[#2E7D32]" />
              <span>{language === 'bn' ? 'নতুন হাসপাতালকে অনুমতি দিন' : 'Grant Hospital Permission'}</span>
            </h3>

            <form onSubmit={handleGenerateGrant} className="space-y-5">
              {/* Select Recipient Hospital */}
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  {language === 'bn' ? 'প্রাপক হাসপাতাল নির্বাচন করুন *' : 'Select Target Hospital *'}
                </label>
                <select
                  value={selectedHospitalId}
                  onChange={e => setSelectedHospitalId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D5E8D7] text-xs font-semibold bg-white text-[#171717] focus:border-[#2E7D32] outline-hidden"
                >
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.distanceKm} km away)
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Validity Duration */}
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-2">
                  {language === 'bn' ? 'অনুমতির মেয়াদ (Time Duration) *' : 'Access Expiry Duration *'}
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { hours: 2, labelBn: '২ ঘণ্টা (2 Hours)', labelEn: '2 Hours' },
                    { hours: 4, labelBn: '৪ ঘণ্টা (4 Hours)', labelEn: '4 Hours' },
                    { hours: 24, labelBn: '২৪ ঘণ্টা (24 Hours)', labelEn: '24 Hours' },
                  ].map(item => (
                    <button
                      type="button"
                      key={item.hours}
                      onClick={() => setValidityHours(item.hours)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                        validityHours === item.hours
                          ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-xs'
                          : 'bg-white text-[#171717] border-[#D5E8D7] hover:bg-[#F1F8F2]'
                      }`}
                    >
                      {language === 'bn' ? item.labelBn : item.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Medical Categories to Share */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#171717]">
                  {language === 'bn' ? 'অনুমোদিত মেডিকেল ক্যাটাগরিসমূহ নির্বাচন করুন:' : 'Select Permitted Medical Categories:'}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'prescriptions', labelBn: 'প্রেসক্রিপশন', labelEn: 'Prescriptions' },
                    { id: 'blood_reports', labelBn: 'রক্তের রিপোর্ট', labelEn: 'Blood Tests' },
                    { id: 'hospital_records', labelBn: 'হাসপাতাল রেকর্ড', labelEn: 'Hospital Records' },
                    { id: 'diagnostic_reports', labelBn: 'ডায়াগনস্টিক রিপোর্ট', labelEn: 'Diagnostic Reports' },
                    { id: 'discharge_summaries', labelBn: 'ডিসচার্জ সামারি', labelEn: 'Discharge Summaries' },
                    { id: 'insurance', labelBn: 'স্বাস্থ্যকার্ড ও স্বাস্থ্যসাথী', labelEn: 'Insurance & Health Card' },
                  ].map(cat => (
                    <div
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id as DocumentCategory)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        selectedCategories.includes(cat.id as DocumentCategory)
                          ? 'bg-white border-[#2E7D32] font-bold text-[#171717]'
                          : 'bg-[#F1F8F2] border-[#D5E8D7] text-[#555555]'
                      }`}
                    >
                      <span className="text-[11px] truncate">{language === 'bn' ? cat.labelBn : cat.labelEn}</span>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id as DocumentCategory)}
                        onChange={() => {}}
                        className="text-[#2E7D32] rounded focus:ring-[#2E7D32]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Include Summary Checkbox */}
              <div className="p-3.5 rounded-xl bg-white border border-[#D5E8D7] space-y-2 text-xs">
                <div className="flex items-center space-x-2.5">
                  <input
                    type="checkbox"
                    id="inc-summary"
                    checked={includeSummary}
                    onChange={e => setIncludeSummary(e.target.checked)}
                    className="w-4 h-4 text-[#2E7D32] rounded focus:ring-[#2E7D32]"
                  />
                  <label htmlFor="inc-summary" className="font-bold text-[#171717] cursor-pointer">
                    {language === 'bn'
                      ? 'জরুরি স্বাস্থ্য সারসংক্ষেপ (অ্যালার্জি, চলমান ওষুধ, রক্তের গ্রুপ) অন্তর্ভুক্ত করুন'
                      : 'Include Emergency Health Summary (Allergies, Medications, Blood Group)'}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#2E7D32] hover:bg-[#256B2A] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>{language === 'bn' ? 'এনক্রিপ্টেড টোকেন ও অনুমতিপত্র তৈরি করুন' : 'Generate Secure Access Token'}</span>
              </button>
            </form>

            {/* Generated Token Display Box */}
            {newlyCreatedToken && (
              <div className="p-4 rounded-2xl bg-white border border-[#D5E8D7] text-[#171717] space-y-3 animate-in fade-in shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2E7D32]">
                    {language === 'bn' ? 'সক্রিয় অ্যাক্সেস টোকেন:' : 'Active Access Token:'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7] text-[10px] font-bold">
                    ACTIVE ({validityHours}h)
                  </span>
                </div>
                <div className="p-3 bg-[#F1F8F2] border border-[#D5E8D7] rounded-xl font-mono text-sm font-bold tracking-wider text-[#2E7D32] flex items-center justify-between">
                  <span>{newlyCreatedToken}</span>
                  <button
                    onClick={() => copyToClipboard(newlyCreatedToken)}
                    className="p-1 hover:bg-[#E8F5E9] rounded text-[#2E7D32]"
                    title="Copy Token"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Active Access Grants Table & Revocation */}
          <div className="lg:col-span-6 bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-6">
            <h3 className="text-lg font-black text-[#171717] flex items-center space-x-2">
              <Clock className="w-5 h-5 text-[#2E7D32]" />
              <span>{language === 'bn' ? 'অনুমোদিত হাসপাতালের তালিকা ও নিয়ন্ত্রণ' : 'Active & Previous Access Grants'}</span>
            </h3>

            <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
              {accessGrants.map(grant => (
                <div
                  key={grant.id}
                  className="p-4 rounded-2xl border border-[#D5E8D7] bg-white space-y-3 text-xs shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#171717] truncate max-w-[220px]">
                      {grant.sharedWithHospitalName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        grant.status === 'ACTIVE'
                          ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7]'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {grant.status === 'ACTIVE'
                        ? (language === 'bn' ? 'সক্রিয়' : 'ACTIVE')
                        : (language === 'bn' ? 'প্রত্যাহারকৃত' : 'REVOKED')}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#555555] space-y-0.5">
                    <p>{language === 'bn' ? 'টোকেন:' : 'Token:'} <span className="font-mono font-bold text-[#171717]">{grant.token}</span></p>
                    <p>{language === 'bn' ? 'তৈরির সময়:' : 'Created At:'} {new Date(grant.createdAt).toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US')}</p>
                    <p>{language === 'bn' ? 'মেয়াদ শেষ:' : 'Expires At:'} {new Date(grant.expiresAt).toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit' })} ({new Date(grant.expiresAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')})</p>
                    <p>{language === 'bn' ? 'অনুমোদিত ক্যাটাগরি:' : 'Allowed Categories:'} {grant.sharedCategories?.join(', ') || 'Prescriptions, Blood reports'}</p>
                  </div>

                  {grant.accessLogs.length > 0 && (
                    <div className="bg-[#F1F8F2] p-2.5 rounded-xl border border-[#D5E8D7] text-[10px] text-[#555555] space-y-0.5">
                      <span className="font-bold block text-[#2E7D32]">
                        {language === 'bn' ? 'হাসপাতাল পরিদর্শন লগ (Staff Access Log):' : 'Hospital Access Log:'}
                      </span>
                      <p>{grant.accessLogs[0].accessedBy} ({grant.accessLogs[0].staffRole || (language === 'bn' ? 'কর্মী' : 'Staff')}) {language === 'bn' ? 'সময়' : 'at'} {new Date(grant.accessLogs[0].accessedAt).toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US')}</p>
                    </div>
                  )}

                  {grant.status === 'ACTIVE' ? (
                    <div className="pt-2 border-t border-[#D5E8D7] flex justify-between items-center">
                      <span className="text-[10px] text-[#2E7D32] font-bold">
                        ● {language === 'bn' ? 'বর্তমানে সক্রিয়' : 'Currently Active'}
                      </span>
                      <button
                        onClick={() => revokeAccessGrant(grant.id, 'Patient revoked permission from Share Portal')}
                        className="px-3.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'অনুমতি প্রত্যাহার করুন' : 'Revoke Access'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-[#D5E8D7] text-[11px] text-rose-700 font-bold flex items-center justify-between">
                      <span>✓ {language === 'bn' ? 'অনুমতি প্রত্যাহার করা হয়েছে' : 'Access Revoked'}</span>
                      <span className="text-[10px] text-[#555555] font-normal">
                        {grant.revokedAt ? new Date(grant.revokedAt).toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US') : ''}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
