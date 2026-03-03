// src/views/organization/Organization.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCogs,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import { hasPermission } from "../../utils/permission";
import { faAddressCard } from "@fortawesome/free-regular-svg-icons";

const Organization = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <FontAwesomeIcon icon={faCogs} />
          Organization
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage system Organization.
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* Roles & Permissions */}
        {hasPermission("MANAGE_ROLE") && (
          <Link
            to="/organization/printcard"
            className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm 
                       hover:shadow-md hover:border-blue-400 hover:-translate-y-1 
                       transition-all duration-200 block"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faAddressCard}
                  className="text-blue-600 w-5 h-5"
                />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900 group-hover:text-blue-600">
                  Printer Card
                </h2>
                <p className="text-xs text-slate-500">
                  Print employee and student cards.
                </p>
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
                  Office
                </h2>
                <p className="text-xs text-slate-500">Manage Office.</p>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Organization;
