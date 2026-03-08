// src/views/settings/Settings.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCogs,
  faUsersCog,
  faBuilding,
  faPaperPlane,
  faUsers,
  faIdBadge,
} from "@fortawesome/free-solid-svg-icons";
import { hasPermission } from "../../utils/permission";

const Settings = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <FontAwesomeIcon icon={faCogs} />
          {t("settings.title")}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {t("settings.description")}
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* Roles & Permissions */}
        {hasPermission("MANAGE_ROLE") && (
          <Link
            to="/settings/roles"
            className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm 
                       hover:shadow-md hover:border-blue-400 hover:-translate-y-1 
                       transition-all duration-200 block"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faUsersCog}
                  className="text-blue-600 w-5 h-5"
                />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900 group-hover:text-blue-600">
                  {t("settings.roles_title")}
                </h2>
                <p className="text-xs text-slate-500">{t("settings.roles_description")}</p>
              </div>
            </div>
          </Link>
        )}

        {/* Departments */}
        {hasPermission("MANAGE_DEPARTMENT") && (
          <Link
            to="/settings/departments"
            className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm 
                       hover:shadow-md hover:border-blue-400 hover:-translate-y-1 
                       transition-all duration-200 block"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faBuilding}
                  className="text-blue-600 w-5 h-5"
                />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900 group-hover:text-blue-600">
                  {t("settings.departments_title")}
                </h2>
                <p className="text-xs text-slate-500">{t("settings.departments_description")}</p>
              </div>
            </div>
          </Link>
        )}

        {/* Employees */}
        {hasPermission("MANAGE_EMPLOYEE") && (
          <Link
            to="/settings/employees"
            className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm 
                       hover:shadow-md hover:border-blue-400 hover:-translate-y-1 
                       transition-all duration-200 block"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="text-blue-600 w-5 h-5"
                />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900 group-hover:text-blue-600">
                  {t("settings.employees_title")}
                </h2>
                <p className="text-xs text-slate-500">{t("settings.employees_description")}</p>
              </div>
            </div>
          </Link>
        )}

        {/* Positions */}
        {hasPermission("MANAGE_POSITION") && (
          <Link
            to="/settings/positions"
            className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm 
                       hover:shadow-md hover:border-blue-400 hover:-translate-y-1 
                       transition-all duration-200 block"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faIdBadge}
                  className="text-blue-600 w-5 h-5"
                />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900 group-hover:text-blue-600">
                  {t("settings.positions_title")}
                </h2>
                <p className="text-xs text-slate-500">{t("settings.positions_description")}</p>
              </div>
            </div>
          </Link>
        )}

        {/* Telegram */}
        {hasPermission("MANAGE_TELEGRAM") && (
          <Link
            to="/settings/telegram"
            className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm 
                       hover:shadow-md hover:border-blue-400 hover:-translate-y-1 
                       transition-all duration-200 block"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  className="text-blue-600 w-5 h-5"
                />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900 group-hover:text-blue-600">
                  {t("settings.telegram_title")}
                </h2>
                <p className="text-xs text-slate-500">
                  {t("settings.telegram_description")}
                </p>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Settings;
