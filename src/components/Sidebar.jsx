import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faUsers,
  faChartArea,
  faTicket,
  faCheckToSlot,
  faSliders,
  faUserGraduate,
  faPlus,
  faMinus,
  faBuilding,
  faChalkboardTeacher,
  faBox,
} from "@fortawesome/free-solid-svg-icons";
import { hasPermission } from "../utils/permission";

const Sidebar = ({ sidebarOpen }) => {
  const { t } = useTranslation();
  const [reportOpen, setReportOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const menuClass = (path) =>
    `flex items-center p-2.5 rounded-xl transition-all duration-200 group
     ${isActive(path)
      ? "bg-blue-600 text-white shadow-md"
      : "text-blue-100 hover:bg-blue-700 hover:text-white"
    }`;

  return (
    <aside
      className={`h-full flex-1 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 
      shadow-xl transition-all duration-300 overflow-y-auto overflow-x-hidden ${sidebarOpen ? "w-64" : "w-64 md:w-20"}`}
    >
      <nav className="p-4 space-y-2 text-sm font-medium">
        {/* Dashboard */}
        {hasPermission("VIEW_DASHBOARD") && (
          <Link to="/dashboard" className={menuClass("/dashboard")}>
            <FontAwesomeIcon icon={faChartBar} className="text-lg" />
            {sidebarOpen && (
              <span className="ml-3">{t("sidebar.dashboard")}</span>
            )}
          </Link>
        )}

        {/* Tickets */}
        {hasPermission("VIEW_TICKET") && (
          <Link to="/ticket" className={menuClass("/ticket")}>
            <FontAwesomeIcon icon={faTicket} className="text-lg" />
            {sidebarOpen && (
              <span className="ml-3">{t("sidebar.tickets")}</span>
            )}
          </Link>
        )}

        {/* Checker */}
        {hasPermission("MAKER_CHECKER") && (
          <Link to="/checkermaker" className={menuClass("/checkermaker")}>
            <FontAwesomeIcon icon={faCheckToSlot} className="text-lg" />
            {sidebarOpen && (
              <span className="ml-3">{t("sidebar.checkerbox")}</span>
            )}
          </Link>
        )}

        {/* Students */}
        {hasPermission("VIEW_STUDENTS") && (
          <Link to="/students" className={menuClass("/students")}>
            <FontAwesomeIcon icon={faUserGraduate} className="text-lg" />
            {sidebarOpen && (
              <span className="ml-3">{t("sidebar.students")}</span>
            )}
          </Link>
        )}
        {/* Inventory */}
        {hasPermission("VIEW_INVENTORY") && (
          <Link to="/inventory" className={menuClass("/inventory")}>
            <FontAwesomeIcon icon={faBox} className="text-lg" />
            {sidebarOpen && (
              <span className="ml-3">{t("sidebar.inventory")}</span>
            )}
          </Link>
        )}

        {/* Users */}
        {hasPermission("VIEW_USER") && (
          <Link to="/users" className={menuClass("/users")}>
            <FontAwesomeIcon icon={faUsers} className="text-lg" />
            {sidebarOpen && <span className="ml-3">{t("sidebar.users")}</span>}
          </Link>
        )}

        {/* Reports */}
        {hasPermission("VIEW_REPORTS") && (
          <div>
            <button
              onClick={() => setReportOpen(!reportOpen)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl 
              text-blue-100 hover:bg-blue-700 hover:text-white transition-all duration-200"
            >
              <div className="flex items-center">
                <FontAwesomeIcon icon={faChartArea} className="text-lg" />
                {sidebarOpen && (
                  <span className="ml-3">{t("sidebar.reports")}</span>
                )}
              </div>

              {sidebarOpen && (
                <FontAwesomeIcon
                  icon={reportOpen ? faMinus : faPlus}
                  className="text-sm transition-all duration-200"
                />
              )}
            </button>

            {/* Submenu */}
            <div
              className={`overflow-hidden transition-all duration-300 ${reportOpen && sidebarOpen ? "max-h-40 mt-2" : "max-h-0"
                }`}
            >
              <Link
                to="/reports/summary"
                className={`block ml-10 py-2 px-3 rounded-lg text-sm transition
                ${isActive("/reports")
                    ? "bg-blue-600 text-white"
                    : "text-blue-200 hover:bg-blue-700 hover:text-white"
                  }`}
              >
                {t("sidebar.ticket_report")}
              </Link>
            </div>
          </div>
        )}
        {/* Organization */}
        {hasPermission("VIEW_ORGANIZATION") && (
          <Link to="/organization" className={menuClass("/organization")}>
            <FontAwesomeIcon icon={faBuilding} className="text-lg" />
            {sidebarOpen && (
              <span className="ml-3">{t("sidebar.organization")}</span>
            )}
          </Link>
        )}
        {/* Settings */}
        {hasPermission("VIEW_SETTING") && (
          <Link to="/setting" className={menuClass("/setting")}>
            <FontAwesomeIcon icon={faSliders} className="text-lg" />
            {sidebarOpen && (
              <span className="ml-3">{t("sidebar.settings")}</span>
            )}
          </Link>
        )}

      </nav>
    </aside>
  );
};

export default Sidebar;
