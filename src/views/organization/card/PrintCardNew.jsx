import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../../services/axiosClient";
import PrintCardForm from "./PrintCardForm";

const PrintCardNew = () => {
  const navigate = useNavigate();

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
      navigate("/settings/employees");
    } catch (err) {
      console.error("Create staff error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
          <FontAwesomeIcon icon={faAddressCard} />
          Print Card New
        </h1>
        <p className="text-sm text-slate-500">
          Print employee and student cards. Fill in the details to create a new card for an employee or student.
        </p>
      </div>

      <PrintCardForm
        isEdit={false}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/organization/printcard")}
      />
    </div>
  );
};

export default PrintCardNew;
