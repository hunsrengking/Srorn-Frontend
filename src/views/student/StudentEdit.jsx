import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import StudentForm from "./StudentForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGraduate } from "@fortawesome/free-solid-svg-icons";
import { useError } from "../../context/ErrorContext";

const StudentEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useError();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    khmer_firstname: "",
    khmer_lastname: "",
    is_active: true,
  });

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const res = await axiosClient.get(`/api/students/${id}`);

        setFormData({
          firstname: res.data.firstname || "",
          lastname: res.data.lastname || "",
          khmer_firstname: res.data.khmer_firstname || "",
          khmer_lastname: res.data.khmer_lastname || "",
          is_active: res.data.is_active ?? true,
        });
      } catch (err) {
        console.error("Error loading student:", err);
      }
    };

    loadStudent();
  }, [id]);

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
      await axiosClient.put(`/api/students/${id}`, payload);
      showSuccess(t("Student.update_success", "Student updated successfully"));
      navigate("/students");
    } catch (err) {
      console.error(err);
      showError(
        err?.response?.data?.message || err?.message ||
          t("Student.update_failed", "Failed to update student")
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
          <FontAwesomeIcon icon={faUserGraduate} />
          {t("Student.edit_title")}
        </h1>

        <p className="text-sm text-slate-500">
          {t("Student.description")}
        </p>
      </div>

      <StudentForm
        isEdit={true}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/students")}
      />
    </div>
  );
};

export default StudentEdit;