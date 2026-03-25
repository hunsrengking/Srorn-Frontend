// src/views/settings/users/Users.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faTicket } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../utils/formatdate";
import { useError } from "../../context/ErrorContext";

const PAGE_SIZE = 15;

const Ticket = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const location = useLocation();
  const { showSuccess } = useError();

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get("/api/ticket");
      const data = res?.data ?? res;
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading tickets:", err);
      setError(t("tickets.load_failed", "Failed to load tickets. Please try again."));
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadTickets]);

  const handleAddTicket = () => navigate("/ticket/create");
  const handleViewTicket = (id) => navigate(`/ticket/views/${id}`);

  const statusBadgeClasses = (status) => {
    switch ((status || "").toLowerCase()) {
      case "open":
        return "bg-emerald-50 text-emerald-700 border border-emerald-100";
      case "in progress":
        return "bg-blue-50 text-blue-700 border border-blue-100";
      case "resolved":
        return "bg-violet-50 text-violet-700 border border-violet-100";
      case "closed":
        return "bg-slate-100 text-slate-700 border border-slate-200";
      default:
        return "bg-slate-50 text-slate-600 border border-slate-100";
    }
  };

  const statusDotClasses = (status) => {
    switch ((status || "").toLowerCase()) {
      case "open":
        return "bg-emerald-500";
      case "in progress":
        return "bg-blue-500";
      case "resolved":
        return "bg-violet-500";
      case "closed":
        return "bg-slate-500";
      default:
        return "bg-slate-400";
    }
  };

  const q = searchTerm.trim().toLowerCase();
  const filteredTickets = tickets.filter((t) => {
    if (!q) return true;
    return (
      (t.title ?? "").toLowerCase().includes(q) ||
      (t.status_name ?? "").toLowerCase().includes(q) ||
      (t.priority_name ?? "").toLowerCase().includes(q) ||
      (t.category_name ?? "").toLowerCase().includes(q) ||
      (t.assigned_to_name ?? "").toLowerCase().includes(q)
    );
  });

  // ✅ PAGINATION LOGIC (ONLY ADDITION)
  const totalPages = Math.ceil(filteredTickets.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedTickets = filteredTickets.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
              <FontAwesomeIcon icon={faTicket} />
              {t("tickets.title")}
            </h1>
            <p className="text-sm text-slate-500">{t("tickets.management")}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <FontAwesomeIcon icon={faSearch} className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder={t("tickets.search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl
                  focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
                  placeholder:text-slate-400 outline-none"
              />
            </div>

            <button
              onClick={handleAddTicket}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm
                font-medium rounded-xl bg-blue-600 text-white shadow-sm
                hover:bg-blue-700 focus:outline-none focus:ring-2
                focus:ring-blue-500/50"
            >
              <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
              {t("tickets.add_new")}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">{t("tickets.id")}</th>
                <th className="px-4 py-3">{t("tickets.title")}</th>
                <th className="px-4 py-3">{t("tickets.category")}</th>
                <th className="px-4 py-3">{t("tickets.priority")}</th>
                <th className="px-4 py-3">{t("tickets.status")}</th>
                <th className="px-4 py-3">{t("tickets.assigned_to")}</th>
                <th className="px-4 py-3">{t("tickets.created_at")}</th>
                <th className="px-4 py-3">{t("tickets.start_date")}</th>
                <th className="px-4 py-3">{t("tickets.end_date")}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    {t("tickets.loading")}
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-sm text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : paginatedTickets.length > 0 ? (
                paginatedTickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => handleViewTicket(t.id)}
                    className="transition-colors duration-150 hover:bg-slate-50 cursor-pointer"
                  >
                    <td className="px-4 py-3 text-slate-700 font-medium">{t.id}</td>
                    <td className="px-4 py-3 text-slate-800 font-medium">{t.title ?? "-"}</td>
                    <td className="px-4 py-3 text-slate-700">{t.category ?? "-"}</td>
                    <td className="px-4 py-3 text-slate-700">{t.priority ?? "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusBadgeClasses(
                          t.status
                        )}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusDotClasses(
                            t.status
                          )}`}
                        />
                        {t.status ?? "Unknown"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{t.assigned_to ?? "-"}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(t.create_date)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(t.start_date)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(t.end_date)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    {t("tickets.not_found")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ PAGINATION UI */}
        <div className="px-4 py-3 bg-slate-50 flex justify-between items-center text-sm">
          <span className="text-slate-500">
            {t("tickets.pagination_showing", {
              start: paginatedTickets.length,
              total: filteredTickets.length,
            })}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 rounded-lg border disabled:opacity-50"
            >
              {t("tickets.pagination_prev")}
            </button>

            <span className="px-2 text-slate-600">
              {t("tickets.pagination_page", {
                current: page,
                total: totalPages || 1,
              })}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded-lg border disabled:opacity-50"
            >
              {t("tickets.pagination_next")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
