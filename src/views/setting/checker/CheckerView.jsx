// src/views/settings/users/CheckerView.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../../utils/formatdate";
import { hasPermission } from "../../../utils/permission";
import { useError } from "../../../context/ErrorContext";

const TicketCheckerView = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useError();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTicket = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/api/ticket/${id}`);
      setTicket(res.data);
    } catch (err) {
      console.error("Failed to load ticket:", err);
      setError(t("checker.load_error", "Failed to load ticket details."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, [id]);

  const updateStatus = async (action) => {
    if (action === "approve") {
      if (!window.confirm(t("checker.approve_confirm_single"))) return;
    } else {
      if (!window.confirm(t("checker.reject_confirm_single"))) return;
    }

    try {
      setActionLoading(true);

      await axiosClient.patch(`/api/ticket/${id}/${action}`);

      showSuccess(t("checker.status_updated"));
      navigate("/checkermaker");
      await loadTicket(); // reload fresh data
    } catch (err) {
      console.error(err.response?.data || err);
      showError(err.response?.data?.detail || t("checker.update_failed"));
    } finally {
      setActionLoading(false);
    }
  };
  const deleteTicket = async () => {
    if (!window.confirm(t("checker.delete_confirm_single"))) {
      return;
    }

    try {
      setActionLoading(true);
      await axiosClient.delete(`/api/ticket/${id}`);
      showSuccess(t("checker.ticket_deleted"));
      navigate("/checkermaker");
    } catch (err) {
      console.error("Delete failed:", err);
      showError(t("positions.delete_failed", "Failed to delete ticket."));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500">
        {t("checker.loading_details")}
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-10 text-center text-slate-500">{t("checker.not_found_single")}</div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="text-sm flex items-center gap-2 px-3 py-2 rounded-xl border bg-slate-50 hover:bg-slate-100"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          {t("checker.back")}
        </button>

        <div className="flex gap-2">
          {hasPermission("APPROVE_CHEKER") && (
            <button
              onClick={() => updateStatus("approve")}
              disabled={actionLoading}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-sm"
            >
              <FontAwesomeIcon icon={faCheck} className="mr-1" /> {t("checker.approve")}
            </button>
          )}

          {hasPermission("REJECT_CHEKER") && (
            <button
              onClick={() => updateStatus("reject")}
              disabled={actionLoading}
              className="px-4 py-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700 text-sm"
            >
              <FontAwesomeIcon icon={faXmark} className="mr-1" /> {t("checker.reject")}
            </button>
          )}

          {/* ✅ FIXED DELETE BUTTON */}
          {hasPermission("DELETE_CHEKER") && (
            <button
              onClick={deleteTicket}
              disabled={actionLoading}
              className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 text-sm"
            >
              <FontAwesomeIcon icon={faXmark} className="mr-1" /> {t("checker.delete")}
            </button>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          {t("checker.view_title", { id: ticket.id })}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500">{t("checker.subject")}</p>
            <p className="font-medium text-slate-800">{ticket.subject}</p>
          </div>

          <div>
            <p className="text-slate-500">{t("checker.category")}</p>
            <p className="font-medium text-slate-800">{ticket.category}</p>
          </div>

          <div>
            <p className="text-slate-500">{t("checker.priority")}</p>
            <p className="font-medium text-slate-800">{ticket.priority}</p>
          </div>

          <div>
            <p className="text-slate-500">{t("checker.status")}</p>
            <p className="font-medium text-slate-800">{ticket.status}</p>
          </div>

          <div>
            <p className="text-slate-500">{t("tickets.created_by", "Created By")}</p>
            <p className="font-medium text-slate-800">{ticket.created_by}</p>
          </div>

          <div>
            <p className="text-slate-500">{t("checker.assigned_to")}</p>
            <p className="font-medium text-slate-800">{ticket.assigned_to}</p>
          </div>

          <div>
            <p className="text-slate-500">{t("checker.created_at")}</p>
            <p className="font-medium text-slate-800">
              {formatDate(ticket.created_at)}
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-slate-500">{t("tickets.description")}</p>
          <p className="mt-1 text-slate-700 whitespace-pre-wrap">
            {ticket.description || t("common.no_data")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicketCheckerView;
