import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Search,
  PlusCircle,
  Eye,
  Trash2,
  Share2,
  Calendar,
  CheckCircle2,
  FolderOpen,
  ShieldCheck,
  Upload
} from 'lucide-react';
import { DocumentCategory } from '../types';

export const MedicalVault: React.FC = () => {
  const { language, t } = useLanguage();
  const { medicalDocuments, deleteMedicalDocument, navigateTo, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>('all');

  const categories: { id: DocumentCategory | 'all'; labelBn: string; labelEn: string; count: number }[] = [
    { id: 'all', labelBn: 'সকল নথি', labelEn: 'All Documents', count: medicalDocuments.length },
    { id: 'prescriptions', labelBn: 'প্রেসক্রিপশন', labelEn: 'Prescriptions', count: medicalDocuments.filter(d => d.category === 'prescriptions').length },
    { id: 'blood_reports', labelBn: 'রক্তের রিপোর্ট', labelEn: 'Blood Reports', count: medicalDocuments.filter(d => d.category === 'blood_reports').length },
    { id: 'diagnostic_reports', labelBn: 'ডায়াগনস্টিক রিপোর্ট', labelEn: 'Diagnostic Reports', count: medicalDocuments.filter(d => d.category === 'diagnostic_reports').length },
    { id: 'hospital_records', labelBn: 'হাসপাতাল রেকর্ড', labelEn: 'Hospital Records', count: medicalDocuments.filter(d => d.category === 'hospital_records').length },
    { id: 'insurance', labelBn: 'স্বাস্থ্য বীমা', labelEn: 'Insurance', count: medicalDocuments.filter(d => d.category === 'insurance').length },
    { id: 'health_schemes', labelBn: 'সরকারি স্বাস্থ্য প্রকল্প', labelEn: 'Health Schemes', count: medicalDocuments.filter(d => d.category === 'health_schemes').length },
    { id: 'id_documents', labelBn: 'পরিচয়পত্র', labelEn: 'ID Documents', count: medicalDocuments.filter(d => d.category === 'id_documents').length },
    { id: 'other', labelBn: 'অন্যান্য নথি', labelEn: 'Other Health Files', count: medicalDocuments.filter(d => d.category === 'other').length },
  ];

  // Filter real documents
  const filteredDocs = medicalDocuments.filter(doc => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.doctorName && doc.doctorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.hospitalName && doc.hospitalName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.notes && doc.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Title & Action Button */}
        <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#2E7D32] font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
              <span>MediVault 256-Bit Encrypted Repository</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#171717]">
              {language === 'bn' ? 'মেডিকেল রেকর্ডস ভল্ট (MediVault)' : 'MediVault Medical Records'}
            </h1>
            <p className="text-xs text-[#555555] max-w-2xl">
              {language === 'bn'
                ? 'আপনার ব্যক্তিগত প্রেসক্রিপশন, রক্তের রিপোর্ট, এক্স-রে ও ডিসচার্জ সামারি সম্পূর্ণ নিরাপদে সংরক্ষিত রাখুন।'
                : 'Centralized, encrypted vault for your real medical documents. Only records saved by you are visible here.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigateTo('upload-document')}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white font-bold text-xs shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('uploadNewDoc')}</span>
            </button>
            {medicalDocuments.length > 0 && (
              <button
                onClick={() => navigateTo('share-records')}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-white border border-[#D5E8D7] hover:bg-[#F1F8F2] text-[#171717] font-bold text-xs shadow-xs transition-all"
              >
                <Share2 className="w-4 h-4 text-[#2E7D32]" />
                <span>{t('shareRecords')}</span>
              </button>
            )}
          </div>
        </div>

        {/* If completely empty, show the mandated empty state */}
        {medicalDocuments.length === 0 ? (
          <div className="bg-[#E8F5E9] rounded-3xl p-12 sm:p-16 text-center border border-[#D5E8D7] shadow-sm max-w-3xl mx-auto space-y-6 animate-in fade-in">
            <div className="w-20 h-20 rounded-3xl bg-white border border-[#D5E8D7] text-[#2E7D32] flex items-center justify-center mx-auto shadow-xs">
              <FolderOpen className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#171717]">
                {language === 'bn' ? 'আপনার মেডিকেল ভল্ট সম্পূর্ণ খালি' : 'Your Medical Vault is Empty'}
              </h2>
              <p className="text-sm text-[#555555] max-w-md mx-auto leading-relaxed">
                {language === 'bn'
                  ? 'আপনার স্বাস্থ্য রেকর্ড নিরাপদে সাজিয়ে রাখতে আপনার প্রথম মেডিকেল নথি আপলোড করুন।'
                  : 'Upload your first medical document to securely organize your health records.'}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigateTo('upload-document')}
                className="px-8 py-3.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-xl font-black text-sm shadow-sm transition-all inline-flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>{language === 'bn' ? 'নথি আপলোড করুন' : 'Upload Documents'}</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Search Bar and Category Tabs */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-5 h-5 text-[#555555] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={language === 'bn' ? 'প্রেসক্রিপশন, ডাক্তারের নাম, হাসপাতাল বা ট্যাগ অনুসন্ধান করুন...' : 'Search records by title, doctor, hospital or tag...'}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-[#D5E8D7] focus:border-[#2E7D32] text-sm font-medium text-[#171717] shadow-xs outline-hidden"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 ${
                      selectedCategory === cat.id
                        ? 'bg-[#2E7D32] text-white shadow-xs'
                        : 'bg-[#E8F5E9] text-[#171717] hover:bg-[#F1F8F2] border border-[#D5E8D7]'
                    }`}
                  >
                    <span>{language === 'bn' ? cat.labelBn : cat.labelEn}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      selectedCategory === cat.id ? 'bg-[#256B2A] text-white' : 'bg-white text-[#555555] border border-[#D5E8D7]'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filtered Documents Grid */}
            {filteredDocs.length === 0 ? (
              <div className="bg-[#E8F5E9] rounded-3xl p-8 text-center border border-[#D5E8D7] space-y-3">
                <p className="text-sm text-[#555555]">
                  {language === 'bn' ? 'এই ফিল্টারে কোনো নথি মেলেনি।' : 'No matching documents found in this filter.'}
                </p>
                <button
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                  className="text-xs font-bold text-[#2E7D32] hover:underline"
                >
                  {language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filter'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocs.map(doc => (
                  <div
                    key={doc.id}
                    className="bg-[#E8F5E9] rounded-2xl border border-[#D5E8D7] shadow-xs hover:border-[#2E7D32] hover:shadow-sm transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase bg-white text-[#2E7D32] border border-[#D5E8D7]">
                          {doc.category.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          {language === 'bn' ? 'সংরক্ষিত' : 'Saved'}
                        </span>
                      </div>

                      <h3
                        onClick={() => navigateTo('document-preview', { id: doc.id })}
                        className="text-base font-bold text-[#171717] group-hover:text-[#2E7D32] cursor-pointer transition-colors line-clamp-2"
                      >
                        {doc.title}
                      </h3>

                      <div className="space-y-1 text-xs text-[#555555]">
                        {doc.doctorName && (
                          <p className="truncate">
                            <span className="font-semibold text-[#171717]">
                              {language === 'bn' ? 'চিকিৎসক:' : 'Physician:'}
                            </span> {doc.doctorName}
                          </p>
                        )}
                        {doc.hospitalName && (
                          <p className="truncate">
                            <span className="font-semibold text-[#171717]">
                              {language === 'bn' ? 'হাসপাতাল:' : 'Hospital:'}
                            </span> {doc.hospitalName}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-[11px] text-[#555555] pt-1">
                          <span className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1 text-[#2E7D32]" />
                            {doc.issueDate || doc.uploadDate}
                          </span>
                          <span>{doc.fileSizeKb} KB • {doc.fileType.toUpperCase()}</span>
                        </div>
                      </div>

                      {doc.notes && (
                        <p className="text-xs text-[#555555] line-clamp-2 italic bg-white p-2.5 rounded-xl border border-[#D5E8D7]">
                          "{doc.notes}"
                        </p>
                      )}
                    </div>

                    <div className="bg-[#F1F8F2] px-6 py-3 border-t border-[#D5E8D7] flex items-center justify-between">
                      <button
                        onClick={() => navigateTo('document-preview', { id: doc.id })}
                        className="flex items-center space-x-1.5 text-xs font-bold text-[#2E7D32] hover:text-[#256B2A]"
                      >
                        <Eye className="w-4 h-4" />
                        <span>{language === 'bn' ? 'প্রিভিউ দেখুন' : 'View'}</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigateTo('share-records', { docId: doc.id })}
                          className="p-1.5 text-[#555555] hover:text-[#2E7D32] rounded hover:bg-white transition-colors"
                          title="Share"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMedicalDocument(doc.id)}
                          className="p-1.5 text-[#555555] hover:text-rose-600 rounded hover:bg-white transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
