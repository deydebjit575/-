import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  PhoneCall,
  HeartPulse,
  Activity,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

export const HelpAndEmergencyInfo: React.FC = () => {
  const { language, t } = useLanguage();
  const { navigateTo } = useApp();

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-[#2E7D32] font-bold text-xs uppercase tracking-wider">
            <PhoneCall className="w-4 h-4 animate-pulse" />
            <span>24x7 National Emergency Support & Senior First-Aid Guide</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171717]">
            {language === 'bn' ? 'জরুরি হেল্পলাইন ও ফার্স্ট এইড গাইড' : 'Emergency Numbers & First-Aid Protocol'}
          </h1>
          <p className="text-xs text-[#555555] max-w-2xl">
            {language === 'bn'
              ? 'হঠাৎ বুকে ব্যথা, স্ট্রোকের লক্ষণ বা পড়ে গিয়ে আঘাত পেলে কী করবেন এবং তাৎক্ষণিক কোন সরকারি নম্বরে যোগাযোগ করবেন।'
              : 'Immediate life-saving emergency helplines and senior first-aid protocols for cardiac and stroke events.'}
          </p>
        </div>

        {/* NATIONAL HELPLINE DIRECT CLICK CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#E8F5E9] p-5 rounded-2xl border border-[#D5E8D7] shadow-xs space-y-2">
            <span className="text-xs font-bold text-rose-700 block uppercase">জাতীয় জরুরি সেবা (All-in-One)</span>
            <a href="tel:112" className="text-2xl font-black text-[#171717] block hover:text-[#2E7D32] transition-colors">
              📞 112
            </a>
            <p className="text-[11px] text-[#555555]">পুলিশ, অ্যাম্বুলেন্স ও দমকল সমন্বিত সেবা</p>
          </div>

          <div className="bg-[#E8F5E9] p-5 rounded-2xl border border-[#D5E8D7] shadow-xs space-y-2">
            <span className="text-xs font-bold text-[#2E7D32] block uppercase">সরকারি অ্যাম্বুলেন্স সার্ভিস</span>
            <a href="tel:108" className="text-2xl font-black text-[#171717] block hover:text-[#2E7D32] transition-colors">
              📞 108 / 102
            </a>
            <p className="text-[11px] text-[#555555]">বিনামূল্যে জরুরি রোগী পরিবহন</p>
          </div>

          <div className="bg-[#E8F5E9] p-5 rounded-2xl border border-[#D5E8D7] shadow-xs space-y-2">
            <span className="text-xs font-bold text-[#2E7D32] block uppercase">প্রবীণ নাগরিক হেল্পলাইন</span>
            <a href="tel:14567" className="text-2xl font-black text-[#171717] block hover:text-[#2E7D32] transition-colors">
              📞 14567
            </a>
            <p className="text-[11px] text-[#555555]">Elder Line — সামাজিক ও স্বাস্থ্য সুরক্ষা</p>
          </div>

          <div className="bg-[#E8F5E9] p-5 rounded-2xl border border-[#D5E8D7] shadow-xs space-y-2">
            <span className="text-xs font-bold text-[#2E7D32] block uppercase">স্বাস্থ্য সাথী হেল্পলাইন</span>
            <a href="tel:18003455384" className="text-2xl font-black text-[#171717] block hover:text-[#2E7D32] transition-colors">
              📞 1800 345 5384
            </a>
            <p className="text-[11px] text-[#555555]">টোল ফ্রি ক্যাশলেস সহায়তা</p>
          </div>
        </div>

        {/* SENIOR FIRST-AID PROTOCOLS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cardiac emergency */}
          <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 border border-[#D5E8D7] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#D5E8D7] flex items-center justify-center text-rose-600 shadow-2xs">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#171717]">
              বুকে ব্যথা / হার্ট অ্যাটাকের লক্ষণ
            </h3>
            <ul className="text-xs text-[#555555] space-y-2 list-disc pl-4 leading-relaxed">
              <li>বুকে ভারী চাপ, বাম বাহু বা চোয়ালে ব্যথা ছড়িয়ে পড়া।</li>
              <li>রোগীকে শান্ত করে বসিয়ে দিন, শুইয়ে দেবেন না।</li>
              <li>টাইট জামাকাপড় ঢিলে করুন এবং দ্রুত <strong>সুস্থায়ন এসওএস</strong> ও ১১২ চাপুন।</li>
              <li>ডাক্তারের নির্দেশিত সরবিট্রেইট বা অ্যাসপিরিন ওষুধ থাকলে সেবন করান।</li>
            </ul>
          </div>

          {/* Stroke FAST rule */}
          <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 border border-[#D5E8D7] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#D5E8D7] flex items-center justify-center text-[#2E7D32] shadow-2xs">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#171717]">
              স্ট্রোক সনাক্তকরণ (F.A.S.T. নিয়ম)
            </h3>
            <ul className="text-xs text-[#555555] space-y-2 list-disc pl-4 leading-relaxed">
              <li><strong>F (Face):</strong> হাসতে বলুন—মুখের একপাশ বেঁকে যাচ্ছে কি?</li>
              <li><strong>A (Arms):</strong> দুই হাত তুলতে বলুন—এক হাত দুর্বল হয়ে পড়ছে কি?</li>
              <li><strong>S (Speech):</strong> কথা স্পষ্ট কি না পরীক্ষা করুন।</li>
              <li><strong>T (Time):</strong> এক মুহূর্ত দেরি না করে স্ট্রোক-রেডি হাসপাতালে যান (গোল্ডেন আওয়ার ৪.৫ ঘণ্টা)।</li>
            </ul>
          </div>

          {/* Fall Injury */}
          <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 border border-[#D5E8D7] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#D5E8D7] flex items-center justify-center text-[#2E7D32] shadow-2xs">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#171717]">
              পড়ে গিয়ে আঘাত / ফ্র্যাকচার
            </h3>
            <ul className="text-xs text-[#555555] space-y-2 list-disc pl-4 leading-relaxed">
              <li>রোগীকে জোর করে তোলার চেষ্টা করবেন না।</li>
              <li>কোমর বা মেরুদণ্ডে আঘাত থাকলে নড়াচড়া করাবেন না।</li>
              <li>রক্তক্ষরণ হলে পরিষ্কার কাপড় দিয়ে মৃদু চাপ দিন।</li>
              <li>অ্যাম্বুলেন্সের স্ট্রেচার সাহায্য আসার অপেক্ষা করুন।</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
