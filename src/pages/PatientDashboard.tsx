import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  FileText,
  MapPin,
  Share2,
  AlertOctagon,
  User,
  Heart,
  ShieldCheck,
  ArrowRight,
  PlusCircle,
  Eye,
  CheckCircle,
  Layers,
  Sparkles,
  Pill,
  FolderOpen,
  Upload
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const {
    patientProfile,
    currentUser,
    medicalDocuments,
    activeEmergencyRequest,
    navigateTo
  } = useApp();

  const patientName = patientProfile.fullName || currentUser?.displayName || 'Patient';

  const quickActionCards = [
    {
      id: 'vault',
      page: 'medical-vault',
      title: language === 'bn' ? 'আমার মেডিকেল ভল্ট' : 'My Medical Vault',
      subtitle: medicalDocuments.length === 0
        ? (language === 'bn' ? 'বর্তমানে খালি (Upload Now)' : 'Empty Vault (0 Docs)')
        : `${medicalDocuments.length} ${language === 'bn' ? 'টি নথি সংরক্ষিত' : 'documents stored'}`,
      icon: FileText
    },
    {
      id: 'hospitals',
      page: 'nearby-hospitals',
      title: language === 'bn' ? 'নিকটস্থ হাসপাতাল খুঁজুন' : 'Nearby Hospitals',
      subtitle: `${patientProfile.location || 'Panihati & Dum Dum'}`,
      icon: MapPin
    },
    {
      id: 'ai-checkin',
      page: 'ai-checkin',
      title: language === 'bn' ? 'এআই স্বাস্থ্য চেক-ইন' : 'AI Health Check-in',
      subtitle: language === 'bn' ? 'উপসর্গভিত্তিক মূল্যায়ন' : 'Symptom Assessment',
      icon: Sparkles
    },
    {
      id: 'drug-checker',
      page: 'drug-checker',
      title: language === 'bn' ? 'ওষুধ মিথস্ক্রিয়া পরীক্ষক' : 'Drug Interaction Checker',
      subtitle: language === 'bn' ? 'ওষুধের নিরাপত্তা যাচাই' : 'Medication Safety',
      icon: Pill
    },
    {
      id: 'sos',
      page: 'emergency-sos',
      title: language === 'bn' ? 'জরুরি এসওএস (SOS)' : 'Emergency SOS',
      subtitle: language === 'bn' ? 'শারীরিক অবস্থা ও ট্রায়াজ রিপোর্টিং' : 'Condition Reporting & Triage',
      icon: AlertOctagon,
      isEmergency: true
    },
    {
      id: 'profile',
      page: 'profile',
      title: language === 'bn' ? 'আমার প্রোফাইল' : 'My Profile',
      subtitle: `${patientProfile.age || 65}Y • ${patientProfile.phone || ''}`,
      icon: User
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#171717] py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ACTIVE EMERGENCY NOTIFICATION BANNER IF IN PROGRESS */}
        {activeEmergencyRequest && (
          <div className="bg-[#D32F2F] text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-rose-600 animate-in fade-in slide-in-from-top-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <AlertOctagon className="w-8 h-8 text-white animate-bounce" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-white text-[#D32F2F] text-xs font-black uppercase tracking-wider">
                  {language === 'bn' ? 'জরুরি অনুরোধ সক্রিয় আছে' : 'Active Emergency SOS'}
                </span>
                <h3 className="text-xl font-black mt-1">
                  {activeEmergencyRequest.selectedHospitalName}
                </h3>
                <p className="text-xs text-rose-100 mt-0.5">
                  {activeEmergencyRequest.statusMessage || 'Hospital triage team is coordinating assistance.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigateTo('emergency-tracking', { id: activeEmergencyRequest.id })}
              className="px-6 py-3 bg-white text-[#D32F2F] hover:bg-rose-50 font-black text-sm rounded-xl shadow-xs transition-all flex items-center space-x-2 shrink-0"
            >
              <span>{language === 'bn' ? 'লাইভ ট্র্যাকিং দেখুন' : 'View Live Tracking'}</span>
              <ArrowRight className="w-4 h-4 text-[#D32F2F]" />
            </button>
          </div>
        )}

        {/* TOP WELCOME & SENIOR STATUS BANNER */}
        <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 text-[#171717] shadow-xs border border-[#D5E8D7] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-white text-[#2E7D32] border border-[#D5E8D7] text-xs font-bold shadow-xs">
                  {language === 'bn' ? 'সুস্থায়ন স্বাস্থ্য ড্যাশবোর্ড' : 'Susthayan Health Dashboard'}
                </span>
                <span className="flex items-center text-xs text-[#2E7D32] font-semibold">
                  <CheckCircle className="w-3.5 h-3.5 mr-1 text-[#2E7D32]" />
                  {language === 'bn' ? 'নিবন্ধিত একাউন্ট' : 'Registered Patient'}
                </span>
              </div>

              {/* Exact Name Display */}
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#171717] font-bengali">
                {language === 'bn' ? `স্বাগতম, ${patientName}` : `Welcome, ${patientName}`}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#555555]">
                <span>
                  {language === 'bn' ? 'বয়স:' : 'Age:'} <strong className="text-[#171717]">{patientProfile.age || currentUser?.age || 65} {language === 'bn' ? 'বছর' : 'Years'}</strong>
                </span>
                <span>•</span>
                <span>📞 <strong className="text-[#171717]">{patientProfile.phone || currentUser?.phone}</strong></span>
                <span>•</span>
                <span className="bg-white px-2 py-0.5 rounded font-bold text-[#2E7D32] border border-[#D5E8D7]">
                  📍 {patientProfile.location || currentUser?.location || 'Panihati, West Bengal'}
                </span>
              </div>
            </div>

            {/* Quick Action Pill Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigateTo('upload-document')}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white font-bold text-xs shadow-xs transition-all"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>{language === 'bn' ? 'নতুন নথি আপলোড' : 'Upload Document'}</span>
              </button>

              <button
                onClick={() => navigateTo('ai-checkin')}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-white hover:bg-[#F1F8F2] text-[#171717] border border-[#D5E8D7] text-xs font-bold transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#2E7D32]" />
                <span>{language === 'bn' ? 'এআই চেক-ইন' : 'AI Check-in'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 6 MAIN QUICK ACTION CARDS */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-[#171717] flex items-center space-x-2">
              <Layers className="w-5 h-5 text-[#2E7D32]" />
              <span>{language === 'bn' ? 'প্রধান স্বাস্থ্য সেবাসমূহ' : 'Key Health Actions'}</span>
            </h2>
            <span className="text-xs text-[#555555] font-medium">
              {language === 'bn' ? 'সহজ ও স্পষ্ট এক ক্লিকে এক্সেস' : 'Quick Access Cards'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {quickActionCards.map(card => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => navigateTo(card.page)}
                  className="bg-[#E8F5E9] p-6 rounded-3xl border border-[#D5E8D7] hover:border-[#2E7D32] transition-all cursor-pointer shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-3 rounded-2xl bg-white border border-[#D5E8D7] shadow-xs">
                        <Icon className={`w-6 h-6 ${card.isEmergency ? 'text-[#D32F2F]' : 'text-[#2E7D32]'}`} />
                      </div>
                      <span className="text-xs font-bold text-[#555555] bg-white px-2.5 py-1 rounded-lg border border-[#D5E8D7]">
                        {card.subtitle}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-[#171717]">
                      {card.title}
                    </h3>
                  </div>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      navigateTo(card.page);
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5 ${
                      card.isEmergency
                        ? 'bg-[#D32F2F] hover:bg-[#B71C1C] text-white'
                        : 'bg-[#2E7D32] hover:bg-[#256B2A] text-white'
                    }`}
                  >
                    <span>{language === 'bn' ? 'প্রবেশ করুন' : 'Open Section'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* PATIENT-CONTROLLED HOSPITAL ACCESS & PERMISSIONS SECTION */}
        <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#D5E8D7]">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-[#2E7D32] font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                <span>Patient-Controlled Hospital Permissions & Privacy</span>
              </div>
              <h3 className="text-xl font-black text-[#171717]">
                {language === 'bn' ? 'হাসপাতাল অনুমতি ও অ্যাক্সেস নিয়ন্ত্রণ (Access Management)' : 'Hospital Access & Permission Control'}
              </h3>
            </div>

            <button
              onClick={() => navigateTo('share-records')}
              className="px-4 py-2 bg-white hover:bg-[#F1F8F2] text-[#2E7D32] border border-[#D5E8D7] rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs"
            >
              <Share2 className="w-4 h-4 text-[#2E7D32]" />
              <span>{language === 'bn' ? 'নতুন হাসপাতালকে অনুমতি দিন' : 'Grant New Hospital Access'}</span>
            </button>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] text-xs text-[#171717] space-y-1">
            <p className="font-bold flex items-center text-[#2E7D32]">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-[#2E7D32]" />
              {language === 'bn' ? 'আপনার নিয়ন্ত্রণ, আপনার গোপনীয়তা:' : 'Your Health Privacy Right:'}
            </p>
            <p className="text-[#555555] leading-relaxed">
              {language === 'bn'
                ? 'হাসপাতাল শুধুমাত্র আপনার অনুমোদিত সময় পর্যন্ত মেডিকেল নথি দেখতে পারে। "অনুমতি প্রত্যাহার" বাটনে চাপলে প্ল্যাটফর্মে হাসপাতালের ভবিষ্যৎ অ্যাক্সেস সাথে সাথে বন্ধ হয়ে যায়।'
                : 'Hospital staff can only access your records within your approved time window. Revoking access instantly blocks any future viewing through the platform.'}
            </p>
          </div>

          {/* Access Grants List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                id: 'grant-pan-8921',
                hospitalName: 'Panihati State General Hospital',
                token: 'GRANT-PAN-8921',
                status: 'ACTIVE',
                validity: 'Valid for 4 Hours',
                expiresAt: 'In 3 hours 45 mins',
                docsCount: 3,
                lastAccess: 'Viewed 5 mins ago by Duty Officer'
              },
              {
                id: 'grant-cmsdh-4412',
                hospitalName: 'Sagore Dutta Medical College (CMSDH)',
                token: 'GRANT-CMSDH-4412',
                status: 'REVOKED',
                validity: 'Expired / Revoked',
                expiresAt: 'Revoked by Patient',
                docsCount: 1,
                lastAccess: 'Blocked'
              }
            ].map(grant => (
              <div
                key={grant.id}
                className="p-5 rounded-2xl border border-[#D5E8D7] bg-white space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-[#171717] truncate max-w-[220px]">
                    {grant.hospitalName}
                  </h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    grant.status === 'ACTIVE'
                      ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7]'
                      : 'bg-rose-50 text-rose-700 border border-rose-300'
                  }`}>
                    {grant.status === 'ACTIVE'
                      ? (language === 'bn' ? 'সক্রিয়' : 'ACTIVE')
                      : (language === 'bn' ? 'প্রত্যাহারকৃত' : 'REVOKED')}
                  </span>
                </div>

                <div className="text-xs text-[#555555] space-y-1">
                  <p>{language === 'bn' ? 'টোকেন:' : 'Token:'} <span className="font-mono font-bold text-[#171717]">{grant.token}</span></p>
                  <p>{language === 'bn' ? 'মেয়াদ:' : 'Duration:'} <span className="font-medium text-[#171717]">{language === 'bn' ? (grant.id === 'grant-pan-8921' ? '৩ ঘণ্টা ৪৫ মিনিট বাকি' : 'রোগী কর্তৃক প্রত্যাহারকৃত') : grant.expiresAt}</span></p>
                  <p>{language === 'bn' ? 'সংযুক্ত রেকর্ড:' : 'Attached Records:'} <strong className="text-[#2E7D32]">{language === 'bn' ? `${grant.docsCount} টি নথি` : `${grant.docsCount} Documents`}</strong> {language === 'bn' ? '(প্রেসক্রিপশন ও রক্ত পরীক্ষা)' : '(Prescriptions & Blood Tests)'}</p>
                  <p className="text-[11px] text-[#777777]">{language === 'bn' ? 'পরিদর্শন স্থিতি:' : 'Access Status:'} {language === 'bn' ? (grant.id === 'grant-pan-8921' ? '৫ মিনিট আগে অন-ডিউটি অফিসার কর্তৃক পরিদর্শিত' : 'ব্লক করা হয়েছে') : grant.lastAccess}</p>
                </div>

                {grant.status === 'ACTIVE' ? (
                  <div className="pt-2 border-t border-[#D5E8D7] flex justify-end">
                    <button
                      onClick={() => navigateTo('share-records')}
                      className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold text-xs rounded-xl transition-all"
                    >
                      {language === 'bn' ? 'অনুমতি প্রত্যাহার করুন' : 'Revoke Access'}
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-[#D5E8D7] text-[11px] text-rose-600 font-bold">
                    {language === 'bn' ? '✓ ভবিষ্যৎ এক্সেস সম্পূর্ণ ব্লক করা হয়েছে' : '✓ Future access completely blocked'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MEDIVAULT RECORDS SECTION */}
        <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#D5E8D7]">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#2E7D32]" />
              <h3 className="text-base font-black text-[#171717]">
                {language === 'bn' ? 'সংরক্ষিত মেডিকেল রেকর্ডস (MediVault)' : 'Saved MediVault Records'}
              </h3>
            </div>
            {medicalDocuments.length > 0 && (
              <button
                onClick={() => navigateTo('medical-vault')}
                className="text-xs font-bold text-[#2E7D32] hover:underline"
              >
                {language === 'bn' ? 'সব নথি দেখুন →' : 'View All →'}
              </button>
            )}
          </div>

          {medicalDocuments.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#D5E8D7] space-y-3">
              <FolderOpen className="w-12 h-12 text-[#2E7D32] mx-auto opacity-70" />
              <h4 className="font-bold text-[#171717] text-base">
                {language === 'bn' ? 'আপনার মেডিকেল ভল্ট বর্তমানে খালি' : 'Your Medical Vault is Empty'}
              </h4>
              <p className="text-xs text-[#555555] max-w-sm mx-auto">
                {language === 'bn'
                  ? 'প্রেসক্রিপশন বা রক্তের রিপোর্ট সংরক্ষণ করতে নিচের বোতামে চাপ দিন।'
                  : 'Upload your first medical document to securely organize your health records.'}
              </p>
              <button
                onClick={() => navigateTo('upload-document')}
                className="px-6 py-2.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center space-x-1.5"
              >
                <Upload className="w-4 h-4 text-white" />
                <span>{language === 'bn' ? 'নথি আপলোড করুন' : 'Upload Documents'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {medicalDocuments.slice(0, 3).map(doc => (
                <div
                  key={doc.id}
                  onClick={() => navigateTo('document-preview', { id: doc.id })}
                  className="p-4 rounded-2xl border border-[#D5E8D7] bg-white hover:border-[#2E7D32] transition-all flex items-center justify-between cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-[#2E7D32]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#171717] truncate group-hover:text-[#2E7D32]">
                        {doc.title}
                      </h4>
                      <p className="text-[11px] text-[#555555]">
                        {doc.uploadDate} • {doc.category.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-[#555555] group-hover:text-[#2E7D32] shrink-0 ml-2" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
