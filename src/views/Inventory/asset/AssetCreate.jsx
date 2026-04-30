import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AssetForm from "./AssetForm";
import axiosClient from "../../../services/axiosClient";
import { errorService } from "../../../services/errorService";

const AssetCreate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "PC/LAPTOP",
    user_name: "",
    device_name: "",
    model: "",
    serial_number: "",
    ip_address: "",
    mac_address: "",
    cpu: "",
    ram: "",
    hdd: "",
    os: "",
    part_upgrade: "",
    office_dept: "",
    location: "",
    building_brand: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/api/assets", formData);
      errorService.success(t("inventory.asset_create_success"));
      navigate("/inventory/asset");
    } catch (err) {
      errorService.error(t("inventory.asset_create_failed", "Failed to create asset"));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
          {t("inventory.asset_create_title", "New Asset Registration")}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {t("inventory.asset_description", "Add new device to inventory")}
        </p>
      </div>

      <AssetForm
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/inventory/asset")}
      />
    </div>
  );
};

export default AssetCreate;
