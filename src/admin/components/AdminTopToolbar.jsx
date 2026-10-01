import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { getCurrentAccount } from '../auth';

export default function AdminTopToolbar({ lang, onToggleLang, onLogout }) {
  const {
    previewMode,
    setPreviewMode,
    hasUnsavedChanges,
    setProjectModal,
    exportDataFile,
    resetToDefaults
  } = useAdmin();

  const isRTL = lang === 'ar';
  const currentAccount = getCurrentAccount();

  return (
    <header className="dashboard-topbar" aria-label="شريط أدوات لوحة التحكم">
      {/* Brand & Account Badge */}
      <div className="dashboard-brand">
        <div className="dashboard-badge">
          <i aria-hidden="true" />
          <span>لوحة تحكم معرض الأعمال ✿</span>
        </div>
        {currentAccount && (
          <span className="text-xs font-bold text-[var(--primary-blue)] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            المستخدم: {currentAccount.name}
          </span>
        )}
        {hasUnsavedChanges && (
          <span className="text-xs bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
            ● هناك تعديلات محفوظة محلياً
          </span>
        )}
      </div>

      {/* Action Controls */}
      <div className="dashboard-actions">
        {/* Visitor Preview Toggle */}
        <button
          type="button"
          className={`dash-btn ${previewMode ? 'primary' : ''}`}
          onClick={() => setPreviewMode(!previewMode)}
          title={previewMode ? 'العودة لوضع التحرير وظهور الأقلام' : 'إخفاء أدوات التحرير لرؤية الموقع كما يراه الزائر'}
        >
          {previewMode ? '✏️ وضع التحرير' : '👁️ معاينة كزائر'}
        </button>

        {/* Add Project Button */}
        {!previewMode && (
          <button
            type="button"
            className="dash-btn primary"
            onClick={() => setProjectModal({ isOpen: true, project: null, isNew: true })}
            title="إضافة مشروع جديد إلى ملف الأعمال"
          >
            <span>+</span>
            <span>{isRTL ? 'مشروع جديد' : 'New Project'}</span>
          </button>
        )}

        {/* Language Toggle for Admin Preview */}
        <button
          type="button"
          className="dash-btn"
          onClick={onToggleLang}
          title="تبديل لغة المعاينة"
        >
          <span>🌐</span>
          <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
        </button>

        {/* Export Code File */}
        <button
          type="button"
          className="dash-btn export"
          onClick={exportDataFile}
          title="تحميل ملف portfolioData.js المحدث لدمجه في كود المشروع مستقبلاً"
        >
          <span>💾</span>
          <span>تصدير الكود</span>
        </button>

        {/* Reset to Defaults */}
        <button
          type="button"
          className="dash-btn danger"
          onClick={resetToDefaults}
          title="استعادة البيانات الأصلية"
        >
          <span>↺</span>
        </button>

        {/* View Public Site in new tab */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="dash-btn"
          title="فتح المعرض العام كما يراه الزوار في تبويب جديد"
        >
          <span>↗</span>
          <span>عرض المعرض</span>
        </a>

        {/* Logout */}
        <button
          type="button"
          className="dash-btn"
          onClick={onLogout}
          title="تسجيل الخروج من لوحة التحكم"
        >
          <span>🚪</span>
          <span>خروج</span>
        </button>
      </div>
    </header>
  );
}
