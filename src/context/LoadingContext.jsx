import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LoadingContext } from "@/context/LoadingContextValue";
import { loadingService } from "@/services/loadingService";

export const LoadingProvider = ({ children }) => {
  const [count, setCount] = useState(0);

  const showLoading = useCallback(() => setCount((c) => c + 1), []);
  const hideLoading = useCallback(() => setCount((c) => Math.max(0, c - 1)), []);

  useEffect(() => {
    loadingService.register(showLoading, hideLoading);
  }, [showLoading, hideLoading]);

  const value = useMemo(() => ({ loading: count > 0 }), [count]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};
