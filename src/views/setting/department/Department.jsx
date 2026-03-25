// src/views/settings/department/Department.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faPlus,
  faUsers,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { errorService } from "../../../services/errorService";

const DepartmentList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDepartments = async () => {
    try {
      const res = await axiosClient.get("/api/department");
      setDepartments(res.data || []);
    } catch (err) {
      console.error("Error loading departments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleDisable = async (id) => {
    if (!window.confirm(t("departments.disable_confirm"))) return;

    try {
      await axiosClient.delete(`/api/department/${id}`);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
      errorService.success(t("departments.disable_success", "Department disabled successfully"));
    } catch (err) {
      console.error("Delete department error:", err);
    }
  };

  if (loading)
    return <p className="text-sm text-slate-500">{t("departments.loading")}</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
            <FontAwesomeIcon icon={faBuilding} />
            {t("departments.title")}
          </h1>
          <p className="text-sm text-slate-500">
            {t("departments.description")}
          </p>
        </div>

        <Link
          to="/settings/department/create"
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-xl shadow hover:bg-blue-700"
        >
          <FontAwesomeIcon icon={faPlus} />
          {t("departments.create_new")}
        </Link>
      </div>

      {/* Departments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">{t("departments.number")}</th>
                <th className="px-4 py-3">{t("departments.name")}</th>
                <th className="px-4 py-3">{t("departments.description")}</th>
                <th className="px-4 py-3 text-right">{t("users.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departments.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    {t("departments.not_found")}
                  </td>
                </tr>
              ) : (
                departments.map((dept, index) => (
                  <tr
                    key={dept.id}
                    className="transition-colors duration-150 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-slate-700 font-medium">{index + 1}</td>
                    <td className="px-4 py-3 text-slate-800 font-medium">
                      {dept.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {dept.description || "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/settings/department/${dept.id}/members`)
                          }
                          className="inline-flex items-center justify-center h-8 px-3 rounded-lg
                                   text-indigo-600 bg-indigo-50 hover:bg-indigo-100
                                   transition-colors text-xs font-medium"
                        >
                          <FontAwesomeIcon icon={faUsers} className="mr-1" />
                          {t("departments.members")}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDisable(dept.id)}
                          className="inline-flex items-center justify-center h-8 px-3 rounded-lg
                                   text-red-600 bg-red-50 hover:bg-red-100
                                   transition-colors text-xs font-medium"
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-1" />
                          {t("departments.disable")}
                        </button>
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
            Showing {departments.length} departments
          </span>
          <span className="text-slate-400">Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};

export default DepartmentList;
