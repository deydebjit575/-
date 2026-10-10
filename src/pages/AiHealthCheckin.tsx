import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  AlertTriangle,
  HeartPulse,
  CheckCircle2,
  Stethoscope,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Activity,
  PhoneCall
} from 'lucide-react';
import { commonSymptomsList, assessSymptomsAI } from '../services/medivaultClinicalServices';
import { HealthCheckinResult } from '../types';

export const AiHealthCheckin: React.FC = () => {
  const { language } = useLanguage();
  const { patientProfile, navigateTo } = useApp();

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [assessmentResult, setAssessmentResult] = useState<HealthCheckinResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleRunAssessment = () => {
    if (selectedSymptoms.length === 0) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const result = assessSymptomsAI(selectedSymptoms, patientProfile.age || 70);
      setAssessmentResult(result);
      setIsAnalyzing(false);
    }, 600);
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setAssessmentResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-3">
          <div className="flex items-center space-x-2 text-teal-700 font-bold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>MediVault AI Health Check-in (স্মার্ট স্বাস্থ্য মূল্যায়ন)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950">
            {language === 'bn' ? 'এআই স্বাস্থ্য চেক-ইন ও উপসর্গ মূল্যায়ন' : 'AI Health Symptom Check-in'}
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'bn'
              ? 'প্রবীণ বয়সের সাধারণ উপসর্গ নির্বাচন করুন এবং তাৎক্ষণিক স্বাস্থ্য সতর্কতা, জীবনযাত্রার পরামর্শ ও উপযুক্ত বিশেষজ্ঞের দিকনির্দেশনা গ্রহণ করুন।'
              : 'Select your current symptoms to get preliminary wellness insights and recommended healthcare steps.'}
          </p>

          {/* Prominent Medical Disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-3 mt-4">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm">চিকিৎসাগত সতর্কবার্তা (Medical Disclaimer):</span>
              <p className="mt-0.5 leading-relaxed">
                এই এআই মূল্যায়ন কোনো নিশ্চিত বা চূড়ান্ত মেডিকেল ডায়াগনোসিস নয়। তীব্র বুকে ব্যথা, মারাত্মক শ্বাসকষ্ট, বা আকস্মিক প্যারালাইসিসের ক্ষেত্রে অবিলম্বে নিচে থাকা <strong>"জরুরি SOS"</strong> বা <strong>112</strong> নম্বরে যোগাযোগ করুন।
              </p>
            </div>
          </div>
        </div>

        {/* Symptom Selection Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-navy-950">
              {language === 'bn' ? 'বর্তমান উপসর্গসমূহ নির্বাচন করুন:' : 'Select Symptoms You Are Experiencing:'}
            </h3>
            <span className="text-xs text-slate-500 font-bold">
              {selectedSymptoms.length} টি নির্বাচিত
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {commonSymptomsList.map(symptom => {
              const isSelected = selectedSymptoms.includes(symptom.id);
              return (
                <div
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-teal-50 border-teal-500 shadow-sm ring-2 ring-teal-500/20 font-bold text-teal-950'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div>
                    <span className="block">{language === 'bn' ? symptom.labelBn : symptom.labelEn}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{symptom.category}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>রিসেট করুন</span>
            </button>

            <button
              onClick={handleRunAssessment}
              disabled={selectedSymptoms.length === 0 || isAnalyzing}
              className={`px-6 py-3 rounded-xl font-black text-xs shadow-md transition-all flex items-center space-x-2 ${
                selectedSymptoms.length > 0
                  ? 'bg-teal-600 hover:bg-teal-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? 'বিশ্লেষণ চলছে...' : 'স্বাস্থ্য মূল্যায়ন শুরু করুন'}</span>
            </button>
          </div>
        </div>

        {/* Assessment Results Card */}
        {assessmentResult && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-elevated space-y-6 animate-in fade-in slide-in-from-bottom-3">
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-2xl ${
                  assessmentResult.riskLevel === 'Emergency Alert'
                    ? 'bg-rose-100 text-rose-700'
                    : assessmentResult.riskLevel === 'Seek Prompt Care'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-teal-100 text-teal-700'
                }`}>
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] uppercase font-bold text-slate-400">মূল্যায়ন ঝুঁকি মাত্রা:</span>
                  <h3 className="text-xl font-black text-navy-950">{assessmentResult.riskLevel}</h3>
                </div>
              </div>

              {assessmentResult.riskLevel === 'Emergency Alert' && (
                <button
                  onClick={() => navigateTo('emergency-sos')}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-emergency animate-pulse flex items-center space-x-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>তাৎক্ষণিক জরুরি SOS পাঠান</span>
                </button>
              )}
            </div>

            {/* Primary Analysis */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs leading-relaxed space-y-1">
              <span className="font-bold text-slate-900 block text-sm">প্রাথমিক পর্যবেক্ষণ:</span>
              <p className="text-slate-700">{assessmentResult.primaryAssessment}</p>
            </div>

            {/* Recommended Actions */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-navy-950 block">করণীয় পদক্ষেপ:</span>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-5">
                {assessmentResult.recommendedActions.map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </div>

            {/* Lifestyle & Home Care */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-navy-950 block">জীবনধারা ও প্রাথমিক যত্ন:</span>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-5">
                {assessmentResult.lifestyleAndHomeCare.map((care, i) => (
                  <li key={i}>{care}</li>
                ))}
              </ul>
            </div>

            {/* Suggested Speciality */}
            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-xs flex items-center justify-between">
              <div>
                <span className="text-teal-900 font-bold block">পরামর্শযোগ্য চিকিৎসক বিভাগ:</span>
                <span className="text-slate-800 font-semibold">{assessmentResult.suggestedDoctorSpeciality}</span>
              </div>
              <button
                onClick={() => navigateTo('nearby-hospitals')}
                className="px-4 py-2 bg-teal-700 text-white rounded-xl font-bold text-xs hover:bg-teal-800 transition-colors"
              >
                নিকটস্থ হাসপাতাল খুঁজুন →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
