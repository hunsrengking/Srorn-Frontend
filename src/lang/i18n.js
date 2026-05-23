import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

// Get saved language from localStorage or default to 'en'
const savedLanguage = localStorage.getItem('app_language') || 'en';

// i18n configuration
i18n
  .use(HttpBackend) // load translations from /public/locales
  .use(initReactI18next)
  .init({
    lng: savedLanguage, // load saved language or default to 'en'
    fallbackLng: "en", // fallback if translation is missing
    ns: ["translation"], // specify namespace
    defaultNS: "translation", // default namespace
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json" // Path to translation files
    },
    interpolation: {
      escapeValue: false // React already escapes by default
    },
    react: {
      useSuspense: false // Prevent Suspense issues during load
    }
  });

// Sync the <html lang=""> attribute with the current language
const syncLang = (lng) => {
  document.documentElement.lang = lng;
};

// Apply on init
syncLang(savedLanguage);

// Save language preference and sync <html lang> whenever it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('app_language', lng);
  syncLang(lng);
});

export default i18n;
