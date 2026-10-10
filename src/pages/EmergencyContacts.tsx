import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  Users,
  PlusCircle,
  PhoneCall,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Star,
  MapPin,
  MessageSquare
} from 'lucide-react';
import { EmergencyContact } from '../types';

export const EmergencyContacts: React.FC = () => {
  const { language, t } = useLanguage();
  const { patientProfile, updatePatientProfile, showToast } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [canReceiveSosSms, setCanReceiveSosSms] = useState(true);
  const [canViewMedicalSummary, setCanViewMedicalSummary] = useState(true);
  const [city, setCity] = useState('');

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const newContact: EmergencyContact = {
      id: `ec-${Date.now()}`,
      name,
      relationship,
      phone,
      email,
      isPrimary,
      canReceiveSosSms,
      canViewMedicalSummary,
      city
    };

    const updated = isPrimary
      ? [newContact, ...patientProfile.emergencyContacts.map(c => ({ ...c, isPrimary: false }))]
      : [...patientProfile.emergencyContacts, newContact];

    updatePatientProfile({ emergencyContacts: updated });
    setShowAddModal(false);
    setName('');
    setRelationship('');
    setPhone('');
    setEmail('');
    showToast('success', 'Emergency Contact Added', name);
  };

  const handleDeleteContact = (id: string) => {
    const updated = patientProfile.emergencyContacts.filter(c => c.id !== id);
    updatePatientProfile({ emergencyContacts: updated });
    showToast('info', 'Contact removed');
  };

  const handleSetPrimary = (id: string) => {
    const updated = patientProfile.emergencyContacts.map(c => ({
      ...c,
      isPrimary: c.id === id
    }));
    updatePatientProfile({ emergencyContacts: updated });
    showToast('success', 'Primary guardian updated');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-teal-700 font-bold text-xs">
              <Users className="w-4 h-4" />
              <span>Trusted Family & Caregiver Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-950">
              {language === 'bn' ? 'জরুরি পরিচিতজন ও অভিভাবক নেটওয়ার্ক' : 'Emergency Contacts & Guardians'}
            </h1>
            <p className="text-xs text-slate-600 max-w-xl">
              {language === 'bn'
                ? 'দূরবর্তী সন্তান, স্থানীয় প্রতিবেশী ও ব্যক্তিগত চিকিৎসকের নম্বর যুক্ত রাখুন। জরুরি এসওএস পাঠালে এরা স্বয়ংক্রিয়ভাবে এসএমএস পাবেন।'
                : 'Add distant children, local neighbors, or your family doctor. Automatic DLT SMS alerts are dispatched upon SOS.'}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন পরিচিত যোগ করুন' : 'Add Contact'}</span>
          </button>
        </div>

        {/* Contacts Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patientProfile.emergencyContacts.map(contact => (
            <div
              key={contact.id}
              className={`rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-4 ${
                contact.isPrimary
                  ? 'bg-teal-50/70 border-teal-400 shadow-elevated ring-2 ring-teal-500/20'
                  : 'bg-white border-slate-200 shadow-soft'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200">
                    {contact.relationship}
                  </span>
                  {contact.isPrimary ? (
                    <span className="flex items-center text-[10px] font-bold text-teal-800 bg-teal-200/60 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 mr-1 fill-teal-800" />
                      প্রধান অভিভাবক
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetPrimary(contact.id)}
                      className="text-[10px] font-bold text-slate-400 hover:text-teal-700"
                    >
                      প্রধান করুন
                    </button>
                  )}
                </div>

                <h3 className="text-lg font-black text-navy-950">{contact.name}</h3>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <a href={`tel:${contact.phone}`} className="flex items-center font-bold text-teal-700 hover:underline">
                    <PhoneCall className="w-3.5 h-3.5 mr-1.5" />
                    {contact.phone}
                  </a>
                  {contact.email && (
                    <p className="flex items-center text-slate-500 text-[11px] truncate">
                      <Mail className="w-3.5 h-3.5 mr-1.5" />
                      {contact.email}
                    </p>
                  )}
                  {contact.city && (
                    <p className="flex items-center text-slate-500 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
                      {contact.city}
                    </p>
                  )}
                </div>

                {/* Permissions pills */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1 text-[10px]">
                  {contact.canReceiveSosSms && (
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold">
                      ✓ SOS SMS সচল
                    </span>
                  )}
                  {contact.canViewMedicalSummary && (
                    <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-md font-semibold">
                      ✓ রেকর্ড দেখার অনুমতি
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                  title="Remove contact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5">
              <h3 className="text-lg font-black text-navy-950">
                {language === 'bn' ? 'নতুন জরুরি অভিভাবক / পরিচিত যোগ করুন' : 'Add Emergency Contact'}
              </h3>

              <form onSubmit={handleAddContact} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">পূর্ণ নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. অনির্বাণ চক্রবর্তী (Anirban Chakraborty)"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">সম্পর্ক *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ছেলে (লন্ডন) / প্রতিবেশী"
                      value={relationship}
                      onChange={e => setRelationship(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">ফোন নম্বর *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 / +44 ..."
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">অবস্থান / শহর</label>
                  <input
                    type="text"
                    placeholder="e.g. London / Salt Lake (5 mins away)"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is-prim"
                      checked={isPrimary}
                      onChange={e => setIsPrimary(e.target.checked)}
                      className="text-teal-600 rounded"
                    />
                    <label htmlFor="is-prim" className="text-xs font-bold text-slate-700 cursor-pointer">
                      প্রধান জরুরি অভিভাবক হিসেবে নির্ধারণ করুন
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="can-sms"
                      checked={canReceiveSosSms}
                      onChange={e => setCanReceiveSosSms(e.target.checked)}
                      className="text-teal-600 rounded"
                    />
                    <label htmlFor="can-sms" className="text-xs font-bold text-slate-700 cursor-pointer">
                      এসওএস বাটনে চাপ দিলে স্বয়ংক্রিয় এসএমএস যাবে
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm"
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
