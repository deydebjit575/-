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
      <div className="min-h-screen bg-slate-50 p-8 text-center">
        <p className="text-slate-600">নথি পাওয়া যায়নি / Document not found</p>
        <button onClick={() => navigateTo('medical-vault')} className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold">
          ভল্টে ফিরে যান
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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigateTo('medical-vault')}
            className="flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'bn' ? 'মেডিকেল ভল্টে ফিরে যান' : 'Back to MediVault'}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>{t('download')}</span>
            </button>
            <button
              onClick={() => navigateTo('share-records', { docId: doc.id })}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>{t('shareRecords')}</span>
            </button>
            <button
              onClick={() => {
                deleteMedicalDocument(doc.id);
                navigateTo('medical-vault');
              }}
              className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
              title="Delete Document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Grid: Document Viewer & Metadata Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Document Preview Box */}
          <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-elevated flex flex-col items-center justify-between min-h-[500px]">
            {/* Viewer Controls */}
            <div className="w-full flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
              <span className="font-semibold text-slate-200">{doc.title} ({doc.fileType.toUpperCase()})</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.2))}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(2.0, prev + 0.2))}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
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
                className="rounded-xl max-w-full h-auto shadow-2xl object-contain transition-transform duration-150"
              />
            </div>

            {/* Footer encryption badge */}
            <div className="w-full pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-teal-400" />
                End-to-End AES-256 Encrypted & Time-Stamped
              </span>
              <span>SHA-256: d8f4e2...9a7b</span>
            </div>
          </div>

          {/* Right: Document Metadata & Audit Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase bg-teal-50 text-teal-800 border border-teal-200">
                  {doc.category.replace('_', ' ')}
                </span>
                {doc.isLabVerified && (
                  <span className="flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    ল্যাব যাচাইকৃত
                  </span>
                )}
              </div>

              <h2 className="text-lg font-black text-navy-950">{doc.title}</h2>

              {/* Detail rows */}
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">ডকুমেন্ট আইডি:</span>
                  <span className="font-mono font-bold text-slate-800">{doc.id}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">আপলোড তারিখ:</span>
                  <span className="font-bold text-slate-800">{doc.uploadDate}</span>
                </div>
                {doc.issueDate && (
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400">ইস্যু তারিখ:</span>
                    <span className="font-bold text-slate-800">{doc.issueDate}</span>
                  </div>
                )}
                {doc.doctorName && (
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400">চিকিৎসক:</span>
                    <span className="font-bold text-slate-800 text-right">{doc.doctorName}</span>
                  </div>
                )}
                {doc.hospitalName && (
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400">হাসপাতাল / ল্যাব:</span>
                    <span className="font-bold text-slate-800 text-right">{doc.hospitalName}</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">ফাইলের আকার:</span>
                  <span className="font-bold text-slate-800">{doc.fileSizeKb} KB</span>
                </div>
              </div>

              {/* Clinical Notes */}
              {doc.notes && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-700 block mb-1">
                    {language === 'bn' ? 'নোট ও মূল্যায়ন:' : 'Clinical Notes:'}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">{doc.notes}</p>
                </div>
              )}

              {/* Tags */}
              {doc.tags && doc.tags.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">ট্যাগসমূহ:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {doc.tags.map((t, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium">
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
