import React from 'react';

export default function Footer({ lang, content }) {
  const isRTL = lang === 'ar';
  const currentYear = new Date().getFullYear();

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer wrap" data-r>
      <div className="flex items-center gap-3">
        <span>© {currentYear} {content.name || 'Habiba Yasser'}</span>
        <span className="opacity-40">·</span>
        <span className="opacity-80">{isRTL ? 'القاهرة، مصر' : 'Cairo, Egypt'}</span>
        <a
          href="#admin"
          title="دخول لوحة التحكم والتحرير البصري | Open Visual CMS"
          className="opacity-40 hover:opacity-100 hover:text-[var(--primary-blue)] transition-opacity text-xs cursor-pointer ml-1"
          aria-label="لوحة التحكم"
        >
          ✏️
        </a>
      </div>

      <div className="flex items-center gap-6">
        <a
          href="#top"
          onClick={scrollToTop}
          className="hover:text-[var(--primary-blue)] transition-colors font-bold flex items-center gap-1 cursor-pointer"
        >
          <span>{isRTL ? 'العودة للأعلى' : 'Back to top'}</span>
          <span>↑</span>
        </a>
      </div>
    </footer>
  );
}
