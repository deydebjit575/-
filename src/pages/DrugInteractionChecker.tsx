import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  Pill,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Search,
  ArrowRight,
  Info
} from 'lucide-react';
import { checkDrugInteractions } from '../services/medivaultClinicalServices';
import { DrugInteractionResult } from '../types';

export const DrugInteractionChecker: React.FC = () => {
  const { language } = useLanguage();
  const { patientProfile } = useApp();

  const [drug1, setDrug1] = useState('');
  const [drug2, setDrug2] = useState('');
  const [result, setResult] = useState<DrugInteractionResult | null>(null);

  const commonMeds = [
    'Aspirin', 'Warfarin', 'Clopidogrel', 'Omeprazole', 'Telmisartan',
    'Spironolactone', 'Metformin', 'Atorvastatin', 'Clarithromycin', 'Paracetamol'
  ];

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drug1.trim() || !drug2.trim()) return;

    const res = checkDrugInteractions(drug1.trim(), drug2.trim());
    setResult(res);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-[#2E7D32] font-bold text-xs uppercase tracking-wider">
            <Pill className="w-4 h-4" />
            <span>MediVault Clinical Pharmacology Safety</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171717]">
            {language === 'bn' ? 'ওষুধের পার্শ্বপ্রতিক্রিয়া ও মিথস্ক্রিয়া পরীক্ষক' : 'Drug Interaction Checker'}
          </h1>
          <p className="text-xs text-[#555555] leading-relaxed">
            {language === 'bn'
              ? 'একাধিক ওষুধ একসাথে সেবনের পূর্বে সম্ভাব্য বিপজ্জনক ড্রাগ-ড্রাগ ইন্টারঅ্যাকশন (যেমন: রক্তক্ষরণ, কিডনি চাপ বা কার্যক্ষমতা হ্রাস) পরীক্ষা করুন।'
              : 'Evaluate potential drug-drug interactions, risks, and clinical advice before taking new combinations.'}
          </p>
        </div>

        {/* Checker Form */}
        <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs space-y-6">
          <form onSubmit={handleCheck} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  {language === 'bn' ? '১ম ওষুধ (Drug 1) *' : 'First Medication *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aspirin, Clopidogrel, Telmisartan"
                  value={drug1}
                  onChange={e => setDrug1(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm text-[#171717] focus:border-[#2E7D32] outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  {language === 'bn' ? '২য় ওষুধ (Drug 2) *' : 'Second Medication *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Warfarin, Omeprazole, Spironolactone"
                  value={drug2}
                  onChange={e => setDrug2(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm text-[#171717] focus:border-[#2E7D32] outline-hidden font-medium"
                />
              </div>
            </div>

            {/* Quick Pill Selector */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-bold text-[#555555] block">
                {language === 'bn' ? 'দ্রুত নির্বাচনের জন্য সাধারণ ওষুধসমূহ:' : 'Common medications (Click to fill):'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {commonMeds.map(m => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => {
                      if (!drug1) setDrug1(m);
                      else if (!drug2) setDrug2(m);
                      else setDrug1(m);
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-[#F1F8F2] text-[#171717] text-xs font-medium rounded-lg border border-[#D5E8D7] transition-colors cursor-pointer shadow-2xs"
                  >
                    + {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 bg-[#2E7D32] hover:bg-[#256B2A] text-white font-black text-sm rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{language === 'bn' ? 'ইন্টারঅ্যাকশন পরীক্ষা করুন' : 'Check Drug Interaction'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Results Box */}
        {result && (
          <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs space-y-5 animate-in fade-in slide-in-from-bottom-3">
            <div className="flex items-center justify-between pb-4 border-b border-[#D5E8D7]">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-2xl border ${
                  result.severity === 'High'
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : result.severity === 'Moderate'
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : 'bg-white border-[#D5E8D7] text-[#2E7D32]'
                }`}>
                  <Pill className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] uppercase font-bold text-[#555555]">মিথস্ক্রিয়ার তীব্রতা:</span>
                  <h3 className="text-xl font-black text-[#171717]">
                    {result.severity === 'High' && '🚨 উচ্চ ঝুঁকি (Severe Risk)'}
                    {result.severity === 'Moderate' && '⚠️ মাঝারি সতর্কতা (Moderate Risk)'}
                    {result.severity === 'Minor' && 'ℹ️ মৃদু প্রভাব (Minor Impact)'}
                    {result.severity === 'None' && '✅ কোনো উল্লেখযোগ্য ক্ষতিকর ইন্টারঅ্যাকশন নেই'}
                  </h3>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
                result.severity === 'High'
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : result.severity === 'Moderate'
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-white border-[#D5E8D7] text-[#2E7D32]'
              }`}>
                {result.severity}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] space-y-1 shadow-2xs">
                <span className="font-bold text-[#171717] block text-sm">বর্ণনা ও সম্ভাব্য প্রভাব:</span>
                <p className="text-[#555555] leading-relaxed">{result.description}</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] space-y-1 shadow-2xs">
                <span className="font-bold text-[#171717] block text-sm">মেকানিজম ও প্রক্রিয়া:</span>
                <p className="text-[#555555] leading-relaxed">{result.mechanism}</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] text-xs space-y-1 shadow-2xs">
              <span className="font-bold text-[#2E7D32] block text-sm">চিকিৎসাগত পরামর্শ ও সতর্কতা:</span>
              <p className="text-[#171717] leading-relaxed font-medium">{result.clinicalAdvice}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
