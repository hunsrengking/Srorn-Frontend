// src/views/organization/card/PrintCardNew.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";
import printCardService from "@/services/printCardService";
import PrintCardForm from "./PrintCardForm";
import { useError } from "../../../context/ErrorContext";

const PrintCardNew = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showSuccess, showError } = useError();

  // entity_type and entry_id come from URL: /printcard/:id/:type
  const { id: entry_id, type: entity_type } = useParams();

  const [formData, setFormData] = useState({
    entity_type:   entity_type || "",  // "staff" | "student"
    entry_id:      entry_id    || "",  // entity's ID
    seller_id:     "",
    print_date:    "",
    description:   "",
    is_print_card: true,
    cables:        [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        entry_id:      Number(formData.entry_id),
        entity_type:   formData.entity_type,
        print_date:    formData.print_date,
        is_print_card: Boolean(formData.is_print_card),
        seller_id:     Number(formData.seller_id),
        description:   formData.description,
        mappings: (formData.cables || []).map((c) => ({
          cable_color_id: Number(c.color),
          quantity:       Number(c.value),
        })),
      };
      await printCardService.createPrintCard(payload);
      showSuccess(t("print_card.create_success", "Print card created successfully"));
      navigate("/organization/printcard");
    } catch (err) {
      showError(
        err?.response?.data?.detail ||
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
        <p className="text-sm text-slate-500">{t("print_card_new.description")}</p>
      </div>

      <PrintCardForm
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/organization/printcard")}
      />
    </div>
  );
};

export default PrintCardNew;
