import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PORTFOLIO_CONTENT as DEFAULT_PORTFOLIO_CONTENT,
  CATEGORIES as DEFAULT_CATEGORIES,
  SOCIAL_LINKS as DEFAULT_SOCIAL_LINKS,
  WHATSAPP_CONFIG as DEFAULT_WHATSAPP_CONFIG
} from '../data/portfolioData';

const PortfolioDataContext = createContext(null);
const STORAGE_KEY = 'habiba_portfolio_cms_v1';

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

function loadPortfolioData() {
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
    console.warn('Error reading portfolio data:', e);
  }
  return {
    content: DEFAULT_PORTFOLIO_CONTENT,
    categories: DEFAULT_CATEGORIES,
    socials: DEFAULT_SOCIAL_LINKS,
    whatsapp: DEFAULT_WHATSAPP_CONFIG
  };
}

export function PortfolioDataProvider({ children }) {
  const [data, setData] = useState(loadPortfolioData);

  // Live Multi-tab and Cross-Window Synchronization
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setData(loadPortfolioData());
      }
    };

    const handleLocalUpdate = () => {
      setData(loadPortfolioData());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('portfolio-data-updated', handleLocalUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('portfolio-data-updated', handleLocalUpdate);
    };
  }, []);

  return (
    <PortfolioDataContext.Provider
      value={{
        data,
        content: data.content,
        categories: data.categories,
        socials: data.socials,
        whatsapp: data.whatsapp
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
