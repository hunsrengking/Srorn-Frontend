import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { errorService } from "@/services/errorService";

const ErrorContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useError = () => useContext(ErrorContext);

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const showError = useCallback((message, timeout = 4000) => {
    setError(message);
    if (timeout) {
      setTimeout(() => setError(null), timeout);
    }
  }, []);

  const showSuccess = useCallback((message, timeout = 3000) => {
    setSuccess(message);
    if (timeout) {
      setTimeout(() => setSuccess(null), timeout);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);
  const clearSuccess = useCallback(() => setSuccess(null), []);

  useEffect(() => {
    errorService.register(showError, showSuccess);
  }, [showError, showSuccess]);

  const value = useMemo(
    () => ({
      error,
      success,
      showError,
      showSuccess,
      clearError,
      clearSuccess,
    }),
    [error, success, showError, showSuccess, clearError, clearSuccess],
  );

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};
