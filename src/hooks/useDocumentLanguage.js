import { useEffect } from "react";

export const useDocumentLanguage = (language) => {
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
};
