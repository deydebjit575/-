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
      const result = assessSymptomsAI(selectedSymptoms, patientProfile.age || 70, language);
      setAssessmentResult(result);
      setIsAnalyzing(false);
    }, 600);
  };

  React.useEffect(() => {
    if (assessmentResult && selectedSymptoms.length > 0) {
      setAssessmentResult(assessSymptomsAI(selectedSymptoms, patientProfile.age || 70, language));
    }
  }, [language]);

  const handleReset = () => {
    setSelectedSymptoms([]);
    setAssessmentResult(null);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-[#2E7D32] font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{language === 'bn' ? 'মেডিভল্ট এআই স্বাস্থ্য চেক-ইন' : 'MediVault AI Health Check-in'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171717]">
            {language === 'bn' ? 'এআই স্বাস্থ্য চেক-ইন ও উপসর্গ মূল্যায়ন' : 'AI Health Symptom Check-in'}
          </h1>
          <p className="text-xs text-[#555555] leading-relaxed">
            {language === 'bn'
              ? 'প্রবীণ বয়সের সাধারণ উপসর্গ নির্বাচন করুন এবং তাৎক্ষণিক স্বাস্থ্য সতর্কতা, জীবনযাত্রার পরামর্শ ও উপযুক্ত বিশেষজ্ঞের দিকনির্দেশনা গ্রহণ করুন।'
              : 'Select your current symptoms to get preliminary wellness insights and recommended healthcare steps.'}
          </p>

          {/* Prominent Medical Disclaimer */}
          <div className="p-4 rounded-2xl bg-[#F1F8F2] border border-[#D5E8D7] text-xs text-[#171717] flex items-start space-x-3 mt-4">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm text-[#171717]">
                {language === 'bn' ? 'চিকিৎসাগত সতর্কবার্তা:' : 'Medical Disclaimer:'}
              </span>
              <p className="mt-0.5 leading-relaxed text-[#555555]">
                {language === 'bn'
                  ? 'এই এআই মূল্যায়ন কোনো নিশ্চিত বা চূড়ান্ত মেডিকেল ডায়াগনোসিস নয়। তীব্র বুকে ব্যথা, মারাত্মক শ্বাসকষ্ট, বা আকস্মিক প্যারালাইসিসের ক্ষেত্রে অবিলম্বে নিচে থাকা "জরুরি SOS" বা 112 নম্বরে যোগাযোগ করুন।'
                  : 'This AI symptom assessment is an informational tool and does not constitute a formal diagnosis. For acute chest tightness, severe breathlessness, or neurological changes, immediately trigger Emergency SOS or dial 112.'}
              </p>
            </div>
          </div>
        </div>

        {/* Symptom Selection Grid */}
        <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#171717]">
              {language === 'bn' ? 'বর্তমান উপসর্গসমূহ নির্বাচন করুন:' : 'Select Symptoms You Are Experiencing:'}
            </h3>
            <span className="text-xs text-[#2E7D32] font-bold">
              {selectedSymptoms.length} {language === 'bn' ? 'টি নির্বাচিত' : 'Selected'}
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
                      ? 'bg-white border-[#2E7D32] shadow-2xs ring-2 ring-[#2E7D32]/20 font-bold text-[#171717]'
                      : 'bg-white/90 border-[#D5E8D7] hover:bg-white text-[#171717]'
                  }`}
                >
                  <div>
                    <span className="block text-[#171717]">{language === 'bn' ? symptom.labelBn : symptom.labelEn}</span>
                    <span className="text-[10px] text-[#555555] block mt-0.5">{symptom.category}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 accent-[#2E7D32] rounded cursor-pointer"
                  />
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#D5E8D7] flex items-center justify-between gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl border border-[#D5E8D7] bg-white text-xs font-bold text-[#555555] hover:bg-[#F1F8F2] flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'রিসেট করুন' : 'Reset'}</span>
            </button>

            <button
              onClick={handleRunAssessment}
              disabled={selectedSymptoms.length === 0 || isAnalyzing}
              className={`px-6 py-3 rounded-xl font-black text-xs shadow-xs transition-all flex items-center space-x-2 cursor-pointer ${
                selectedSymptoms.length > 0
                  ? 'bg-[#2E7D32] hover:bg-[#256B2A] text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isAnalyzing
                  ? (language === 'bn' ? 'বিশ্লেষণ চলছে...' : 'Analyzing Symptoms...')
                  : (language === 'bn' ? 'স্বাস্থ্য মূল্যায়ন শুরু করুন' : 'Start Health Assessment')}
              </span>
            </button>
          </div>
        </div>

        {/* Assessment Results Card */}
        {assessmentResult && (
          <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs space-y-6 animate-in fade-in slide-in-from-bottom-3">
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#D5E8D7] gap-3">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-2xl border ${
                  assessmentResult.riskLevel === 'Emergency Alert'
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : assessmentResult.riskLevel === 'Seek Prompt Care'
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : 'bg-white border-[#D5E8D7] text-[#2E7D32]'
                }`}>
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] uppercase font-bold text-[#555555]">
                    {language === 'bn' ? 'মূল্যায়ন ঝুঁকি মাত্রা:' : 'Assessment Risk Level:'}
                  </span>
                  <h3 className="text-xl font-black text-[#171717]">
                    {language === 'bn'
                      ? (assessmentResult.riskLevel === 'Emergency Alert'
                          ? '🚨 জরুরি সতর্কতা (Emergency Alert)'
                          : assessmentResult.riskLevel === 'Seek Prompt Care'
                          ? '⚠️ দ্রুত পরামর্শ নিন (Seek Prompt Care)'
                          : 'স্বাভাবিক / মৃদু ঝুঁকি (Low Risk)')
                      : assessmentResult.riskLevel}
                  </h3>
                </div>
              </div>

              {assessmentResult.riskLevel === 'Emergency Alert' && (
                <button
                  onClick={() => navigateTo('emergency-sos')}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs animate-pulse flex items-center space-x-2 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{language === 'bn' ? 'তাৎক্ষণিক জরুরি SOS পাঠান' : 'Initiate Emergency SOS'}</span>
                </button>
              )}
            </div>

            {/* Primary Analysis */}
            <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] text-xs leading-relaxed space-y-1 shadow-2xs">
              <span className="font-bold text-[#171717] block text-sm">
                {language === 'bn' ? 'প্রাথমিক পর্যবেক্ষণ:' : 'Primary Assessment:'}
              </span>
              <p className="text-[#555555]">{assessmentResult.primaryAssessment}</p>
            </div>

            {/* Recommended Actions */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#171717] block">
                {language === 'bn' ? 'করণীয় পদক্ষেপ:' : 'Recommended Actions:'}
              </span>
              <ul className="space-y-1.5 text-xs text-[#555555] list-disc pl-5">
                {assessmentResult.recommendedActions.map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </div>

            {/* Lifestyle & Home Care */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#171717] block">
                {language === 'bn' ? 'জীবনধারা ও প্রাথমিক যত্ন:' : 'Lifestyle & Home Care Guidance:'}
              </span>
              <ul className="space-y-1.5 text-xs text-[#555555] list-disc pl-5">
                {assessmentResult.lifestyleAndHomeCare.map((care, i) => (
                  <li key={i}>{care}</li>
                ))}
              </ul>
            </div>

            {/* Suggested Speciality */}
            <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] text-xs flex items-center justify-between shadow-2xs">
              <div>
                <span className="text-[#2E7D32] font-bold block">
                  {language === 'bn' ? 'পরামর্শযোগ্য চিকিৎসক বিভাগ:' : 'Recommended Specialist Department:'}
                </span>
                <span className="text-[#171717] font-semibold">{assessmentResult.suggestedDoctorSpeciality}</span>
              </div>
              <button
                onClick={() => navigateTo('nearby-hospitals')}
                className="px-4 py-2 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'নিকটস্থ হাসপাতাল খুঁজুন →' : 'Find Nearby Hospitals →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
