import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import staffService from "@/services/staffService";
import printCardService from "@/services/printCardService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faArrowLeft,
  faEdit,
  faAddressCard,
  faCalendarDay,
  faUser,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/utils/formatdate";

const ViewStaff = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [staff, setStaff] = useState(null);
  const [printCards, setPrintCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pcLoading, setPcLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPrintCards = useCallback(async () => {
    try {
      setPcLoading(true);
      const res = await printCardService.getPrintCards({
        entry_id: id,
        entity_type: "staff",
      });
      setPrintCards(res.data || []);
    } catch (err) {
      console.error("Error loading print cards:", err);
      setPrintCards([]);
    } finally {
      setPcLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        setLoading(true);
        const res = await staffService.getStaffById(id);
        setStaff(res.data);
      } catch (err) {
        console.error(err);
        setError(t("staff.load_failed"));
      } finally {
        setLoading(false);
      }
    };

    loadStaff();
    loadPrintCards();
  }, [id, t, loadPrintCards]);

  if (loading) {
    return <div className="text-sm text-slate-500">{t("staff.loading")}</div>;
  }

  if (error || !staff) {
    return (
      <div className="text-sm text-red-500">
        {error || t("staff.not_found")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
            <FontAwesomeIcon icon={faUserTie} />
            {t("staff.view_title")}
          </h1>
          <p className="text-sm text-slate-500">{t("staff.view_desc")}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate(`/printcard/${id}/staff`)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm
                       border border-slate-200 rounded-xl text-slate-600
                       hover:bg-slate-50 transition-colors"
          >
            <FontAwesomeIcon icon={faAddressCard} />
            PrintCard
          </button>

          <button
            onClick={() => navigate(`/settings/employees/${id}/edit`)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm
                       bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <FontAwesomeIcon icon={faEdit} />
            {t("common.edit")}
          </button>
        </div>
      </div>

      {/* ── Staff Info Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl">
              <FontAwesomeIcon icon={faUserTie} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              {staff.display_name ||
                `${staff.firstname || ""} ${staff.lastname || ""}`.trim() ||
                "-"}
            </h2>
            <p className="text-sm text-slate-500">
              {staff.position_title || "Staff"}
            </p>
            <span
              className={`mt-4 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                ${
                  staff.is_active
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "bg-red-50 text-red-700 border border-red-100"
                }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${staff.is_active ? "bg-emerald-500" : "bg-red-500"}`}
              />
              {staff.is_active ? t("staff.active") : t("staff.inactive")}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            <Info label={t("staff.external_id")} value={staff.external_id} />
            <Info label={t("staff.position")} value={staff.position_title} />
            <Info label={t("staff.first_name")} value={staff.firstname} />
            <Info label={t("staff.last_name")} value={staff.lastname} />
            <Info label={t("staff.display_name")} value={staff.display_name} />
            <Info label={t("staff.mobile_no")} value={staff.mobile_no} />
            <Info
              label={t("staff.join_date")}
              value={
                staff.join_on_date ? staff.join_on_date.substring(0, 10) : "-"
              }
            />
          </div>
        </div>
      </div>

      {/* ── Print Card Transactions Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
              <FontAwesomeIcon icon={faAddressCard} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Print Card Transactions
              </h2>
              <p className="text-xs text-slate-400">
                All issued cards for this staff member
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg">
            {printCards.length} Record{printCards.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Print Date</th>
                <th className="px-5 py-3">Seller By</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pcLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-sm text-slate-400"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Loading transactions...
                    </div>
                  </td>
                </tr>
              ) : printCards.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <FontAwesomeIcon
                        icon={faAddressCard}
                        className="text-3xl opacity-30"
                      />
                      <p className="text-sm">No print card records found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                printCards.map((card, idx) => (
                  <tr
                    key={card.id}
                    onClick={() =>
                      navigate(`/organization/printcard/${card.id}`)
                    }
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3 text-slate-500 font-mono text-xs">
                      {idx + 1}
                    </td>
                    <td className="px-5 py-3 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <FontAwesomeIcon
                          icon={faCalendarDay}
                          className="text-slate-400 text-xs"
                        />
                        {formatDate(card.print_date)}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="text-slate-400 text-xs"
                        />
                        {card.seller_name || "-"}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          card.is_print_card
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${card.is_print_card ? "bg-emerald-500" : "bg-slate-400"}`}
                        />
                        {card.is_print_card ? "Printed" : "Pending"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500 max-w-xs">
                      <span className="line-clamp-1">
                        {card.description || "-"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/organization/printcard/${card.id}/edit`);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs
                                   text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors"
                      >
                        <FontAwesomeIcon icon={faPen} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {printCards.length > 0 && (
          <div className="px-5 py-3 text-xs text-slate-400 bg-slate-50 border-t border-slate-100">
            Showing {printCards.length} transaction
            {printCards.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-slate-500 mb-1">{label}</p>
    <p className="text-sm font-medium text-slate-900">{value || "-"}</p>
  </div>
);

export default ViewStaff;
