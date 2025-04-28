import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import { ar } from '@/locales/ar';

interface I18nContextProps {
  t: (key: string, options?: Record<string, any>) => string;
  locale: string;
  setLocale: (locale: string) => void;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export const i18n = new I18n({
  ar,
});

i18n.defaultLocale = 'ar';
i18n.locale = 'ar'; // Set Arabic as default
i18n.enableFallback = true;

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState(i18n.locale);

  useEffect(() => {
    i18n.locale = locale;
  }, [locale]);

  const t = (key: string, options?: Record<string, any>) => {
    return i18n.t(key, options);
  };

  return (
    <I18nContext.Provider value={{ t, locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18nContext = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18nContext must be used within an I18nProvider');
  }
  return context;
};