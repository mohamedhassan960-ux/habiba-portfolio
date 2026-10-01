import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import AdminEditableWrapper from './AdminEditableWrapper';
import SkyAtmosphere from '../../components/SkyAtmosphere';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Lightbox from '../../components/Lightbox';

const TAPES = ['var(--butter)', 'var(--peri)', 'var(--mint)', '#ffffff', 'var(--blush)'];

export default function AdminPortfolioCanvas({ lang, onToggleLang }) {
  const {
    content,
    categories,
    previewMode,
    setProjectModal,
    setCategoryModal,
    toastMsg
  } = useAdmin();

  const isRTL = lang === 'ar';
  const currentContent = content[lang] || content.ar;
  const [activeCategorySlug, setActiveCategorySlug] = useState('all');
  const [selectedWork, setSelectedWork] = useState(null);

  const worksItems = currentContent.works?.items || [];
  const filteredWorks =
    activeCategorySlug === 'all'
      ? worksItems
      : worksItems.filter((it) => it.categorySlug === activeCategorySlug);

  const activeCategory =
    categories.find((c) => c.slug === activeCategorySlug) || categories[0];

  const bp = currentContent.about?.boardingPass || {};

  return (
    <div className={`relative min-h-screen text-[var(--plum)] flex flex-col ${isRTL ? 'font-sans-ar' : 'font-sans-en'}`}>
      {/* Informative Banner */}
      {!previewMode && (
        <div className="admin-canvas-banner">
          <span>🎨 <b>وضع التحرير المباشر:</b> كل عنصر عليه قلم ✏️ اضغطي عليه لتعديله فوراً، أو استخدمي زر "معاينة كزائر" لمشاهدة الموقع النهائي.</span>
        </div>
      )}

      {/* Sky Background Atmosphere */}
      <SkyAtmosphere lang={lang} />

      {/* Header */}
      <Header
        lang={lang}
        onToggleLang={onToggleLang}
        content={currentContent.nav}
      />

      <main className="flex-1">
        {/* ==========================================================================
            01. HERO SECTION (ADMIN VERSION)
            ========================================================================== */}
        <section className="hero" id="top">
          <div className="hero-grid">
            {/* Top row */}
            <div className="hero-kicker" data-r>
              <span className="dot" aria-hidden="true" />
              <AdminEditableWrapper
                path="hero.eyebrow"
                title="تعديل الوصف والكلية"
                hint="تعديل السطر التعريفي الأكاديمي (طالبة بكلية الفنون الجميلة...)"
              >
                <span>{currentContent.hero?.eyebrow}</span>
              </AdminEditableWrapper>
            </div>

            {/* Giant Title with Avatar in 'O' */}
            <div className="hero-giant" aria-label="Habiba Portfolio">
              <span className="word w1">
                <span className="l">H</span>
                <span className="l">a</span>
                <span className="l">b</span>
                <span className="l">i</span>
                <span className="l">b</span>
                <span className="l">a</span>
              </span>
              <span className="word w2">
                <span className="l">P</span>
                {/* Character Sticker inside "o" */}
                <span className="w-o">
                  <span className="tip">{isRTL ? 'أنا هنا ✿' : "that's me ✿"}</span>
                  <span className="char">
                    <AdminEditableWrapper
                      path="hero.portrait"
                      title="تعديل صورة الستيكر (الكرتونية)"
                      hint="تغيير أو رفع صورة الستيكر داخل حرف الـ O"
                      type="image"
                    >
                      <img
                        src={currentContent.hero?.portrait || '/images/habiba-sticker.png'}
                        alt="Habiba Yasser"
                        width="820"
                        height="982"
                      />
                    </AdminEditableWrapper>
                  </span>
                </span>
                <span className="l">r</span>
                <span className="l">t</span>
                <span className="l">f</span>
                <span className="l">o</span>
                <span className="l">l</span>
                <span className="l">i</span>
                <span className="l">o</span>
              </span>
            </div>

            {/* Hero Role and Bio */}
            <div className="hero-foot" style={{ marginTop: '2rem' }}>
              <div className="hero-role">
                <AdminEditableWrapper
                  path="hero.name"
                  title="تعديل اسم المصممة"
                  hint="تعديل اسم المصممة البارز في المقدمة"
                >
                  <strong className="block text-2xl font-bold mb-1 text-[var(--plum)]">
                    {currentContent.hero?.name || 'حبيبة ياسر'}
                  </strong>
                </AdminEditableWrapper>

                <AdminEditableWrapper
                  path="hero.title"
                  title="تعديل المسمى الوظيفي والمدينة"
                  hint="تعديل المسمى المهني (مصممة جرافيك ومونتيرة من القاهرة...)"
                  block
                >
                  <span className="block font-bold opacity-90 mb-2">
                    {currentContent.hero?.title}
                  </span>
                </AdminEditableWrapper>

                <AdminEditableWrapper
                  path="hero.description"
                  title="تعديل النبذة الترحيبية"
                  hint="تعديل النص الترحيبي العام أسفل الشعار"
                  type="textarea"
                  block
                >
                  <p className="text-base opacity-85 leading-relaxed max-w-xl">
                    {currentContent.hero?.description}
                  </p>
                </AdminEditableWrapper>
              </div>

              <div className="hero-cta flex gap-3 flex-wrap">
                <a className="btn btn-candy" href="#work">
                  {currentContent.hero?.ctaSecondary || (isRTL ? 'استعراض الأعمال' : 'See my work')}
                </a>
                <a className="btn" href="#contact">
                  {currentContent.hero?.ctaPrimary || (isRTL ? 'تواصل معي' : 'Say hi')}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            02. SELECTED WORKS (ADMIN VERSION WITH CARDS & FOLDERS)
            ========================================================================== */}
        <section className="section" id="work">
          <div className="wrap">
            <div className="section-head">
              <div>
                <AdminEditableWrapper
                  path="works.sectionTitle"
                  title="تعديل عنوان قسم الأعمال"
                  hint="تعديل العنوان الرئيسي لمعرض الأعمال"
                >
                  <h2 className="h2">
                    {currentContent.works?.sectionTitle || (isRTL ? 'أعمال مختارة' : 'Selected work')}
                  </h2>
                </AdminEditableWrapper>
              </div>
            </div>

            {/* Folder Cabinet */}
            <div className="cabinet" style={{ '--tab': activeCategory.color }}>
              {/* Category Tabs */}
              <div className="tabs" role="tablist">
                {categories.map((cat) => {
                  const isSelected = activeCategorySlug === cat.slug;
                  const count =
                    cat.slug === 'all'
                      ? worksItems.length
                      : worksItems.filter((it) => it.categorySlug === cat.slug).length;

                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      className={`tab cursor-pointer ${isSelected ? 'active' : ''}`}
                      style={{ '--c': cat.color }}
                      onClick={() => setActiveCategorySlug(cat.slug)}
                    >
                      <span className="tab-label">{cat.name[lang] || cat.name.ar}</span>
                      <sup>{count}</sup>
                      {!previewMode && (
                        <span
                          className="tab-edit-pin"
                          title="✏️ تعديل اسم ولون هذا التبويب"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCategoryModal({ isOpen: true, category: cat });
                          }}
                        >
                          ✏️
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Folder Panel */}
              <div className="folder">
                <div className="folder-head">
                  <h3>{activeCategory.name[lang] || activeCategory.name.ar}</h3>
                  {activeCategory.desc?.[lang] && <p>{activeCategory.desc[lang]}</p>}
                </div>

                {/* Grid of Projects */}
                <ul className="grid is-fav enter">
                  {filteredWorks.map((item, index) => {
                    const tapeColor = TAPES[index % TAPES.length];

                    return (
                      <li
                        key={item.id}
                        className="card fav relative"
                        style={{ '--tape': tapeColor, '--k': index }}
                      >
                        {!previewMode && (
                          <div className="card-admin-pins">
                            <button
                              type="button"
                              className="edit-pin-btn"
                              title="✏️ تعديل بيانات المشروع (العنوان، الغلاف، التصنيف، الرابط)"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setProjectModal({ isOpen: true, project: item, isNew: false });
                              }}
                            >
                              <span aria-hidden="true">✏️</span>
                              <div className="edit-tooltip">
                                <b>تعديل بيانات المشروع ✿</b>
                                <span>تعديل الغلاف، العنوان، الوصف، رابط Behance أو حذف المشروع</span>
                              </div>
                            </button>
                          </div>
                        )}

                        <div
                          className="cursor-pointer"
                          onClick={() => setSelectedWork(item)}
                        >
                          <figure>
                            <img
                              src={item.image}
                              alt={item.title}
                              width={808}
                              height={632}
                            />
                            <span className="be" aria-hidden="true">
                              {isRTL ? 'معاينة' : 'Zoom'}
                            </span>
                          </figure>

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
                            </dl>
                          </div>
                        </div>
                      </li>
                    );
                  })}

                  {/* Add New Project Card */}
                  {!previewMode && (
                    <li
                      className="card fav border-2 border-dashed border-[var(--primary-blue)] flex items-center justify-center p-8 bg-[var(--paper-tint)] rounded-2xl cursor-pointer hover:bg-[var(--blush)] transition-all text-center"
                      style={{ minHeight: '340px' }}
                      onClick={() => setProjectModal({ isOpen: true, project: null, isNew: true })}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-4xl">➕</span>
                        <b className="text-lg text-[var(--primary-blue)] font-bold">
                          {isRTL ? 'إضافة مشروع جديد ✿' : 'Add New Project ✿'}
                        </b>
                        <span className="text-xs text-[var(--plum)] opacity-70">
                          {isRTL ? 'انقر لرفع الغلاف وإضافة مشروع إلى المعرض' : 'Click to add a project'}
                        </span>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            03. ABOUT & BOARDING PASS SECTION (ADMIN VERSION)
            ========================================================================== */}
        <section className="section" id="about">
          <div className="wrap">
            <div className="about-grid">
              {/* Photo Area */}
              <div className="about-visual">
                <figure className="snap relative">
                  <div className="tape" aria-hidden="true" />
                  <div className="snap-top">
                    habiba_irl.jpg
                  </div>
                  <AdminEditableWrapper
                    path="about.portrait.image"
                    title="تعديل صورة البورتريه الواقعية"
                    hint="تغيير أو رفع الصورة الحقيقية لحبيبة"
                    type="image"
                    block
                  >
                    <img
                      src={currentContent.about?.portrait?.image || '/images/habiba-portrait.jpg'}
                      alt="Habiba Yasser"
                      width={900}
                      height={1150}
                    />
                  </AdminEditableWrapper>
                </figure>
              </div>

              {/* Bio & Boarding Pass */}
              <div className="about-content">
                <AdminEditableWrapper
                  path="about.headline"
                  title="تعديل عنوان النبذة الشخصية"
                  hint="تعديل السطر البارز في النبذة الشخصية"
                  block
                >
                  <p className="lead text-xl font-bold leading-relaxed my-4 text-[var(--plum)]">
                    {currentContent.about?.headline}
                  </p>
                </AdminEditableWrapper>

                <AdminEditableWrapper
                  path="about.bio"
                  title="تعديل النبذة الكاملة عن المصممة"
                  hint="تعديل النص الكامل حول دراستك ورؤيتك التصميمية وخبرتك"
                  type="textarea"
                  block
                >
                  <p className="text-base opacity-85 leading-relaxed mb-6">
                    {currentContent.about?.bio}
                  </p>
                </AdminEditableWrapper>

                {/* The Boarding Pass */}
                <article className="pass">
                  <div className="pass-main">
                    <header className="pass-head">
                      <span>{isRTL ? 'تذكرة صعود الطائرة' : 'Boarding pass'}</span>
                      <AdminEditableWrapper
                        path="about.boardingPass.flight"
                        title="تعديل رقم ورحلة التذكرة"
                        hint="تعديل رمز ورقم الرحلة (Flight HY 2028)"
                      >
                        <span>{bp.flight || 'Flight HY 2028'}</span>
                      </AdminEditableWrapper>
                    </header>

                    <div className="pass-route">
                      <div className="city">
                        <b>{bp.fromCode || 'CAI'}</b>
                        <AdminEditableWrapper
                          path="about.boardingPass.fromCity"
                          title="تعديل مدينة المغادرة"
                          hint="تعديل اسم مدينة الإقلاع"
                        >
                          <span>{bp.fromCity || (isRTL ? 'القاهرة، مصر' : 'Cairo, Egypt')}</span>
                        </AdminEditableWrapper>
                      </div>
                      <div className="route" aria-hidden="true">✈</div>
                      <div className="city to">
                        <b>{bp.toCode || 'YOU'}</b>
                        <AdminEditableWrapper
                          path="about.boardingPass.toCity"
                          title="تعديل وجهة الوصول"
                          hint="تعديل وجهة الوصول (مثال: مشروعك وعلامتك)"
                        >
                          <span>{bp.toCity || (isRTL ? 'مشروعك وعلامتك' : 'Your brand')}</span>
                        </AdminEditableWrapper>
                      </div>
                    </div>

                    <dl className="pass-fields">
                      <div>
                        <dt>{isRTL ? 'المسافر' : 'Passenger'}</dt>
                        <AdminEditableWrapper
                          path="about.boardingPass.passenger"
                          title="تعديل اسم المسافر"
                          hint="تعديل اسم المسافر على التذكرة"
                          block
                        >
                          <dd>{bp.passenger || (isRTL ? 'حبيبة ياسر' : 'Habiba Yasser')}</dd>
                        </AdminEditableWrapper>
                      </div>
                      <div>
                        <dt>{isRTL ? 'الدرجة' : 'Class'}</dt>
                        <AdminEditableWrapper
                          path="about.boardingPass.degree"
                          title="تعديل الدرجة والدفعة"
                          hint="تعديل الكلية وسنة التخرج"
                          block
                        >
                          <dd>{bp.degree || (isRTL ? 'فنون جميلة، دفعة ٢٠٢٨' : 'Fine Arts, Class of 2028')}</dd>
                        </AdminEditableWrapper>
                      </div>
                      <div>
                        <dt>{isRTL ? 'التخصص' : 'Specialization'}</dt>
                        <AdminEditableWrapper
                          path="about.boardingPass.specialty"
                          title="تعديل التخصص المهني"
                          hint="تعديل التخصص الرئيسي"
                          block
                        >
                          <dd>{bp.specialty || (isRTL ? 'جرافيك ومونتاج فيديو' : 'Graphic Design & Video Editing')}</dd>
                        </AdminEditableWrapper>
                      </div>
                      <div>
                        <dt>{isRTL ? 'الاعتمادات الموثقة' : 'Verified Training'}</dt>
                        <AdminEditableWrapper
                          path="about.boardingPass.certificates"
                          title="تعديل الشهادات الموثقة"
                          hint="تعديل الشهادات والاعتمادات الرسمية"
                          block
                        >
                          <dd>{bp.certificates || 'TIEC & ITI Certificates'}</dd>
                        </AdminEditableWrapper>
                      </div>
                      <div>
                        <dt>{isRTL ? 'لغات التصميم' : 'Design Languages'}</dt>
                        <AdminEditableWrapper
                          path="about.boardingPass.languages"
                          title="تعديل لغات العمل"
                          hint="تعديل لغات العمل والتصميم"
                          block
                        >
                          <dd>{bp.languages || (isRTL ? 'العربية والإنجليزية' : 'Arabic & English')}</dd>
                        </AdminEditableWrapper>
                      </div>
                      <div>
                        <dt>{isRTL ? 'الحالة' : 'Status'}</dt>
                        <AdminEditableWrapper
                          path="about.boardingPass.status"
                          title="تعديل حالة التفرغ"
                          hint="تعديل حالة استقبال طلبات التصميم"
                          block
                        >
                          <dd>{bp.status || (isRTL ? 'متاحة لمشاريع جديدة' : 'Open for projects')}</dd>
                        </AdminEditableWrapper>
                      </div>
                    </dl>
                  </div>

                  {/* Stub with CV upload */}
                  <div className="pass-stub">
                    <AdminEditableWrapper
                      path="about.boardingPass.stubLabel"
                      title="تعديل عنوان القسيمة"
                      hint="تعديل النص التعريفي أعلى الباركود"
                      block
                    >
                      <span className="stub-label block">{bp.stubLabel || (isRTL ? 'السيرة الذاتية والشهادات' : 'Credentials & CV')}</span>
                    </AdminEditableWrapper>

                    <AdminEditableWrapper
                      path="about.boardingPass.stubTitle"
                      title="تعديل الاسم على القسيمة"
                      hint="تعديل الاسم المطبوع أعلى الباركود"
                      block
                    >
                      <b className="stub-title block">{bp.stubTitle || (isRTL ? 'حبيبة ياسر' : 'Habiba Yasser')}</b>
                    </AdminEditableWrapper>

                    <span className="barcode" aria-hidden="true" />

                    <div className="flex flex-col gap-2 w-full mt-3">
                      <AdminEditableWrapper
                        path="about.boardingPass.cvUrl"
                        title="رفع وتعديل ملف السيرة الذاتية (CV PDF)"
                        hint="اضغطي لرفع ملف السيرة الذاتية PDF من جهازك أو وضع رابطه لتحديث أزرار القراءة والتحميل فوراً"
                        type="pdf"
                        block
                      >
                        <div className="p-2 border-2 border-dashed border-[var(--primary-blue)] rounded-xl text-center bg-blue-50 cursor-pointer">
                          <span className="font-bold text-xs text-[var(--primary-blue)] block">
                            📄 ملف الـ CV المرفوع حالياً
                          </span>
                          <span className="text-[11px] opacity-75">
                            {bp.cvUrl ? 'تم ربط ملف PDF بنجاح' : 'اضغطي هنا لرفع ملف جديد'}
                          </span>
                        </div>
                      </AdminEditableWrapper>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            04. CONTACT SECTION (ADMIN VERSION)
            ========================================================================== */}
        <section className="section" id="contact">
          <div className="wrap">
            <div className="section-head text-center">
              <h2 className="h2">{isRTL ? 'تواصل معي' : 'Contact'}</h2>
            </div>

            <div className="mailcard max-w-xl mx-auto p-6 bg-white border-2 border-[var(--plum)] rounded-3xl shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <AdminEditableWrapper
                  path="contact.stamp"
                  title="تعديل صورة طابع البريد"
                  hint="تغيير أو رفع الصورة المصغرة في طابع البريد"
                  type="image"
                >
                  <img
                    src="/images/habiba-portrait.png"
                    alt="Habiba"
                    className="w-16 h-16 rounded-xl border border-[var(--plum)] object-cover"
                  />
                </AdminEditableWrapper>
                <div>
                  <b className="block text-base">{currentContent.hero?.name || 'حبيبة ياسر'}</b>
                  <span className="text-xs opacity-75">{isRTL ? 'مصممة جرافيك ومونتيرة' : 'Designer & Editor'}</span>
                </div>
              </div>

              <div className="p-4 bg-[var(--paper-tint)] rounded-2xl border border-[var(--plum)] flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <span className="text-xs block opacity-75">{isRTL ? 'البريد الإلكتروني للتواصل:' : 'Contact email:'}</span>
                  <AdminEditableWrapper
                    path="contact.email"
                    title="تعديل البريد الإلكتروني للتواصل"
                    hint="تعديل الإيميل المعتمد لاستقبال الرسائل والتواصل"
                    isBilingual={false}
                  >
                    <span className="font-bold text-base text-[var(--primary-blue)]">
                      {currentContent.contact?.email || 'habibamarghani1@gmail.com'}
                    </span>
                  </AdminEditableWrapper>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer lang={lang} content={currentContent.footer} />

      {/* Lightbox for Artworks */}
      <Lightbox
        isOpen={Boolean(selectedWork)}
        currentWork={selectedWork}
        items={worksItems}
        onClose={() => setSelectedWork(null)}
        onNavigate={setSelectedWork}
        lang={lang}
        content={currentContent.lightbox}
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="retro-toast" role="status" aria-live="polite">
          <span className="toast-spark">✨</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
