import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  FileText,
  MapPin,
  Share2,
  AlertOctagon,
  Users,
  User,
  Heart,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
  PlusCircle,
  Eye,
  CheckCircle,
  PhoneCall,
  Calendar,
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
      icon: FileText,
      color: 'bg-teal-50 text-teal-700 border-teal-200',
      btnColor: 'bg-teal-600 hover:bg-teal-700 text-white'
    },
    {
      id: 'hospitals',
      page: 'nearby-hospitals',
      title: language === 'bn' ? 'নিকটস্থ হাসপাতাল খুঁজুন' : 'Nearby Hospitals',
      subtitle: `${patientProfile.location || 'Panihati & Dum Dum'}`,
      icon: MapPin,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      btnColor: 'bg-cyan-600 hover:bg-cyan-700 text-white'
    },
    {
      id: 'ai-checkin',
      page: 'ai-checkin',
      title: language === 'bn' ? 'এআই স্বাস্থ্য চেক-ইন' : 'AI Health Check-in',
      subtitle: language === 'bn' ? 'উপসর্গভিত্তিক মূল্যায়ন' : 'Symptom Assessment',
      icon: Sparkles,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white'
    },
    {
      id: 'drug-checker',
      page: 'drug-checker',
      title: language === 'bn' ? 'ওষুধ মিথস্ক্রিয়া পরীক্ষক' : 'Drug Interaction Checker',
      subtitle: language === 'bn' ? 'ওষুধের নিরাপত্তা যাচাই' : 'Medication Safety',
      icon: Pill,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      btnColor: 'bg-indigo-600 hover:bg-indigo-700 text-white'
    },
    {
      id: 'sos',
      page: 'emergency-sos',
      title: language === 'bn' ? 'জরুরি এসওএস (SOS)' : 'Emergency SOS',
      subtitle: language === 'bn' ? 'তাৎক্ষণিক ৩ সেকেন্ড সহায়তা' : 'Instant 1-tap dispatch',
      icon: AlertOctagon,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      btnColor: 'bg-rose-600 hover:bg-rose-700 text-white'
    },
    {
      id: 'profile',
      page: 'profile',
      title: language === 'bn' ? 'আমার প্রোফাইল' : 'My Profile',
      subtitle: `${patientProfile.age || 65}Y • ${patientProfile.phone || ''}`,
      icon: User,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      btnColor: 'bg-purple-600 hover:bg-purple-700 text-white'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ACTIVE EMERGENCY NOTIFICATION BANNER IF IN PROGRESS */}
        {activeEmergencyRequest && (
          <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 text-white rounded-2xl p-5 sm:p-6 shadow-emergency border border-rose-500 animate-in fade-in slide-in-from-top-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <AlertOctagon className="w-8 h-8 text-yellow-300 animate-bounce" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-yellow-400 text-navy-950 text-xs font-black uppercase tracking-wider">
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
              className="px-6 py-3 bg-white text-rose-700 hover:bg-rose-50 font-black text-sm rounded-xl shadow-md transition-all flex items-center space-x-2 shrink-0"
            >
              <span>{language === 'bn' ? 'লাইভ ট্র্যাকিং দেখুন' : 'View Live Tracking'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TOP WELCOME & SENIOR STATUS BANNER */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-navy-900 rounded-3xl p-6 sm:p-8 text-white shadow-elevated border border-teal-700/50 relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 border border-teal-400/40 text-xs font-bold">
                  {language === 'bn' ? 'সুস্থায়ন স্বাস্থ্য ড্যাশবোর্ড' : 'Susthayan Health Dashboard'}
                </span>
                <span className="flex items-center text-xs text-emerald-300">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  {language === 'bn' ? 'নিবন্ধিত একাউন্ট' : 'Registered Account'}
                </span>
              </div>

              {/* Exact Name Display */}
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight font-bengali">
                {language === 'bn' ? `স্বাগতম, ${patientName}` : `Welcome, ${patientName}`}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-teal-200">
                <span>
                  {language === 'bn' ? 'বয়স:' : 'Age:'} {patientProfile.age || currentUser?.age || 65} {language === 'bn' ? 'বছর' : 'Years'}
                </span>
                <span>•</span>
                <span>📞 {patientProfile.phone || currentUser?.phone}</span>
                <span>•</span>
                <span className="bg-teal-800/90 px-2 py-0.5 rounded font-bold text-white">
                  📍 {patientProfile.location || currentUser?.location || 'Panihati, West Bengal'}
                </span>
              </div>
            </div>

            {/* Quick Action Pill Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigateTo('upload-document')}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs shadow-md transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{language === 'bn' ? 'নতুন নথি আপলোড' : 'Upload Document'}</span>
              </button>

              <button
                onClick={() => navigateTo('ai-checkin')}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-teal-200 border border-teal-500/30 text-xs font-bold transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'bn' ? 'এআই চেক-ইন' : 'AI Check-in'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 6 MAIN QUICK ACTION CARDS */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-navy-950 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-teal-700" />
              <span>{language === 'bn' ? 'প্রধান স্বাস্থ্য সেবাসমূহ' : 'Key Health Actions'}</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
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
                  className={`p-6 rounded-3xl border transition-all cursor-pointer shadow-soft hover:shadow-elevated hover:scale-[1.01] ${card.color}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-white shadow-xs">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-white/70 px-2 py-1 rounded-md">
                      {card.subtitle}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-navy-950 mb-3">
                    {card.title}
                  </h3>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      navigateTo(card.page);
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5 ${card.btnColor}`}
                  >
                    <span>{language === 'bn' ? 'প্রবেশ করুন' : 'Open Section'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* PATIENT-CONTROLLED HOSPITAL ACCESS & PERMISSIONS SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-purple-700 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Patient-Controlled Hospital Permissions & Privacy</span>
              </div>
              <h3 className="text-xl font-black text-navy-950">
                {language === 'bn' ? 'হাসপাতাল অনুমতি ও অ্যাক্সেস নিয়ন্ত্রণ (Access Management)' : 'Hospital Access & Permission Control'}
              </h3>
            </div>

            <button
              onClick={() => navigateTo('share-records')}
              className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>{language === 'bn' ? 'নতুন হাসপাতালকে অনুমতি দিন' : 'Grant New Hospital Access'}</span>
            </button>
          </div>

          <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 text-xs text-purple-950 space-y-1">
            <p className="font-bold flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-purple-700" />
              {language === 'bn' ? 'আপনার নিয়ন্ত্রণ, আপনার গোপনীয়তা:' : 'Your Health Privacy Right:'}
            </p>
            <p className="text-slate-600 leading-relaxed">
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
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-navy-950 truncate max-w-[220px]">
                    {grant.hospitalName}
                  </h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    grant.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}>
                    {grant.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p>টোকেন: <span className="font-mono font-bold text-slate-800">{grant.token}</span></p>
                  <p>মেয়াদ: <span className="font-medium">{grant.expiresAt}</span></p>
                  <p>সংযুক্ত রেকর্ড: <strong className="text-teal-800">{grant.docsCount} টি নথি</strong> (প্রেসক্রিপশন ও রক্ত পরীক্ষা)</p>
                  <p className="text-[11px] text-slate-500">পরিদর্শন স্থিতি: {grant.lastAccess}</p>
                </div>

                {grant.status === 'ACTIVE' ? (
                  <div className="pt-2 border-t border-slate-200 flex justify-end">
                    <button
                      onClick={() => navigateTo('share-records')}
                      className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-all"
                    >
                      {language === 'bn' ? 'অনুমতি প্রত্যাহার করুন (Revoke)' : 'Revoke Access Now'}
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-200 text-[11px] text-rose-600 font-bold">
                    ✓ ভবিষ্যৎ এক্সেস সম্পূর্ণ ব্লক করা হয়েছে (Access Blocked)
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MEDIVAULT RECORDS SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-teal-700" />
              <h3 className="text-base font-black text-navy-950">
                {language === 'bn' ? 'সংরক্ষিত মেডিকেল রেকর্ডস (MediVault)' : 'Saved MediVault Records'}
              </h3>
            </div>
            {medicalDocuments.length > 0 && (
              <button
                onClick={() => navigateTo('medical-vault')}
                className="text-xs font-bold text-teal-700 hover:text-teal-900"
              >
                {language === 'bn' ? 'সব নথি দেখুন →' : 'View All →'}
              </button>
            )}
          </div>

          {medicalDocuments.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <FolderOpen className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="font-bold text-navy-950 text-base">
                {language === 'bn' ? 'আপনার মেডিকেল ভল্ট বর্তমানে খালি' : 'Your Medical Vault is Empty'}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {language === 'bn'
                  ? 'প্রেসক্রিপশন বা রক্তের রিপোর্ট সংরক্ষণ করতে নিচের বোতামে চাপ দিন।'
                  : 'Upload your first medical document to securely organize your health records.'}
              </p>
              <button
                onClick={() => navigateTo('upload-document')}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center space-x-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>{language === 'bn' ? 'নথি আপলোড করুন' : 'Upload Documents'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {medicalDocuments.slice(0, 3).map(doc => (
                <div
                  key={doc.id}
                  onClick={() => navigateTo('document-preview', { id: doc.id })}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-teal-400 bg-slate-50/50 hover:bg-teal-50/30 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-navy-950 truncate group-hover:text-teal-800">
                        {doc.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {doc.uploadDate} • {doc.category.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-slate-400 group-hover:text-teal-700 shrink-0 ml-2" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
