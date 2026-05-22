import { useTranslation } from "react-i18next";
import ErrorAlert from "@/components/common/ErrorAlert";
import SuccessAlert from "@/components/common/SuccessAlert";
import { useDocumentLanguage } from "@/hooks/useDocumentLanguage";
import AppProviders from "@/providers/AppProviders";
import AppRoute from "@/routes/AppRoute";

function App() {
  const { i18n } = useTranslation();
  useDocumentLanguage(i18n.language);

  return (
    <AppProviders>
      <ErrorAlert />
      <SuccessAlert />
      <AppRoute />
    </AppProviders>
  );
}

export default App;
