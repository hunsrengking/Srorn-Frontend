// src/views/settings/positions/Position.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axiosClient from "../../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useError } from "../../..//context/ErrorContext";

const Position = () => {
  const { t } = useTranslation();
  // ================= STATE =================
  const [positionId, setPositionId] = useState(null);

  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [positions, setPositions] = useState([]);

  // ================= FETCH =================
  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setLoadingList(true);
      const res = await axiosClient.get("api/positions");
      setPositions(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  };

  // ================= SAVE / UPDATE =================
  const { showSuccess, showError } = useError();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title,
        level,
        min_salary: minSalary,
        max_salary: maxSalary,
        is_active: isActive,
      };

      if (positionId) {
        await axiosClient.put(`/api/positions/${positionId}`, payload);
        showSuccess(t("positions.update_success"));
      } else {
        await axiosClient.post("/api/positions", payload);
        showSuccess(t("positions.create_success"));
      }

      resetForm();
      fetchPositions();
    } catch (err) {
      console.error(err);
      showError(
        err?.response?.data?.message || err?.message ||
          t("positions.save_failed")
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= SELECT ROW =================
  const handleSelectRow = (item) => {
    setPositionId(item.id);
    setTitle(item.title);
    setLevel(item.level);
    setMinSalary(item.min_salary);
    setMaxSalary(item.max_salary);
    setIsActive(!!item.is_active);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm(t("positions.delete_confirm"))) return;

    try {
      await axiosClient.delete(`/api/positions/${id}`);
      showSuccess(t("positions.delete_success"));
      fetchPositions();

      if (positionId === id) resetForm();
    } catch (err) {
      console.error(err);
      showError(
        err?.response?.data?.message || err?.message ||
          t("positions.delete_failed")
      );
    }
  };

  // ================= RESET =================
  const resetForm = () => {
    setPositionId(null);
    setTitle("");
    setLevel("");
    setMinSalary("");
    setMaxSalary("");
    setIsActive(true);
  };

  // ================= UI =================
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <FontAwesomeIcon icon={faBriefcase} />
          {t("positions.title")}
        </h1>
        <p className="text-sm text-slate-500">
          {t("positions.edit_info")}
        </p>
      </div>

      {/* FORM + LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* FORM (SMALL) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm space-y-4"
        >
          <div>
            <label className="text-sm">{t("positions.job_title")}</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full mt-1 border rounded-xl p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="text-sm">{t("positions.level")}</label>
            <input
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
              placeholder={t("positions.level_example")}
              className="w-full mt-1 border rounded-xl p-2.5 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">{t("positions.min_salary")}</label>
              <input
                type="number"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                required
                className="w-full mt-1 border rounded-xl p-2.5 text-sm"
              />
            </div>

            <div>
              <label className="text-sm">{t("positions.max_salary")}</label>
              <input
                type="number"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
                required
                className="w-full mt-1 border rounded-xl p-2.5 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{t("positions.active")}</span>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative h-6 w-11 rounded-full ${
                isActive ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 bg-white rounded-full transition ${
                  isActive ? "left-5" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="flex gap-3">
            <button
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl"
            >
              {positionId ? t("positions.update") : t("common.save")}
            </button>

            {positionId && (
              <button
                type="button"
                onClick={resetForm}
                className="border px-4 py-2 rounded-xl"
              >
                {t("positions.clear")}
              </button>
            )}
          </div>
        </form>

        {/* LIST (BIG) */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-semibold">{t("positions.list_title")}</h2>
          </div>

          {loadingList ? (
            <div className="p-8 text-center text-sm text-slate-400">
              {t("common.loading")}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3">{t("positions.job_title")}</th>
                    <th className="px-4 py-3">{t("positions.level")}</th>
                    <th className="px-4 py-3">{t("positions.salary")}</th>
                    <th className="px-4 py-3">{t("positions.status")}</th>
                    <th className="px-4 py-3 text-right">{t("users.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {positions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                        {t("positions.not_found")}
                      </td>
                    </tr>
                  ) : (
                    positions.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => handleSelectRow(item)}
                        className={`transition-colors duration-150 cursor-pointer 
                          ${positionId === item.id ? "bg-blue-50" : "hover:bg-slate-50"}`}
                      >
                        <td className="px-4 py-3 text-slate-700 font-medium">{item.title}</td>
                        <td className="px-4 py-3 text-slate-600">{item.level}</td>
                        <td className="px-4 py-3 text-slate-600">
                          ${item.min_salary} - ${item.max_salary}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                              ${item.is_active
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-red-50 text-red-700 border border-red-100"
                              }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1.5
                                ${item.is_active ? "bg-emerald-500" : "bg-red-500"}`}
                            />
                            {item.is_active ? t("positions.active") : t("staff.inactive")}
                          </span>
                        </td>
                        <td
                          className="px-4 py-3 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                     text-slate-500 hover:text-red-600 hover:bg-red-50
                                     transition-colors"
                          >
                            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          <div className="px-4 py-3 text-xs text-slate-500 bg-slate-50 mt-auto border-t border-slate-100">
            Showing {positions.length} positions
          </div>
        </div>
      </div>
    </div>
  );
};

export default Position;
