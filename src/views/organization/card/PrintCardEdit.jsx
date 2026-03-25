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

  const [loading, setLoading] = useState(true);
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
      try {
        setLoading(true);
        // Try detail API first
        const res = await axiosClient.get(`/api/organization/printcards/${id}`);
        const data = res.data;

        if (data) {
          setFormData({
            position_id: data.position_id || data.positionId || "",
            staff_id: data.entry_id || data.entryId || data.staff_id || data.staffId || "",
            seller_id: data.seller_id || data.sellerId || "",
            // Handle ISO string like "2026-03-17T00:00:00" -> "2026-03-17"
            print_date: (data.print_date || data.printDate || "").split("T")[0],
            description: data.description || "",
            is_print_card: data.is_print_card !== undefined ? Boolean(data.is_print_card) : true,
            cables:
              (data.mappings || data.cables || []).map((m) => ({
                value: m.quantity || m.value || "1",
                color: String(m.cable_color_id || m.color || ""),
              })),
          });
        }
      } catch (err) {
        console.error("Load print card detail error, trying list fallback:", err);
        try {
          // Fallback to list API if detail fails
          const res = await axiosClient.get("/api/organization/printcards");
          const item = (res.data || []).find((x) => String(x.id) === String(id));
          if (item) {
            setFormData({
              position_id: item.position_id || item.positionId || "",
              staff_id: item.entry_id || item.entryId || item.staff_id || item.staffId || "",
              seller_id: item.seller_id || item.sellerId || "",
              print_date: (item.print_date || item.printDate || "").split("T")[0],
              description: item.description || "",
              is_print_card: item.is_print_card !== undefined ? Boolean(item.is_print_card) : true,
              cables:
                (item.mappings || item.cables || []).map((m) => ({
                  value: m.quantity || m.value || "1",
                  color: String(m.cable_color_id || m.color || ""),
                })),
            });
          }
        } catch (listErr) {
          console.error("Load print card list error:", listErr);
        }
      } finally {
        setLoading(false);
      }
    };

    loadPrintCard();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sm text-slate-500">{t("roles.loading", "Loading...")}</div>
      </div>
    );
  }

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