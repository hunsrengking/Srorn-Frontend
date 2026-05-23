// src/views/organization/card/PrintCardEdit.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import printCardService from "@/services/printCardService";
import PrintCardForm from "./PrintCardForm";
import { useError } from "../../../context/ErrorContext";

const PrintCardEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useError();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    entity_type: "", // "staff" | "student" — from API
    entry_id: "",
    seller_id: "",
    print_date: "",
    description: "",
    is_print_card: true,
    cables: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await printCardService.getPrintCardById(id);
        const data = res.data;

        setFormData({
          // entity_type comes from the backend (added in service.py)
          entity_type: data.entity_type || "staff",
          entry_id: data.entry_id || "",
          seller_id: data.seller_id || "",
          print_date: (data.print_date || "").split("T")[0],
          description: data.description || "",
          is_print_card:
            data.is_print_card !== undefined
              ? Boolean(data.is_print_card)
              : true,
          cables: (data.mappings || []).map((m) => ({
            value: m.quantity || "1",
            color: String(m.cable_color_id || ""),
          })),
        });
      } catch (err) {
        showError(t("print_card.load_failed", "Failed to load print card"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sm text-slate-500">
          {t("roles.loading", "Loading...")}
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        entry_id: Number(formData.entry_id),
        entity_type: formData.entity_type,
        print_date: formData.print_date,
        is_print_card: Boolean(formData.is_print_card),
        seller_id: Number(formData.seller_id),
        description: formData.description,
        mappings: (formData.cables || []).map((c) => ({
          cable_color_id: Number(c.color),
          quantity: Number(c.value),
        })),
      };
      await printCardService.updatePrintCard(id, payload);
      showSuccess(
        t("print_card.update_success", "Print card updated successfully"),
      );
      navigate("/organization/printcard");
    } catch (err) {
      showError(
        err?.response?.data?.detail ||
          err?.message ||
          t("print_card.update_failed", "Failed to update print card"),
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
          <FontAwesomeIcon icon={faUserTie} />
          {t("print_card.edit_title")}
        </h1>
        <p className="text-sm text-slate-500">{t("print_card.edit_desc")}</p>
      </div>

      <PrintCardForm
        isEdit={true}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/organization/printcard")}
      />
    </div>
  );
};

export default PrintCardEdit;
