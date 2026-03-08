import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import StaffForm from "./StaffForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../../services/axiosClient";
import { useError } from "../../../context/ErrorContext";

const StaffCreate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showSuccess, showError } = useError();

  const [formData, setFormData] = useState({
    external_id: "",
    firstname: "",
    lastname: "",
    display_name: "",
    mobile_no: "",
    join_on_date: "",
    position_id: "",
    is_active: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosClient.post("/api/staff", formData);
      showSuccess(t("staff.create_success", "Staff created successfully"));
      navigate("/settings/employees");
    } catch (err) {
      console.error("Create staff error:", err);
      showError(
        err?.response?.data?.message || err?.message ||
          t("staff.create_failed", "Failed to create staff")
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
          <FontAwesomeIcon icon={faUserTie} />
          {t("staff.create_title")}
        </h1>
        <p className="text-sm text-slate-500">
          {t("staff.create_desc")}
        </p>
      </div>

      <StaffForm
        isEdit={false}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/settings/employees")}
      />
    </div>
  );
};

export default StaffCreate;
