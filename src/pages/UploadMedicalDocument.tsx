import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowLeft,
  ShieldCheck,
  Calendar,
  Building,
  User,
  Sparkles
} from 'lucide-react';
import { DocumentCategory } from '../types';

export const UploadMedicalDocument: React.FC = () => {
  const { language, t } = useLanguage();
  const { currentUser, addMedicalDocument, navigateTo, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('prescriptions');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [doctorName, setDoctorName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isLabVerified, setIsLabVerified] = useState(true);

  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'jpeg' | 'png'>('pdf');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelection = (selectedFile: File) => {
    // Validation: Max 15MB
    if (selectedFile.size > 15 * 1024 * 1024) {
      showToast('error', 'File too large', 'Please upload a file under 15MB.');
      return;
    }

    setFile(selectedFile);
    if (!title) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
    }

    if (selectedFile.type.includes('pdf')) {
      setFileType('pdf');
      setFilePreview('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80');
    } else if (selectedFile.type.includes('png') || selectedFile.type.includes('jpeg') || selectedFile.type.includes('jpg')) {
      setFileType(selectedFile.type.includes('png') ? 'png' : 'jpeg');
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('error', 'Title is required');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          const tags = tagsInput
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);

          addMedicalDocument({
            patientId: currentUser?.uid || 'user-doc',
            title,
            category,
            fileUrl: filePreview || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
            fileType,
            fileSizeKb: file ? Math.round(file.size / 1024) : 850,
            issueDate,
            doctorName,
            hospitalName,
            notes,
            isLabVerified,
            tags
          });

          setIsUploading(false);
          navigateTo('medical-vault');
          return 100;
        }
        return prev + 30;
      });
    }, 150);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Back Navigation */}
        <button
          onClick={() => navigateTo('medical-vault')}
          className="flex items-center space-x-2 text-xs font-bold text-[#2E7D32] hover:text-[#256B2A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'bn' ? 'মেডিকেল ভল্টে ফিরে যান' : 'Back to MediVault'}</span>
        </button>

        {/* Header */}
        <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm">
          <div className="flex items-center space-x-2 text-[#2E7D32] font-bold text-xs mb-1">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
            <span>{language === 'bn' ? 'নিরাপদ এনক্রিপ্টেড আপলোড' : 'Secure Encrypted Upload'}</span>
          </div>
          <h1 className="text-2xl font-black text-[#171717]">
            {language === 'bn' ? 'নতুন মেডিকেল নথি সংরক্ষণ করুন' : 'Upload Medical Record'}
          </h1>
          <p className="text-xs text-[#555555] mt-1">
            {language === 'bn'
              ? 'ডাক্তারের প্রেসক্রিপশন, রক্ত বা ডায়াগনস্টিক রিপোর্ট অথবা ডিসচার্জ সার্টিফিকেট আপলোড করুন।'
              : 'Add prescriptions, diagnostic tests, or discharge summaries to your MediVault.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* File Drag and Drop Zone */}
            <div>
              <label className="block text-xs font-bold text-[#171717] mb-2">
                {language === 'bn' ? 'ফাইল নির্বাচন বা ড্র্যাগ করুন (PDF, PNG, JPEG - সর্বোচ্চ ১৫MB)' : 'Select or Drop File (PDF, PNG, JPEG - Max 15MB)'}
              </label>

              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                  isDragging ? 'border-[#2E7D32] bg-[#F1F8F2]' : 'border-[#D5E8D7] hover:border-[#2E7D32] bg-white'
                }`}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
                />

                {file ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center border border-[#D5E8D7]">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-[#171717]">{file.name}</p>
                    <p className="text-xs text-[#555555]">
                      {(file.size / 1024).toFixed(1)} KB • {language === 'bn' ? 'ক্লিক করে পরিবর্তন করুন' : 'Click to change'}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center border border-[#D5E8D7]">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-[#171717]">
                      {language === 'bn' ? 'এখানে ফাইল ড্র্যাগ করুন অথবা ক্লিক করে নির্বাচন করুন' : 'Drag file here or click to browse'}
                    </p>
                    <p className="text-xs text-[#555555]">
                      {language === 'bn' ? 'PDF, JPG, PNG ফাইল সমর্থিত' : 'PDF, JPG, PNG formats supported'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Document Title & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  {language === 'bn' ? 'নথির শিরোনাম *' : 'Document Title *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'bn' ? 'যেমন: কার্ডিওলজি প্রেসক্রিপশন' : 'e.g., Cardiology Prescription'}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] focus:border-[#2E7D32] text-sm text-[#171717] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  {language === 'bn' ? 'নথির বিভাগ *' : 'Document Category *'}
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as DocumentCategory)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] focus:border-[#2E7D32] text-sm text-[#171717] outline-hidden"
                >
                  <option value="prescriptions">{t('categoryPrescription')}</option>
                  <option value="blood_reports">{t('categoryBloodReport')}</option>
                  <option value="diagnostic_reports">{t('categoryDiagnostic')}</option>
                  <option value="hospital_records">{t('categoryHospitalRecord')}</option>
                  <option value="health_schemes">{t('categoryGovtScheme')}</option>
                  <option value="insurance">{t('categoryInsurance')}</option>
                  <option value="id_documents">{t('categoryIds')}</option>
                  <option value="other">{t('categoryOther')}</option>
                </select>
              </div>
            </div>

            {/* Doctor, Hospital & Issue Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  {language === 'bn' ? 'ইস্যুর তারিখ' : 'Issue Date'}
                </label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={e => setIssueDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] focus:border-[#2E7D32] text-sm text-[#171717] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  {language === 'bn' ? 'পরামর্শক চিকিৎসক' : 'Doctor Name'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'bn' ? 'যেমন: ডাঃ অলোক ব্যানার্জি' : 'e.g., Dr. A. Banerjee'}
                  value={doctorName}
                  onChange={e => setDoctorName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] focus:border-[#2E7D32] text-sm text-[#171717] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  {language === 'bn' ? 'হাসপাতাল / ল্যাব' : 'Hospital / Diagnostic Lab'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'bn' ? 'যেমন: অ্যাপোলো হাসপাতাল' : 'e.g., Apollo Hospital'}
                  value={hospitalName}
                  onChange={e => setHospitalName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] focus:border-[#2E7D32] text-sm text-[#171717] outline-hidden"
                />
              </div>
            </div>

            {/* Notes & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  {language === 'bn' ? 'ট্যাগ (কমা দিয়ে আলাদা করুন)' : 'Tags (Comma separated)'}
                </label>
                <input
                  type="text"
                  placeholder="Cardiology, Blood Sugar, Routine"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] focus:border-[#2E7D32] text-sm text-[#171717] outline-hidden"
                />
              </div>

              <div className="flex items-center space-x-3 pt-6">
                <input
                  type="checkbox"
                  id="lab-verified"
                  checked={isLabVerified}
                  onChange={e => setIsLabVerified(e.target.checked)}
                  className="w-4 h-4 text-[#2E7D32] rounded border-[#D5E8D7] focus:ring-[#2E7D32]"
                />
                <label htmlFor="lab-verified" className="text-xs font-bold text-[#171717] cursor-pointer">
                  {language === 'bn' ? 'এটি একটি ল্যাব/হাসপাতাল কর্তৃক প্রত্যয়িত রিপোর্ট' : 'This is a certified lab/hospital report'}
                </label>
              </div>
            </div>

            {/* Notes description */}
            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                {language === 'bn' ? 'গুরুত্বপূর্ণ নোট / ডাক্তারের পরামর্শ' : 'Important Notes / Findings'}
              </label>
              <textarea
                rows={3}
                placeholder={language === 'bn' ? 'রিপোর্টের মূল সারাংশ বা পরামর্শ লিখুন...' : 'Add clinical observations, medication instructions, or diagnostic notes...'}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5E8D7] focus:border-[#2E7D32] text-sm text-[#171717] outline-hidden"
              />
            </div>

            {/* Upload Progress Indicator */}
            {isUploading && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[#2E7D32]">
                  <span>{language === 'bn' ? 'এনক্রিপ্ট ও আপলোড হচ্ছে...' : 'Encrypting and uploading...'}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-[#D5E8D7] rounded-full h-2">
                  <div className="bg-[#2E7D32] h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#D5E8D7]">
              <button
                type="button"
                onClick={() => navigateTo('medical-vault')}
                className="px-5 py-2.5 rounded-xl bg-white border border-[#D5E8D7] hover:bg-[#F1F8F2] text-[#555555] text-xs font-bold"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256B2A] text-white text-xs font-bold shadow-sm transition-all flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>{language === 'bn' ? 'ভল্টে সংরক্ষণ করুন' : 'Save to MediVault'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
