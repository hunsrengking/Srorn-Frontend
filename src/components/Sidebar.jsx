import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "@fortawesome/free-solid-svg-icons";
import { hasPermission } from "../utils/permission";

const Sidebar = ({ sidebarOpen }) => {
  const [reportOpen, setReportOpen] = useState(false);
  const [studentOpen, setStudentOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const menuClass = (path) =>
    `flex items-center p-2.5 rounded-xl transition-all duration-200 group
     ${
       isActive(path)
         ? "bg-blue-600 text-white shadow-md"
         : "text-blue-100 hover:bg-blue-700 hover:text-white"
     }`;

  return (
    <aside
      className={`h-screen sticky top-0 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 
      shadow-xl transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}
    >
      <nav className="p-4 space-y-2 text-sm font-medium">
        {/* Dashboard */}
        {hasPermission("VIEW_DASHBOARD") && (
          <Link to="/dashboard" className={menuClass("/dashboard")}>
            <FontAwesomeIcon icon={faChartBar} className="text-lg" />
            {sidebarOpen && <span className="ml-3">Dashboard</span>}
          </Link>
        )}

        {/* Tickets */}
        {hasPermission("VIEW_TICKET") && (
          <Link to="/ticket" className={menuClass("/ticket")}>
            <FontAwesomeIcon icon={faTicket} className="text-lg" />
            {sidebarOpen && <span className="ml-3">Tickets</span>}
          </Link>
        )}

        {/* Checker */}
        {hasPermission("MAKER_CHECKER") && (
          <Link to="/checkermaker" className={menuClass("/checkermaker")}>
            <FontAwesomeIcon icon={faCheckToSlot} className="text-lg" />
            {sidebarOpen && <span className="ml-3">CheckerBox</span>}
          </Link>
        )}
        {/* Student Dropdown */}
        {hasPermission("VIEW_STUDENT") && (
          <div>
            <button
              onClick={() => setStudentOpen(!studentOpen)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl 
      text-blue-100 hover:bg-blue-700 hover:text-white transition-all duration-200"
            >
              <div className="flex items-center">
                <FontAwesomeIcon icon={faUserGraduate} className="text-lg" />
                {sidebarOpen && <span className="ml-3">Students</span>}
              </div>

              {sidebarOpen && (
                <FontAwesomeIcon
                  icon={studentOpen ? faMinus : faPlus}
                  className="text-sm transition-all duration-200"
                />
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                studentOpen && sidebarOpen ? "max-h-40 mt-2" : "max-h-0"
              }`}
            >
              {/* Student List Permission */}
              {hasPermission("VIEW_STUDENT") && (
                <Link
                  to="/students/list"
                  className={`block ml-10 py-2 px-3 rounded-lg text-sm transition
          ${
            isActive("/students/list")
              ? "bg-blue-600 text-white"
              : "text-blue-200 hover:bg-blue-700 hover:text-white"
          }`}
                >
                  Student List
                </Link>
              )}

              {/* Attendance Permission */}
              {hasPermission("VIEW_STUDENT") && (
                <Link
                  to="/students/attendance"
                  className={`block ml-10 py-2 px-3 rounded-lg text-sm transition
          ${
            isActive("/students/attendance")
              ? "bg-blue-600 text-white"
              : "text-blue-200 hover:bg-blue-700 hover:text-white"
          }`}
                >
                  Attendance
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Users */}
        {hasPermission("VIEW_USER") && (
          <Link to="/users" className={menuClass("/users")}>
            <FontAwesomeIcon icon={faUsers} className="text-lg" />
            {sidebarOpen && <span className="ml-3">Users</span>}
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
                {sidebarOpen && <span className="ml-3">Reports</span>}
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
              className={`overflow-hidden transition-all duration-300 ${
                reportOpen && sidebarOpen ? "max-h-40 mt-2" : "max-h-0"
              }`}
            >
              <Link
                to="/reports/summary"
                className={`block ml-10 py-2 px-3 rounded-lg text-sm transition
                ${
                  isActive("/reports")
                    ? "bg-blue-600 text-white"
                    : "text-blue-200 hover:bg-blue-700 hover:text-white"
                }`}
              >
                Ticket Report
              </Link>
            </div>
          </div>
        )}
        {/* Organization */}
        {hasPermission("VIEW_ORGANIZATION") && (
          <Link to="/organization" className={menuClass("/organization")}>
            <FontAwesomeIcon icon={faBuilding} className="text-lg" />
            {sidebarOpen && <span className="ml-3">Organization</span>}
          </Link>
        )}
        {/* Settings */}
        {hasPermission("VIEW_SETTING") && (
          <Link to="/setting" className={menuClass("/setting")}>
            <FontAwesomeIcon icon={faSliders} className="text-lg" />
            {sidebarOpen && <span className="ml-3">Settings</span>}
          </Link>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
