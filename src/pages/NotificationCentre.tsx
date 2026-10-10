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
      case 'bed': return <Bed className="w-5 h-5 text-[#2E7D32]" />;
      case 'vault': return <FileText className="w-5 h-5 text-[#2E7D32]" />;
      default: return <Info className="w-5 h-5 text-[#555555]" />;
    }
  };

  const filteredNotifs = notifications.filter(n => {
    if (activeTab === 'emergency') return n.type === 'emergency' || n.type === 'ambulance';
    if (activeTab === 'vault') return n.type === 'vault';
    return true;
  });

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">
              Notification & SMS Gateway Feed
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#171717]">
              {language === 'bn' ? 'বিজ্ঞপ্তি ও এসএমএস কেন্দ্র' : 'Notification Center'}
            </h1>
            <p className="text-xs text-[#555555]">
              {language === 'bn' ? 'জরুরি অ্যালার্ট, বেড নিশ্চয়তা ও ভারতীয় DLT এসএমএস বার্তা।' : 'In-app notifications and DLT-compliant SMS emergency dispatch logs.'}
            </p>
          </div>

          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center space-x-1.5 px-4 py-2 bg-white border border-[#D5E8D7] hover:bg-[#F1F8F2] text-[#171717] rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <CheckCheck className="w-4 h-4 text-[#2E7D32]" />
            <span>{language === 'bn' ? 'সব পঠিত হিসেবে চিহ্নিত করুন' : 'Mark All as Read'}</span>
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center space-x-2 border-b border-[#D5E8D7] pb-2 overflow-x-auto">
          {[
            { id: 'all', label: language === 'bn' ? 'সকল নোটিফিকেশন' : 'All Alerts' },
            { id: 'emergency', label: language === 'bn' ? 'জরুরি ও অ্যাম্বুলেন্স' : 'Emergency & Ambulance' },
            { id: 'vault', label: language === 'bn' ? 'মেডিকেল ভল্ট ও পলিসি' : 'Vault & Policies' },
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
                  ? 'bg-white border-[#D5E8D7] shadow-2xs'
                  : 'bg-[#E8F5E9] border-[#2E7D32] shadow-xs ring-1 ring-[#2E7D32]/20'
              }`}
            >
              <div className="p-3 bg-white border border-[#D5E8D7] rounded-xl shadow-2xs shrink-0">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#171717] text-sm">
                    {language === 'bn' && notif.titleBn ? notif.titleBn : notif.title}
                  </h4>
                  <span className="text-[11px] text-[#555555]">
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs text-[#555555] leading-relaxed">
                  {language === 'bn' && notif.messageBn ? notif.messageBn : notif.message}
                </p>

                {/* SMS DLT Stamp Indicator */}
                <div className="pt-2 flex items-center space-x-2 text-[10px] text-[#555555]">
                  <MessageSquare className="w-3 h-3 text-[#2E7D32]" />
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
