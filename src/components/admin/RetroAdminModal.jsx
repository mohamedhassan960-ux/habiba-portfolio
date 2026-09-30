import React, { useState, useEffect } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';

export default function RetroAdminModal() {
  const { fieldModal, setFieldModal, updateBilingualField, updateSingleField } = usePortfolioData();
  const { isOpen, path, title, hint, type, currentAr, currentEn, isBilingual } = fieldModal;

  const [valAr, setValAr] = useState('');
  const [valEn, setValEn] = useState('');
  const [activeTab, setActiveTab] = useState('ar');
  const [imgPreview, setImgPreview] = useState('');
  const [uploadedPdfName, setUploadedPdfName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setValAr(currentAr || '');
      setValEn(currentEn || '');
      if (type === 'image') {
        setImgPreview(currentAr || '');
      }
      if (type === 'pdf' || type === 'file') {
        setUploadedPdfName('');
      }
    }
  }, [isOpen, currentAr, currentEn, type]);

  if (!isOpen) return null;

  const handleClose = () => {
    setFieldModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        setValAr(base64);
        setValEn(base64);
        setImgPreview(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePdfFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedPdfName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        setValAr(base64);
        setValEn(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (isBilingual) {
      updateBilingualField(path, valAr, valEn);
    } else {
      updateSingleField(path, valAr);
    }
    handleClose();
  };

  return (
    <div className="retro-modal-backdrop" onClick={handleClose}>
      <div
        className="retro-modal-window"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header with Retro Window Controls */}
        <div className="retro-modal-header">
          <div className="win-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <b>{title || 'تعديل المحتوى | Edit Content'}</b>
          <button
            type="button"
            className="retro-modal-close"
            onClick={handleClose}
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave}>
          <div className="retro-modal-body">
            {hint && <p className="field-hint text-sm text-[var(--plum)] mb-4 opacity-80">{hint}</p>}

            {/* Language Tabs if Bilingual */}
            {isBilingual && type !== 'image' && (
              <div className="flex gap-2 mb-4 border-b-2 border-dashed border-[var(--plum)] pb-2">
                <button
                  type="button"
                  className={`modal-btn ${activeTab === 'ar' ? 'save' : 'cancel'} text-xs py-1 px-4`}
                  onClick={() => setActiveTab('ar')}
                >
                  العربية (Arabic) ✿
                </button>
                <button
                  type="button"
                  className={`modal-btn ${activeTab === 'en' ? 'save' : 'cancel'} text-xs py-1 px-4`}
                  onClick={() => setActiveTab('en')}
                >
                  English ✿
                </button>
              </div>
            )}

            {/* Type: Image Upload / URL */}
            {type === 'image' ? (
              <div className="modal-field-group">
                <label>صورة العنصر (Image Preview & Upload):</label>
                {imgPreview && (
                  <div className="flex justify-center mb-3">
                    <div className="image-preview-box">
                      <img src={imgPreview} alt="معاينة" />
                    </div>
                  </div>
                )}

                <label className="image-upload-zone mb-3">
                  <span className="text-2xl">📁</span>
                  <span className="font-bold text-sm">اضغط لاختيار صورة من جهازك</span>
                  <span className="text-xs opacity-70">أو اسحب الصورة هنا (PNG, JPG, WebP)</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFileChange}
                  />
                </label>

                <div className="mt-2">
                  <label className="text-xs">أو أدخل مسار / رابط الصورة المباشر:</label>
                  <input
                    type="text"
                    className="modal-input text-sm"
                    value={valAr}
                    onChange={(e) => {
                      setValAr(e.target.value);
                      setValEn(e.target.value);
                      setImgPreview(e.target.value);
                    }}
                    placeholder="/images/habiba-portrait.jpg"
                  />
                </div>
              </div>
            ) : (type === 'pdf' || type === 'file') ? (
              <div className="modal-field-group">
                <label>إدارة ورفع ملف السيرة الذاتية (CV / Resume PDF):</label>

                {valAr && (
                  <div className="p-3 bg-[var(--paper)] rounded-xl border-2 border-[var(--plum)] mb-4 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📄</span>
                      <div>
                        <div className="font-bold text-xs text-[var(--plum)]">
                          {uploadedPdfName || (valAr.startsWith('data:') ? 'ملف PDF مخصص (جاهز ومحفوظ)' : valAr.split('/').pop() || 'Habiba-Yasser-CV.pdf')}
                        </div>
                        <div className="text-[11px] opacity-75">
                          {valAr.startsWith('data:')
                            ? `الحجم التقريبي: ~${Math.round(valAr.length * 0.75 / 1024)} كيلوبايت`
                            : 'الملف النشط حالياً في الموقع'}
                        </div>
                      </div>
                    </div>
                    <a
                      href={valAr}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-btn cancel text-xs py-1.5 px-3 flex items-center gap-1 font-bold"
                    >
                      معاينة وتجربة ↗
                    </a>
                  </div>
                )}

                <label className="image-upload-zone mb-3 cursor-pointer">
                  <span className="text-3xl">📥</span>
                  <span className="font-bold text-sm text-[var(--plum)]">
                    اضغط لاختيار ملف السيرة الذاتية (PDF) من جهازك
                  </span>
                  <span className="text-xs opacity-75">
                    اختر أي ملف PDF وسيقوم النظام بربطه فوراً مع أزرار القراءة والتحميل بالموقع
                  </span>
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    onChange={handlePdfFileChange}
                  />
                </label>

                <div className="mt-3">
                  <label className="text-xs font-bold block mb-1">أو أدخل مسار أو رابط مباشر خارجي (Google Drive / Direct URL):</label>
                  <input
                    type="text"
                    className="modal-input text-sm"
                    value={valAr}
                    onChange={(e) => {
                      setValAr(e.target.value);
                      setValEn(e.target.value);
                    }}
                    placeholder="/assets/Habiba-Yasser-CV.pdf"
                  />
                </div>
              </div>
            ) : type === 'textarea' ? (
              <div className="modal-field-group">
                {activeTab === 'ar' ? (
                  <>
                    <label>النص بالعربية:</label>
                    <textarea
                      className="modal-textarea"
                      dir="rtl"
                      value={valAr}
                      onChange={(e) => setValAr(e.target.value)}
                      required
                    />
                  </>
                ) : (
                  <>
                    <label>Text in English:</label>
                    <textarea
                      className="modal-textarea"
                      dir="ltr"
                      value={valEn}
                      onChange={(e) => setValEn(e.target.value)}
                      required
                    />
                  </>
                )}
              </div>
            ) : (
              <div className="modal-field-group">
                {(!isBilingual || activeTab === 'ar') ? (
                  <>
                    <label>القيمة (العربية):</label>
                    <input
                      type="text"
                      className="modal-input"
                      dir={isBilingual ? 'rtl' : 'ltr'}
                      value={valAr}
                      onChange={(e) => setValAr(e.target.value)}
                      required
                    />
                  </>
                ) : (
                  <>
                    <label>Value (English):</label>
                    <input
                      type="text"
                      className="modal-input"
                      dir="ltr"
                      value={valEn}
                      onChange={(e) => setValEn(e.target.value)}
                      required
                    />
                  </>
                )}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="retro-modal-footer">
            <button
              type="button"
              className="modal-btn cancel"
              onClick={handleClose}
            >
              إلغاء | Cancel
            </button>
            <button
              type="submit"
              className="modal-btn save"
            >
              حفظ التعديلات ✿ | Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
