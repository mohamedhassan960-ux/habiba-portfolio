import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PORTFOLIO_CONTENT as DEFAULT_PORTFOLIO_CONTENT,
  CATEGORIES as DEFAULT_CATEGORIES,
  SOCIAL_LINKS as DEFAULT_SOCIAL_LINKS,
  WHATSAPP_CONFIG as DEFAULT_WHATSAPP_CONFIG
} from '../data/portfolioData';

const PortfolioDataContext = createContext(null);
const STORAGE_KEY = 'habiba_portfolio_cms_v1';
const ADMIN_AUTH_KEY = 'habiba_admin_auth_v1';

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

export function PortfolioDataProvider({ children }) {
  // 1. Data state with localStorage persistence
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          content: {
            ar: deepMerge(DEFAULT_PORTFOLIO_CONTENT.ar, parsed.content?.ar),
            en: deepMerge(DEFAULT_PORTFOLIO_CONTENT.en, parsed.content?.en)
          },
          categories: parsed.categories || DEFAULT_CATEGORIES,
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
  });

  // 2. Admin Mode state & routing detection
  const [isAdmin, setIsAdmin] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Check URL hash/query on load and hash change
  useEffect(() => {
    const checkAdminRoute = () => {
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      const isAuthSaved = localStorage.getItem(ADMIN_AUTH_KEY) === 'true';

      if (
        hash.includes('admin') ||
        search.includes('admin=1') ||
        isAuthSaved
      ) {
        setIsAdmin(true);
        localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    return () => window.removeEventListener('hashchange', checkAdminRoute);
  }, []);

  // Save changes to localStorage whenever data changes
  const persistData = (nextData) => {
    setData(nextData);
    setHasUnsavedChanges(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  };

  // 3. Modal States
  const [fieldModal, setFieldModal] = useState({
    isOpen: false,
    path: '',
    title: '',
    hint: '',
    type: 'text', // 'text' | 'textarea' | 'image' | 'link'
    currentAr: '',
    currentEn: '',
    isBilingual: true
  });

  const [projectModal, setProjectModal] = useState({
    isOpen: false,
    project: null,
    isNew: false
  });

  // 4. Data Mutators
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
  };

  const updateSingleField = (targetPath, value) => {
    // targetPath e.g. "socials.email" or "whatsapp.number"
    const nextData = JSON.parse(JSON.stringify(data));
    const keys = targetPath.split('.');
    let cur = nextData;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!cur[keys[i]]) cur[keys[i]] = {};
      cur = cur[keys[i]];
    }
    cur[keys[keys.length - 1]] = value;
    persistData(nextData);
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
  };

  // 5. Code Export: generates clean portfolioData.js code file
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
  };

  const resetToDefaults = () => {
    if (!window.confirm('هل تريد إعادة تعيين كافة البيانات إلى الحالة الافتراضية الأصلية؟')) return;
    localStorage.removeItem(STORAGE_KEY);
    setData({
      content: DEFAULT_PORTFOLIO_CONTENT,
      categories: DEFAULT_CATEGORIES,
      socials: DEFAULT_SOCIAL_LINKS,
      whatsapp: DEFAULT_WHATSAPP_CONFIG
    });
    setHasUnsavedChanges(false);
  };

  const exitAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem(ADMIN_AUTH_KEY);
    if (window.location.hash.includes('admin')) {
      window.location.hash = '';
    }
  };

  return (
    <PortfolioDataContext.Provider
      value={{
        data,
        content: data.content,
        categories: data.categories,
        socials: data.socials,
        whatsapp: data.whatsapp,
        isAdmin,
        setIsAdmin,
        previewMode,
        setPreviewMode,
        hasUnsavedChanges,
        fieldModal,
        setFieldModal,
        projectModal,
        setProjectModal,
        updateBilingualField,
        updateSingleField,
        saveProject,
        deleteProject,
        exportDataFile,
        resetToDefaults,
        exitAdmin
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  const ctx = useContext(PortfolioDataContext);
  if (!ctx) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return ctx;
}
