import React, { useState } from 'react';
import AdminTopToolbar from './AdminTopToolbar';
import AdminPortfolioCanvas from './AdminPortfolioCanvas';
import RetroAdminModal from './RetroAdminModal';
import ProjectEditorModal from './ProjectEditorModal';
import CategoryEditorModal from './CategoryEditorModal';

export default function AdminDashboard({ onLogout }) {
  const [lang, setLang] = useState('ar');

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  return (
    <div className="admin-dashboard-root" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Floating / Sticky Toolbar */}
      <AdminTopToolbar
        lang={lang}
        onToggleLang={toggleLanguage}
        onLogout={onLogout}
      />

      {/* Main Administrative Canvas */}
      <AdminPortfolioCanvas
        lang={lang}
        onToggleLang={toggleLanguage}
      />

      {/* Dedicated Modals */}
      <RetroAdminModal />
      <ProjectEditorModal />
      <CategoryEditorModal />
    </div>
  );
}
