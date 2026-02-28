// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient, {
  getAccessToken,
  isTokenExpired,
  clearTokens,
  setLogoutCallback,
} from "../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const Header = ({ toggleSidebar }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("app_auth_user")) || null;
    } catch {
      return null;
    }
  })();

  const user = {
    id: storedUser?.id || "id",
    name: storedUser?.username || storedUser?.name || "User",
    role: storedUser?.role?.name || storedUser?.role || "Role",
  };

  // ===== LOAD NOTIFICATIONS =====
  useEffect(() => {
    const load = async () => {
      try {
        const listRes = await axiosClient.get("/api/notifications");
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
      clearTokens();
      delete axiosClient.defaults.headers.common["Authorization"];
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

  // ===== TOKEN CHECK =====
  useEffect(() => {
    const check = () => {
      const token = getAccessToken();
      if (token && isTokenExpired(token)) handleForcedLogout();
    };
    check();
    const iv = setInterval(check, 30000);
    return () => clearInterval(iv);
  }, []);

  const handleForcedLogout = () => {
    clearTokens();
    delete axiosClient.defaults.headers.common["Authorization"];
    navigate("/login", { replace: true });
  };

  const handleRead = async (n) => {
    try {
      await axiosClient.put(`/api/notifications/${n.id}/read`);

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
        await axiosClient.post("/api/logout", null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
    } finally {
      clearTokens();
      delete axiosClient.defaults.headers.common["Authorization"];
      setLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

  const isExpiredNotification = (n) => {
    const time = n.created_at
      ? new Date(n.created_at).getTime()
      : n.createdAt
        ? new Date(n.createdAt).getTime()
        : 0;

    return time && Date.now() - time > THREE_DAYS_MS;
  };

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-lg border-b border-blue-700">
      <div className="flex items-center justify-between px-6 py-3">
        {/* LEFT */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FontAwesomeIcon icon={faBars} className="text-white text-lg" />
          </button>

          <h1 className="text-lg md:text-xl font-semibold text-white tracking-wide">
            Support System
          </h1>
        </div>

        {/* RIGHT */}
        <div className="flex items-center space-x-4 relative">
          {/* NOTIFICATION */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotif((p) => !p)}
              className="relative p-2 rounded-full hover:bg-blue-700 transition"
            >
              <FontAwesomeIcon icon={faBell} className="text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            <div
              className={`absolute right-0 mt-3 w-80 bg-white border border-slate-200 shadow-xl rounded-xl py-2 transition-all duration-200 ${
                showNotif
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              {notifications.length === 0 && (
                <div className="px-4 py-3 text-sm text-slate-500">
                  No notifications
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

          {/* USER */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu((p) => !p)}
              className="flex items-center space-x-3 px-3 py-1.5 rounded-full hover:bg-blue-700 transition"
            >
              <div className="bg-white text-blue-800 rounded-full h-9 w-9 flex items-center justify-center font-semibold">
                <FontAwesomeIcon icon={faUser} />
              </div>

              <div className="hidden sm:flex flex-col items-start text-white">
                <span className="text-xs font-medium">{user.name}</span>
                <span className="text-[11px] text-blue-200">{user.role}</span>
              </div>
            </button>

            <div
              className={`absolute right-0 mt-3 w-56 bg-white shadow-xl rounded-xl py-2 transition-all duration-200 ${
                showUserMenu
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <Link
                to={`/users/${user.id}/view`}
                className="block px-4 py-2 text-sm hover:bg-blue-50"
              >
                Profile
              </Link>

              <Link
                to="/setting"
                className="block px-4 py-2 text-sm hover:bg-blue-50"
              >
                Settings
              </Link>
              {/* 
              <div className="border-t my-1"></div> */}

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
