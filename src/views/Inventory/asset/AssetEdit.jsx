import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import AssetForm from "./AssetForm";
import axiosClient from "../../../services/axiosClient";
import { errorService } from "../../../services/errorService";

const AssetEdit = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await axiosClient.get(`/api/assets/${id}`);
        setFormData(res.data);
      } catch (err) {
        errorService.error(t("inventory.asset_load_failed"));
        navigate("/inventory/asset");
      } finally {
        setLoading(false);
      }
    };
    fetchAsset();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/api/assets/${id}`, formData);
      errorService.success(t("inventory.asset_update_success"));
      navigate("/inventory/asset");
    } catch (err) {
      errorService.error(t("inventory.asset_update_failed", "Failed to update asset"));
    }
  };

  if (loading) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
          {t("inventory.asset_edit_title", "Update Asset Information")}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {t("inventory.asset_description", "Modify asset specifications")}
        </p>
      </div>

      <AssetForm
        isEdit
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/inventory/asset")}
      />
    </div>
  );
};

export default AssetEdit;
