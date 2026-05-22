import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import authService, {
  getAccessToken,
  isTokenExpired,
  setLogoutCallback,
} from "@/services/authService";
import notificationService from "@/services/notificationService";
import {
  faBars,
  faBell,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useSystem } from "../context/SystemContext";

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

const isExpiredNotification = (n) => {
  const time = n.created_at
    ? new Date(n.created_at).getTime()
    : n.createdAt
      ? new Date(n.createdAt).getTime()
      : 0;

  return time && Date.now() - time > THREE_DAYS_MS;
};

const Header = ({ toggleSidebar }) => {
  const { t } = useTranslation();
  const { systemInfo } = useSystem();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const [storedUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("app_auth_user")) || null;
    } catch {
      return null;
    }
  });

  const user = {
    id: storedUser?.id || "id",
    name: storedUser?.username || storedUser?.name || "User",
    role: storedUser?.role?.name || storedUser?.role || "Role",
  };

  // ===== LOAD NOTIFICATIONS =====
  useEffect(() => {
    const load = async () => {
      try {
        const listRes = await notificationService.getNotifications();
        const cleaned = (listRes.data || []).filter(
          (n) => !isExpiredNotification(n),
        );
        setNotifications(cleaned);
        setUnreadCount(cleaned.filter((n) => !n.is_read).length);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  // ===== LOGOUT CALLBACK =====
  useEffect(() => {
    setLogoutCallback(() => {
      authService.clearSession();
      navigate("/login", { replace: true });
    });
    return () => setLogoutCallback(() => {});
  }, [navigate]);

  // ===== CLICK OUTSIDE =====
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleForcedLogout = useCallback(() => {
    authService.clearSession();
    navigate("/login", { replace: true });
  }, [navigate]);

  // ===== TOKEN CHECK =====
  useEffect(() => {
    const check = () => {
      const token = getAccessToken();
      if (token && isTokenExpired(token)) handleForcedLogout();
    };
    check();
    const iv = setInterval(check, 30000);
    return () => clearInterval(iv);
  }, [handleForcedLogout]);

  const handleRead = async (n) => {
    try {
      await notificationService.markAsRead(n.id);

      const updated = notifications.map((item) =>
        item.id === n.id ? { ...item, is_read: true } : item,
      );

      setNotifications(updated);
      setUnreadCount(updated.filter((x) => !x.is_read).length);
      setShowNotif(false);

      if (n.link) navigate(n.link);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    setLoggingOut(true);
    try {
      const token = getAccessToken();
      if (token) {
        await authService.logout(token);
      }
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      authService.clearSession();
      setLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="flex min-h-16 items-center justify-between px-3 sm:px-5 lg:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            onClick={toggleSidebar}
            aria-label="Toggle navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-950 transition"
          >
            <FontAwesomeIcon icon={faBars} className="text-lg" />
          </button>

          <div className="flex min-w-0 items-center gap-3 px-1">
            <div className="h-10 w-10 shrink-0 ">
              <img
                src={systemInfo.logo_url}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="truncate text-base font-semibold text-slate-950 sm:text-lg">
              {systemInfo.system_name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 relative">
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotif((p) => !p)}
              aria-label="Notifications"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-950 transition"
            >
              <FontAwesomeIcon icon={faBell} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            <div
              className={`absolute right-0 mt-3 w-[min(22rem,calc(100vw-2rem))] bg-white border border-slate-200 shadow-xl rounded-lg py-2 transition-all duration-200 ${
                showNotif
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              {notifications.length === 0 && (
                <div className="px-4 py-3 text-sm text-slate-500">
                  {t("header.no_notifications")}
                </div>
              )}

              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleRead(n)}
                    className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition ${
                      !n.is_read
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : "text-slate-500"
                    }`}
                  >
                    <div className="text-sm font-medium">{n.title}</div>
                    <div className="text-xs text-slate-500 truncate">
                      {n.message}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu((p) => !p)}
              className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-slate-100 transition sm:gap-3 sm:px-2"
            >
              <div className="bg-blue-600 text-white rounded-full h-9 w-9 flex items-center justify-center font-semibold">
                <FontAwesomeIcon icon={faUser} />
              </div>

              <div className="hidden sm:flex max-w-36 flex-col items-start">
                <span className="max-w-full truncate text-xs font-semibold text-slate-900">
                  {user.name}
                </span>
                <span className="max-w-full truncate text-[11px] text-slate-500">
                  {user.role}
                </span>
              </div>
            </button>

            <div
              className={`absolute right-0 mt-3 w-56 bg-white border border-slate-200 shadow-xl rounded-lg py-2 transition-all duration-200 ${
                showUserMenu
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <Link
                to={`/users/${user.id}/view`}
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Profile
              </Link>

              <Link
                to="/setting"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Settings
              </Link>
              {/* 
              <div className="border-t my-1"></div> */}

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
