import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ErrorProvider } from "./context/ErrorContext";
import { LoadingProvider } from "./context/LoadingContext";
import { SystemProvider } from "./context/SystemContext";
import ErrorAlert from "./components/common/ErrorAlert";
import AppRoute from "./routes/AppRoute";
import SuccessAlert from "./components/common/SuccessAlert";

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set lang attribute on html element for CSS language-specific styling
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <ErrorProvider>
      <LoadingProvider>
        <SystemProvider>
          <ErrorAlert />
          <SuccessAlert />
          <AppRoute />
        </SystemProvider>
      </LoadingProvider>
    </ErrorProvider>
  );
}

export default App;
