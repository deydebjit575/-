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
  const { patientProfile, navigateTo } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header & Actions */}
        <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">
              {language === 'bn' ? 'জরুরি চিকিৎসা সারসংক্ষেপ' : 'Critical Medical Summary'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#171717]">
              {patientProfile.fullName}
            </h1>
            <p className="text-xs text-[#555555]">
              {language === 'bn' ? 'সর্বশেষ আপডেট:' : 'Last Updated:'} {new Date(patientProfile.updatedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-[#D5E8D7] bg-white hover:bg-[#F1F8F2] text-[#171717] text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#2E7D32]" />
              <span>{language === 'bn' ? 'প্রিন্ট / PDF সংরক্ষণ' : 'Print / Export PDF'}</span>
            </button>
            <button
              onClick={() => navigateTo('share-records')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{t('shareRecords')}</span>
            </button>
          </div>
        </div>

        {/* Vital Health Metrics Snapshot Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#E8F5E9] p-5 rounded-2xl border border-[#D5E8D7] shadow-xs">
            <span className="text-xs font-bold text-[#555555] block">
              {language === 'bn' ? 'রক্তের গ্রুপ' : 'Blood Group'}
            </span>
            <span className="text-2xl font-black text-rose-700 mt-1 block">{patientProfile.bloodGroup}</span>
            <span className="text-[10px] text-[#555555]">
              {language === 'bn' ? 'জরুরি ট্রান্সফিউশন প্রস্তুত' : 'Transfusion Ready'}
            </span>
          </div>

          <div className="bg-[#E8F5E9] p-5 rounded-2xl border border-[#D5E8D7] shadow-xs">
            <span className="text-xs font-bold text-[#555555] block">
              {language === 'bn' ? 'বয়স ও লিঙ্গ' : 'Age & Gender'}
            </span>
            <span className="text-2xl font-black text-[#171717] mt-1 block">
              {patientProfile.age} {language === 'bn' ? 'বছর' : 'Y'} • <span className="capitalize">{patientProfile.gender}</span>
            </span>
            <span className="text-[10px] text-[#555555]">
              {language === 'bn' ? 'জন্ম: ' : 'DOB: '} {patientProfile.dateOfBirth}
            </span>
          </div>

          <div className="bg-[#E8F5E9] p-5 rounded-2xl border border-[#D5E8D7] shadow-xs">
            <span className="text-xs font-bold text-[#555555] block">
              {language === 'bn' ? 'রক্তচাপ' : 'Recent Blood Pressure'}
            </span>
            <span className="text-2xl font-black text-[#2E7D32] mt-1 block">124 / 80</span>
            <span className="text-[10px] text-[#2E7D32] font-semibold">
              mmHg ({language === 'bn' ? 'স্বাভাবিক' : 'Normal'})
            </span>
          </div>

          <div className="bg-[#E8F5E9] p-5 rounded-2xl border border-[#D5E8D7] shadow-xs">
            <span className="text-xs font-bold text-[#555555] block">
              {language === 'bn' ? 'রক্তে অক্সিজেন (SpO2)' : 'Oxygen Saturation (SpO2)'}
            </span>
            <span className="text-2xl font-black text-[#2E7D32] mt-1 block">99%</span>
            <span className="text-[10px] text-[#2E7D32] font-semibold">
              {language === 'bn' ? 'স্বাভাবিক পালস' : 'Normal Pulse'}
            </span>
          </div>
        </div>

        {/* VITALS TREND CHART (RECHARTS) */}
        <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-[#2E7D32]" />
              <h3 className="text-base font-black text-[#171717]">
                {language === 'bn' ? 'রক্তচাপ ও গ্লুকোজ ট্রেন্ড হিস্ট্রি' : 'Blood Pressure & Glucose History'}
              </h3>
            </div>
            <span className="text-xs text-[#555555]">
              {language === 'bn' ? 'গত ৬ সপ্তাহের রেকর্ড' : 'Last 6 weeks history'}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#D5E8D7] h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={patientProfile.vitalsHistory} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D5E8D7" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#555555' }} />
                <YAxis tick={{ fontSize: 11, fill: '#555555' }} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D5E8D7', borderRadius: '12px', color: '#171717' }} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#171717' }} />
                <Line type="monotone" dataKey="systolicBP" name="Systolic BP (mmHg)" stroke="#2E7D32" strokeWidth={3} />
                <Line type="monotone" dataKey="diastolicBP" name="Diastolic BP (mmHg)" stroke="#1b4332" strokeWidth={2} />
                <Line type="monotone" dataKey="bloodGlucose" name="Fasting Glucose (mg/dL)" stroke="#d97706" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ALLERGIES & ONGOING MEDICATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Allergies & Conditions */}
          <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 border border-[#D5E8D7] shadow-xs space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-[#D5E8D7] text-rose-700 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>{language === 'bn' ? 'জানা অ্যালার্জি ও শর্তাবলী' : 'Allergies & Medical Alerts'}</span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#171717] block">
                {language === 'bn' ? 'জানা অ্যালার্জি:' : 'Known Allergies:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {patientProfile.knownAllergies.map((all, i) => (
                  <span key={i} className="px-3 py-1 bg-white border border-rose-300 text-rose-700 text-xs font-bold rounded-lg shadow-2xs">
                    ⚠️ {all}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-[#171717] block">
                {language === 'bn' ? 'বিদ্যমান রোগ:' : 'Existing Conditions:'}
              </span>
              <ul className="space-y-1.5 text-xs text-[#555555] list-disc pl-4">
                {patientProfile.existingConditions.map((cond, i) => (
                  <li key={i}>{cond}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#D5E8D7]">
              <span className="text-xs font-bold text-[#171717] block">
                {language === 'bn' ? 'অতীতের অপারেশন:' : 'Past Surgeries:'}
              </span>
              {patientProfile.pastSurgeries.map((surg, i) => (
                <div key={i} className="bg-white p-2.5 rounded-lg border border-[#D5E8D7] text-xs">
                  <span className="font-bold text-[#171717]">{surg.procedure} ({surg.year})</span>
                  {surg.hospital && <span className="text-[#555555] block text-[11px]">{surg.hospital}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Current Daily Medications */}
          <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 border border-[#D5E8D7] shadow-xs space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-[#D5E8D7] text-[#2E7D32] font-bold text-sm">
              <Pill className="w-5 h-5" />
              <span>{language === 'bn' ? 'চলমান দৈনিক ওষুধসমূহ' : 'Current Daily Medications'}</span>
            </div>

            <div className="space-y-2.5">
              {patientProfile.currentMedications.map((med, i) => (
                <div key={i} className="p-3 bg-white border border-[#D5E8D7] rounded-xl flex items-center justify-between text-xs shadow-2xs">
                  <div>
                    <h5 className="font-bold text-[#171717] text-sm">{med.name}</h5>
                    <p className="text-[#555555] text-[11px]">{med.frequency}</p>
                    {med.prescribedBy && (
                      <p className="text-[10px] text-[#2E7D32] mt-0.5">
                        {language === 'bn' ? 'পরামর্শক: ' : 'Prescribed By: '} {med.prescribedBy}
                      </p>
                    )}
                  </div>
                  <span className="px-2.5 py-1 bg-[#E8F5E9] border border-[#D5E8D7] text-[#2E7D32] rounded-md font-bold text-xs">
                    {med.dosage}
                  </span>
                </div>
              ))}
            </div>

            {/* Treating Doctor */}
            {patientProfile.treatingDoctor && (
              <div className="p-4 bg-white border border-[#D5E8D7] rounded-2xl text-xs space-y-1 mt-4">
                <span className="font-bold text-[#2E7D32] block">
                  {language === 'bn' ? 'প্রধান পরামর্শক চিকিৎসক:' : 'Primary Consultant Doctor:'}
                </span>
                <p className="font-bold text-[#171717]">{patientProfile.treatingDoctor.name}</p>
                <p className="text-[#555555] text-[11px]">{patientProfile.treatingDoctor.speciality} • {patientProfile.treatingDoctor.hospital}</p>
                <a href={`tel:${patientProfile.treatingDoctor.phone}`} className="text-[#2E7D32] hover:text-[#256B2A] font-bold block pt-1">
                  📞 {patientProfile.treatingDoctor.phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* EMERGENCY CONTACTS LIST */}
        <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-[#171717] font-black text-base">
            <PhoneCall className="w-5 h-5 text-rose-600" />
            <span>{language === 'bn' ? 'জরুরি যোগাযোগ ও অভিভাবক তালিকা' : 'Emergency Contacts & Guardians'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {patientProfile.emergencyContacts.map(contact => (
              <div key={contact.id} className="p-4 rounded-2xl bg-white border border-[#D5E8D7] text-xs space-y-1.5 shadow-2xs">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-[#171717]">{contact.name}</span>
                  {contact.isPrimary && (
                    <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold">
                      Primary
                    </span>
                  )}
                </div>
                <p className="text-[#555555]">{contact.relationship}</p>
                <a href={`tel:${contact.phone}`} className="text-[#2E7D32] hover:text-[#256B2A] font-bold block">
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
