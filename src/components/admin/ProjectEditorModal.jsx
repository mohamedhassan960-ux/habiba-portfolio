import React, { useState, useEffect } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';

export default function ProjectEditorModal() {
  const { projectModal, setProjectModal, saveProject, deleteProject } = usePortfolioData();
  const { isOpen, project, isNew } = projectModal;

  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [categoryAr, setCategoryAr] = useState('');
  const [categoryEn, setCategoryEn] = useState('');
  const [categorySlug, setCategorySlug] = useState('social');
  const [year, setYear] = useState('2024');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [image, setImage] = useState('');
  const [behanceUrl, setBehanceUrl] = useState('');
  const [tagsStrAr, setTagsStrAr] = useState('');
  const [tagsStrEn, setTagsStrEn] = useState('');
  const [activeTab, setActiveTab] = useState('ar');

  useEffect(() => {
    if (isOpen) {
      if (project && !isNew) {
        setTitleAr(project.title || '');
        setTitleEn(project.titleEn || project.title || '');
        setCategoryAr(project.category || '');
        setCategoryEn(project.categoryEn || project.category || '');
        setCategorySlug(project.categorySlug || 'social');
        setYear(project.year || '2024');
        setDescriptionAr(project.description || '');
        setDescriptionEn(project.descriptionEn || project.description || '');
        setImage(project.image || '');
        setBehanceUrl(project.behanceUrl || '');
        setTagsStrAr(Array.isArray(project.tags) ? project.tags.join(', ') : '');
        setTagsStrEn(Array.isArray(project.tagsEn) ? project.tagsEn.join(', ') : '');
      } else {
        // Reset for new project
        setTitleAr('');
        setTitleEn('');
        setCategoryAr('سوشيال ميديا وإعلانات');
        setCategoryEn('Social Media & Ads');
        setCategorySlug('social');
        setYear('2024');
        setDescriptionAr('');
        setDescriptionEn('');
        setImage('/images/ashley-root-chair.jpg');
        setBehanceUrl('https://www.behance.net/habibayasser43');
        setTagsStrAr('Ashley Furniture, Visual Study, Photoshop');
        setTagsStrEn('Ashley Furniture, Visual Study, Photoshop');
      }
    }
  }, [isOpen, project, isNew]);

  if (!isOpen) return null;

  const handleClose = () => {
    setProjectModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        setImage(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const tagsAr = tagsStrAr.split(',').map((t) => t.trim()).filter(Boolean);
    const tagsEn = tagsStrEn.split(',').map((t) => t.trim()).filter(Boolean);

    saveProject(
      {
        id: project?.id,
        titleAr,
        titleEn,
        categoryAr,
        categoryEn,
        categorySlug,
        year,
        descriptionAr,
        descriptionEn,
        image,
        behanceUrl,
        tagsAr,
        tagsEn
      },
      isNew
    );

    handleClose();
  };

  const handleDelete = () => {
    if (project?.id) {
      deleteProject(project.id);
      handleClose();
    }
  };

  return (
    <div className="retro-modal-backdrop" onClick={handleClose}>
      <div
        className="retro-modal-window"
        style={{ maxWidth: '680px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="retro-modal-header">
          <div className="win-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <b>{isNew ? 'إضافة مشروع جديد ✿ | Add Project' : 'تعديل بيانات المشروع | Edit Project'}</b>
          <button
            type="button"
            className="retro-modal-close"
            onClick={handleClose}
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave}>
          <div className="retro-modal-body">
            {/* Language tabs */}
            <div className="flex gap-2 mb-4 border-b-2 border-dashed border-[var(--plum)] pb-2">
              <button
                type="button"
                className={`modal-btn ${activeTab === 'ar' ? 'save' : 'cancel'} text-xs py-1 px-4`}
                onClick={() => setActiveTab('ar')}
              >
                بيانات المشروع بالعربية (Arabic) ✿
              </button>
              <button
                type="button"
                className={`modal-btn ${activeTab === 'en' ? 'save' : 'cancel'} text-xs py-1 px-4`}
                onClick={() => setActiveTab('en')}
              >
                Project Details (English) ✿
              </button>
            </div>

            {/* Common Image Upload Section */}
            <div className="modal-field-group">
              <label>غلاف المشروع (Project Cover Image):</label>
              {image && (
                <div className="flex justify-center mb-3">
                  <div className="image-preview-box" style={{ width: '160px', height: '160px' }}>
                    <img src={image} alt="معاينة الغلاف" />
                  </div>
                </div>
              )}

              <label className="image-upload-zone mb-2">
                <span className="text-2xl">🖼️</span>
                <span className="font-bold text-sm">رفع صورة الغلاف من الكمبيوتر</span>
                <span className="text-xs opacity-70">أبعاد مربعة 1:1 أو 4:3 موصى بها</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFileChange}
                />
              </label>

              <input
                type="text"
                className="modal-input text-sm mb-3"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/images/your-project.jpg"
              />

              {/* Category Slug Selector */}
              <div className="modal-field-group mb-1">
                <label>مجلد وتصنيف المشروع في المعرض (Cabinet Category):</label>
                <select
                  className="modal-input cursor-pointer font-bold"
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                >
                  <option value="social">📁 سوشيال ميديا وإعلانات (Social Media & Ads)</option>
                  <option value="media">📁 أغلفة كتب وميديا يوتيوب (Covers & YouTube)</option>
                  <option value="brand">📁 هوية ودراسات فنية (Visual Studies & Brand)</option>
                </select>
              </div>
            </div>

            {/* Arabic Tab Fields */}
            {activeTab === 'ar' ? (
              <>
                <div className="modal-field-group">
                  <label>عنوان المشروع (بالعربية):</label>
                  <input
                    type="text"
                    className="modal-input"
                    dir="rtl"
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder="مثال: هوية بصرية — براند قهوة"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="modal-field-group">
                    <label>تصنيف المشروع (بالعربية):</label>
                    <input
                      type="text"
                      className="modal-input"
                      dir="rtl"
                      value={categoryAr}
                      onChange={(e) => setCategoryAr(e.target.value)}
                      placeholder="مثال: تصميم سوشيال ميديا"
                      required
                    />
                  </div>
                  <div className="modal-field-group">
                    <label>السنة:</label>
                    <input
                      type="text"
                      className="modal-input"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div className="modal-field-group">
                  <label>وصف المشروع وفكرته (بالعربية):</label>
                  <textarea
                    className="modal-textarea"
                    dir="rtl"
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    placeholder="اكتب شرحاً موجزاً عن التكوين البصري والهدف الإعلاني للمشروع…"
                    required
                  />
                </div>

                <div className="modal-field-group">
                  <label>الكلمات المفتاحية / الوسوم (مفصولة بفواصل):</label>
                  <input
                    type="text"
                    className="modal-input"
                    dir="rtl"
                    value={tagsStrAr}
                    onChange={(e) => setTagsStrAr(e.target.value)}
                    placeholder="Photoshop, Social Media, Branding"
                  />
                </div>
              </>
            ) : (
              /* English Tab Fields */
              <>
                <div className="modal-field-group">
                  <label>Project Title (English):</label>
                  <input
                    type="text"
                    className="modal-input"
                    dir="ltr"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Sculptural Lotus Chair"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="modal-field-group">
                    <label>Category (English):</label>
                    <input
                      type="text"
                      className="modal-input"
                      dir="ltr"
                      value={categoryEn}
                      onChange={(e) => setCategoryEn(e.target.value)}
                      placeholder="e.g. Concept & Visual Study"
                      required
                    />
                  </div>
                  <div className="modal-field-group">
                    <label>Year:</label>
                    <input
                      type="text"
                      className="modal-input"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div className="modal-field-group">
                  <label>Project Description (English):</label>
                  <textarea
                    className="modal-textarea"
                    dir="ltr"
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    placeholder="Describe the concept, visual hierarchy and goal..."
                    required
                  />
                </div>

                <div className="modal-field-group">
                  <label>Tags (Comma-separated):</label>
                  <input
                    type="text"
                    className="modal-input"
                    dir="ltr"
                    value={tagsStrEn}
                    onChange={(e) => setTagsStrEn(e.target.value)}
                    placeholder="Photoshop, Social Media, Branding"
                  />
                </div>
              </>
            )}

            {/* Behance Link */}
            <div className="modal-field-group">
              <label>رابط المشروع على Behance (اختياري):</label>
              <input
                type="url"
                className="modal-input"
                dir="ltr"
                value={behanceUrl}
                onChange={(e) => setBehanceUrl(e.target.value)}
                placeholder="https://www.behance.net/gallery/..."
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="retro-modal-footer justify-between">
            <div>
              {!isNew && (
                <button
                  type="button"
                  className="modal-btn cancel text-red-600 border-red-300 hover:bg-red-50"
                  onClick={handleDelete}
                >
                  حذف المشروع 🗑️
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="modal-btn cancel"
                onClick={handleClose}
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="modal-btn save"
              >
                {isNew ? 'إضافة المشروع الآن ✿' : 'حفظ التعديلات ✿'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
