import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations, phraseTranslations } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyOrText: string, fallback?: string) => string;
  speak: (text: string) => void;
  fontSizeMultiplier: number;
  setFontSizeMultiplier: (size: number) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('susthayan_lang') as Language) || 'bn';
  });

  const [fontSizeMultiplier, setFontSizeMultiplierState] = useState<number>(() => {
    return Number(localStorage.getItem('susthayan_font_scale')) || 1.0;
  });

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    return localStorage.getItem('susthayan_high_contrast') === 'true';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('susthayan_lang', lang);
  };

  const setFontSizeMultiplier = (size: number) => {
    setFontSizeMultiplierState(size);
    localStorage.setItem('susthayan_font_scale', size.toString());
  };

  const setHighContrast = (val: boolean) => {
    setHighContrastState(val);
    localStorage.setItem('susthayan_high_contrast', val ? 'true' : 'false');
  };

  const t = (keyOrText: string, fallback?: string): string => {
    if (!keyOrText) return '';
    const currentLang = language === 'bn' ? 'bn' : 'en';
    const altLang = currentLang === 'bn' ? 'en' : 'bn';

    const currentDict = (translations[currentLang] || {}) as Record<string, string>;
    const altDict = (translations[altLang] || {}) as Record<string, string>;

    // 1. Exact key match in current language dictionary
    if (currentDict[keyOrText] !== undefined) {
      return currentDict[keyOrText];
    }

    // 2. Exact match in phrase translations dictionary
    const phraseMatch = phraseTranslations[keyOrText];
    if (phraseMatch && phraseMatch[currentLang]) {
      return phraseMatch[currentLang];
    }

    // 3. Search if keyOrText is a value in the other language's dictionary
    for (const [k, val] of Object.entries(altDict)) {
      if (val === keyOrText && currentDict[k] !== undefined) {
        return currentDict[k];
      }
    }

    // 4. Search reverse in phrase translations
    for (const entry of Object.values(phraseTranslations)) {
      if (entry[altLang] === keyOrText && entry[currentLang]) {
        return entry[currentLang];
      }
    }

    // 5. Fallback or return original
    if (fallback !== undefined) return fallback;
    return keyOrText;
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any active speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'bn' ? 'bn-BD' : 'en-US';
      utterance.rate = 0.9; // Slightly slower for elderly comprehension
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.setAttribute('data-lang', language);
  }, [language]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSizeMultiplier * 100}%`;
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [fontSizeMultiplier, highContrast]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        speak,
        fontSizeMultiplier,
        setFontSizeMultiplier,
        highContrast,
        setHighContrast,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
