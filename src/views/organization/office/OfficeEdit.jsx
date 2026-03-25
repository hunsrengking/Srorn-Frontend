import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import OfficeForm from "./OfficeForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../../services/axiosClient";
import { useError } from "../../../context/ErrorContext";

const OfficeEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useError();

  const [formData, setFormData] = useState({
    name: "",
    external_id: "",
    is_active: true,
    is_delete: false,
  });

  useEffect(() => {
    const loadOffice = async () => {
      try {
        const res = await axiosClient.get(`/api/offices/${id}`);
        setFormData({
          name: res.data.name ?? "",
          external_id: res.data.external_id ?? "",
          is_active: res.data.is_active ?? true,
          is_delete: res.data.is_delete ?? false,
        });
      } catch (err) {
        console.error("Load office error:", err);
        showError(t("office.load_failed"));
      }
    };

    loadOffice();
  }, [id, t, showError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosClient.put(`/api/offices/${id}`, formData);
      showSuccess(t("office.update_success", "Office updated successfully"));
      navigate("/organization/office");
    } catch (err) {
      console.error("Update office error:", err);
      showError(
        err?.response?.data?.message || err?.message ||
          t("office.update_failed", "Failed to update office")
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
          <FontAwesomeIcon icon={faBuilding} className="text-blue-600" />
          {t("office.edit_title")}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {t("office.description")}
        </p>
      </div>

      <OfficeForm
        isEdit={true}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/organization/office")}
      />
    </div>
  );
};

export default OfficeEdit;
