import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  isLocale,
  translate,
  type Locale,
  type TranslationKey,
} from "../i18n/translations";

const LOCALE_STORAGE_KEY = "june-admin.locale";

type TranslationVariables = Record<string, string | number>;

type LocaleContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
  t: (key: TranslationKey, variables?: TranslationVariables) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const getInitialLocale = (): Locale => {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (storedLocale && isLocale(storedLocale)) {
    return storedLocale;
  }

  const browserLocale = window.navigator.language.toLowerCase();
  return browserLocale.startsWith("ko") ? "ko" : "en";
};

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "ko" ? "en" : "ko");
  }, [locale, setLocale]);

  const t = useCallback(
    (key: TranslationKey, variables?: TranslationVariables) =>
      translate(locale, key, variables),
    [locale],
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t,
    }),
    [locale, setLocale, t, toggleLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }

  return context;
};
