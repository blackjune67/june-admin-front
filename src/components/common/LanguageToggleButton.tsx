import { useLocale } from "../../context/LocaleContext";

export const LanguageToggleButton: React.FC = () => {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      className="inline-flex h-11 items-center rounded-full border border-gray-200 bg-white p-1 text-xs font-semibold dark:border-gray-800 dark:bg-gray-900"
      aria-label={t("common.language")}
      title={t("common.language")}
    >
      <button
        type="button"
        onClick={() => setLocale("ko")}
        className={`rounded-full px-3 py-1.5 transition-colors ${
          locale === "ko"
            ? "bg-brand-500 text-white"
            : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        }`}
      >
        KO
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded-full px-3 py-1.5 transition-colors ${
          locale === "en"
            ? "bg-brand-500 text-white"
            : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        }`}
      >
        EN
      </button>
    </div>
  );
};
