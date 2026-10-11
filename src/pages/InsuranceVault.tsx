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
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#2E7D32] font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'bn' ? 'ক্যাশলেস স্বাস্থ্য সুরক্ষা কার্ড ভল্ট' : 'Cashless Health Card Vault'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#171717]">
              {language === 'bn' ? 'স্বাস্থ্য বীমা ও সরকারি প্রকল্প ভল্ট' : 'Insurance & Health Schemes'}
            </h1>
            <p className="text-xs text-[#555555] max-w-xl">
              {language === 'bn'
                ? 'মেডিক্লেইম, স্বাস্থ্য সাথী ও আয়ুষ্মান ভারত কার্ডের বিবরণ ও পলিসি ডকুমেন্ট এক স্থানে সংরক্ষিত রাখুন।'
                : 'Manage Mediclaim, Swasthya Sathi, and Ayushman Bharat policies with cashless hospital helplines.'}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white font-bold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন পলিসি যোগ করুন' : 'Add Policy'}</span>
          </button>
        </div>

        {/* Policy Expiry Disclaimer Notice */}
        <div className="p-4 rounded-2xl bg-[#F1F8F2] border border-[#D5E8D7] text-xs text-[#171717] flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-[#171717]">
              {language === 'bn' ? 'গুরুত্বপূর্ণ নির্দেশিকা (Disclaimer):' : 'Important Disclaimer:'}
            </span>
            <span className="text-[#555555]">
              {language === 'bn'
                ? 'ভল্টে সংরক্ষিত কার্ড স্বয়ংক্রিয়ভাবে হাসপাতালে কভারেজ গ্যারান্টি প্রদান করে না। হাসপাতালে ভর্তির সময় মূল কার্ড ও টিপিএ প্রি-অথোরাইজেশন প্রক্রিয়ার শর্ত প্রযোজ্য।'
                : 'Stored cards do not automatically guarantee hospital coverage. Hospital admission remains subject to physical card verification and TPA pre-authorization protocol.'}
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insurancePolicies.map(policy => {
            const isGovt = policy.category === 'swasthya_sathi' || policy.category === 'ayushman_bharat';

            return (
              <div
                key={policy.id}
                className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 shadow-xs border border-[#D5E8D7] flex flex-col justify-between space-y-6"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#D5E8D7]">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-[#D5E8D7] text-[#2E7D32]">
                      {policy.category.replace('_', ' ')}
                    </span>
                    <CreditCard className="w-5 h-5 text-[#2E7D32]" />
                  </div>

                  <h3 className="text-lg font-black text-[#171717] mt-3 leading-snug">
                    {policy.policyName}
                  </h3>
                  <p className="text-xs text-[#555555]">{policy.provider}</p>

                  <div className="my-4 p-3 rounded-xl bg-white border border-[#D5E8D7] shadow-2xs">
                    <span className="text-[10px] uppercase text-[#555555] block font-semibold">
                      {language === 'bn' ? 'পলিসি / কার্ড নম্বর:' : 'Policy / Card Number:'}
                    </span>
                    <span className="font-mono text-base font-bold text-[#171717] tracking-wider block mt-0.5">
                      {policy.policyNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-[#555555] block">
                        {language === 'bn' ? 'কভারেজ সীমা:' : 'Sum Insured:'}
                      </span>
                      <span className="font-bold text-[#2E7D32]">₹{(policy.sumInsured / 100000).toFixed(1)} Lakh</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#555555] block">
                        {language === 'bn' ? 'মেয়াদ উত্তীর্ণ:' : 'Valid Till:'}
                      </span>
                      <span className="font-bold text-[#171717]">{policy.validTill}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D5E8D7] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#555555] block">
                      {language === 'bn' ? 'ক্যাশলেস হেল্পলাইন:' : 'Cashless Helpline:'}
                    </span>
                    <a href={`tel:${policy.cashlessHelpline}`} className="font-bold text-[#2E7D32] hover:underline">
                      📞 {policy.cashlessHelpline}
                    </a>
                  </div>
                  <button
                    onClick={() => deleteInsurancePolicy(policy.id)}
                    className="p-2 rounded-lg bg-white border border-[#D5E8D7] hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
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
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-xl border border-[#D5E8D7] space-y-5">
              <h3 className="text-lg font-black text-[#171717]">
                {language === 'bn' ? 'নতুন স্বাস্থ্য কার্ড / পলিসি যোগ করুন' : 'Add Health Policy'}
              </h3>

              <form onSubmit={handleAddPolicy} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1">
                    {language === 'bn' ? 'বীমা প্রদানকারী সংস্থা *' : 'Insurance Provider *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Star Health, Care Health, Govt. of WB"
                    value={provider}
                    onChange={e => setProvider(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm text-[#171717] focus:border-[#2E7D32] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1">
                    {language === 'bn' ? 'পলিসি / স্কিমের নাম' : 'Policy / Scheme Name'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Senior Citizen Red Carpet / Swasthya Sathi"
                    value={policyName}
                    onChange={e => setPolicyName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm text-[#171717] focus:border-[#2E7D32] outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1">
                      {language === 'bn' ? 'পলিসি / URN নম্বর *' : 'Policy / URN Number *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="WB/KOL/..."
                      value={policyNumber}
                      onChange={e => setPolicyNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5E8D7] text-xs font-mono text-[#171717] focus:border-[#2E7D32] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1">
                      {language === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                    </label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5E8D7] text-xs text-[#171717] focus:border-[#2E7D32] outline-hidden"
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
                    <label className="block text-xs font-bold text-[#171717] mb-1">
                      {language === 'bn' ? 'মেয়াদ উত্তীর্ণ তারিখ' : 'Expiry Date'}
                    </label>
                    <input
                      type="date"
                      value={validTill}
                      onChange={e => setValidTill(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5E8D7] text-xs text-[#171717] focus:border-[#2E7D32] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1">
                      {language === 'bn' ? 'কভারেজ (টাকা)' : 'Coverage (₹)'}
                    </label>
                    <input
                      type="number"
                      value={sumInsured}
                      onChange={e => setSumInsured(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5E8D7] text-xs text-[#171717] focus:border-[#2E7D32] outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1">
                    {language === 'bn' ? 'ক্যাশলেস হেল্পলাইন নম্বর' : 'Cashless Helpline'}
                  </label>
                  <input
                    type="text"
                    placeholder="1800 425 2255"
                    value={cashlessHelpline}
                    onChange={e => setCashlessHelpline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm text-[#171717] focus:border-[#2E7D32] outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#D5E8D7]">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border border-[#D5E8D7] bg-white text-xs font-bold text-[#555555] hover:bg-[#F1F8F2] cursor-pointer"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold shadow-xs cursor-pointer"
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
