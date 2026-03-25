import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faArrowLeft,
  faEdit,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

const OfficeView = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [office, setOffice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOffice = async () => {
      try {
        const res = await axiosClient.get(`/api/offices/${id}`);
        setOffice(res.data);
      } catch (err) {
        console.error(err);
        setError(t("office.load_failed"));
      } finally {
        setLoading(false);
      }
    };

    loadOffice();
  }, [id, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-sm text-slate-500">{t("office.loading")}</span>
      </div>
    );
  }

  if (error || !office) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm">
        {error || t("office.not_found")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm
                      flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
            <FontAwesomeIcon icon={faBuilding} className="text-blue-600" />
            {office.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t("office.view_title", "Office Details")} — {office.external_id}
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => navigate(`/organization/office/${id}/edit`)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-sm
                       bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium"
          >
            <FontAwesomeIcon icon={faEdit} />
            {t("common.edit")}
          </button>

          <button
            onClick={() => navigate("/organization/office")}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-sm
                       border border-slate-300 rounded-xl text-slate-600
                       hover:bg-slate-50 transition-all font-medium"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            {t("checker.back")}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 uppercase tracking-wider text-[10px] font-bold text-slate-400">
           {t("office.information", "Information")}
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Info label={t("office.name")} value={office.name} />
            <Info label={t("office.external_id", "External ID")} value={office.external_id} />
            <Info 
              label={t("office.status")} 
              value={office.is_active ? t("office.active") : t("office.inactive")}
              isStatus
              isActive={office.is_active}
            />
            <Info 
              label={t("office.created_at", "Created At")} 
              value={office.created_at ? new Date(office.created_at).toLocaleString() : "-"} 
            />
            <Info 
              label={t("office.updated_at", "Updated At")} 
              value={office.updated_at ? new Date(office.updated_at).toLocaleString() : "-"} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value, isFullWidth, isStatus, isActive }) => (
  <div className={isFullWidth ? "sm:col-span-2 lg:col-span-3" : ""}>
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-tight mb-1">{label}</p>
    {isStatus ? (
       <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${
         isActive ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-600 border-slate-200"
       }`}>
         {value}
       </span>
    ) : (
      <p className="text-sm font-medium text-slate-800 break-words">
        {value || "-"}
      </p>
    )}
  </div>
);

export default OfficeView;
