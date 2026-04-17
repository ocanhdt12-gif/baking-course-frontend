import React, { createContext, useContext, useState, useCallback } from 'react';
import en from './en.json';
import vi from './vi.json';

const translations = { en, vi };
const DEFAULT_LANG = 'vi';
const STORAGE_KEY = 'muka_language';

const LanguageContext = createContext();

/**
 * Get a nested value from an object using a dot-separated key path.
 * e.g., getNestedValue(obj, 'premium.tabs.videos') → obj.premium.tabs.videos
 */
function getNestedValue(obj, keyPath) {
  return keyPath.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

/**
 * Replace placeholders like {name}, {count}, {year} in a translation string.
 */
function interpolate(str, params) {
  if (!params || typeof str !== 'string') return str;
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replace(new RegExp(`\\{${key}\\}`, 'g'), value),
    str
  );
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(DEFAULT_LANG);

  const setLanguage = useCallback((lang) => {
    if (translations[lang]) {
      setLanguageState(lang);
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    }
  }, []);

  /**
   * Translate a key with optional interpolation params.
   * 
   * Usage:
   *   t('header.home')                        → "Homepage"
   *   t('premium.lessonNum', { num: 3 })      → "Lesson 3"
   *   t('footer.copyright', { year: 2026 })   → "© Copyright 2026 All Rights Reserved"
   */
  const t = useCallback((key, params) => {
    const value = getNestedValue(translations[language], key) 
      ?? getNestedValue(translations[DEFAULT_LANG], key) 
      ?? key;
    return interpolate(value, params);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook to access translation function and language controls.
 * 
 * const { t, language, setLanguage } = useTranslation();
 */
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
