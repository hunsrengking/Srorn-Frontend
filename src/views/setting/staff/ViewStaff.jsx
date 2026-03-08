import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faArrowLeft,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

const ViewStaff = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const res = await axiosClient.get(`/api/staff/${id}`);
        setStaff(res.data);
      } catch (err) {
        console.error(err);
        setError(t("staff.load_failed"));
      } finally {
        setLoading(false);
      }
    };

    loadStaff();
  }, [id]);

  if (loading) {
    return (
      <div className="text-sm text-slate-500">{t("staff.loading")}</div>
    );
  }

  if (error || !staff) {
    return (
      <div className="text-sm text-red-500">{error || t("staff.not_found")}</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm
                      flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
            <FontAwesomeIcon icon={faUserTie} />
            {t("staff.view_title")}
          </h1>
          <p className="text-sm text-slate-500">
            {t("staff.view_desc")}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/settings/employees/${id}/edit`)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm
                       bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faEdit} />
            {t("common.edit")}
          </button>

          <button
            onClick={() => navigate("/settings/employees")}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm
                       border border-slate-300 rounded-xl text-slate-600
                       hover:bg-slate-100"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            {t("checker.back")}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">

          <Info label={t("staff.external_id")} value={staff.external_id} />
          <Info label={t("staff.display_name")} value={staff.display_name} />

          <Info label={t("staff.first_name")} value={staff.firstname} />
          <Info label={t("staff.last_name")} value={staff.lastname} />

          <Info label={t("staff.mobile_no")} value={staff.mobile_no} />
          <Info
            label={t("staff.join_date")}
            value={
              staff.join_on_date
                ? staff.join_on_date.substring(0, 10)
                : "-"
            }
          />

          <Info
            label={t("staff.position")}
            value={staff.position_title || "-"}
          />

          <Info
            label={t("staff.status")}
            value={staff.is_active ? t("staff.active") : t("staff.inactive")}
          />
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-slate-500 mb-1">{label}</p>
    <p className="text-sm font-medium text-slate-900">
      {value || "-"}
    </p>
  </div>
);

export default ViewStaff;
