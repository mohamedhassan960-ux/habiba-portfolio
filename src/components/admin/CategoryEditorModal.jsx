import React, { useState, useEffect } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';

const COLOR_OPTIONS = [
  { label: 'Candy Pink', value: 'var(--candy)' },
  { label: 'Blush Rose', value: 'var(--blush)' },
  { label: 'Butter Gold', value: 'var(--butter)' },
  { label: 'Periwinkle Blue', value: 'var(--peri)' },
  { label: 'Mint Fresh', value: 'var(--mint)' }
];

export default function CategoryEditorModal() {
  const { categoryModal, setCategoryModal, updateCategory } = usePortfolioData();
  const { isOpen, category } = categoryModal || {};

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [color, setColor] = useState('var(--candy)');
  const [activeTab, setActiveTab] = useState('ar');

  useEffect(() => {
    if (isOpen && category) {
      setNameAr(category.name?.ar || '');
      setNameEn(category.name?.en || '');
      setDescAr(category.desc?.ar || '');
      setDescEn(category.desc?.en || '');
      setColor(category.color || 'var(--candy)');
    }
  }, [isOpen, category]);

  if (!isOpen || !category) return null;

  const handleClose = () => {
    setCategoryModal({ isOpen: false, category: null });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!nameAr.trim()) return;

    updateCategory(category.slug, {
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim() || nameAr.trim(),
      descAr: descAr.trim(),
      descEn: descEn.trim(),
      color
    });

    handleClose();
  };

  return (
    <div className="retro-modal-backdrop" onClick={handleClose}>
      <div
        className="retro-modal-window"
        style={{ maxWidth: '580px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Retro Header */}
        <div className="retro-modal-header">
          <div className="win-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <b>تعديل اسم التبويب ✿ | Edit Tab</b>
          <button
            type="button"
            className="retro-modal-close"
            onClick={handleClose}
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave}>
          <div className="retro-modal-body">
            {/* Live Tab Preview */}
            <div className="mb-4 p-3 rounded-2xl bg-[var(--paper)] border-2 border-dashed border-[var(--plum)] flex flex-col items-center">
              <span className="text-xs font-bold opacity-75 mb-2">معاينة شكل التبويب (Tab Preview):</span>
              <div
                className="tab active"
                style={{
                  '--c': color,
                  '--tab': color,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  pointerEvents: 'none'
                }}
              >
                <span>{nameAr || 'اسم التبويب'}</span>
                <sup>8</sup>
              </div>
            </div>

            {/* Bilingual Tab Names Group */}
            <div className="modal-field-group">
              <label>اسم التبويب بالعربية (Category Name in Arabic):</label>
              <input
                type="text"
                className="modal-input font-bold text-base"
                dir="rtl"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="مثال: سوشيال ميديا وإعلانات"
                required
              />
              <small className="modal-hint">يظهر مباشرة على لسان المجلد في الموقع عند اختيار اللغة العربية.</small>
            </div>

            <div className="modal-field-group">
              <label>اسم التبويب بالإنجليزية (Tab Name in English):</label>
              <input
                type="text"
                className="modal-input font-bold text-base"
                dir="ltr"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Social Media & Ads"
                required
              />
              <small className="modal-hint">Appears on the tab when switching to English mode.</small>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="modal-field-group">
                <label>وصف المجلد بالعربية (اختياري):</label>
                <textarea
                  className="modal-textarea"
                  dir="rtl"
                  value={descAr}
                  onChange={(e) => setDescAr(e.target.value)}
                  placeholder="وصف موجز للمشاريع..."
                  rows={2}
                />
              </div>
              <div className="modal-field-group">
                <label>Description in English (Optional):</label>
                <textarea
                  className="modal-textarea"
                  dir="ltr"
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  placeholder="Brief summary..."
                  rows={2}
                />
              </div>
            </div>

            {/* Folder Color Palette */}
            <div className="modal-field-group mt-3">
              <label>لون المجلد الأرشيفي (Folder Color):</label>
              <div className="flex gap-2.5 flex-wrap pt-1">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-[var(--plum)] cursor-pointer text-xs font-bold transition-transform hover:scale-105"
                    style={{
                      backgroundColor: c.value,
                      boxShadow: color === c.value ? '0 0 0 2.5px var(--plum)' : 'none',
                      transform: color === c.value ? 'scale(1.06)' : 'scale(1)'
                    }}
                    onClick={() => setColor(c.value)}
                  >
                    <span>{c.label}</span>
                    {color === c.value && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
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
              حفظ التعديل ✿ | Save Tab
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
