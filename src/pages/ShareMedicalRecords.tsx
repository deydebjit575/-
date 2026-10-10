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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-3">
          <div className="flex items-center space-x-2 text-purple-700 font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Patient-Controlled Confidentiality & Authorization Protocol</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950">
            {language === 'bn' ? 'হাসপাতাল-নির্দিষ্ট মেডিকেল রেকর্ড শেয়ার ও অনুমতি' : 'Hospital-Specific Record Sharing & Access Control'}
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
            {language === 'bn'
              ? 'রোগী হিসেবে আপনি সম্পূর্ণ নিয়ন্ত্রণ রাখেন। নির্বাচিত হাসপাতাল শুধুমাত্র আপনার অনুমোদিত ক্যাটাগরি ও নথি নির্দিষ্ট সময়ের (২, ৪ বা ২৪ ঘণ্টা) জন্য দেখতে পারবে। যেকোনো মুহূর্তে "অনুমতি প্রত্যাহার" বাটন চাপলে প্ল্যাটফর্মে হাসপাতালের ভবিষ্যৎ প্রবেশাধিকার তাৎক্ষণিকভাবে বন্ধ হয়ে যাবে।'
              : 'You have full control over your health data. Create time-limited, encrypted permission grants for specific hospitals. Revoke access at any time with immediate effect.'}
          </p>
        </div>

        {/* HOSPITAL SWITCHING WORKFLOW GUIDE BANNER */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-navy-950 text-white rounded-3xl p-6 border border-purple-800/40 shadow-elevated space-y-4">
          <div className="flex items-center space-x-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Hospital Switching & Permission Isolation Workflow</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1">
              <span className="font-bold text-purple-300 block">১. হাসপাতাল নির্বাচন</span>
              <p className="text-slate-300 text-[11px]">হাসপাতাল A বেছে নিয়ে নির্দিষ্ট কিছু নথি শেয়ারের অনুমতি দিন।</p>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1">
              <span className="font-bold text-purple-300 block">২. আইসিইউ ও ট্রায়াজ যাচাই</span>
              <p className="text-slate-300 text-[11px]">হাসপাতাল A বেড যাচাই করবে। বেড খালি না থাকলে রোগী বার্তা পাবেন।</p>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1">
              <span className="font-bold text-purple-300 block">৩. এক ক্লিকে অনুমতি প্রত্যাহার</span>
              <p className="text-slate-300 text-[11px]">হাসপাতাল A-এর অনুমতি সাথে সাথে প্রত্যাহার করে অ্যাক্সেস ব্লক করুন।</p>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1">
              <span className="font-bold text-emerald-300 block">৪. হাসপাতাল B-তে নতুন গ্রান্ট</span>
              <p className="text-slate-300 text-[11px]">হাসপাতাল B সম্পূর্ণ নতুন অনুমতি পাবে; পূর্ববর্তী গ্রান্ট কখনো শেয়ার হবে না।</p>
            </div>
          </div>
        </div>

        {/* Generator Form & Active Grants Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Create New Grant */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
            <h3 className="text-lg font-black text-navy-950 flex items-center space-x-2">
              <Share2 className="w-5 h-5 text-purple-600" />
              <span>{language === 'bn' ? 'নতুন হাসপাতালকে অনুমতি দিন' : 'Grant Hospital Permission'}</span>
            </h3>

            <form onSubmit={handleGenerateGrant} className="space-y-5">
              {/* Select Recipient Hospital */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {language === 'bn' ? 'প্রাপক হাসপাতাল নির্বাচন করুন *' : 'Select Target Hospital *'}
                </label>
                <select
                  value={selectedHospitalId}
                  onChange={e => setSelectedHospitalId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-purple-200"
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
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  {language === 'bn' ? 'অনুমতির মেয়াদ (Time Duration) *' : 'Access Expiry Duration *'}
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { hours: 2, label: '২ ঘণ্টা (2 Hours)' },
                    { hours: 4, label: '৪ ঘণ্টা (4 Hours)' },
                    { hours: 24, label: '২৪ ঘণ্টা (24 Hours)' },
                  ].map(item => (
                    <button
                      type="button"
                      key={item.hours}
                      onClick={() => setValidityHours(item.hours)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                        validityHours === item.hours
                          ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Medical Categories to Share */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  {language === 'bn' ? 'অনুমোদিত মেডিকেল ক্যাটাগরিসমূহ নির্বাচন করুন:' : 'Select Permitted Medical Categories:'}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'prescriptions', label: 'প্রেসক্রিপশন (Prescriptions)' },
                    { id: 'blood_reports', label: 'রক্তের রিপোর্ট (Blood Tests)' },
                    { id: 'hospital_records', label: 'হাসপাতাল রেকর্ড (Hospital Records)' },
                    { id: 'diagnostic_reports', label: 'ডায়াগনস্টিক রিপোর্ট (Diagnostics)' },
                    { id: 'discharge_summaries', label: 'ডিসচার্জ সামারি (Discharge Summary)' },
                    { id: 'insurance', label: 'স্বাস্থ্যকার্ড ও স্বাস্থ্যসাথী (Insurance)' },
                  ].map(cat => (
                    <div
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id as DocumentCategory)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        selectedCategories.includes(cat.id as DocumentCategory)
                          ? 'bg-purple-50 border-purple-300 font-bold text-purple-950'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="text-[11px] truncate">{cat.label}</span>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id as DocumentCategory)}
                        onChange={() => {}}
                        className="text-purple-600 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Include Summary Checkbox */}
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 space-y-2 text-xs">
                <div className="flex items-center space-x-2.5">
                  <input
                    type="checkbox"
                    id="inc-summary"
                    checked={includeSummary}
                    onChange={e => setIncludeSummary(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <label htmlFor="inc-summary" className="font-bold text-purple-950 cursor-pointer">
                    জরুরি স্বাস্থ্য সারসংক্ষেপ (অ্যালার্জি, চলমান ওষুধ, রক্তের গ্রুপ) অন্তর্ভুক্ত করুন
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>{language === 'bn' ? 'এনক্রিপ্টেড টোকেন ও অনুমতিপত্র তৈরি করুন' : 'Generate Secure Access Token'}</span>
              </button>
            </form>

            {/* Generated Token Display Box */}
            {newlyCreatedToken && (
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300">সক্রিয় অ্যাক্সেস টোকেন:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    ACTIVE ({validityHours}h)
                  </span>
                </div>
                <div className="p-3 bg-slate-800 rounded-xl font-mono text-sm font-bold tracking-wider text-teal-300 flex items-center justify-between">
                  <span>{newlyCreatedToken}</span>
                  <button
                    onClick={() => copyToClipboard(newlyCreatedToken)}
                    className="p-1 hover:bg-slate-700 rounded text-slate-300"
                    title="Copy Token"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Active Access Grants Table & Revocation */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
            <h3 className="text-lg font-black text-navy-950 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-teal-700" />
              <span>{language === 'bn' ? 'অনুমোদিত হাসপাতালের তালিকা ও নিয়ন্ত্রণ' : 'Active & Previous Access Grants'}</span>
            </h3>

            <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
              {accessGrants.map(grant => (
                <div
                  key={grant.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-navy-950 truncate max-w-[220px]">
                      {grant.sharedWithHospitalName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        grant.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {grant.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <p>টোকেন: <span className="font-mono font-bold text-slate-800">{grant.token}</span></p>
                    <p>তৈরির সময়: {new Date(grant.createdAt).toLocaleString()}</p>
                    <p>মেয়াদ শেষ: {new Date(grant.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(grant.expiresAt).toLocaleDateString()})</p>
                    <p>অনুমোদিত ক্যাটাগরি: {grant.sharedCategories?.join(', ') || 'Prescriptions, Blood reports'}</p>
                  </div>

                  {grant.accessLogs.length > 0 && (
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-[10px] text-slate-600 space-y-0.5">
                      <span className="font-bold block text-teal-900">হাসপাতাল পরিদর্শন লগ (Staff Access Log):</span>
                      <p>{grant.accessLogs[0].accessedBy} ({grant.accessLogs[0].staffRole || 'Staff'}) at {new Date(grant.accessLogs[0].accessedAt).toLocaleTimeString()}</p>
                    </div>
                  )}

                  {grant.status === 'ACTIVE' ? (
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-[10px] text-emerald-700 font-bold">● বর্তমানে সক্রিয়</span>
                      <button
                        onClick={() => revokeAccessGrant(grant.id, 'Patient revoked permission from Share Portal')}
                        className="px-3.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'অনুমতি প্রত্যাহার করুন' : 'Revoke Access Now'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-200 text-[11px] text-rose-700 font-bold flex items-center justify-between">
                      <span>✓ অনুমতি প্রত্যাহার করা হয়েছে</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {grant.revokedAt ? new Date(grant.revokedAt).toLocaleTimeString() : ''}
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
