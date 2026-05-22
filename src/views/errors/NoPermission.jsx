// src/views/errors/NoPermission.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import authService from "@/services/authService";

const NoPermission = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("token") ||
        null;

      if (token) {
        await authService.logout(token);
      } else {
        console.warn(
          "No token found in localStorage — skipping backend logout call."
        );
      }
    } catch (err) {
      console.warn(
        "Logout request failed (continuing to clear local state):",
        err
      );
    } finally {
      authService.clearSession();

      setLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-2">{t("errors.forbidden_title")}</h1>
        <p className="text-slate-600 mb-4">
          {t("errors.forbidden_message")}
        </p>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-slate-800 text-white rounded disabled:opacity-60"
          disabled={loggingOut}
        >
          {loggingOut ? t("errors.logging_out") : t("errors.go_home")}
        </button>
      </div>
    </div>
  );
};

export default NoPermission;
