import React, { useState, useEffect, useRef } from 'react';
import { WHATSAPP_CONFIG } from '../data/portfolioData';

export default function Header({ lang, onToggleLang, content }) {
  const isRTL = lang === 'ar';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navRef = useRef(null);
  const menuBtnRef = useRef(null);

  const nameLetters = Array.from(content.name || 'Habiba Yasser');

  // Close menu on ESC or outside click
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };

    const handlePointerDown = (e) => {
      if (isMenuOpen && navRef.current && !navRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isMenuOpen]);

  // Spring timing token
  const SPRING = 'cubic-bezier(.3, 1.25, .4, 1)';

  // Tuck bar into menu button (matching reference tuckBar animation)
  const tuckBar = () => {
    if (isCollapsed || !navRef.current || !menuBtnRef.current) return;
    setIsMenuOpen(false);

    const nav = navRef.current;
    const menuBtn = menuBtnRef.current;
    const mb = menuBtn.getBoundingClientRect();
    const cx = mb.left + mb.width / 2;
    const barItems = Array.from(nav.children).filter(
      (el) => !el.classList.contains('menu-btn') && !el.classList.contains('menu') && el.offsetParent
    );

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsCollapsed(true);
      return;
    }

    const anims = barItems.map((el, i) => {
      const r = el.getBoundingClientRect();
      const dx = cx - (r.left + r.width / 2);
      return el.animate(
        [
          { transform: 'none', opacity: 1 },
          { transform: `translateX(${dx}px) scale(.15)`, opacity: 0 }
        ],
        {
          duration: 420,
          delay: (barItems.length - 1 - i) * 45,
          easing: 'cubic-bezier(.6,0,.4,1)',
          fill: 'forwards'
        }
      );
    });

    Promise.all(anims.map((a) => a.finished)).then(() => {
      const before = nav.getBoundingClientRect();
      setIsCollapsed(true);
      anims.forEach((a) => a.cancel());

      requestAnimationFrame(() => {
        const after = nav.getBoundingClientRect();
        nav.style.overflow = 'hidden';
        const shift = isRTL ? before.left - after.left : before.right - after.right;
        const widthAnim = nav.animate(
          [
            { width: `${before.width}px`, transform: `translateX(${shift}px)` },
            { width: `${after.width}px`, transform: 'none' }
          ],
          { duration: 650, easing: SPRING }
        );
        widthAnim.onfinish = () => {
          nav.style.overflow = '';
        };
      });
    });
  };

  // Bring the bar back from tucked state
  const bringBar = () => {
    if (!isCollapsed || !navRef.current || !menuBtnRef.current) return;
    setIsMenuOpen(false);

    const nav = navRef.current;
    const menuBtn = menuBtnRef.current;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsCollapsed(false);
      return;
    }

    const before = nav.getBoundingClientRect();
    setIsCollapsed(false);

    requestAnimationFrame(() => {
      const after = nav.getBoundingClientRect();
      const mb = menuBtn.getBoundingClientRect();
      const cx = mb.left + mb.width / 2;
      nav.style.overflow = 'hidden';

      const shift = isRTL ? before.right - after.right : before.left - after.left;
      const widthAnim = nav.animate(
        [
          { width: `${before.width}px`, transform: `translateX(${shift}px)` },
          { width: `${after.width}px`, transform: 'none' }
        ],
        { duration: 600, easing: SPRING }
      );
      widthAnim.onfinish = () => {
        nav.style.overflow = '';
      };

      const barItems = Array.from(nav.children).filter(
        (el) => !el.classList.contains('menu-btn') && !el.classList.contains('menu') && el.offsetParent
      );

      barItems.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const dx = cx - (r.left + r.width / 2);
        el.animate(
          [
            { transform: `translateX(${dx}px) scale(.15)`, opacity: 0 },
            { transform: 'none', opacity: 1 }
          ],
          {
            duration: 480,
            delay: 200 + i * 45,
            easing: SPRING,
            fill: 'backwards'
          }
        );
      });
    });
  };

  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className={`nav ${isCollapsed ? 'collapsed' : ''}`}
      id="nav"
      aria-label="Main"
    >
      {/* Retro window traffic light dots */}
      <span className="dots">
        <button
          type="button"
          id="nav-close"
          onClick={tuckBar}
          title={isRTL ? 'طي الشريط في القائمة' : 'Tuck the bar into the menu'}
          aria-label={isRTL ? 'طي الشريط في القائمة' : 'Tuck the bar into the menu'}
        >
          ×
        </button>
        <i aria-hidden="true" />
        <i aria-hidden="true" />
      </span>

      {/* Retro badge logo with interactive waving letters */}
      <a className="nav-logo" href="#top" aria-label={`${content.name}, ${isRTL ? 'للأعلى' : 'back to top'}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.5 15.5 21 21" />
        </svg>
        <span className="nl-name font-bold">
          {isRTL ? (
            content.name
          ) : (
            nameLetters.map((ch, i) => (
              <i key={i} style={{ '--i': i }}>
                {ch === ' ' ? '\u00A0' : ch}
              </i>
            ))
          )}
        </span>
      </a>

      {/* Main navigation links */}
      <a href="#work">{content.work}</a>
      <a href="#about">{content.about}</a>
      <a href="#services">{content.services}</a>
      <a href="#contact">{content.contact}</a>

      {/* Language Switcher & Menu button with proper spacing */}
      <div className="flex items-center gap-2.5 ms-2">
        <button
          type="button"
          onClick={onToggleLang}
          className="px-2.5 py-1 text-xs font-bold tracking-wider rounded-lg border-2 border-[var(--plum)] bg-[var(--butter)] text-[var(--plum)] hover:bg-[var(--blush)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          aria-label={isRTL ? 'Switch to English' : 'التبديل إلى العربية'}
          title={isRTL ? 'Switch to English' : 'التبديل إلى العربية'}
        >
          {isRTL ? 'EN' : 'عربي'}
        </button>

        {/* Menu / Burger button */}
        <button
          ref={menuBtnRef}
          className="menu-btn"
          id="menu-btn"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="burger" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>{isRTL ? 'القائمة' : 'Menu'}</span>
        </button>
      </div>

      {/* menu.exe Window Flyout */}
      <div className="menu win" id="menu" hidden={!isMenuOpen}>
        <div className="win-bar" aria-hidden="true">
          <span className="dots">
            <i />
            <i />
            <i />
          </span>
          menu.exe
        </div>
        <ul className="menu-links">
          <li style={{ '--i': 0 }}>
            <a href="#work" onClick={handleNavLinkClick}>
              <span className="mi" style={{ '--c': 'var(--candy)' }}>
                <svg viewBox="0 0 24 24">
                  <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
              </span>
              <b>{content.work}</b>
              <small>{isRTL ? '٤ دراسات بصرية وتصاميم أثاث' : '4 Ashley Furniture visual studies'}</small>
            </a>
          </li>
          <li style={{ '--i': 1 }}>
            <a href="#about" onClick={handleNavLinkClick}>
              <span className="mi" style={{ '--c': 'var(--blush)' }}>
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8.5 14.5c1.8 2 5.2 2 7 0M9 9.5h.01M15 9.5h.01" />
                </svg>
              </span>
              <b>{content.about}</b>
              <small>{isRTL ? 'فنون جميلة القاهرة، دفعة ٢٠٢٨' : 'Fine Arts Cairo, Class of 2028'}</small>
            </a>
          </li>
          <li style={{ '--i': 2 }}>
            <a href="#services" onClick={handleNavLinkClick}>
              <span className="mi" style={{ '--c': 'var(--butter)' }}>
                <svg viewBox="0 0 24 24">
                  <path d="M3 10h18l-2 10H5zM7 10l3-6M17 10l-3-6M9 14v3M15 14v3M12 14v3" />
                </svg>
              </span>
              <b>{content.services}</b>
              <small>{isRTL ? 'سوشيال ميديا، أغلفة، ومونتاج فيديو' : 'Social media, covers & video editing'}</small>
            </a>
          </li>
          <li style={{ '--i': 3 }}>
            <a href="#contact" onClick={handleNavLinkClick}>
              <span className="mi" style={{ '--c': 'var(--peri)' }}>
                <svg viewBox="0 0 24 24">
                  <path d="m12 3 2.4 5.6 6 .6-4.5 4 1.3 6L12 16.1 6.8 19.2l1.3-6-4.5-4 6-.6z" />
                </svg>
              </span>
              <b>{content.contact}</b>
              <small>{isRTL ? 'تواصل وبدء مشروع جديد' : 'Say hi & discuss a project'}</small>
            </a>
          </li>
          <li style={{ '--i': 4 }}>
            <a
              href={WHATSAPP_CONFIG.getLink(lang)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleNavLinkClick}
            >
              <span className="mi" style={{ '--c': 'var(--mint)' }}>
                <svg viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </span>
              <b>{content.whatsapp || 'WhatsApp'}</b>
              <small>{isRTL ? 'محادثة فورية ومباشرة' : 'Direct WhatsApp chat'}</small>
            </a>
          </li>
        </ul>
        <div className="menu-foot">
          <span className="status">
            <i />
            {content.status || (isRTL ? 'متاحة لمشاريع جديدة' : 'Open for projects')}
          </span>
          <button type="button" className="bar-back" id="bar-back" onClick={bringBar}>
            {isRTL ? 'إرجاع الشريط' : 'Bring the bar back'}
          </button>
        </div>
      </div>
    </nav>
  );
}
