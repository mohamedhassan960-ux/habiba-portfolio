import React from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';

export default function AdminTopToolbar({ lang }) {
  const {
    isAdmin,
    previewMode,
    setPreviewMode,
    hasUnsavedChanges,
    setProjectModal,
    exportDataFile,
    resetToDefaults,
    exitAdmin
  } = usePortfolioData();

  if (!isAdmin) return null;

  const isRTL = lang === 'ar';

  return (
    <aside className="admin-toolbar-root" aria-label="لوحة تحكم إدارة المحتوى">
      {/* Status Badge */}
      <div className="admin-badge">
        <i />
        <span>{isRTL ? 'لوحة تحكم الموقع ✿' : 'Habiba CMS ✿'}</span>
      </div>

      <div className="admin-actions">
        {/* Visitor Preview Toggle */}
        <button
          type="button"
          className={`admin-btn ${previewMode ? 'primary' : ''}`}
          onClick={() => setPreviewMode(!previewMode)}
          title={previewMode ? 'العودة لوضع التحرير' : 'إخفاء أدوات التحرير لرؤية الموقع كما يراه الزائر'}
        >
          {previewMode ? '✏️ وضع التحرير' : '👁️ معاينة كزائر'}
        </button>

        {/* Add Project Button */}
        {!previewMode && (
          <button
            type="button"
            className="admin-btn primary"
            onClick={() => setProjectModal({ isOpen: true, project: null, isNew: true })}
            title="إضافة مشروع جديد إلى ملف الأعمال"
          >
            <span>+</span>
            <span>{isRTL ? 'مشروع جديد' : 'New Project'}</span>
          </button>
        )}

        {/* Export Code File */}
        <button
          type="button"
          className={`admin-btn export ${hasUnsavedChanges ? 'font-bold' : ''}`}
          onClick={exportDataFile}
          title="تحميل ملف portfolioData.js المحدث لدمجه في كود المشروع"
        >
          <span>💾</span>
          <span>{isRTL ? 'تصدير الكود' : 'Export Code'}</span>
        </button>

        {/* Reset to Defaults */}
        <button
          type="button"
          className="admin-btn danger"
          onClick={resetToDefaults}
          title="استعادة البيانات الأصلية"
        >
          <span>↺</span>
        </button>

        {/* Exit Admin */}
        <button
          type="button"
          className="admin-btn"
          onClick={exitAdmin}
          title="الخروج من وضع لوحة التحكم"
        >
          <span>✕</span>
          <span>{isRTL ? 'خروج' : 'Exit'}</span>
        </button>
      </div>
    </aside>
  );
}
