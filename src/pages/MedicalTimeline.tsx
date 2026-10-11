import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  Clock,
  PlusCircle,
  Stethoscope,
  FileText,
  Activity,
  Heart,
  Syringe,
  Building,
  CheckCircle2,
  Calendar,
  Eye,
  Filter
} from 'lucide-react';
import { MedicalTimelineEvent } from '../types';

export const MedicalTimeline: React.FC = () => {
  const { language, t } = useLanguage();
  const { currentUser, timelineEvents, addTimelineEvent, navigateTo } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New event form state
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newType, setNewType] = useState<MedicalTimelineEvent['type']>('consultation');
  const [newFacility, setNewFacility] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const filteredEvents = timelineEvents.filter(
    e => filterType === 'all' || e.type === filterType
  );

  const getEventIcon = (type: MedicalTimelineEvent['type']) => {
    switch (type) {
      case 'consultation': return <Stethoscope className="w-5 h-5 text-teal-700" />;
      case 'prescription': return <FileText className="w-5 h-5 text-blue-700" />;
      case 'blood_test': return <Activity className="w-5 h-5 text-rose-700" />;
      case 'diagnostic': return <Activity className="w-5 h-5 text-cyan-700" />;
      case 'surgery': return <Heart className="w-5 h-5 text-purple-700" />;
      case 'vaccination': return <Syringe className="w-5 h-5 text-emerald-700" />;
      default: return <Clock className="w-5 h-5 text-slate-700" />;
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTimelineEvent({
      patientId: currentUser?.uid || 'user-record',
      title: newTitle,
      date: newDate,
      type: newType,
      doctorOrFacility: newFacility || 'Verified Clinic',
      description: newDescription,
      isUserEntered: true
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewFacility('');
    setNewDescription('');
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#2E7D32] font-bold text-xs">
              <Clock className="w-4 h-4 text-[#2E7D32]" />
              <span>{language === 'bn' ? 'কালানুক্রমিক চিকিৎসা ইতিহাস' : 'Chronological Health History'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#171717]">
              {language === 'bn' ? 'চিকিৎসা ইতিহাস ও টাইমলাইন' : 'Medical Care Timeline'}
            </h1>
            <p className="text-xs text-[#555555] max-w-xl">
              {language === 'bn'
                ? 'পরামর্শ, প্রেসক্রিপশন, অপারেশন ও ল্যাব পরীক্ষার সম্পূর্ণ ধারাবাহিক চিত্র। স্পষ্টরূপে চিহ্নিত স্ব-নথিভুক্ত ও ল্যাব-যাচাইকৃত তথ্য।'
                : 'A unified chronological overview of consultations, surgeries, tests, and vaccinations.'}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white font-bold text-xs shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন ঘটনা যোগ করুন' : 'Add Health Event'}</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: language === 'bn' ? 'সকল ঘটনা' : 'All Events' },
            { id: 'consultation', label: language === 'bn' ? 'ডাক্তার কনসালটেশন' : 'Consultations' },
            { id: 'blood_test', label: language === 'bn' ? 'রক্তের টেস্ট' : 'Blood Tests' },
            { id: 'surgery', label: language === 'bn' ? 'অপারেশন / সার্জারি' : 'Surgeries' },
            { id: 'vaccination', label: language === 'bn' ? 'টিকাদান' : 'Vaccinations' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                filterType === f.id
                  ? 'bg-[#2E7D32] text-white shadow-xs'
                  : 'bg-[#E8F5E9] text-[#171717] hover:bg-[#F1F8F2] border border-[#D5E8D7]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Timeline Stream */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#D5E8D7] space-y-8 my-6">
          {filteredEvents.map(event => (
            <div key={event.id} className="relative group">
              {/* Node indicator */}
              <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-9 h-9 rounded-full bg-white border-2 border-[#2E7D32] flex items-center justify-center shadow-xs">
                {getEventIcon(event.type)}
              </div>

              {/* Event Box */}
              <div className="bg-[#E8F5E9] rounded-2xl p-6 border border-[#D5E8D7] shadow-xs hover:border-[#2E7D32] hover:shadow-sm transition-all space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center text-xs font-bold text-[#2E7D32] bg-white px-2.5 py-1 rounded-lg border border-[#D5E8D7]">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-[#2E7D32]" />
                    {event.date}
                  </span>

                  <div className="flex items-center space-x-2">
                    {event.isUserEntered ? (
                      <span className="text-[11px] font-semibold text-[#555555] bg-white px-2.5 py-0.5 rounded-full border border-[#D5E8D7]">
                        {language === 'bn' ? 'ব্যবহারকারী কর্তৃক যুক্ত' : 'User Entered'}
                      </span>
                    ) : (
                      <span className="flex items-center text-[11px] font-semibold text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                        {language === 'bn' ? 'ল্যাব / প্রেসক্রিপশন যাচাইকৃত' : 'Lab / Prescription Verified'}
                      </span>
                    )}

                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#555555] bg-white px-2 py-0.5 rounded border border-[#D5E8D7]">
                      {event.type}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#171717]">
                  {language === 'bn' && event.titleBn ? event.titleBn : event.title}
                </h3>

                <p className="text-xs font-semibold text-[#2E7D32] flex items-center">
                  <Building className="w-3.5 h-3.5 mr-1 text-[#2E7D32]" />
                  {event.doctorOrFacility}
                </p>

                <p className="text-xs text-[#555555] leading-relaxed">
                  {event.description}
                </p>

                {event.documentId && (
                  <div className="pt-2 border-t border-[#D5E8D7] flex items-center justify-between">
                    <button
                      onClick={() => navigateTo('document-preview', { id: event.documentId })}
                      className="text-xs font-bold text-[#2E7D32] hover:text-[#256B2A] flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'সংযুক্ত মূল রিপোর্ট দেখুন' : 'View Linked Document'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal to Add New Event */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-xl border border-[#D5E8D7] space-y-5">
              <h3 className="text-lg font-black text-[#171717]">
                {language === 'bn' ? 'নতুন স্বাস্থ্য ঘটনা যুক্ত করুন' : 'Add Medical Timeline Event'}
              </h3>

              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1">
                    {language === 'bn' ? 'শিরোনাম *' : 'Event Title *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Annual Cardiology Consultation"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm text-[#171717] focus:border-[#2E7D32] outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1">
                      {language === 'bn' ? 'তারিখ' : 'Date'}
                    </label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5E8D7] text-xs text-[#171717] focus:border-[#2E7D32] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1">
                      {language === 'bn' ? 'ধরণ' : 'Event Type'}
                    </label>
                    <select
                      value={newType}
                      onChange={e => setNewType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5E8D7] text-xs text-[#171717] focus:border-[#2E7D32] outline-hidden"
                    >
                      <option value="consultation">Consultation</option>
                      <option value="prescription">Prescription</option>
                      <option value="blood_test">Blood Test</option>
                      <option value="diagnostic">Diagnostic</option>
                      <option value="surgery">Surgery</option>
                      <option value="vaccination">Vaccination</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1">
                    {language === 'bn' ? 'চিকিৎসক বা স্বাস্থ্য কেন্দ্র' : 'Doctor or Facility'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Apollo Hospital / Dr. A. K. Banerjee"
                    value={newFacility}
                    onChange={e => setNewFacility(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm text-[#171717] focus:border-[#2E7D32] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1">
                    {language === 'bn' ? 'বিবরণ / পরামর্শ' : 'Description / Notes'}
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Clinical notes, medications prescribed..."
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm text-[#171717] focus:border-[#2E7D32] outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#D5E8D7]">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-white border border-[#D5E8D7] text-xs font-bold text-[#555555] hover:bg-[#F1F8F2]"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    {t('save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalTimeline;
