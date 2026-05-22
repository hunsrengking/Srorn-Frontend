import { ErrorProvider } from "@/context/ErrorContext";
import { LoadingProvider } from "@/context/LoadingContext";
import { SystemProvider } from "@/context/SystemContext";

const AppProviders = ({ children }) => (
  <ErrorProvider>
    <LoadingProvider>
      <SystemProvider>{children}</SystemProvider>
    </LoadingProvider>
  </ErrorProvider>
);

export default AppProviders;
