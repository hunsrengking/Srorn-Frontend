import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../../services/axiosClient";
import PrintCardForm from "./PrintCardForm";
import { useError } from "../../../context/ErrorContext";

const PrintCardNew = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showSuccess, showError } = useError();

  const [formData, setFormData] = useState({
    position_id: "",
    staff_id: "",
    seller_id: "",
    print_date: "",
    description: "",
    is_print_card: "",
    cables: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        entry_id: formData.staff_id,
        print_date: formData.print_date,
        is_print_card: Boolean(formData.is_print_card),
        seller_id: formData.seller_id,
        description: formData.description,
        mappings: (formData.cables || []).map((c) => ({
          cable_color_id: Number(c.color),
          quantity: Number(c.value),
        })),
      };

      await axiosClient.post("/api/organization/printcards", payload);

      showSuccess(
        t("print_card.create_success", "Print card created successfully")
      );

      navigate("/organization/printcard");
    } catch (err) {
      console.error("Create print card error:", err);
      showError(
        err?.response?.data?.message ||
          err?.message ||
          t("print_card.create_failed", "Failed to create print card")
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
          <FontAwesomeIcon icon={faAddressCard} />
          {t("print_card_new.title")}
        </h1>
        <p className="text-sm text-slate-500">
          {t("print_card_new.description")}
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