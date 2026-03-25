import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import OfficeForm from "./OfficeForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../../services/axiosClient";
import { useError } from "../../../context/ErrorContext";

const OfficeCreate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showSuccess, showError } = useError();

  const [formData, setFormData] = useState({
    name: "",
    external_id: "",
    is_active: true,
    is_delete: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosClient.post("/api/offices", formData);
      showSuccess(t("office.create_success", "Office created successfully"));
      navigate("/organization/office");
    } catch (err) {
      console.error("Create office error:", err);
      showError(
        err?.response?.data?.message || err?.message ||
          t("office.create_failed", "Failed to create office")
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
          <FontAwesomeIcon icon={faBuilding} className="text-blue-600" />
          {t("office.create_title")}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {t("office.description")}
        </p>
      </div>

      <OfficeForm
        isEdit={false}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/organization/office")}
      />
    </div>
  );
};

export default OfficeCreate;
