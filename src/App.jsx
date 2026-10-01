import React, { useState, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import SkyAtmosphere from './components/SkyAtmosphere';
import Hero from './components/Hero';
import PenLine from './components/PenLine';
import SelectedWorks from './components/SelectedWorks';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';
import { PortfolioDataProvider, usePortfolioData } from './context/PortfolioDataContext';

// Code Splitting: Lazy load AdminApp so visitor never downloads Admin bundle
const LazyAdminApp = lazy(() => import('./admin/AdminApp'));

function AdminLoadingFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 30%, #FCE7F3 0%, #FFFFFF 70%, #C7D2FE 100%)',
        fontFamily: "'Marhey', 'Alexandria', system-ui, sans-serif",
        color: '#0F172A',
        direction: 'rtl'
      }}
    >
      <div
        style={{
          padding: '24px 36px',
          background: '#FFFFFF',
          border: '3px solid #0F172A',
          borderRadius: '24px',
          boxShadow: '6px 8px 0 #1D4ED8',
          textAlign: 'center'
        }}
      >
        <span style={{ fontSize: '36px', display: 'block', marginBottom: '12px' }}>🎨</span>
        <b style={{ fontSize: '18px', display: 'block', color: '#1D4ED8', marginBottom: '6px' }}>
          جاري فتح لوحة التحكم ✿
        </b>
        <span style={{ fontSize: '13px', opacity: 0.75 }}>لحظات ونكون جاهزين...</span>
      </div>
    </div>
  );
}

function PublicPortfolio() {
  const [lang, setLang] = useState('ar');
  const [selectedWork, setSelectedWork] = useState(null);
  const { content } = usePortfolioData();

  // Sync HTML lang and dir attributes on language change
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Global scroll-reveal observer for [data-r] elements
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px 80px 0px' }
    );

    const elements = document.querySelectorAll('[data-r]');
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) {
        el.classList.add('in');
      } else {
        observer.observe(el);
      }
    });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const currentContent = content[lang] || content.ar;

  return (
    <div
      id="top"
      className={`min-h-screen relative text-[var(--plum)] flex flex-col selection:bg-[var(--primary-blue)] selection:text-white ${
        lang === 'ar' ? 'font-sans-ar' : 'font-sans-en'
      }`}
    >
      {/* 00. Celestial Sky & Astronomical Moon Atmosphere */}
      <SkyAtmosphere lang={lang} />

      {/* 01. Retro Digital Floating Header */}
      <Header
        lang={lang}
        onToggleLang={toggleLanguage}
        content={currentContent.nav}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 02. The Hero Section */}
        <Hero
          lang={lang}
          content={currentContent.hero}
        />

        {/* 02.5 Interactive Bézier Penline & Drawing Toolbar */}
        <PenLine lang={lang} />

        {/* 03. Selected Works Section */}
        <SelectedWorks
          lang={lang}
          content={currentContent.works}
          onSelectWork={setSelectedWork}
        />

        {/* 04. About & Editorial Profile Section (with Boarding Pass & CV) */}
        <About
          lang={lang}
          content={currentContent.about}
        />

        {/* 05. Editorial Services & Disciplines Section (with Interactive Basket) */}
        <Services
          lang={lang}
          content={currentContent.services}
        />

        {/* 06. Contact Section (Final Conversion) */}
        <Contact
          lang={lang}
          content={currentContent.contact}
        />
      </main>

      {/* 07. Quiet Minimal Footer */}
      <Footer
        lang={lang}
        content={currentContent.footer}
      />

      {/* 08. Focused Lightbox for Artwork Details */}
      <Lightbox
        isOpen={Boolean(selectedWork)}
        currentWork={selectedWork}
        items={currentContent.works?.items || []}
        onClose={() => setSelectedWork(null)}
        onNavigate={setSelectedWork}
        lang={lang}
        content={currentContent.lightbox}
      />
    </div>
  );
}

export default function App() {
  const checkIsAdmin = () => {
    const hash = window.location.hash || '';
    const pathname = window.location.pathname || '';
    return (
      hash.startsWith('#/admin') ||
      hash.startsWith('#/dashboard') ||
      hash === '#admin' ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/dashboard')
    );
  };

  const [isAdminRoute, setIsAdminRoute] = useState(checkIsAdmin);

  useEffect(() => {
    const handleRoute = () => {
      setIsAdminRoute(checkIsAdmin());
    };

    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('popstate', handleRoute);
    return () => {
      window.removeEventListener('hashchange', handleRoute);
      window.removeEventListener('popstate', handleRoute);
    };
  }, []);

  if (isAdminRoute) {
    return (
      <Suspense fallback={<AdminLoadingFallback />}>
        <LazyAdminApp />
      </Suspense>
    );
  }

  return (
    <PortfolioDataProvider>
      <PublicPortfolio />
    </PortfolioDataProvider>
  );
}
