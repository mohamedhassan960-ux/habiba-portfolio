import React from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';

export default function EditableElement({
  children,
  path,
  title,
  hint,
  type = 'text',
  isBilingual = true,
  block = false,
  className = '',
  customTrigger = null
}) {
  const { isAdmin, previewMode, setFieldModal, content, data } = usePortfolioData();

  // If visitor mode or preview mode, render child as-is
  if (!isAdmin || previewMode) {
    return children;
  }

  // Extract current values from content
  const getDeep = (obj, p) => {
    if (!obj) return '';
    return p.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : ''), obj);
  };

  const currentAr = isBilingual ? getDeep(content.ar, path) : (getDeep(data, path) || getDeep(content.ar, path));
  const currentEn = isBilingual ? getDeep(content.en, path) : '';

  const handleOpenEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (customTrigger) {
      customTrigger();
      return;
    }

    setFieldModal({
      isOpen: true,
      path,
      title: title || 'تعديل المحتوى | Edit Content',
      hint: hint || 'يمكنك تعديل هذا النص وحفظ التغييرات فوراً ليتم تحديث الموقع مباشرة.',
      type,
      currentAr: typeof currentAr === 'string' ? currentAr : JSON.stringify(currentAr),
      currentEn: typeof currentEn === 'string' ? currentEn : JSON.stringify(currentEn),
      isBilingual
    });
  };

  return (
    <div
      className={`editable-container cms-active ${block ? 'block' : ''} ${className}`}
      onClick={(e) => {
        // Option to click element directly or pin
        if (e.altKey) {
          handleOpenEdit(e);
        }
      }}
    >
      {children}

      <button
        type="button"
        className="edit-pin-btn"
        aria-label={`تعديل: ${title || path}`}
        onClick={handleOpenEdit}
      >
        <span aria-hidden="true">✏️</span>
        <div className="edit-tooltip">
          <b>{title || 'تعديل هذا العنصر'}</b>
          <span>{hint || 'انقر لتعديل المحتوى وتحديث الموقع فوراً'}</span>
        </div>
      </button>
    </div>
  );
}
