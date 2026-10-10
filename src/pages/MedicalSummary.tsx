import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  Heart,
  Activity,
  AlertTriangle,
  Pill,
  Printer,
  Share2,
  PhoneCall,
  User,
  ShieldCheck,
  Calendar,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export const MedicalSummary: React.FC = () => {
  const { language, t } = useLanguage();
  const { patientProfile, navigateTo, showToast } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header & Actions */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest">
              {language === 'bn' ? 'জরুরি চিকিৎসা সারসংক্ষেপ' : 'Critical Medical Summary'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-950">
              {patientProfile.fullName}
            </h1>
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'সর্বশেষ আপডেট:' : 'Last Updated:'} {new Date(patientProfile.updatedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'bn' ? 'প্রিন্ট / PDF সংরক্ষণ' : 'Print / Export PDF'}</span>
            </button>
            <button
              onClick={() => navigateTo('share-records')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{t('shareRecords')}</span>
            </button>
          </div>
        </div>

        {/* Vital Health Metrics Snapshot Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
            <span className="text-xs font-bold text-slate-500 block">রক্তের গ্রুপ (Blood Group)</span>
            <span className="text-2xl font-black text-rose-600 mt-1 block">{patientProfile.bloodGroup}</span>
            <span className="text-[10px] text-slate-400">জরুরি ট্রান্সফিউশন প্রস্তুত</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
            <span className="text-xs font-bold text-slate-500 block">বয়স ও লিঙ্গ</span>
            <span className="text-2xl font-black text-navy-950 mt-1 block">
              {patientProfile.age}Y • <span className="capitalize">{patientProfile.gender}</span>
            </span>
            <span className="text-[10px] text-slate-400">জন্ম: {patientProfile.dateOfBirth}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
            <span className="text-xs font-bold text-slate-500 block">রক্তচাপ (Recent BP)</span>
            <span className="text-2xl font-black text-teal-700 mt-1 block">124 / 80</span>
            <span className="text-[10px] text-emerald-600 font-semibold">mmHg (স্বাভাবিক)</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
            <span className="text-xs font-bold text-slate-500 block">রক্তে অক্সিজেন (SpO2)</span>
            <span className="text-2xl font-black text-cyan-700 mt-1 block">99%</span>
            <span className="text-[10px] text-emerald-600 font-semibold">স্বাভাবিক পালস</span>
          </div>
        </div>

        {/* VITALS TREND CHART (RECHARTS) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-teal-700" />
              <h3 className="text-base font-black text-navy-950">
                {language === 'bn' ? 'রক্তচাপ ও গ্লুকোজ ট্রেন্ড হিস্ট্রি' : 'Blood Pressure & Glucose History'}
              </h3>
            </div>
            <span className="text-xs text-slate-500">গত ৬ সপ্তাহের রেকর্ড</span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={patientProfile.vitalsHistory} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="systolicBP" name="Systolic BP (mmHg)" stroke="#0d9488" strokeWidth={3} />
                <Line type="monotone" dataKey="diastolicBP" name="Diastolic BP (mmHg)" stroke="#06b6d4" strokeWidth={2} />
                <Line type="monotone" dataKey="bloodGlucose" name="Fasting Glucose (mg/dL)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ALLERGIES & ONGOING MEDICATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Allergies & Conditions */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 text-rose-700 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>{language === 'bn' ? 'জানা অ্যালার্জি ও শর্তাবলী' : 'Allergies & Medical Alerts'}</span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">জানা অ্যালার্জি:</span>
              <div className="flex flex-wrap gap-2">
                {patientProfile.knownAllergies.map((all, i) => (
                  <span key={i} className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-lg">
                    ⚠️ {all}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 block">বিদ্যমান রোগ:</span>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4">
                {patientProfile.existingConditions.map((cond, i) => (
                  <li key={i}>{cond}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 block">অতীতের অপারেশন (Surgeries):</span>
              {patientProfile.pastSurgeries.map((surg, i) => (
                <div key={i} className="bg-slate-50 p-2.5 rounded-lg text-xs">
                  <span className="font-bold text-slate-800">{surg.procedure} ({surg.year})</span>
                  {surg.hospital && <span className="text-slate-500 block text-[11px]">{surg.hospital}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Current Daily Medications */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 text-teal-800 font-bold text-sm">
              <Pill className="w-5 h-5" />
              <span>{language === 'bn' ? 'চলমান দৈনিক ওষুধসমূহ' : 'Current Daily Medications'}</span>
            </div>

            <div className="space-y-2.5">
              {patientProfile.currentMedications.map((med, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">{med.name}</h5>
                    <p className="text-slate-500 text-[11px]">{med.frequency}</p>
                    {med.prescribedBy && <p className="text-[10px] text-teal-700 mt-0.5">পরামর্শক: {med.prescribedBy}</p>}
                  </div>
                  <span className="px-2.5 py-1 bg-teal-100 text-teal-800 rounded-md font-bold text-xs">
                    {med.dosage}
                  </span>
                </div>
              ))}
            </div>

            {/* Treating Doctor */}
            {patientProfile.treatingDoctor && (
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs space-y-1 mt-4">
                <span className="font-bold text-teal-900 block">প্রধান পরামর্শক চিকিৎসক:</span>
                <p className="font-bold text-slate-800">{patientProfile.treatingDoctor.name}</p>
                <p className="text-slate-600 text-[11px]">{patientProfile.treatingDoctor.speciality} • {patientProfile.treatingDoctor.hospital}</p>
                <a href={`tel:${patientProfile.treatingDoctor.phone}`} className="text-teal-700 font-bold block pt-1">
                  📞 {patientProfile.treatingDoctor.phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* EMERGENCY CONTACTS LIST */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center space-x-2 text-navy-950 font-black text-base">
            <PhoneCall className="w-5 h-5 text-rose-600" />
            <span>{language === 'bn' ? 'জরুরি যোগাযোগ ও অভিভাবক তালিকা' : 'Emergency Contacts & Guardians'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {patientProfile.emergencyContacts.map(contact => (
              <div key={contact.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-navy-950">{contact.name}</span>
                  {contact.isPrimary && (
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold">
                      Primary
                    </span>
                  )}
                </div>
                <p className="text-slate-500">{contact.relationship}</p>
                <a href={`tel:${contact.phone}`} className="text-teal-700 font-bold block">
                  📞 {contact.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
