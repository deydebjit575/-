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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-elevated flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-purple-300 font-bold text-xs">
              <Shield className="w-4 h-4" />
              <span>Platform Governance & Compliance Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              {language === 'bn' ? 'প্রশাসনিক ড্যাশবোর্ড ও অডিট লগ' : 'Susthayan Administrative Command'}
            </h1>
            <p className="text-xs text-slate-300">
              Hospital registrations, live ICU telemetry verification, and DISHA audit access logs.
            </p>
          </div>

          <button
            onClick={() => {
              if (window.confirm('সকল ডেটা প্রারম্ভিক ডেমো অবস্থায় রিসেট করতে চান?')) {
                resetToDefaultData();
              }
            }}
            className="flex items-center space-x-2 px-5 py-2.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{language === 'bn' ? 'ডেমো ডেটা রিসেট' : 'Reset Demo Data'}</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
            <span className="text-xs font-bold text-slate-500 block">পার্টনার হাসপাতাল</span>
            <span className="text-2xl font-black text-navy-950 mt-1 block">{hospitals.length} টি</span>
            <span className="text-[10px] text-emerald-600 font-bold">১০০% ভেরিফাইড</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
            <span className="text-xs font-bold text-slate-500 block">মোট আইসিইউ বেড</span>
            <span className="text-2xl font-black text-teal-700 mt-1 block">
              {hospitals.reduce((acc, h) => acc + h.icuBedsAvailable, 0)} টি খালি
            </span>
            <span className="text-[10px] text-slate-400">লাইভ আপডেট সচল</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
            <span className="text-xs font-bold text-slate-500 block">জরুরি অনুরোধ হ্যান্ডলড</span>
            <span className="text-2xl font-black text-rose-600 mt-1 block">{emergencyRequests.length}</span>
            <span className="text-[10px] text-slate-400">গড় সাড়াদান সময়: ~১.৮ মিনিট</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
            <span className="text-xs font-bold text-slate-500 block">অডিট লগ এন্ট্রি</span>
            <span className="text-2xl font-black text-purple-700 mt-1 block">{auditLogs.length}</span>
            <span className="text-[10px] text-emerald-600 font-bold">Immutable SHA-256</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
          {[
            { id: 'hospitals', label: 'নিবন্ধিত হাসপাতাল তালিকা (Partner Hospitals)' },
            { id: 'audit', label: 'নিরাপত্তা ও অ্যাক্সেস অডিট লগ (Audit Trail)' },
            { id: 'config', label: 'প্ল্যাটফর্ম ও DLT কনফিগারেশন (Settings)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === tab.id
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Hospitals */}
        {activeTab === 'hospitals' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-4">
            <h3 className="font-black text-navy-950 text-base">রেজিস্টার্ড হাসপাতাল ও লাইভ স্ট্যাটাস</h3>
            <div className="space-y-3">
              {hospitals.map(hosp => (
                <div
                  key={hosp.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-sm text-navy-950 block">{hosp.name}</span>
                    <p className="text-slate-500">{hosp.address} • 📞 {hosp.phone}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-teal-800 font-bold">ICU: {hosp.icuBedsAvailable} Beds</span>
                    <span className="text-slate-700 font-bold">Ambulance: {hosp.ambulanceCount}</span>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-4">
            <h3 className="font-black text-navy-950 text-base">প্ল্যাটফর্ম অ্যাক্সেস ও নিরাপত্তা অডিট লগ</h3>
            <div className="space-y-3">
              {auditLogs.map(log => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-navy-950 uppercase">{log.action}</span>
                      <span className="px-2 py-0.2 rounded bg-purple-100 text-purple-800 text-[10px] font-semibold">
                        {log.actorRole}
                      </span>
                    </div>
                    <p className="text-slate-600">{log.details}</p>
                  </div>
                  <div className="text-right text-[11px] text-slate-400 shrink-0">
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6 text-xs">
            <h3 className="font-black text-navy-950 text-base">সিস্টেম ও গেটওয়ে ইন্টিগ্রেশন স্ট্যাটাস</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">Indian DLT SMS Gateway</span>
                <span className="text-emerald-700 font-bold block">Status: READY (Template Id: 14071618293)</span>
                <p className="text-slate-500 text-[11px]">DLT Entity ID: WB-HEALTH-SUSTHAYAN-991</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">Google Maps & Places API</span>
                <span className="text-emerald-700 font-bold block">Status: ACTIVE with Fallback Radar</span>
                <p className="text-slate-500 text-[11px]">Kolkata & Dhaka Geocoding Cluster</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
