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
  faBox,
} from "@fortawesome/free-solid-svg-icons";
import { hasPermission } from "../utils/permission";

const Sidebar = ({ sidebarOpen }) => {
  const { t } = useTranslation();
  const [reportOpen, setReportOpen] = useState(false);
  const location = useLocation();

  const isActive = (paths) => {
    const values = Array.isArray(paths) ? paths : [paths];
    return values.some((path) => location.pathname.startsWith(path));
  };

  const menuClass = (paths) =>
    `flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors duration-200 group
     ${sidebarOpen ? "gap-3" : "justify-center"}
     ${isActive(paths)
      ? "bg-blue-600 text-white shadow-sm"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }`;

  const menuItems = [
    {
      to: "/dashboard",
      paths: "/dashboard",
      permission: "VIEW_DASHBOARD",
      icon: faChartBar,
      label: t("sidebar.dashboard"),
    },
    {
      to: "/ticket",
      paths: "/ticket",
      permission: "VIEW_TICKET",
      icon: faTicket,
      label: t("sidebar.tickets"),
    },
    {
      to: "/checkermaker",
      paths: "/checkermaker",
      permission: "MAKER_CHECKER",
      icon: faCheckToSlot,
      label: t("sidebar.checkerbox"),
    },
    {
      to: "/students",
      paths: "/students",
      permission: "VIEW_STUDENTS",
      icon: faUserGraduate,
      label: t("sidebar.students"),
    },
    {
      to: "/inventory",
      paths: "/inventory",
      permission: "VIEW_INVENTORY",
      icon: faBox,
      label: t("sidebar.inventory"),
    },
    {
      to: "/users",
      paths: "/users",
      permission: "VIEW_USER",
      icon: faUsers,
      label: t("sidebar.users"),
    },
    {
      to: "/organization",
      paths: "/organization",
      permission: "VIEW_ORGANIZATION",
      icon: faBuilding,
      label: t("sidebar.organization"),
    },
    {
      to: "/setting",
      paths: ["/setting", "/settings"],
      permission: "VIEW_SETTING",
      icon: faSliders,
      label: t("sidebar.settings"),
    },
  ];

  const renderMenuItem = (item) =>
    hasPermission(item.permission) ? (
      <Link
        key={item.to}
        to={item.to}
        className={menuClass(item.paths)}
        title={sidebarOpen ? undefined : item.label}
      >
        <FontAwesomeIcon icon={item.icon} className="w-5 text-base" />
        {sidebarOpen && <span className="truncate">{item.label}</span>}
      </Link>
    ) : null;

  return (
    <aside
      className={`h-full flex-1 border-r border-slate-200 bg-white shadow-sm transition-all duration-300 overflow-y-auto overflow-x-hidden ${sidebarOpen ? "w-64" : "w-64 md:w-20"}`}
    >
      <nav className="p-3 space-y-1.5">
        {menuItems.slice(0, 6).map(renderMenuItem)}

        {hasPermission("VIEW_REPORTS") && (
          <div>
            <button
              onClick={() => setReportOpen(!reportOpen)}
              aria-expanded={reportOpen}
              title={sidebarOpen ? undefined : t("sidebar.reports")}
              className={`w-full min-h-11 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 transition-colors duration-200 ${
                sidebarOpen ? "flex items-center justify-between" : "flex items-center justify-center"
              }`}
            >
              <div className={`flex items-center ${sidebarOpen ? "gap-3" : ""}`}>
                <FontAwesomeIcon icon={faChartArea} className="w-5 text-base" />
                {sidebarOpen && <span>{t("sidebar.reports")}</span>}
              </div>

              {sidebarOpen && (
                <FontAwesomeIcon
                  icon={reportOpen ? faMinus : faPlus}
                  className="text-sm transition-all duration-200"
                />
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${reportOpen && sidebarOpen ? "max-h-40 mt-2 space-y-1" : "max-h-0"
                }`}
            >
              <Link
                to="/reports/summary"
                className={`block ml-10 py-2 px-3 rounded-lg text-sm transition
                ${isActive("/reports/summary")
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                  }`}
              >
                {t("sidebar.ticket_report")}
              </Link>
              <Link
                to="/reports/printcards"
                className={`block ml-10 py-2 px-3 rounded-lg text-sm transition
                ${isActive("/reports/printcards")
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                  }`}
              >
                Print Card Report
              </Link>
            </div>
          </div>
        )}

        {menuItems.slice(6).map(renderMenuItem)}
      </nav>
    </aside>
  );
};

export default Sidebar;
