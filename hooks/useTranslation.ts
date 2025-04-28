import { useI18nContext } from '@/contexts/I18nContext';

export const useTranslation = () => {
  const { t, locale, setLocale } = useI18nContext();
  
  return {
    t,
    locale,
    setLocale,
  };
};