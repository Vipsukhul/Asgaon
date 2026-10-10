import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales/translations';
import type { SupportedLang, TranslationKey } from '../locales/translations';

interface LanguageContextType {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
  toggleLang: () => void;
  t: (key: TranslationKey, fallback?: string) => string;
  getLocalized: <T extends Record<string, any>>(item: T | null | undefined, fieldPrefix: string) => string;
}

const STORAGE_KEY = 'asgaon_preferred_lang';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default language is Marathi ('MR') as per requirement
  const [lang, setLangState] = useState<SupportedLang>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'EN' || saved === 'MR') return saved;
    } catch {
      // LocalStorage not available or blocked
    }
    return 'MR';
  });

  const setLang = (newLang: SupportedLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // Ignore
    }
  };

  const toggleLang = () => {
    setLang(lang === 'MR' ? 'EN' : 'MR');
  };

  // Sync HTML lang attribute for screen readers & SEO
  useEffect(() => {
    document.documentElement.lang = lang === 'MR' ? 'mr' : 'en';
  }, [lang]);

  // Translate static UI labels
  const t = (key: TranslationKey, fallback?: string): string => {
    const entry = translations[key];
    if (!entry) return fallback || String(key);
    return entry[lang] || entry['MR'] || fallback || String(key);
  };

  // Helper for dynamic bilingual objects (e.g. item.titleMr / item.titleEn or title_mr / title_en)
  const getLocalized = <T extends Record<string, any>>(item: T | null | undefined, fieldPrefix: string): string => {
    if (!item) return '';
    const cap = fieldPrefix.charAt(0).toUpperCase() + fieldPrefix.slice(1);
    
    if (lang === 'MR') {
      return (
        item[`${fieldPrefix}Mr`] ||
        item[`${fieldPrefix}_mr`] ||
        item[`${fieldPrefix}MR`] ||
        item[`${fieldPrefix}${cap}`] ||
        item[fieldPrefix] ||
        item[`${fieldPrefix}En`] ||
        item[`${fieldPrefix}_en`] ||
        ''
      );
    } else {
      return (
        item[`${fieldPrefix}En`] ||
        item[`${fieldPrefix}_en`] ||
        item[`${fieldPrefix}EN`] ||
        item[fieldPrefix] ||
        item[`${fieldPrefix}Mr`] ||
        item[`${fieldPrefix}_mr`] ||
        ''
      );
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, getLocalized }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
