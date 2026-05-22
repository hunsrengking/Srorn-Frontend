// src/context/AuthContext.jsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContextValue";
import { useSystem } from "./SystemContext";

const AUTH_TOKEN_KEY = "app_auth_token";
const AUTH_USER_KEY = "app_auth_user";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(() =>
    localStorage.getItem(AUTH_TOKEN_KEY),
  );
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const signIn = useCallback(async (authToken, userData) => {
    setToken(authToken);
    setUser(userData);

    localStorage.setItem(AUTH_TOKEN_KEY, authToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));

    navigate("/dashboard");
  }, [navigate]);

  const signOut = useCallback(() => {
    setToken(null);
    setUser(null);

    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);

    navigate("/login");
  }, [navigate]);

  const updateUser = useCallback((newUserData) => {
    setUser(newUserData);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUserData));
  }, []);

  // --- Auto Logout Logic ---
  const { systemInfo } = useSystem();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];

    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (token && systemInfo?.auto_logout_enabled) {
        const duration = (systemInfo.auto_logout_time || 30) * 60 * 1000;
        timeoutRef.current = setTimeout(() => {
          signOut();
        }, duration);
      }
    };

    if (token && systemInfo?.auto_logout_enabled) {
      resetTimer();
      events.forEach((event) => window.addEventListener(event, resetTimer));
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [token, systemInfo?.auto_logout_enabled, systemInfo?.auto_logout_time, signOut]);

  const value = useMemo(
    () => ({ token, user, loading, signIn, signOut, updateUser }),
    [token, user, loading, signIn, signOut, updateUser],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
