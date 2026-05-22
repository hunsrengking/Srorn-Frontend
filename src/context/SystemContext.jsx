import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import systemService from "@/services/systemService";

const SystemContext = createContext();

const getAssetBaseUrl = () => {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/+$/, "");
  if (!baseUrl || baseUrl === "/api") return "";
  return baseUrl.endsWith("/api") ? baseUrl.slice(0, -4) : baseUrl;
};

export const SystemProvider = ({ children }) => {
  const [systemInfo, setSystemInfo] = useState({
    system_name: "Support System",
    logo_url: "/assets/images/logo/logo.PNG",
    auto_logout_enabled: false,
    auto_logout_time: 30,
  });
  const [loading, setLoading] = useState(true);

  const getFullImageUrl = useCallback((url) => {
    if (!url) return "/assets/images/logo/logo.PNG";
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    return `${getAssetBaseUrl()}${url}`;
  }, []);

  const loadSystemInfo = useCallback(async () => {
    try {
      setLoading(true);
      const res = await systemService.getSystemSettings();
      if (res.data) {
        setSystemInfo({
          system_name: res.data.system_name || "Support System",
          logo_url: getFullImageUrl(res.data.logo_url),
          auto_logout_enabled: res.data.auto_logout_enabled || false,
          auto_logout_time: res.data.auto_logout_time || 30,
        });
      }
    } catch (err) {
      console.error("Failed to load system info:", err);
    } finally {
      setLoading(false);
    }
  }, [getFullImageUrl]);

  useEffect(() => {
    loadSystemInfo();
  }, [loadSystemInfo]);

  const updateSystemInfo = useCallback((newData) => {
    if (newData.logo_url) {
      newData.logo_url = getFullImageUrl(newData.logo_url);
    }
    setSystemInfo((prev) => ({ ...prev, ...newData }));
  }, [getFullImageUrl]);

  const value = useMemo(
    () => ({ systemInfo, updateSystemInfo, loadSystemInfo, loading }),
    [systemInfo, updateSystemInfo, loadSystemInfo, loading],
  );

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error("useSystem must be used within a SystemProvider");
  }
  return context;
};
