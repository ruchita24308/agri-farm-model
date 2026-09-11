import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language } from "../types";
import { translations, TranslationKey } from "../i18n";

const STORAGE_KEY = "bhumisutra_language";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: TranslationKey) => string;
  isFirstLaunch: boolean;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === "en" || stored === "te" || stored === "hi") {
          setLanguageState(stored);
          setIsFirstLaunch(false);
        } else {
          setIsFirstLaunch(true);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setLanguage = async (lang: Language) => {
    await AsyncStorage.setItem(STORAGE_KEY, lang);
    setLanguageState(lang);
    setIsFirstLaunch(false);
  };

  const t = (key: TranslationKey) => translations[language][key] ?? key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isFirstLaunch, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};