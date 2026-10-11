import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Download,
  Share2,
  Trash2,
  Calendar,
  User,
  Building,
  CheckCircle2,
  Tag,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  Clock,
  Printer
} from 'lucide-react';

export const DocumentPreviewModal: React.FC = () => {
  const { language, t } = useLanguage();
  const { medicalDocuments, pageParams, navigateTo, deleteMedicalDocument, showToast, addAuditLog } = useApp();

  const docId = pageParams?.id;
  const doc = medicalDocuments.find(d => d.id === docId) || medicalDocuments[0];

  const [zoomLevel, setZoomLevel] = useState(1);

  if (!doc) {
    return (
      <div className="min-h-screen bg-white p-8 text-center flex flex-col items-center justify-center space-y-4">
        <p className="text-[#555555] text-sm">
          {language === 'bn' ? 'নথি পাওয়া যায়নি' : 'Document not found'}
        </p>
        <button
          onClick={() => navigateTo('medical-vault')}
          className="px-5 py-2.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
        >
          {language === 'bn' ? 'ভল্টে ফিরে যান' : 'Back to Vault'}
        </button>
      </div>
    );
  }

  const handleDownload = () => {
    addAuditLog('DOWNLOAD_DOCUMENT', `Downloaded document: ${doc.title} (${doc.id})`);
    showToast('success', 'Document download initiated', doc.title);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigateTo('medical-vault')}
            className="flex items-center space-x-2 text-xs font-bold text-[#2E7D32] hover:text-[#256B2A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'bn' ? 'মেডিকেল ভল্টে ফিরে যান' : 'Back to MediVault'}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-[#D5E8D7] bg-white hover:bg-[#F1F8F2] text-[#171717] text-xs font-bold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{t('download')}</span>
            </button>
            <button
              onClick={() => navigateTo('share-records', { docId: doc.id })}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#D5E8D7] hover:bg-[#F1F8F2] text-[#171717] text-xs font-bold shadow-xs transition-colors"
            >
              <Share2 className="w-4 h-4 text-[#2E7D32]" />
              <span>{t('shareRecords')}</span>
            </button>
            <button
              onClick={() => {
                deleteMedicalDocument(doc.id);
                navigateTo('medical-vault');
              }}
              className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
              title="Delete Document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Grid: Document Viewer & Metadata Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Document Preview Box */}
          <div className="lg:col-span-8 bg-[#E8F5E9] rounded-3xl p-4 sm:p-6 border border-[#D5E8D7] shadow-sm flex flex-col items-center justify-between min-h-[500px]">
            {/* Viewer Controls */}
            <div className="w-full flex items-center justify-between text-xs text-[#555555] pb-3 border-b border-[#D5E8D7]">
              <span className="font-semibold text-[#171717]">{doc.title} ({doc.fileType.toUpperCase()})</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.2))}
                  className="p-1 rounded-lg bg-white border border-[#D5E8D7] hover:bg-[#F1F8F2] text-[#171717]"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-[#171717] font-bold">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(2.0, prev + 0.2))}
                  className="p-1 rounded-lg bg-white border border-[#D5E8D7] hover:bg-[#F1F8F2] text-[#171717]"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Image / PDF container */}
            <div className="my-auto overflow-auto max-h-[550px] w-full flex items-center justify-center p-4">
              <img
                src={doc.fileUrl}
                alt={doc.title}
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
                className="rounded-xl max-w-full h-auto shadow-md object-contain transition-transform duration-150 border border-[#D5E8D7] bg-white"
              />
            </div>

            {/* Footer encryption badge */}
            <div className="w-full pt-3 border-t border-[#D5E8D7] flex items-center justify-between text-[11px] text-[#555555]">
              <span className="flex items-center text-[#2E7D32] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#2E7D32]" />
                End-to-End AES-256 Encrypted & Time-Stamped
              </span>
              <span className="font-mono">SHA-256: d8f4e2...9a7b</span>
            </div>
          </div>

          {/* Right: Document Metadata & Audit Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#E8F5E9] rounded-3xl p-6 border border-[#D5E8D7] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#D5E8D7]">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase bg-white text-[#2E7D32] border border-[#D5E8D7]">
                  {doc.category.replace('_', ' ')}
                </span>
                {doc.isLabVerified && (
                  <span className="flex items-center text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    {language === 'bn' ? 'ল্যাব যাচাইকৃত' : 'Lab Verified'}
                  </span>
                )}
              </div>

              <h2 className="text-lg font-black text-[#171717]">{doc.title}</h2>

              {/* Detail rows */}
              <div className="space-y-3 text-xs text-[#555555]">
                <div className="flex justify-between py-1.5 border-b border-[#D5E8D7]">
                  <span className="text-[#555555]">{language === 'bn' ? 'ডকুমেন্ট আইডি:' : 'Document ID:'}</span>
                  <span className="font-mono font-bold text-[#171717]">{doc.id}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#D5E8D7]">
                  <span className="text-[#555555]">{language === 'bn' ? 'আপলোড তারিখ:' : 'Upload Date:'}</span>
                  <span className="font-bold text-[#171717]">{doc.uploadDate}</span>
                </div>
                {doc.issueDate && (
                  <div className="flex justify-between py-1.5 border-b border-[#D5E8D7]">
                    <span className="text-[#555555]">{language === 'bn' ? 'ইস্যু তারিখ:' : 'Issue Date:'}</span>
                    <span className="font-bold text-[#171717]">{doc.issueDate}</span>
                  </div>
                )}
                {doc.doctorName && (
                  <div className="flex justify-between py-1.5 border-b border-[#D5E8D7]">
                    <span className="text-[#555555]">{language === 'bn' ? 'চিকিৎসক:' : 'Physician:'}</span>
                    <span className="font-bold text-[#171717] text-right">{doc.doctorName}</span>
                  </div>
                )}
                {doc.hospitalName && (
                  <div className="flex justify-between py-1.5 border-b border-[#D5E8D7]">
                    <span className="text-[#555555]">{language === 'bn' ? 'হাসপাতাল / ল্যাব:' : 'Hospital / Lab:'}</span>
                    <span className="font-bold text-[#171717] text-right">{doc.hospitalName}</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 border-b border-[#D5E8D7]">
                  <span className="text-[#555555]">{language === 'bn' ? 'ফাইলের আকার:' : 'File Size:'}</span>
                  <span className="font-bold text-[#171717]">{doc.fileSizeKb} KB</span>
                </div>
              </div>

              {/* Clinical Notes */}
              {doc.notes && (
                <div className="bg-white p-3.5 rounded-xl border border-[#D5E8D7]">
                  <span className="text-xs font-bold text-[#171717] block mb-1">
                    {language === 'bn' ? 'নোট ও মূল্যায়ন:' : 'Clinical Notes:'}
                  </span>
                  <p className="text-xs text-[#555555] leading-relaxed">{doc.notes}</p>
                </div>
              )}

              {/* Tags */}
              {doc.tags && doc.tags.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-[#171717] block mb-1.5">
                    {language === 'bn' ? 'ট্যাগসমূহ:' : 'Tags:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {doc.tags.map((t, idx) => (
                      <span key={idx} className="text-xs bg-white text-[#171717] border border-[#D5E8D7] px-2.5 py-0.5 rounded-md font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
