import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faEdit,
  faTrash,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import { hasPermission } from "../../../utils/permission";
import axiosClient from "../../../services/axiosClient";
import { errorService } from "../../../services/errorService";

const Office = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadOffices = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get("/api/offices");
      setOffices(res.data || []);
    } catch (err) {
      console.error("Error loading office:", err);
      setError(t("office.load_failed"));
      setOffices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffices();
    if (location.state?.message) {
      errorService.success(location.state.message);
    }
  }, [location.state?.message]);

  const handleAddOffice = () => {
    navigate("/organization/office/create");
  };

  const handleEditOffice = (id) => {
    navigate(`/organization/office/${id}/edit`);
  };

  const handleDeleteOffice = async (id) => {
    if (!window.confirm(t("office.delete_confirm"))) return;

    try {
      await axiosClient.delete(`/api/offices/${id}`);
      setOffices((prev) => prev.filter((s) => s.id !== id));
      errorService.success(t("office.delete_success"));
    } catch (err) {
      console.error("Error deleting office:", err);
      errorService.error(t("office.delete_failed"));
    }
  };

  const handleViewOffice = (id) => {
    navigate(`/organization/office/${id}/view`);
  };

  const filteredOffices = offices.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.external_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
              <FontAwesomeIcon icon={faBuilding} className="text-blue-600 text-lg" />
              {t("office.title")}
            </h1>
            <p className="text-sm text-slate-500 mt-1.5 ml-[28px]">
              {t("office.description")}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-80 group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <FontAwesomeIcon icon={faSearch} className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder={t("office.search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl
                           bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100/50 
                           focus:border-blue-500 placeholder:text-slate-400 outline-none transition-all"
              />
            </div>

            {hasPermission("CREATE_OFFICE") && (
              <button
                onClick={handleAddOffice}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm
                         font-semibold rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200
                         hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-[0.98]"
              >
                <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                <span>{t("office.add_new")}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">{t("office.name")}</th>
                <th className="px-4 py-3">{t("office.external_id", "External ID")}</th>
                <th className="px-4 py-3">{t("office.status")}</th>
                <th className="px-4 py-3 text-right">{t("users.actions")}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                   <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    {t("office.loading")}
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-red-500"
                  >
                    {error}
                    <button
                      onClick={loadOffices}
                      className="ml-2 text-blue-600 hover:text-blue-800 underline"
                    >
                      {t("common.retry")}
                    </button>
                  </td>
                </tr>
              ) : filteredOffices.length > 0 ? (
                filteredOffices.map((s) => (
                  <tr
                    key={s.id}
                    onClick={
                      hasPermission("VIEW_OFFICE")
                        ? () => handleViewOffice(s.id)
                        : undefined
                    }
                    className={`transition-colors duration-150
                      ${hasPermission("VIEW_OFFICE")
                        ? "hover:bg-slate-50 cursor-pointer"
                        : "cursor-not-allowed opacity-60"
                      }`}
                  >
                    <td className="px-4 py-3 text-slate-700 font-medium">#{s.id}</td>
                    <td className="px-4 py-3 text-slate-800 font-medium">{s.name || "-"}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                        {s.external_id || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                          ${s.is_active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-red-50 text-red-700 border border-red-100"
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5
                            ${s.is_active ? "bg-emerald-500" : "bg-red-500"
                            }`}
                        />
                        {s.is_active ? t("office.active") : t("office.inactive")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div
                        className="inline-flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {hasPermission("UPDATE_OFFICE") && (
                          <button
                            onClick={() => handleEditOffice(s.id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                     text-slate-500 hover:text-blue-600 hover:bg-blue-50
                                     transition-colors"
                          >
                            <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                          </button>
                        )}
                        {hasPermission("DELETE_OFFICE") && (
                          <button
                            onClick={() => handleDeleteOffice(s.id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                     text-slate-500 hover:text-red-600 hover:bg-red-50
                                     transition-colors"
                          >
                            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    {t("office.not_found")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 text-xs text-slate-500 bg-slate-50 flex justify-between items-center">
          <span>
             {t("office.showing", { filtered: filteredOffices.length, total: offices.length })}
          </span>
          <span className="text-slate-400">Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};

export default Office;
