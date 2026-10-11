import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  Bed,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Building2,
  Activity,
  Edit,
  Save
} from 'lucide-react';
import { BedAvailabilityRecord, BedCategoryType, BedStatus } from '../types';

export const BedAvailabilityManagement: React.FC = () => {
  const { language, t } = useLanguage();
  const { bedRecords, updateBedStatus, addBedRecord, currentUser } = useApp();

  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<BedStatus>('AVAILABLE');
  const [editAvailableCount, setEditAvailableCount] = useState<number>(5);
  const [editNotes, setEditNotes] = useState<string>('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState<BedCategoryType>('ICU');
  const [newCapacity, setNewCapacity] = useState(20);
  const [newAvailable, setNewAvailable] = useState(4);
  const [newNotes, setNewNotes] = useState('');

  const handleStartEdit = (record: BedAvailabilityRecord) => {
    setEditingRecordId(record.id);
    setEditStatus(record.status);
    setEditAvailableCount(record.availableCount);
    setEditNotes(record.notes || '');
  };

  const handleSaveEdit = (recordId: string) => {
    updateBedStatus(recordId, editStatus, Number(editAvailableCount), editNotes);
    setEditingRecordId(null);
  };

  const handleAddBed = (e: React.FormEvent) => {
    e.preventDefault();
    addBedRecord({
      hospitalId: currentUser?.hospitalId || 'hosp-1',
      hospitalName: currentUser?.hospitalName || 'Apollo Multispeciality Hospital',
      category: newCategory,
      totalCapacity: Number(newCapacity),
      availableCount: Number(newAvailable),
      status: Number(newAvailable) > 0 ? 'AVAILABLE' : 'UNAVAILABLE',
      updatedByStaffName: currentUser?.displayName || 'Emergency Staff',
      notes: newNotes
    });
    setShowAddModal(false);
    setNewNotes('');
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#2E7D32] font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Real-Time Bed Audit System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#171717]">
              {language === 'bn' ? 'লাইভ আইসিইউ ও জেনারেল বেড ব্যবস্থাপনা' : 'ICU & Ward Bed Management'}
            </h1>
            <p className="text-xs text-[#555555] max-w-2xl">
              {language === 'bn'
                ? 'হাসপাতাল স্টাফদের দ্বারা লাইভ বেড স্থিতি (উপলব্ধ / অনুপলব্ধ / যাচাইকৃত নয়) আপডেট করুন। গুগলে অপ্রমাণিত তথ্যের বিভ্রান্তি এড়াতে শুধুমাত্র অনুমোদিত স্টাফের ডেটাই নিশ্চিত বেড হিসেবে প্রদর্শিত হয়।'
                : 'Staff-verified ICU, CCU and Ward bed tracking. Prevents patient redirect delays.'}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white font-bold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন বেড ক্যাটাগরি যোগ' : 'Add Bed Category'}</span>
          </button>
        </div>

        {/* Live Bed Cards Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bedRecords.map(record => {
            const isEditing = editingRecordId === record.id;

            let statusBadge = (
              <span className="flex items-center text-xs font-bold text-[#2E7D32] bg-white border border-[#D5E8D7] px-2.5 py-1 rounded-full shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#2E7D32]" />
                {language === 'bn' ? 'উপলব্ধ (AVAILABLE)' : 'AVAILABLE'}
              </span>
            );

            if (record.status === 'UNAVAILABLE' || record.availableCount === 0) {
              statusBadge = (
                <span className="flex items-center text-xs font-bold text-rose-700 bg-white border border-rose-200 px-2.5 py-1 rounded-full shadow-2xs">
                  <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
                  {language === 'bn' ? 'খালি নেই (FULL)' : 'UNAVAILABLE'}
                </span>
              );
            } else if (record.status === 'UNKNOWN') {
              statusBadge = (
                <span className="flex items-center text-xs font-bold text-[#555555] bg-white border border-[#D5E8D7] px-2.5 py-1 rounded-full shadow-2xs">
                  <HelpCircle className="w-3.5 h-3.5 mr-1 text-[#555555]" />
                  {language === 'bn' ? 'অপরীক্ষিত (UNKNOWN)' : 'UNKNOWN'}
                </span>
              );
            }

            return (
              <div
                key={record.id}
                className="bg-[#E8F5E9] rounded-2xl sm:rounded-3xl p-6 border border-[#D5E8D7] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-[#D5E8D7]">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-white border border-[#D5E8D7] text-[#171717]">
                      {record.category.replace('_', ' ')}
                    </span>
                    {statusBadge}
                  </div>

                  <h3 className="font-bold text-[#171717] text-base">{record.hospitalName}</h3>

                  {isEditing ? (
                    <div className="space-y-3 p-3 bg-white rounded-2xl border border-[#D5E8D7]">
                      <div>
                        <label className="block text-[11px] font-bold text-[#171717] mb-1">
                          {language === 'bn' ? 'অবস্থা নির্বাচন:' : 'Select Status:'}
                        </label>
                        <select
                          value={editStatus}
                          onChange={e => setEditStatus(e.target.value as BedStatus)}
                          className="w-full p-2 bg-white rounded-xl border border-[#D5E8D7] text-xs font-bold text-[#171717] outline-hidden focus:border-[#2E7D32]"
                        >
                          <option value="AVAILABLE">{language === 'bn' ? 'AVAILABLE (উপলব্ধ)' : 'AVAILABLE'}</option>
                          <option value="UNAVAILABLE">{language === 'bn' ? 'UNAVAILABLE (খালি নেই)' : 'UNAVAILABLE'}</option>
                          <option value="UNKNOWN">{language === 'bn' ? 'UNKNOWN (অনিশ্চিত)' : 'UNKNOWN'}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#171717] mb-1">
                          {language === 'bn' ? 'উপলব্ধ বেড সংখ্যা:' : 'Available Bed Count:'}
                        </label>
                        <input
                          type="number"
                          value={editAvailableCount}
                          onChange={e => setEditAvailableCount(Number(e.target.value))}
                          className="w-full p-2 bg-white rounded-xl border border-[#D5E8D7] text-xs font-bold text-[#171717] outline-hidden focus:border-[#2E7D32]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#171717] mb-1">
                          {language === 'bn' ? 'নোট:' : 'Notes:'}
                        </label>
                        <input
                          type="text"
                          value={editNotes}
                          onChange={e => setEditNotes(e.target.value)}
                          className="w-full p-2 bg-white rounded-xl border border-[#D5E8D7] text-xs text-[#171717] outline-hidden focus:border-[#2E7D32]"
                          placeholder={language === 'bn' ? 'যেমন: ভেন্টিলেটর প্রস্তুত...' : 'e.g. Ventilator ready...'}
                        />
                      </div>

                      <div className="flex justify-end space-x-2 pt-2">
                        <button
                          onClick={() => setEditingRecordId(null)}
                          className="px-3 py-1 bg-white border border-[#D5E8D7] text-[#555555] rounded-lg text-xs font-bold cursor-pointer"
                        >
                          {language === 'bn' ? 'বাতিল' : 'Cancel'}
                        </button>
                        <button
                          onClick={() => handleSaveEdit(record.id)}
                          className="px-4 py-1 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'সংরক্ষণ' : 'Save'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-4 bg-white rounded-2xl border border-[#D5E8D7] flex items-center justify-between shadow-2xs">
                        <span className="text-xs text-[#555555] font-medium">
                          {language === 'bn' ? 'উপলব্ধ / মোট ক্ষমতা:' : 'Available / Total Capacity:'}
                        </span>
                        <span className="text-lg font-black text-[#171717]">
                          <span className="text-[#2E7D32]">{record.availableCount}</span> / {record.totalCapacity}
                        </span>
                      </div>

                      {record.notes && (
                        <p className="text-xs text-[#555555] italic bg-white p-2.5 rounded-xl border border-[#D5E8D7]">
                          "{record.notes}"
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#D5E8D7] flex items-center justify-between text-xs text-[#555555]">
                  <span className="truncate max-w-[170px]">
                    {language === 'bn' ? 'স্টাফ:' : 'Staff:'} <strong className="text-[#171717]">{record.updatedByStaffName.split('(')[0]}</strong>
                  </span>
                  {!isEditing && (
                    <button
                      onClick={() => handleStartEdit(record)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#D5E8D7] hover:bg-[#F1F8F2] text-[#171717] font-bold transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>{language === 'bn' ? 'হালনাগাদ' : 'Update'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Bed Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-xl border border-[#D5E8D7] space-y-5">
              <h3 className="text-lg font-black text-[#171717]">
                {language === 'bn' ? 'নতুন বেড ক্যাটাগরি তৈরি করুন' : 'Add Bed Category'}
              </h3>

              <form onSubmit={handleAddBed} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1">
                    {language === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as BedCategoryType)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5E8D7] text-xs font-bold text-[#171717] outline-hidden focus:border-[#2E7D32]"
                  >
                    <option value="ICU">ICU (Intensive Care Unit)</option>
                    <option value="CCU">CCU (Coronary Care Unit)</option>
                    <option value="HDU">HDU (High Dependency Unit)</option>
                    <option value="GENERAL_WARD">General Ward</option>
                    <option value="NICU">NICU (Neonatal ICU)</option>
                    <option value="OXYGEN_SUPPORTED">Oxygen Supported Bed</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1">
                      {language === 'bn' ? 'মোট ক্ষমতা (Total)' : 'Total Capacity'}
                    </label>
                    <input
                      type="number"
                      required
                      value={newCapacity}
                      onChange={e => setNewCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5E8D7] text-xs text-[#171717] outline-hidden focus:border-[#2E7D32]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1">
                      {language === 'bn' ? 'উপলব্ধ সংখ্যা (Available)' : 'Available Count'}
                    </label>
                    <input
                      type="number"
                      required
                      value={newAvailable}
                      onChange={e => setNewAvailable(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#D5E8D7] text-xs text-[#171717] outline-hidden focus:border-[#2E7D32]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1">
                    {language === 'bn' ? 'নোট / সুবিধা বিবরণ' : 'Notes / Facilities'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ventilator ready, Cardiac monitor attached"
                    value={newNotes}
                    onChange={e => setNewNotes(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-white border border-[#D5E8D7] text-xs text-[#171717] outline-hidden focus:border-[#2E7D32]"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#D5E8D7]">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border border-[#D5E8D7] bg-white text-xs font-bold text-[#555555] hover:bg-[#F1F8F2] cursor-pointer"
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
