// src/auth/auth.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSystem } from "../context/SystemContext";

const AUTH_TOKEN_KEY = "app_auth_token";
const AUTH_USER_KEY = "app_auth_user";

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  signIn: async () => {},
  signOut: () => {},
  updateUser: () => {},
});

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

  const signIn = async (token, userData) => {
    setToken(token);
    setUser(userData);

    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));

    navigate("/dashboard");
  };
  const signOut = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);

    navigate("/login");
  };
  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUserData));
  };

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


  return (
    <AuthContext.Provider
      value={{ token, user, loading, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
