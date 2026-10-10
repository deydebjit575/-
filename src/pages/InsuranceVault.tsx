import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  PlusCircle,
  Calendar,
  AlertCircle,
  Download,
  Trash2,
  ExternalLink,
  Building,
  CreditCard,
  FileCheck
} from 'lucide-react';
import { InsurancePolicy } from '../types';

export const InsuranceVault: React.FC = () => {
  const { language, t } = useLanguage();
  const { currentUser, insurancePolicies, addInsurancePolicy, deleteInsurancePolicy, navigateTo } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [provider, setProvider] = useState('');
  const [policyName, setPolicyName] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validTill, setValidTill] = useState('');
  const [sumInsured, setSumInsured] = useState(500000);
  const [cashlessHelpline, setCashlessHelpline] = useState('');
  const [category, setCategory] = useState<InsurancePolicy['category']>('mediclaim');

  const handleAddPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider || !policyNumber) return;

    addInsurancePolicy({
      patientId: currentUser?.uid || 'user-insurance',
      provider,
      policyName: policyName || provider,
      policyNumber,
      validFrom: validFrom || '2025-01-01',
      validTill: validTill || '2026-12-31',
      sumInsured: Number(sumInsured),
      cashlessHelpline: cashlessHelpline || '1800-102-4488',
      category
    });

    setShowAddModal(false);
    setProvider('');
    setPolicyName('');
    setPolicyNumber('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'bn' ? 'ক্যাশলেস স্বাস্থ্য সুরক্ষা কার্ড ভল্ট' : 'Cashless Health Card Vault'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-950">
              {language === 'bn' ? 'স্বাস্থ্য বীমা ও সরকারি প্রকল্প ভল্ট' : 'Insurance & Health Schemes'}
            </h1>
            <p className="text-xs text-slate-600 max-w-xl">
              {language === 'bn'
                ? 'মেডিক্লেইম, স্বাস্থ্য সাথী ও আয়ুষ্মান ভারত কার্ডের বিবরণ ও পলিসি ডকুমেন্ট এক স্থানে সংরক্ষিত রাখুন।'
                : 'Manage Mediclaim, Swasthya Sathi, and Ayushman Bharat policies with cashless hospital helplines.'}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন পলিসি যোগ করুন' : 'Add Policy'}</span>
          </button>
        </div>

        {/* Policy Expiry Disclaimer Notice */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">গুরুত্বপূর্ণ নির্দেশিকা (Disclaimer):</span>
            <span>
              ভল্টে সংরক্ষিত কার্ড স্বয়ংক্রিয়ভাবে হাসপাতালে কভারেজ গ্যারান্টি প্রদান করে না। হাসপাতালে ভর্তির সময় মূল কার্ড ও টিপিএ প্রি-অথোরাইজেশন প্রক্রিয়ার শর্ত প্রযোজ্য।
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insurancePolicies.map(policy => {
            const isGovt = policy.category === 'swasthya_sathi' || policy.category === 'ayushman_bharat';
            const bgClass = isGovt
              ? 'bg-gradient-to-br from-emerald-900 to-teal-950 text-white'
              : 'bg-gradient-to-br from-navy-900 to-indigo-950 text-white';

            return (
              <div
                key={policy.id}
                className={`rounded-3xl p-6 shadow-elevated border border-slate-700 flex flex-col justify-between space-y-6 ${bgClass}`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-teal-300">
                      {policy.category.replace('_', ' ')}
                    </span>
                    <CreditCard className="w-5 h-5 text-teal-300" />
                  </div>

                  <h3 className="text-lg font-black mt-3 leading-snug">
                    {policy.policyName}
                  </h3>
                  <p className="text-xs text-slate-300">{policy.provider}</p>

                  <div className="my-5 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                    <span className="text-[10px] uppercase text-slate-300 block font-semibold">পলিসি / কার্ড নম্বর:</span>
                    <span className="font-mono text-base font-bold text-white tracking-wider block mt-0.5">
                      {policy.policyNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-400 block">কভারেজ সীমা:</span>
                      <span className="font-bold text-teal-300">₹{(policy.sumInsured / 100000).toFixed(1)} Lakh</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">মেয়াদ উত্তীর্ণ:</span>
                      <span className="font-bold text-white">{policy.validTill}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">ক্যাশলেস হেল্পলাইন:</span>
                    <a href={`tel:${policy.cashlessHelpline}`} className="font-bold text-teal-300 hover:underline">
                      📞 {policy.cashlessHelpline}
                    </a>
                  </div>
                  <button
                    onClick={() => deleteInsurancePolicy(policy.id)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-rose-600/80 text-white transition-colors"
                    title="Remove Policy"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Policy Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5">
              <h3 className="text-lg font-black text-navy-950">
                {language === 'bn' ? 'নতুন স্বাস্থ্য কার্ড / পলিসি যোগ করুন' : 'Add Health Policy'}
              </h3>

              <form onSubmit={handleAddPolicy} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">বীমা প্রদানকারী সংস্থা *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Star Health, Care Health, Govt. of WB"
                    value={provider}
                    onChange={e => setProvider(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">পলিসি / স্কিমের নাম</label>
                  <input
                    type="text"
                    placeholder="e.g., Senior Citizen Red Carpet / Swasthya Sathi"
                    value={policyName}
                    onChange={e => setPolicyName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">পলিসি / URN নম্বর *</label>
                    <input
                      type="text"
                      required
                      placeholder="WB/KOL/..."
                      value={policyNumber}
                      onChange={e => setPolicyNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">ক্যাটাগরি</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    >
                      <option value="mediclaim">Mediclaim (Private)</option>
                      <option value="swasthya_sathi">Swasthya Sathi</option>
                      <option value="ayushman_bharat">Ayushman Bharat (PM-JAY)</option>
                      <option value="corporate">Corporate</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">মেয়াদ উত্তীর্ণ তারিখ</label>
                    <input
                      type="date"
                      value={validTill}
                      onChange={e => setValidTill(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">কভারেজ (টাকা)</label>
                    <input
                      type="number"
                      value={sumInsured}
                      onChange={e => setSumInsured(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">ক্যাশলেস হেল্পলাইন নম্বর</label>
                  <input
                    type="text"
                    placeholder="1800 425 2255"
                    value={cashlessHelpline}
                    onChange={e => setCashlessHelpline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
                  >
                    {t('save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
