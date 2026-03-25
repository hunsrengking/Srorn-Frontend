// src/views/settings/roles/RoleList.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserShield,
  faPlus,
  faKey,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { hasPermission } from "../../../utils/permission";
import { errorService } from "../../../services/errorService";

const RoleList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRoles = async () => {
    try {
      const res = await axiosClient.get("/api/role");
      setRoles(res.data || []);
    } catch (err) {
      console.error("Error loading roles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleDisable = async (id) => {
    if (!window.confirm(t("roles.disable_confirm"))) return;

    try {
      await axiosClient.delete(`/api/role/${id}`);
      setRoles((prev) => prev.filter((r) => r.id !== id));
      errorService.success(t("roles.disable_success", "Role disabled successfully"));
    } catch (err) {
      console.error("Delete role error:", err);
    }
  };

  if (loading)
    return <p className="text-sm text-slate-500">{t("roles.loading")}</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
            <FontAwesomeIcon icon={faUserShield} />
            {t("roles.title")}
          </h1>
          <p className="text-sm text-slate-500">
            {t("roles.description")}
          </p>
        </div>
        {hasPermission("CREATE_ROLES") && (
          <Link
            to="/settings/roles/create"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-xl shadow hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faPlus} />
            {t("roles.create_new")}
          </Link>
        )}
      </div>

      {/* Roles Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">{t("departments.number")}</th>
                <th className="px-4 py-3">{t("roles.name")}</th>
                <th className="px-4 py-3">{t("roles.description")}</th>
                <th className="px-4 py-3 text-right">{t("users.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roles.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    {t("roles.not_found")}
                  </td>
                </tr>
              ) : (
                roles.map((role, index) => (
                  <tr
                    key={role.id}
                    className="transition-colors duration-150 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-slate-800 font-medium">
                      {role.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {role.description || "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        {hasPermission("UPDATE_PERMISSIONS") && (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/settings/roles/${role.id}/permissions`)
                            }
                            className="inline-flex items-center justify-center h-8 px-3 rounded-lg
                                     text-indigo-600 bg-indigo-50 hover:bg-indigo-100
                                     transition-colors text-xs font-medium"
                          >
                            <FontAwesomeIcon icon={faKey} className="mr-1" />
                            {t("roles.permissions")}
                          </button>
                        )}
                        {hasPermission("DISABLE_ROLES") && (
                          <button
                            type="button"
                            onClick={() => handleDisable(role.id)}
                            className="inline-flex items-center justify-center h-8 px-3 rounded-lg
                                     text-red-600 bg-red-50 hover:bg-red-100
                                     transition-colors text-xs font-medium"
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-1" />
                            {t("roles.disable")}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 text-xs text-slate-500 bg-slate-50 flex justify-between items-center">
          <span>
            Showing {roles.length} roles
          </span>
          <span className="text-slate-400">Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};

export default RoleList;
