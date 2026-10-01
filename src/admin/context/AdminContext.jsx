import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PORTFOLIO_CONTENT as DEFAULT_PORTFOLIO_CONTENT,
  CATEGORIES as DEFAULT_CATEGORIES,
  SOCIAL_LINKS as DEFAULT_SOCIAL_LINKS,
  WHATSAPP_CONFIG as DEFAULT_WHATSAPP_CONFIG
} from '../../data/portfolioData';

const AdminContext = createContext(null);
export const STORAGE_KEY = 'habiba_portfolio_cms_v1';

function deepMerge(target, source) {
  if (!source) return target;
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      key in target &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      output[key] = deepMerge(target[key], source[key]);
    } else if (source[key] !== undefined) {
      output[key] = source[key];
    }
  }
  return output;
}

function mergeWorks(defaultWorks, savedWorks) {
  if (!savedWorks) return defaultWorks;
  const mergedItems = [...(defaultWorks?.items || [])];

  if (Array.isArray(savedWorks.items)) {
    savedWorks.items.forEach((savedItem) => {
      const idx = mergedItems.findIndex((it) => it.id === savedItem.id);
      if (idx !== -1) {
        mergedItems[idx] = { ...mergedItems[idx], ...savedItem };
      } else {
        mergedItems.push(savedItem);
      }
    });
  }

  return {
    ...defaultWorks,
    ...savedWorks,
    items: mergedItems
  };
}

export function loadCurrentPortfolioData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const arContent = deepMerge(DEFAULT_PORTFOLIO_CONTENT.ar, parsed.content?.ar);
      const enContent = deepMerge(DEFAULT_PORTFOLIO_CONTENT.en, parsed.content?.en);

      arContent.works = mergeWorks(DEFAULT_PORTFOLIO_CONTENT.ar.works, parsed.content?.ar?.works);
      enContent.works = mergeWorks(DEFAULT_PORTFOLIO_CONTENT.en.works, parsed.content?.en?.works);

      const categories =
        parsed.categories && parsed.categories.length >= DEFAULT_CATEGORIES.length
          ? parsed.categories
          : DEFAULT_CATEGORIES;

      return {
        content: {
          ar: arContent,
          en: enContent
        },
        categories,
        socials: parsed.socials || DEFAULT_SOCIAL_LINKS,
        whatsapp: parsed.whatsapp || DEFAULT_WHATSAPP_CONFIG
      };
    }
  } catch (e) {
    console.warn('Error reading from localStorage:', e);
  }
  return {
    content: DEFAULT_PORTFOLIO_CONTENT,
    categories: DEFAULT_CATEGORIES,
    socials: DEFAULT_SOCIAL_LINKS,
    whatsapp: DEFAULT_WHATSAPP_CONFIG
  };
}

export function AdminProvider({ children }) {
  const [data, setData] = useState(loadCurrentPortfolioData);
  const [previewMode, setPreviewMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Sync when storage changes in another tab
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setData(loadCurrentPortfolioData());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const persistData = (nextData) => {
    setData(nextData);
    setHasUnsavedChanges(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
      window.dispatchEvent(new Event('portfolio-data-updated'));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
      showToast('خطأ: تعذر حفظ التعديلات في التخزين المحلي');
    }
  };

  // Modals state
  const [fieldModal, setFieldModal] = useState({
    isOpen: false,
    path: '',
    title: '',
    hint: '',
    type: 'text',
    currentAr: '',
    currentEn: '',
    isBilingual: true
  });

  const [projectModal, setProjectModal] = useState({
    isOpen: false,
    project: null,
    isNew: false
  });

  const [categoryModal, setCategoryModal] = useState({
    isOpen: false,
    category: null
  });

  // Mutators
  const updateBilingualField = (path, valueAr, valueEn) => {
    const nextContent = JSON.parse(JSON.stringify(data.content));
    const setDeep = (obj, p, val) => {
      const keys = p.split('.');
      let cur = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!cur[keys[i]]) cur[keys[i]] = {};
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = val;
    };

    if (valueAr !== undefined) setDeep(nextContent.ar, path, valueAr);
    if (valueEn !== undefined) setDeep(nextContent.en, path, valueEn);

    persistData({
      ...data,
      content: nextContent
    });
    showToast('تم حفظ التعديل بنجاح ✿');
  };

  const updateSingleField = (targetPath, value) => {
    const nextData = JSON.parse(JSON.stringify(data));
    const keys = targetPath.split('.');
    let cur = nextData;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!cur[keys[i]]) cur[keys[i]] = {};
      cur = cur[keys[i]];
    }
    cur[keys[keys.length - 1]] = value;
    persistData(nextData);
    showToast('تم حفظ التعديل بنجاح ✿');
  };

  const saveProject = (projectData, isNew) => {
    const nextContent = JSON.parse(JSON.stringify(data.content));
    const itemsAr = [...(nextContent.ar.works?.items || [])];
    const itemsEn = [...(nextContent.en.works?.items || [])];

    if (isNew) {
      const newId = projectData.id || `proj-${Date.now()}`;
      const indexNum = String(itemsAr.length + 1).padStart(2, '0');

      const newItemAr = {
        id: newId,
        index: indexNum,
        year: projectData.year || '2024',
        title: projectData.titleAr || projectData.title || 'مشروع جديد',
        category: projectData.categoryAr || projectData.category || 'تصميم جرافيك',
        categorySlug: projectData.categorySlug || 'social',
        description: projectData.descriptionAr || projectData.description || '',
        image: projectData.image || '/images/ashley-root-chair.jpg',
        accent: projectData.accent || '#1D4ED8',
        tags: projectData.tagsAr || projectData.tags || ['Graphic Design'],
        aspectRatio: 'aspect-square',
        behanceUrl: projectData.behanceUrl || '',
        metrics: projectData.metricsAr || {
          studyFocus: 'الإخراج البصري',
          composition: 'متزن',
          colorHarmony: 'متناسق',
          deliverable: 'حملة إعلانية'
        }
      };

      const newItemEn = {
        ...newItemAr,
        title: projectData.titleEn || newItemAr.title,
        category: projectData.categoryEn || newItemAr.category,
        description: projectData.descriptionEn || newItemAr.description,
        tags: projectData.tagsEn || newItemAr.tags
      };

      itemsAr.push(newItemAr);
      itemsEn.push(newItemEn);
    } else {
      const idxAr = itemsAr.findIndex((p) => p.id === projectData.id);
      if (idxAr !== -1) {
        itemsAr[idxAr] = {
          ...itemsAr[idxAr],
          title: projectData.titleAr || projectData.title || itemsAr[idxAr].title,
          category: projectData.categoryAr || itemsAr[idxAr].category,
          categorySlug: projectData.categorySlug || itemsAr[idxAr].categorySlug,
          description: projectData.descriptionAr || itemsAr[idxAr].description,
          image: projectData.image || itemsAr[idxAr].image,
          accent: projectData.accent || itemsAr[idxAr].accent,
          year: projectData.year || itemsAr[idxAr].year,
          tags: projectData.tagsAr || projectData.tags || itemsAr[idxAr].tags,
          behanceUrl: projectData.behanceUrl || itemsAr[idxAr].behanceUrl
        };
      }

      const idxEn = itemsEn.findIndex((p) => p.id === projectData.id);
      if (idxEn !== -1) {
        itemsEn[idxEn] = {
          ...itemsEn[idxEn],
          title: projectData.titleEn || projectData.title || itemsEn[idxEn].title,
          category: projectData.categoryEn || itemsEn[idxEn].category,
          categorySlug: projectData.categorySlug || itemsEn[idxEn].categorySlug,
          description: projectData.descriptionEn || itemsEn[idxEn].description,
          image: projectData.image || itemsEn[idxEn].image,
          accent: projectData.accent || itemsEn[idxEn].accent,
          year: projectData.year || itemsEn[idxEn].year,
          tags: projectData.tagsEn || projectData.tags || itemsEn[idxEn].tags,
          behanceUrl: projectData.behanceUrl || itemsEn[idxEn].behanceUrl
        };
      }
    }

    nextContent.ar.works.items = itemsAr;
    nextContent.en.works.items = itemsEn;

    persistData({
      ...data,
      content: nextContent
    });
    showToast(isNew ? 'تمت إضافة المشروع الجديد بنجاح ✿' : 'تم حفظ بيانات المشروع بنجاح ✿');
  };

  const deleteProject = (projectId) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا المشروع؟')) return;

    const nextContent = JSON.parse(JSON.stringify(data.content));
    nextContent.ar.works.items = (nextContent.ar.works?.items || []).filter(
      (p) => p.id !== projectId
    );
    nextContent.en.works.items = (nextContent.en.works?.items || []).filter(
      (p) => p.id !== projectId
    );

    persistData({
      ...data,
      content: nextContent
    });
    showToast('تم حذف المشروع بنجاح');
  };

  const updateCategory = (slug, updates) => {
    const nextCategories = (data.categories || DEFAULT_CATEGORIES).map((cat) => {
      if (cat.slug === slug) {
        return {
          ...cat,
          name: {
            ar: updates.nameAr !== undefined ? updates.nameAr : cat.name.ar,
            en: updates.nameEn !== undefined ? updates.nameEn : cat.name.en
          },
          desc: {
            ar: updates.descAr !== undefined ? updates.descAr : cat.desc?.ar,
            en: updates.descEn !== undefined ? updates.descEn : cat.desc?.en
          },
          color: updates.color || cat.color
        };
      }
      return cat;
    });

    persistData({
      ...data,
      categories: nextCategories
    });
    showToast('تم حفظ تعديلات التبويب ✿');
  };

  const moveProjectCategory = (projectId, targetCategorySlug) => {
    if (!projectId || !targetCategorySlug || targetCategorySlug === 'all') return;

    const targetCategory = (data.categories || DEFAULT_CATEGORIES).find(
      (c) => c.slug === targetCategorySlug
    );
    if (!targetCategory) return;

    const nextContent = JSON.parse(JSON.stringify(data.content));
    const itemsAr = [...(nextContent.ar.works?.items || [])];
    const itemsEn = [...(nextContent.en.works?.items || [])];

    const idxAr = itemsAr.findIndex((p) => p.id === projectId);
    if (idxAr !== -1) {
      itemsAr[idxAr] = {
        ...itemsAr[idxAr],
        categorySlug: targetCategorySlug,
        category: targetCategory.name.ar
      };
    }

    const idxEn = itemsEn.findIndex((p) => p.id === projectId);
    if (idxEn !== -1) {
      itemsEn[idxEn] = {
        ...itemsEn[idxEn],
        categorySlug: targetCategorySlug,
        category: targetCategory.name.en
      };
    }

    nextContent.ar.works.items = itemsAr;
    nextContent.en.works.items = itemsEn;

    persistData({
      ...data,
      content: nextContent
    });
  };

  const exportDataFile = () => {
    const code = `// ==========================================================================
// HABIBA YASSER PORTFOLIO DATA (Exported via Visual CMS)
// Generated at: ${new Date().toISOString()}
// ==========================================================================

export const SOCIAL_LINKS = ${JSON.stringify(data.socials, null, 2)};

export const WHATSAPP_CONFIG = {
  number: '${data.whatsapp.number || '201117616300'}',
  getLink: (lang) => {
    const text = lang === 'ar'
      ? 'مرحباً أستاذة حبيبة، اطلعت على أعمالك في موقعك وأود الاستفسار عن مشروع تصميم...'
      : 'Hello Habiba, I reviewed your design portfolio and would like to discuss a project...';
    return \`https://wa.me/\${WHATSAPP_CONFIG.number}?text=\${encodeURIComponent(text)}\`;
  }
};

export const CATEGORIES = ${JSON.stringify(data.categories, null, 2)};

export const PORTFOLIO_CONTENT = ${JSON.stringify(data.content, null, 2)};
`;

    const blob = new Blob([code], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolioData.js';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setHasUnsavedChanges(false);
    showToast('تم تصدير ملف الكود portfolioData.js بنجاح 💾');
  };

  const resetToDefaults = () => {
    if (!window.confirm('هل أنتِ متأكدة من رغبتك في استعادة كافة البيانات الأصلية؟')) return;
    localStorage.removeItem(STORAGE_KEY);
    setData({
      content: DEFAULT_PORTFOLIO_CONTENT,
      categories: DEFAULT_CATEGORIES,
      socials: DEFAULT_SOCIAL_LINKS,
      whatsapp: DEFAULT_WHATSAPP_CONFIG
    });
    setHasUnsavedChanges(false);
    window.dispatchEvent(new Event('portfolio-data-updated'));
    showToast('تمت استعادة البيانات الافتراضية بنجاح ↺');
  };

  return (
    <AdminContext.Provider
      value={{
        data,
        content: data.content,
        categories: data.categories,
        socials: data.socials,
        whatsapp: data.whatsapp,
        previewMode,
        setPreviewMode,
        hasUnsavedChanges,
        toastMsg,
        showToast,
        fieldModal,
        setFieldModal,
        projectModal,
        setProjectModal,
        categoryModal,
        setCategoryModal,
        updateCategory,
        moveProjectCategory,
        updateBilingualField,
        updateSingleField,
        saveProject,
        deleteProject,
        exportDataFile,
        resetToDefaults
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return ctx;
}
