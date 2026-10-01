import React from 'react';
import { useAdmin } from '../context/AdminContext';

export default function AdminEditableWrapper({
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
  const { previewMode, setFieldModal, content, data } = useAdmin();

  // If in Preview Mode, render plain children without admin decorations
  if (previewMode) {
    return children;
  }

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
      hint: hint || 'يمكنك تعديل هذا المحتوى ثم الضغط على حفظ ليتم تحديث الموقع فوراً.',
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
        if (e.altKey) {
          handleOpenEdit(e);
        }
      }}
    >
      {children}

      <button
        type="button"
        className="edit-pin-btn"
        aria-label={title || `تعديل: ${path}`}
        onClick={handleOpenEdit}
      >
        <span aria-hidden="true">✏️</span>
        <div className="edit-tooltip" role="tooltip">
          <b>{title || 'تعديل هذا العنصر'}</b>
          <span>{hint || 'انقر لفتح المحرر وتحديث المحتوى في الموقع فوراً'}</span>
        </div>
      </button>
    </div>
  );
}
