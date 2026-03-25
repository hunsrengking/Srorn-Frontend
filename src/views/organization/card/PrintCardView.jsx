import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faArrowLeft,
  faEdit,
  faPrint,
  faUser,
  faBriefcase,
  faCalendarDay,
  faUserTag,
  faLayerGroup
} from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../../services/axiosClient";
import { formatDate } from "../../../utils/formatdate";

const PrintCardView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [printCard, setPrintCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const colors = {
    1: { label: "Red", class: "bg-red-500" },
    2: { label: "Green", class: "bg-green-500" },
    3: { label: "Blue", class: "bg-blue-500" },
    4: { label: "Yellow", class: "bg-yellow-500" },
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/api/organization/printcards/${id}`);
        setPrintCard(res.data);
      } catch (err) {
        console.error("Load print card error:", err);
        setError(t("print_card.load_failed", "Failed to load print card"));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, t]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="text-sm text-slate-500">{t("common.loading", "Loading details...")}</p>
      </div>
    );
  }

  if (error || !printCard) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">!</div>
        <p className="text-sm font-medium">{error || t("print_card.not_found")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Actions */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
            <FontAwesomeIcon icon={faAddressCard} className="text-blue-600" />
            {t("print_card.detail_title", "Print Card Details")}
          </h1>
          <p className="text-sm text-slate-500">
            {t("print_card.view_desc", "View full details of the issued card")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/organization/printcard/${id}/edit`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold text-sm shadow-md"
          >
            <FontAwesomeIcon icon={faEdit} />
            {t("common.edit", "Edit Card")}
          </button>
          <button
            onClick={() => navigate("/organization/printcard")}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-semibold text-sm"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            {t("checker.back", "Back")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Visual Card Preview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 text-white shadow-2xl h-[450px] flex flex-col items-center justify-center border-4 border-white/20">
            {/* Holographic effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>

            <div className="relative z-10 w-32 h-32 rounded-full border-4 border-white/30 p-1 mb-6 shadow-xl overflow-hidden bg-white/10 flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-5xl opacity-80" />
            </div>

            <div className="relative z-10 text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">{printCard.person_name}</h2>
              <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-widest border border-white/20">
                {printCard.position_name}
              </div>
            </div>

            <div className="absolute bottom-10 left-0 right-0 px-8 flex justify-between items-end opacity-60">
              <div className="text-[10px] font-mono leading-tight">
                <p>CARD REF: #{printCard.id.toString().padStart(5, '0')}</p>
                <p>ISSUED: {formatDate(printCard.print_date)}</p>
              </div>
              <FontAwesomeIcon icon={faAddressCard} className="text-4xl" />
            </div>

            {/* Status Batch */}
            <div className="absolute top-6 right-6">
              {printCard.is_print_card ? (
                <div className="bg-emerald-400/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-[10px] px-3 py-1 rounded-lg font-bold">
                  ACTIVE CARD
                </div>
              ) : (
                <div className="bg-zinc-400/20 backdrop-blur-md border border-zinc-400/30 text-zinc-300 text-[10px] px-3 py-1 rounded-lg font-bold">
                  INACTIVE
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
            <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faUserTag} />
              {t("print_card.issued_by", "Issued By")}
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-bold">
                {printCard.seller_name?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{printCard.seller_name}</p>
                <p className="text-xs text-slate-500">Authorized Seller</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-8 border-b border-slate-100 pb-4">
              <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
              <h2 className="text-xl font-bold text-slate-800">{t("print_card.information", "Core Information")}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <DetailItem
                icon={faUser}
                label={t("person.name", "Full Name")}
                value={printCard.person_name}
              />
              <DetailItem
                icon={faBriefcase}
                label={t("person.position", "Role / Position")}
                value={printCard.position_name}
              />
              <DetailItem
                icon={faCalendarDay}
                label={t("print_card.print_date", "Date Issued")}
                value={formatDate(printCard.print_date)}
              />
              <DetailItem
                icon={faLayerGroup}
                label={t("print_card.entry_id", "Database Entry ID")}
                value={`ENT-${printCard.entry_id}`}
              />
            </div>

            {printCard.description && (
              <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t("departments.description", "Remarks")}</p>
                <p className="text-slate-600 leading-relaxed italic">"{printCard.description}"</p>
              </div>
            )}
          </div>

          {/* Cable Mappings */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-slate-800">{t("print_card.cable_details", "Cable & Quantity")}</h2>
              </div>
              {printCard.mappings?.length > 0 && (
                <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-lg">
                  {printCard.mappings.length} {t("print_card.items", "Items")}
                </span>
              )}
            </div>

            {printCard.mappings && printCard.mappings.length > 0 ? (
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">{t("print_card.cable_color", "Color")}</th>
                      <th className="px-4 py-3 text-right">{t("print_card.quantity", "Quantity")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {printCard.mappings.map((m, idx) => (
                      <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4 text-xs text-slate-400 font-mono">{idx + 1}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${colors[m.cable_color_id]?.class || 'bg-slate-200'} shadow-sm border-2 border-white`} />
                            <span className="text-sm font-semibold text-slate-700">
                              {colors[m.cable_color_id]?.label || `Color ID: ${m.cable_color_id}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold">
                            {m.quantity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50/50">
                      <td colSpan="2" className="px-4 py-4 text-sm font-bold text-slate-600">{t("print_card.total_qty", "Total Distributed")}</td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-xl font-extrabold text-blue-600">
                          {printCard.mappings.reduce((sum, m) => sum + m.quantity, 0)}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-10 bg-slate-50 rounded-[1.5rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 text-sm italic">{t("print_card.no_cables", "No cable data available for this card.")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex gap-4 group">
    <div className="w-12 h-12 shrink-0 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:border-blue-100 transition-all">
      <FontAwesomeIcon icon={icon} />
    </div>
    <div className="flex flex-col justify-center">
      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-bold text-slate-700">{value || "-"}</p>
    </div>
  </div>
);

export default PrintCardView;