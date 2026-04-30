import React, { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../services/axiosClient";

const SystemContext = createContext();

export const SystemProvider = ({ children }) => {
  const [systemInfo, setSystemInfo] = useState({
    system_name: "Support System",
    logo_url: "/assets/images/logo/logo.PNG",
    auto_logout_enabled: false,
    auto_logout_time: 30,
  });
  const [loading, setLoading] = useState(true);

  const getFullImageUrl = (url) => {
    if (!url) return "/assets/images/logo/logo.PNG";
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
    return `${base}${url}`;
  };

  const loadSystemInfo = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/api/system-settings");
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
  };

  useEffect(() => {
    loadSystemInfo();
  }, []);

  const updateSystemInfo = (newData) => {
    if (newData.logo_url) {
      newData.logo_url = getFullImageUrl(newData.logo_url);
    }
    setSystemInfo((prev) => ({ ...prev, ...newData }));
  };

  return (
    <SystemContext.Provider value={{ systemInfo, updateSystemInfo, loadSystemInfo, loading }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error("useSystem must be used within a SystemProvider");
  }
  return context;
};
