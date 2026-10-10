import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Pill,
  Stethoscope,
  Save,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { BloodGroup, LocationArea } from '../types';

export const PersonalProfile: React.FC = () => {
  const { language } = useLanguage();
  const { patientProfile, currentUser, updatePatientProfile, showToast } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(patientProfile.fullName || currentUser?.displayName || '');
  const [age, setAge] = useState(String(patientProfile.age || currentUser?.age || '65'));
  const [phone, setPhone] = useState(patientProfile.phone || currentUser?.phone || '');
  const [location, setLocation] = useState<LocationArea | string>(patientProfile.location || currentUser?.location || 'Panihati, West Bengal');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>(patientProfile.bloodGroup || '');
  const [allergiesText, setAllergiesText] = useState((patientProfile.knownAllergies || []).join(', '));
  const [conditionsText, setConditionsText] = useState((patientProfile.existingConditions || []).join('\n'));

  // Doctor state
  const [doctorName, setDoctorName] = useState(patientProfile.treatingDoctor?.name || '');
  const [doctorPhone, setDoctorPhone] = useState(patientProfile.treatingDoctor?.phone || '');
  const [doctorHospital, setDoctorHospital] = useState(patientProfile.treatingDoctor?.hospital || '');

  // Keep form synchronized with active patient profile
  useEffect(() => {
    setFullName(patientProfile.fullName || currentUser?.displayName || '');
    setAge(String(patientProfile.age || currentUser?.age || '65'));
    setPhone(patientProfile.phone || currentUser?.phone || '');
    setLocation(patientProfile.location || currentUser?.location || 'Panihati, West Bengal');
    setBloodGroup(patientProfile.bloodGroup || '');
    setAllergiesText((patientProfile.knownAllergies || []).join(', '));
    setConditionsText((patientProfile.existingConditions || []).join('\n'));
    setDoctorName(patientProfile.treatingDoctor?.name || '');
    setDoctorPhone(patientProfile.treatingDoctor?.phone || '');
    setDoctorHospital(patientProfile.treatingDoctor?.hospital || '');
  }, [patientProfile, currentUser]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const allergies = allergiesText
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);

    const conditions = conditionsText
      .split('\n')
      .map(c => c.trim())
      .filter(Boolean);

    updatePatientProfile({
      fullName: fullName.trim(),
      age: Number(age) || 65,
      phone: phone.trim(),
      location,
      bloodGroup: (bloodGroup || undefined) as BloodGroup | undefined,
      knownAllergies: allergies,
      existingConditions: conditions,
      treatingDoctor: doctorName ? {
        name: doctorName,
        phone: doctorPhone,
        hospital: doctorHospital,
        speciality: 'Consultant Physician'
      } : undefined
    });

    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-widest flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1 text-[#2E7D32]" />
              Verified Patient Health Profile
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#171717]">
              {patientProfile.fullName || currentUser?.displayName || 'My Profile'}
            </h1>
            <p className="text-xs text-[#555555]">
              {language === 'bn' ? 'অ্যাকাউন্ট তৈরি:' : 'Account Created:'} {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Active'}
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? (language === 'bn' ? 'বাতিল' : 'Cancel Edit') : (language === 'bn' ? 'প্রোফাইল সম্পাদনা' : 'Edit Profile')}</span>
          </button>
        </div>

        {/* Profile Content */}
        {isEditing ? (
          <form onSubmit={handleSave} className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-6">
            <h3 className="text-base font-black text-[#171717] pb-3 border-b border-[#D5E8D7]">
              {language === 'bn' ? 'প্রোফাইল তথ্য আপডেট করুন' : 'Edit Profile Information'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">পূর্ণ নাম (Full Name) *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm font-medium text-[#171717] outline-hidden focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">বয়স (Age) *</label>
                <input
                  type="number"
                  required
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm font-medium text-[#171717] outline-hidden focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">ফোন নম্বর (Phone) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm font-medium font-mono text-[#171717] outline-hidden focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">অবস্থান এলাকা (Location) *</label>
                <select
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm font-bold text-[#171717] outline-hidden focus:border-[#2E7D32]"
                >
                  <option value="Panihati, West Bengal">Panihati, West Bengal</option>
                  <option value="Dum Dum, West Bengal">Dum Dum, West Bengal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">রক্তের গ্রুপ (ঐচ্ছিক)</label>
                <select
                  value={bloodGroup}
                  onChange={e => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-sm text-[#171717] font-semibold outline-hidden focus:border-[#2E7D32]"
                >
                  <option value="">নির্বাচন করুন (Select if known)</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            {/* Medical history optional entry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#D5E8D7]">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">জানা অ্যালার্জি (কমা দিয়ে আলাদা করুন)</label>
                <textarea
                  rows={3}
                  placeholder="যেমন: Penicillin, Dust..."
                  value={allergiesText}
                  onChange={e => setAllergiesText(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white border border-[#D5E8D7] text-xs text-[#171717] outline-hidden focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">বিদ্যমান রোগ বা পূর্ববর্তী অপারেশন</label>
                <textarea
                  rows={3}
                  placeholder="যেমন: Hypertension, Diabetes..."
                  value={conditionsText}
                  onChange={e => setConditionsText(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white border border-[#D5E8D7] text-xs text-[#171717] outline-hidden focus:border-[#2E7D32]"
                />
              </div>
            </div>

            {/* Doctor info */}
            <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] space-y-3">
              <span className="text-xs font-bold text-[#2E7D32] block">ব্যক্তিগত চিকিৎসক (ঐচ্ছিক):</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="ডাক্তারের নাম"
                  value={doctorName}
                  onChange={e => setDoctorName(e.target.value)}
                  className="px-3 py-2 bg-[#F1F8F2] rounded-xl border border-[#D5E8D7] text-xs text-[#171717] outline-hidden focus:border-[#2E7D32]"
                />
                <input
                  type="tel"
                  placeholder="ডাক্তারের ফোন"
                  value={doctorPhone}
                  onChange={e => setDoctorPhone(e.target.value)}
                  className="px-3 py-2 bg-[#F1F8F2] rounded-xl border border-[#D5E8D7] text-xs text-[#171717] outline-hidden focus:border-[#2E7D32]"
                />
                <input
                  type="text"
                  placeholder="হাসপাতাল / চেম্বার"
                  value={doctorHospital}
                  onChange={e => setDoctorHospital(e.target.value)}
                  className="px-3 py-2 bg-[#F1F8F2] rounded-xl border border-[#D5E8D7] text-xs text-[#171717] outline-hidden focus:border-[#2E7D32]"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-[#D5E8D7]">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl bg-white border border-[#D5E8D7] text-xs font-bold text-[#555555] hover:bg-[#F1F8F2]"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-xl text-xs font-bold shadow-sm flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>সংরক্ষণ করুন</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Primary Details Card */}
            <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#171717] pb-3 border-b border-[#D5E8D7]">
                {language === 'bn' ? 'নিবন্ধিত প্রাথমিক তথ্য' : 'Registered Patient Details'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="bg-white p-4 rounded-2xl border border-[#D5E8D7]">
                  <span className="text-[#555555] block">পূর্ণ নাম:</span>
                  <span className="text-base font-black text-[#171717] block mt-0.5">
                    {patientProfile.fullName || currentUser?.displayName}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#D5E8D7]">
                  <span className="text-[#555555] block">বয়স:</span>
                  <span className="text-base font-black text-[#171717] block mt-0.5">
                    {patientProfile.age || currentUser?.age || 65} বছর (Years)
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#D5E8D7]">
                  <span className="text-[#555555] block">ফোন নম্বর:</span>
                  <span className="text-base font-black text-[#2E7D32] block mt-0.5 font-mono">
                    {patientProfile.phone || currentUser?.phone}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#D5E8D7]">
                  <span className="text-[#555555] block">নিবন্ধিত এলাকা:</span>
                  <span className="text-sm font-black text-[#171717] block mt-0.5">
                    {patientProfile.location || currentUser?.location || 'Panihati, West Bengal'}
                  </span>
                </div>
              </div>
            </div>

            {/* Optional Medical Info Card */}
            <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#171717] pb-3 border-b border-[#D5E8D7] flex items-center justify-between">
                <span>{language === 'bn' ? 'ব্যক্তিগত চিকিৎসা তথ্য' : 'Medical Details'}</span>
                {(!patientProfile.knownAllergies?.length && !patientProfile.existingConditions?.length && !patientProfile.bloodGroup) && (
                  <span className="text-xs text-[#555555] font-normal">রোগী কর্তৃক এখনো কোনো তথ্য যোগ করা হয়নি</span>
                )}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-white p-4 rounded-2xl border border-[#D5E8D7]">
                  <span className="text-[#555555] block">রক্তের গ্রুপ:</span>
                  <span className="text-base font-black text-rose-600 block mt-0.5">
                    {patientProfile.bloodGroup || 'প্রদান করা হয়নি'}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#D5E8D7] sm:col-span-2">
                  <span className="text-[#555555] block">জানা অ্যালার্জি:</span>
                  {(patientProfile.knownAllergies && patientProfile.knownAllergies.length > 0) ? (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {patientProfile.knownAllergies.map((a, i) => (
                        <span key={i} className="px-2.5 py-0.5 bg-rose-50 text-rose-800 rounded-md font-bold text-xs border border-rose-200">
                          {a}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[#555555] italic block mt-0.5">কোনো অ্যালার্জি যুক্ত করা হয়নি</span>
                  )}
                </div>
              </div>

              {patientProfile.treatingDoctor && (
                <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] text-xs">
                  <span className="font-bold text-[#2E7D32] block">পরামর্শক চিকিৎসক:</span>
                  <p className="font-bold text-[#171717] mt-0.5">{patientProfile.treatingDoctor.name}</p>
                  <p className="text-[#555555]">{patientProfile.treatingDoctor.hospital} • {patientProfile.treatingDoctor.phone}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
