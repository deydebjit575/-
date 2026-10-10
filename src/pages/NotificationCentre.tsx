import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCheck,
  AlertOctagon,
  Bed,
  Ambulance,
  FileText,
  Info,
  Clock,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { AppNotification } from '../types';

export const NotificationCentre: React.FC = () => {
  const { language, t } = useLanguage();
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    navigateTo
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'emergency' | 'sms' | 'vault'>('all');

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'emergency': return <AlertOctagon className="w-5 h-5 text-rose-600" />;
      case 'ambulance': return <Ambulance className="w-5 h-5 text-amber-600" />;
      case 'bed': return <Bed className="w-5 h-5 text-teal-600" />;
      case 'vault': return <FileText className="w-5 h-5 text-indigo-600" />;
      default: return <Info className="w-5 h-5 text-slate-600" />;
    }
  };

  const filteredNotifs = notifications.filter(n => {
    if (activeTab === 'emergency') return n.type === 'emergency' || n.type === 'ambulance';
    if (activeTab === 'vault') return n.type === 'vault';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest">
              Notification & SMS Gateway Feed
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-950">
              {language === 'bn' ? 'বিজ্ঞপ্তি ও এসএমএস কেন্দ্র' : 'Notification Center'}
            </h1>
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'জরুরি অ্যালার্ট, বেড নিশ্চয়তা ও ভারতীয় DLT এসএমএস বার্তা।' : 'In-app notifications and DLT-compliant SMS emergency dispatch logs.'}
            </p>
          </div>

          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-teal-700" />
            <span>{language === 'bn' ? 'সব পঠিত হিসেবে চিহ্নিত করুন' : 'Mark All as Read'}</span>
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
          {[
            { id: 'all', label: language === 'bn' ? 'সকল নোটিফিকেশন' : 'All Alerts' },
            { id: 'emergency', label: language === 'bn' ? 'জরুরি ও অ্যাম্বুলেন্স' : 'Emergency & Ambulance' },
            { id: 'vault', label: language === 'bn' ? 'মেডিকেল ভল্ট ও পলিসি' : 'Vault & Policies' },
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

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifs.map(notif => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationAsRead(notif.id);
                if (notif.actionUrl) navigateTo(notif.actionUrl);
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-4 ${
                notif.isRead
                  ? 'bg-white border-slate-200 shadow-soft'
                  : 'bg-teal-50/50 border-teal-300 shadow-md ring-1 ring-teal-400/20'
              }`}
            >
              <div className="p-3 bg-white rounded-xl shadow-xs shrink-0">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-navy-950 text-sm">
                    {language === 'bn' && notif.titleBn ? notif.titleBn : notif.title}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'bn' && notif.messageBn ? notif.messageBn : notif.message}
                </p>

                {/* SMS DLT Stamp Indicator */}
                <div className="pt-2 flex items-center space-x-2 text-[10px] text-slate-400">
                  <MessageSquare className="w-3 h-3 text-emerald-600" />
                  <span>DLT Registered Entity: SUSTHAYAN-GOV • SMS Delivered</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
