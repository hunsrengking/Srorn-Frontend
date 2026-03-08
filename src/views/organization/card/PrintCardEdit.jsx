import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../../services/axiosClient";
import PrintCardForm from "./PrintCardForm";
import { useError } from "../../../context/ErrorContext";

const PrintCardEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useError();

  const [formData, setFormData] = useState({
    position_id: "",
    staff_id: "",
    seller_id: "",
    print_date: "",
    description: "",
    is_print_card: true,
    cables: [],
  });

  useEffect(() => {
    const loadPrintCard = async () => {
      const res = await axiosClient.get(`/api/organization/printcards/${id}`);

      setFormData({
        position_id: "",
        staff_id: res.data.entry_id ?? "",
        seller_id: res.data.seller_id ?? "",
        print_date: res.data.print_date ?? "",
        description: res.data.description ?? "",
        is_print_card: res.data.is_print_card ?? true,
        cables:
          res.data.mappings?.map((m) => ({
            value: m.quantity,
            color: m.cable_color_id,
          })) || [],
      });
    };

    loadPrintCard();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        entry_id: formData.staff_id,
        print_date: formData.print_date,
        is_print_card: true,
        seller_id: formData.seller_id,
        description: formData.description,
        mappings: (formData.cables || []).map((c) => ({
          cable_color_id: Number(c.color),
          quantity: Number(c.value),
        })),
      };

      await axiosClient.put(`/api/organization/printcards/${id}`, payload);

      showSuccess(
        t("print_card.update_success", "Print card updated successfully")
      );

      navigate("/organization/printcard");
    } catch (err) {
      console.error("Update print card error:", err);
      showError(
        err?.response?.data?.message ||
          err?.message ||
          t("print_card.update_failed", "Failed to update print card")
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
        <p className="text-sm text-slate-500">
          {t("print_card.edit_desc")}
        </p>
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