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
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#2E7D32] font-bold text-xs">
              <Users className="w-4 h-4 text-[#2E7D32]" />
              <span>{language === 'bn' ? 'বিশ্বস্ত পরিবার ও অভিভাবক নেটওয়ার্ক' : 'Trusted Family & Caregiver Network'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#171717]">
              {language === 'bn' ? 'জরুরি পরিচিতজন ও অভিভাবক নেটওয়ার্ক' : 'Emergency Contacts & Guardians'}
            </h1>
            <p className="text-xs text-[#555555] max-w-xl">
              {language === 'bn'
                ? 'দূরবর্তী সন্তান, স্থানীয় প্রতিবেশী ও ব্যক্তিগত চিকিৎসকের নম্বর যুক্ত রাখুন। জরুরি এসওএস পাঠালে এরা স্বয়ংক্রিয়ভাবে এসএমএস পাবেন।'
                : 'Add distant children, local neighbors, or your family doctor. Automatic DLT SMS alerts are dispatched upon SOS.'}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white font-bold text-xs shadow-sm transition-all shrink-0 cursor-pointer"
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
              className={`rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-4 bg-[#E8F5E9] ${
                contact.isPrimary
                  ? 'border-[#2E7D32] shadow-sm ring-2 ring-[#2E7D32]/20'
                  : 'border-[#D5E8D7] shadow-xs hover:border-[#2E7D32]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#171717] bg-white px-2.5 py-1 rounded-lg border border-[#D5E8D7]">
                    {contact.relationship}
                  </span>
                  {contact.isPrimary ? (
                    <span className="flex items-center text-[10px] font-bold text-[#2E7D32] bg-white px-2 py-0.5 rounded-full border border-[#D5E8D7]">
                      <Star className="w-3 h-3 mr-1 fill-[#2E7D32]" />
                      {language === 'bn' ? 'প্রধান অভিভাবক' : 'Primary Guardian'}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetPrimary(contact.id)}
                      className="text-[10px] font-bold text-[#555555] hover:text-[#2E7D32] cursor-pointer"
                    >
                      {language === 'bn' ? 'প্রধান করুন' : 'Make Primary'}
                    </button>
                  )}
                </div>

                <h3 className="text-lg font-black text-[#171717]">{contact.name}</h3>

                <div className="space-y-1.5 text-xs text-[#555555]">
                  <a href={`tel:${contact.phone}`} className="flex items-center font-bold text-[#2E7D32] hover:underline">
                    <PhoneCall className="w-3.5 h-3.5 mr-1.5" />
                    {contact.phone}
                  </a>
                  {contact.email && (
                    <p className="flex items-center text-[#555555] text-[11px] truncate">
                      <Mail className="w-3.5 h-3.5 mr-1.5" />
                      {contact.email}
                    </p>
                  )}
                  {contact.city && (
                    <p className="flex items-center text-[#555555] text-[11px]">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#2E7D32]" />
                      {contact.city}
                    </p>
                  )}
                </div>

                {/* Permissions pills */}
                <div className="pt-2 border-t border-[#D5E8D7] flex flex-wrap gap-1 text-[10px]">
                  {contact.canReceiveSosSms && (
                    <span className="bg-white text-[#2E7D32] border border-[#D5E8D7] px-2 py-0.5 rounded-md font-semibold">
                      {language === 'bn' ? '✓ SOS SMS সচল' : '✓ SOS SMS Active'}
                    </span>
                  )}
                  {contact.canViewMedicalSummary && (
                    <span className="bg-white text-[#171717] border border-[#D5E8D7] px-2 py-0.5 rounded-md font-semibold">
                      {language === 'bn' ? '✓ রেকর্ড দেখার অনুমতি' : '✓ Summary View Access'}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#D5E8D7] flex justify-end">
                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  className="p-1.5 text-[#555555] hover:text-rose-600 rounded hover:bg-white transition-colors cursor-pointer"
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
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-xl border border-[#D5E8D7] space-y-5">
              <h3 className="text-lg font-black text-[#171717]">
                {language === 'bn' ? 'নতুন জরুরি অভিভাবক / পরিচিত যোগ করুন' : 'Add Emergency Contact & Guardian'}
              </h3>

              <form onSubmit={handleAddContact} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1">
                    {language === 'bn' ? 'পূর্ণ নাম *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={language === 'bn' ? 'যেমন: অনির্বাণ চক্রবর্তী' : 'e.g. Anirban Chakraborty'}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm text-[#171717] focus:border-[#2E7D32] outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1">
                      {language === 'bn' ? 'সম্পর্ক *' : 'Relationship *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={language === 'bn' ? 'যেমন: ছেলে / কন্যা / প্রতিবেশী' : 'e.g. Son / Daughter / Neighbor'}
                      value={relationship}
                      onChange={e => setRelationship(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5E8D7] text-xs text-[#171717] focus:border-[#2E7D32] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1">
                      {language === 'bn' ? 'ফোন নম্বর *' : 'Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 / +44 ..."
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5E8D7] text-xs text-[#171717] focus:border-[#2E7D32] outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1">
                    {language === 'bn' ? 'অবস্থান / শহর' : 'Location / City'}
                  </label>
                  <input
                    type="text"
                    placeholder={language === 'bn' ? 'যেমন: পানিহাটি / সল্টলেক / লন্ডন' : 'e.g. Panihati / Salt Lake / London'}
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm text-[#171717] focus:border-[#2E7D32] outline-hidden"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-[#D5E8D7]">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is-prim"
                      checked={isPrimary}
                      onChange={e => setIsPrimary(e.target.checked)}
                      className="text-[#2E7D32] rounded focus:ring-[#2E7D32]"
                    />
                    <label htmlFor="is-prim" className="text-xs font-bold text-[#171717] cursor-pointer">
                      {language === 'bn' ? 'প্রধান জরুরি অভিভাবক হিসেবে নির্ধারণ করুন' : 'Set as Primary Emergency Guardian'}
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="can-sms"
                      checked={canReceiveSosSms}
                      onChange={e => setCanReceiveSosSms(e.target.checked)}
                      className="text-[#2E7D32] rounded focus:ring-[#2E7D32]"
                    />
                    <label htmlFor="can-sms" className="text-xs font-bold text-[#171717] cursor-pointer">
                      {language === 'bn' ? 'এসওএস বাটনে চাপ দিলে স্বয়ংক্রিয় এসএমএস যাবে' : 'Send automated SMS alert on Emergency SOS'}
                    </label>
                  </div>
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
