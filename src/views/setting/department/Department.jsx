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
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        {departments.length === 0 ? (
          <p className="text-sm text-slate-500">{t("departments.not_found")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="py-2 pr-4">{t("departments.number")}</th>
                  <th className="py-2 pr-4">{t("departments.name")}</th>
                  <th className="py-2 pr-4">{t("departments.description")}</th>
                  <th className="py-2 pr-4 text-right">{t("common.edit")}</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept, index) => (
                  <tr
                    key={dept.id}
                    className="border-b last:border-b-0 hover:bg-slate-50"
                  >
                    <td className="py-2 pr-4">{index + 1}</td>
                    <td className="py-2 pr-4 font-medium text-slate-800">
                      {dept.name}
                    </td>
                    <td className="py-2 pr-4 text-slate-600">
                      {dept.description || "-"}
                    </td>
                    <td className="py-2 pr-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/settings/department/${dept.id}/members`)
                          }
                          className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center gap-1"
                        >
                          <FontAwesomeIcon icon={faUsers} />
                          {t("departments.members")}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDisable(dept.id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-1"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                          {t("departments.disable")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentList;
