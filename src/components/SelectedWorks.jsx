import React, { useState, useRef, useEffect } from 'react';
import { CATEGORIES, SOCIAL_LINKS } from '../data/portfolioData';
import { usePortfolioData } from '../context/PortfolioDataContext';
import EditableElement from './admin/EditableElement';

const TAPES = ['var(--butter)', 'var(--peri)', 'var(--mint)', '#ffffff', 'var(--blush)'];

export default function SelectedWorks({ lang, content, onSelectWork }) {
  const isRTL = lang === 'ar';
  const { items = [], eyebrow, sectionTitle, sectionSubtitle, viewFull } = content || {};
  const { isAdmin, previewMode, setProjectModal } = usePortfolioData();

  // Build folder map from CATEGORIES
  const folderKeys = CATEGORIES.map((c) => c.slug);
  const [activeKey, setActiveKey] = useState('all');
  const cabinetRef = useRef(null);
  const folderRef = useRef(null);
  const tabsRef = useRef(null);
  const swipeStartRef = useRef(null);

  const activeCategory = CATEGORIES.find((c) => c.slug === activeKey) || CATEGORIES[0];
  const activeIndex = CATEGORIES.findIndex((c) => c.slug === activeKey);

  const getFilteredItems = (key) => {
    if (key === 'all') return items;
    return items.filter((item) => item.categorySlug === key);
  };

  const filteredItems = getFilteredItems(activeKey);

  // Update cabinet CSS color variables
  useEffect(() => {
    const cab = cabinetRef.current;
    if (!cab) return;
    const len = CATEGORIES.length;
    const nextCat = CATEGORIES[(activeIndex + 1) % len];
    const next2Cat = CATEGORIES[(activeIndex + 2) % len];
    cab.style.setProperty('--tab', activeCategory.color);
    cab.style.setProperty('--next', nextCat.color);
    cab.style.setProperty('--next2', next2Cat.color);
  }, [activeKey, activeIndex, activeCategory]);

  // Animated folder step
  const stepFolder = (d, targetKey) => {
    const len = folderKeys.length;
    const nextKey =
      targetKey !== undefined
        ? targetKey
        : folderKeys[(activeIndex + d + len) % len];

    if (nextKey === activeKey) return;

    setActiveKey(nextKey);

    if (folderRef.current) {
      folderRef.current.animate(
        [
          {
            transform: `translate(${d * 46}px, 0) rotate(${d * 2}deg)`,
            opacity: 0.4
          },
          { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 }
        ],
        { duration: 480, easing: 'cubic-bezier(.2, 1.3, .35, 1)' }
      );
    }

    // Scroll tab into view if needed
    const tabEl = tabsRef.current?.querySelector(`[data-k="${nextKey}"]`);
    if (tabEl && tabsRef.current) {
      tabsRef.current.scrollTo({
        left: tabEl.offsetLeft - (tabsRef.current.clientWidth - tabEl.offsetWidth) / 2,
        behavior: 'smooth'
      });
    }
  };

  // Keyboard navigation on tabs
  const handleTabKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepFolder(isRTL ? -1 : 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepFolder(isRTL ? 1 : -1);
    }
  };

  // Touch swipe support
  const handleTouchStart = (e) => {
    swipeStartRef.current = [e.touches[0].clientX, e.touches[0].clientY];
  };

  const handleTouchEnd = (e) => {
    if (!swipeStartRef.current) return;
    const dx = e.changedTouches[0].clientX - swipeStartRef.current[0];
    const dy = e.changedTouches[0].clientY - swipeStartRef.current[1];
    swipeStartRef.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      stepFolder(dx < 0 ? (isRTL ? -1 : 1) : (isRTL ? 1 : -1));
    }
  };

  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="wrap">
        {/* Section Editorial Header */}
        <div className="section-head" data-r>
          <div>
            {eyebrow && (
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary-blue)] mb-2 block">
                {eyebrow}
              </span>
            )}
            <EditableElement
              path="works.sectionTitle"
              title="عنوان قسم الأعمال | Selected Works"
              hint="تعديل العنوان الرئيسي لمعرض الأعمال"
            >
              <h2 className="h2" id="work-title">
                {sectionTitle || (isRTL ? 'أعمال مختارة' : 'Selected work')}
              </h2>
            </EditableElement>
          </div>
          {sectionSubtitle ? <p>{sectionSubtitle}</p> : null}
        </div>

        {/* Manila Folder Cabinet */}
        <div
          ref={cabinetRef}
          className="cabinet"
          id="cabinet"
          data-r
          style={{ '--tab': activeCategory.color }}
        >
          {/* Manila Folder Tabs */}
          <div
            ref={tabsRef}
            className="tabs"
            role="tablist"
            aria-label="Project folders"
            onKeyDown={handleTabKeyDown}
          >
            {CATEGORIES.map((cat, idx) => {
              const isSelected = activeKey === cat.slug;
              const count = getFilteredItems(cat.slug).length;

              return (
                <button
                  key={cat.slug}
                  data-k={cat.slug}
                  className={`tab cursor-pointer ${isSelected ? 'active' : ''}`}
                  role="tab"
                  id={`tab-${cat.slug}`}
                  aria-controls="folder"
                  aria-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  style={{ '--c': cat.color }}
                  onClick={() => stepFolder(idx > activeIndex ? 1 : -1, cat.slug)}
                >
                  {cat.name[lang] || cat.name.en}
                  <sup>{count}</sup>
                </button>
              );
            })}
          </div>

          {/* The Manila Folder Panel */}
          <div
            ref={folderRef}
            className="folder"
            role="tabpanel"
            id="folder"
            tabIndex={-1}
            aria-labelledby={`tab-${activeKey}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Folder Header */}
            <div className="folder-head">
              <h3 id="folder-title">{activeCategory.name[lang] || activeCategory.name.en}</h3>
              {activeCategory.desc?.[lang] ? <p id="folder-desc">{activeCategory.desc[lang]}</p> : null}
            </div>

            {/* Folder Pagination Controls */}
            {CATEGORIES.length > 1 && (
              <div className="fpager" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  className="fstep cursor-pointer"
                  aria-label={isRTL ? 'المجلد السابق' : 'Previous folder'}
                  onClick={() => stepFolder(isRTL ? 1 : -1)}
                >
                  <svg viewBox="0 0 20 20">
                    <path d={isRTL ? 'M8 5l5 5-5 5' : 'M12 5l-5 5 5 5'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="fdots">
                  {CATEGORIES.map((cat) => (
                    <i
                      key={cat.slug}
                      style={{ '--c': cat.color }}
                      className={cat.slug === activeKey ? 'on cursor-pointer' : 'cursor-pointer'}
                      onClick={() => stepFolder(0, cat.slug)}
                      aria-label={cat.name[lang]}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="fstep cursor-pointer"
                  aria-label={isRTL ? 'المجلد التالي' : 'Next folder'}
                  onClick={() => stepFolder(isRTL ? -1 : 1)}
                >
                  <svg viewBox="0 0 20 20">
                    <path d={isRTL ? 'M12 5l-5 5 5 5' : 'M8 5l5 5-5 5'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}

            {/* Asymmetric Project Cards Grid */}
            <ul className="grid is-fav enter" id="grid">
              {filteredItems.map((item, index) => {
                const tapeColor = TAPES[index % TAPES.length];
                return (
                  <li
                    key={item.id}
                    className="card fav relative"
                    style={{ '--tape': tapeColor, '--k': index }}
                  >
                    {isAdmin && !previewMode && (
                      <button
                        type="button"
                        className="edit-pin-btn"
                        style={{
                          top: '12px',
                          right: isRTL ? 'auto' : '12px',
                          left: isRTL ? '12px' : 'auto',
                          zIndex: 30
                        }}
                        title="تعديل هذا المشروع | Edit Project"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setProjectModal({ isOpen: true, project: item, isNew: false });
                        }}
                      >
                        <span aria-hidden="true">✏️</span>
                        <div className="edit-tooltip">
                          <b>تعديل هذا المشروع ✿</b>
                          <span>انقر لتعديل العنوان، الغلاف، التصنيف، الوصف أو الرابط</span>
                        </div>
                      </button>
                    )}

                    <a
                      href="#view"
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectWork(item);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectWork(item);
                        }
                      }}
                      aria-label={`${item.title} — ${viewFull || 'View full'}`}
                      className="cursor-pointer"
                    >
                      {/* Polaroid Image Container */}
                      <figure>
                        <img
                          src={item.image}
                          alt={item.title}
                          width={808}
                          height={632}
                          loading="lazy"
                        />
                        <span className="be" aria-hidden="true">
                          {isRTL ? 'معاينة' : 'Zoom'}
                        </span>
                      </figure>

                      {/* Card Body & Information */}
                      <div className="card-body">
                        <h4>{item.title}</h4>
                        {item.description && (
                          <p className="desc text-sm opacity-85 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                        <dl className="meta">
                          <div>
                            <dt>{isRTL ? 'المجال' : 'Category'}</dt>
                            <dd>{item.category}</dd>
                          </div>
                          <div>
                            <dt>{isRTL ? 'السنة' : 'Year'}</dt>
                            <dd>{item.year || '2024'}</dd>
                          </div>
                          <div>
                            <dt>{isRTL ? 'العميل' : 'Client'}</dt>
                            <dd>Ashley Furniture</dd>
                          </div>
                        </dl>
                      </div>
                    </a>
                  </li>
                );
              })}

              {/* Add New Project Card in Admin Mode */}
              {isAdmin && !previewMode && (
                <li
                  className="card fav border-2 border-dashed border-[var(--primary-blue)] flex items-center justify-center p-8 bg-[var(--paper)] rounded-2xl cursor-pointer hover:bg-[var(--blush)] transition-all text-center"
                  style={{ minHeight: '340px' }}
                  onClick={() => setProjectModal({ isOpen: true, project: null, isNew: true })}
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl">➕</span>
                    <b className="text-lg text-[var(--primary-blue)] font-bold">
                      {isRTL ? 'إضافة مشروع جديد ✿' : 'Add New Project ✿'}
                    </b>
                    <span className="text-xs text-[var(--plum)] opacity-70">
                      {isRTL ? 'انقر لرفع الغلاف وإضافة مشروع إلى المحفظة' : 'Click to add a project'}
                    </span>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Action Link below Cabinet */}
        <div className="work-more text-center mt-12" data-r>
          <a
            className="btn btn-butter text-base font-bold shadow-md hover:scale-105 transition-transform"
            href={SOCIAL_LINKS.behance}
            target="_blank"
            rel="noopener noreferrer"
          >
            {isRTL ? 'شاهد كل أعمالي على بيهانس' : 'See everything on Behance'}
          </a>
        </div>
      </div>
    </section>
  );
}
