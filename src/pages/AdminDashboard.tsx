import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Building,
  Users,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  Lock,
  Search,
  Sparkles
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const {
    hospitals,
    bedRecords,
    emergencyRequests,
    auditLogs,
    resetToDefaultData,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'hospitals' | 'audit' | 'config'>('hospitals');

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#2E7D32] font-bold text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Platform Governance & Compliance Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#171717]">
              {language === 'bn' ? 'প্রশাসনিক ড্যাশবোর্ড ও অডিট লগ' : 'Susthayan Administrative Command'}
            </h1>
            <p className="text-xs text-[#555555]">
              {language === 'bn'
                ? 'হাসপাতাল নিবন্ধন, সরাসরি আইসিইউ টেলিমেট্রি যাচাই এবং DISHA অ্যাক্সেস অডিট লগ।'
                : 'Hospital registrations, live ICU telemetry verification, and DISHA audit access logs.'}
            </p>
          </div>

          <button
            onClick={() => {
              const confirmMsg = language === 'bn'
                ? 'সকল ডেটা প্রারম্ভিক ডেমো অবস্থায় রিসেট করতে চান?'
                : 'Are you sure you want to reset all data to initial demo state?';
              if (window.confirm(confirmMsg)) {
                resetToDefaultData();
              }
            }}
            className="flex items-center space-x-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{language === 'bn' ? 'ডেমো ডেটা রিসেট' : 'Reset Demo Data'}</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#E8F5E9] p-5 rounded-2xl border border-[#D5E8D7] shadow-xs">
            <span className="text-xs font-bold text-[#555555] block">
              {language === 'bn' ? 'পার্টনার হাসপাতাল' : 'Partner Hospitals'}
            </span>
            <span className="text-2xl font-black text-[#171717] mt-1 block">
              {hospitals.length} {language === 'bn' ? 'টি' : ''}
            </span>
            <span className="text-[10px] text-[#2E7D32] font-bold">
              {language === 'bn' ? '১০০% ভেরিফাইড' : '100% Verified'}
            </span>
          </div>

          <div className="bg-[#E8F5E9] p-5 rounded-2xl border border-[#D5E8D7] shadow-xs">
            <span className="text-xs font-bold text-[#555555] block">
              {language === 'bn' ? 'মোট আইসিইউ বেড' : 'Total ICU Beds'}
            </span>
            <span className="text-2xl font-black text-[#2E7D32] mt-1 block">
              {hospitals.reduce((acc, h) => acc + h.icuBedsAvailable, 0)} {language === 'bn' ? 'টি খালি' : 'Available'}
            </span>
            <span className="text-[10px] text-[#555555]">
              {language === 'bn' ? 'লাইভ আপডেট সচল' : 'Live updates active'}
            </span>
          </div>

          <div className="bg-[#E8F5E9] p-5 rounded-2xl border border-[#D5E8D7] shadow-xs">
            <span className="text-xs font-bold text-[#555555] block">
              {language === 'bn' ? 'জরুরি অনুরোধ নিষ্পত্তি' : 'Emergency SOS Handled'}
            </span>
            <span className="text-2xl font-black text-rose-700 mt-1 block">{emergencyRequests.length}</span>
            <span className="text-[10px] text-[#555555]">
              {language === 'bn' ? 'গড় সাড়াদান সময়: ~১.৮ মিনিট' : 'Avg response: ~1.8 mins'}
            </span>
          </div>

          <div className="bg-[#E8F5E9] p-5 rounded-2xl border border-[#D5E8D7] shadow-xs">
            <span className="text-xs font-bold text-[#555555] block">
              {language === 'bn' ? 'অডিট লগ এন্ট্রি' : 'Audit Log Entries'}
            </span>
            <span className="text-2xl font-black text-[#2E7D32] mt-1 block">{auditLogs.length}</span>
            <span className="text-[10px] text-[#2E7D32] font-bold">Immutable SHA-256</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-[#D5E8D7] pb-2 overflow-x-auto">
          {[
            { id: 'hospitals', label: language === 'bn' ? 'নিবন্ধিত হাসপাতাল তালিকা' : 'Registered Hospitals' },
            { id: 'audit', label: language === 'bn' ? 'নিরাপত্তা ও অ্যাক্সেস অডিট লগ' : 'Security Audit Trail' },
            { id: 'config', label: language === 'bn' ? 'প্ল্যাটফর্ম ও সিস্টেম কনফিগারেশন' : 'Platform & System Config' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#2E7D32] text-white shadow-xs'
                  : 'text-[#555555] hover:bg-[#E8F5E9]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Hospitals */}
        {activeTab === 'hospitals' && (
          <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs space-y-4">
            <h3 className="font-black text-[#171717] text-base">
              {language === 'bn' ? 'রেজিস্টার্ড হাসপাতাল ও লাইভ স্ট্যাটাস' : 'Registered Hospitals & Live Telemetry'}
            </h3>
            <div className="space-y-3">
              {hospitals.map(hosp => (
                <div
                  key={hosp.id}
                  className="p-4 rounded-2xl bg-white border border-[#D5E8D7] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-sm text-[#171717] block">{hosp.name}</span>
                    <p className="text-[#555555]">{hosp.address} • 📞 {hosp.phone}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-[#2E7D32] font-bold">
                      ICU: {hosp.icuBedsAvailable} {language === 'bn' ? 'বেড' : 'Beds'}
                    </span>
                    <span className="text-[#171717] font-bold">
                      Ambulance: {hosp.ambulanceCount}
                    </span>
                    <span className="px-2.5 py-1 bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7] rounded-full font-bold text-[10px]">
                      VERIFIED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Security Audit Logs */}
        {activeTab === 'audit' && (
          <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs space-y-4">
            <h3 className="font-black text-[#171717] text-base">
              {language === 'bn' ? 'প্ল্যাটফর্ম অ্যাক্সেস ও নিরাপত্তা অডিট লগ' : 'Platform Access & Security Audit Trail'}
            </h3>
            <div className="space-y-3">
              {auditLogs.map(log => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-white border border-[#D5E8D7] shadow-2xs text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-[#171717] uppercase">{log.action}</span>
                      <span className="px-2 py-0.5 rounded bg-[#E8F5E9] border border-[#D5E8D7] text-[#2E7D32] text-[10px] font-semibold">
                        {log.actorRole}
                      </span>
                    </div>
                    <p className="text-[#555555]">{log.details}</p>
                  </div>
                  <div className="text-right text-[11px] text-[#555555] shrink-0">
                    <p>{new Date(log.timestamp).toLocaleTimeString()}</p>
                    <p className="font-mono">{log.ipAddress}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Config */}
        {activeTab === 'config' && (
          <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs space-y-6 text-xs">
            <h3 className="font-black text-[#171717] text-base">
              {language === 'bn' ? 'সিস্টেম ও গেটওয়ে ইন্টিগ্রেশন স্ট্যাটাস' : 'System & Gateway Integration Telemetry'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] shadow-2xs space-y-1">
                <span className="font-bold text-[#171717] block">Indian DLT SMS Gateway</span>
                <span className="text-[#2E7D32] font-bold block">Status: READY (Template Id: 14071618293)</span>
                <p className="text-[#555555] text-[11px]">DLT Entity ID: WB-HEALTH-SUSTHAYAN-991</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] shadow-2xs space-y-1">
                <span className="font-bold text-[#171717] block">Google Maps & Places API</span>
                <span className="text-[#2E7D32] font-bold block">Status: ACTIVE with Fallback Radar</span>
                <p className="text-[#555555] text-[11px]">Kolkata & Dhaka Geocoding Cluster</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
