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
  const { bedRecords, updateBedStatus, addBedRecord, currentUser, showToast } = useApp();

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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-teal-700 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Real-Time Bed Audit System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-950">
              {language === 'bn' ? 'লাইভ আইসিইউ ও জেনারেল বেড ব্যবস্থাপনা' : 'ICU & Ward Bed Management'}
            </h1>
            <p className="text-xs text-slate-600 max-w-2xl">
              {language === 'bn'
                ? 'হাসপাতাল স্টাফদের দ্বারা লাইভ বেড স্থিতি (উপলব্ধ / অনুপলব্ধ / যাচাইকৃত নয়) আপডেট করুন। গুগলে অপ্রমাণিত তথ্যের বিভ্রান্তি এড়াতে শুধুমাত্র অনুমোদিত স্টাফের ডেটাই নিশ্চিত বেড হিসেবে প্রদর্শিত হয়।'
                : 'Staff-verified ICU, CCU and Ward bed tracking. Prevents patient redirect delays.'}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all shrink-0"
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
              <span className="flex items-center text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                {language === 'bn' ? 'উপলব্ধ (AVAILABLE)' : 'AVAILABLE'}
              </span>
            );

            if (record.status === 'UNAVAILABLE' || record.availableCount === 0) {
              statusBadge = (
                <span className="flex items-center text-xs font-bold text-rose-800 bg-rose-100 px-2.5 py-1 rounded-full">
                  <XCircle className="w-3.5 h-3.5 mr-1" />
                  {language === 'bn' ? 'খালি নেই (FULL)' : 'UNAVAILABLE'}
                </span>
              );
            } else if (record.status === 'UNKNOWN') {
              statusBadge = (
                <span className="flex items-center text-xs font-bold text-slate-700 bg-slate-200 px-2.5 py-1 rounded-full">
                  <HelpCircle className="w-3.5 h-3.5 mr-1" />
                  {language === 'bn' ? 'অপরীক্ষিত (UNKNOWN)' : 'UNKNOWN'}
                </span>
              );
            }

            return (
              <div
                key={record.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider bg-navy-900 text-white">
                      {record.category.replace('_', ' ')}
                    </span>
                    {statusBadge}
                  </div>

                  <h3 className="font-bold text-navy-950 text-base">{record.hospitalName}</h3>

                  {isEditing ? (
                    <div className="space-y-3 p-3 bg-slate-50 rounded-2xl border border-teal-200">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">অবস্থা নির্বাচন:</label>
                        <select
                          value={editStatus}
                          onChange={e => setEditStatus(e.target.value as BedStatus)}
                          className="w-full p-2 bg-white rounded-xl border text-xs font-bold"
                        >
                          <option value="AVAILABLE">AVAILABLE (উপলব্ধ)</option>
                          <option value="UNAVAILABLE">UNAVAILABLE (খালি নেই)</option>
                          <option value="UNKNOWN">UNKNOWN (অনিশ্চিত)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">উপলব্ধ বেড সংখ্যা:</label>
                        <input
                          type="number"
                          value={editAvailableCount}
                          onChange={e => setEditAvailableCount(Number(e.target.value))}
                          className="w-full p-2 bg-white rounded-xl border text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">নোট:</label>
                        <input
                          type="text"
                          value={editNotes}
                          onChange={e => setEditNotes(e.target.value)}
                          className="w-full p-2 bg-white rounded-xl border text-xs"
                          placeholder="Ventilator ready..."
                        />
                      </div>

                      <div className="flex justify-end space-x-2 pt-2">
                        <button
                          onClick={() => setEditingRecordId(null)}
                          className="px-3 py-1 bg-slate-200 rounded-lg text-xs font-bold"
                        >
                          বাতিল
                        </button>
                        <button
                          onClick={() => handleSaveEdit(record.id)}
                          className="px-4 py-1 bg-teal-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>সংরক্ষণ</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">উপলব্ধ / মোট ক্ষমতা:</span>
                        <span className="text-lg font-black text-navy-950">
                          <span className="text-teal-700">{record.availableCount}</span> / {record.totalCapacity}
                        </span>
                      </div>

                      {record.notes && (
                        <p className="text-xs text-slate-600 italic bg-teal-50/50 p-2.5 rounded-xl border border-teal-100">
                          "{record.notes}"
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="truncate max-w-[170px]">
                    স্টাফ: <strong>{record.updatedByStaffName.split('(')[0]}</strong>
                  </span>
                  {!isEditing && (
                    <button
                      onClick={() => handleStartEdit(record)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-bold transition-colors flex items-center space-x-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>হালনাগাদ</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Bed Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5">
              <h3 className="text-lg font-black text-navy-950">
                {language === 'bn' ? 'নতুন বেড ক্যাটাগরি তৈরি করুন' : 'Add Bed Category'}
              </h3>

              <form onSubmit={handleAddBed} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">ক্যাটাগরি</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as BedCategoryType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-bold"
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
                    <label className="block text-xs font-bold text-slate-800 mb-1">মোট ক্ষমতা (Total)</label>
                    <input
                      type="number"
                      required
                      value={newCapacity}
                      onChange={e => setNewCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">উপলব্ধ সংখ্যা (Available)</label>
                    <input
                      type="number"
                      required
                      value={newAvailable}
                      onChange={e => setNewAvailable(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">নোট / সুবিধা বিবরণ</label>
                  <input
                    type="text"
                    placeholder="e.g. Ventilator ready, Cardiac monitor attached"
                    value={newNotes}
                    onChange={e => setNewNotes(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
                  />
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
