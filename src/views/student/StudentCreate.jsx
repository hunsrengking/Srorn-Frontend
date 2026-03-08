// src/views/settings/Student/StudentCreate.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useError } from "../../context/ErrorContext";
import axiosClient from "../../services/axiosClient";
import StudentForm from "./StudentForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGraduate } from "@fortawesome/free-solid-svg-icons";

const StudentCreate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    khmer_firstname: "",
    khmer_lastname: "",
    is_active: true,
  });

  const { showSuccess, showError } = useError();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      khmer_firstname: formData.khmer_firstname || null,
      khmer_lastname: formData.khmer_lastname || null,
      is_active: formData.is_active,
    };

    try {
      await axiosClient.post("/api/students", payload);

      showSuccess(t("Student.create_success"));

      navigate("/students");
    } catch (err) {
      console.error(err);

      showError(
        err?.response?.data?.message ||
          err?.message ||
          t("Student.create_failed")
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
          <FontAwesomeIcon icon={faUserGraduate} />
          {t("Student.create_title")}
        </h1>

        <p className="text-sm text-slate-500">
          {t("Student.description")}
        </p>
      </div>

      <StudentForm
        isEdit={false}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/students")}
      />
    </div>
  );
};

export default StudentCreate;