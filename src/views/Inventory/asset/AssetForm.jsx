import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../../services/axiosClient";

const AssetForm = ({
  isEdit = false,
  formData,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await axiosClient.get("/api/category");
        const filtered = res.data.filter((item) => item.groups === "Asset");
        setCategories(filtered || []);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
        {/* Category */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="text-sm text-slate-600 sm:w-32">
            {t("inventory.asset_category")} <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category || ""}
            onChange={handleChange}
            required
            className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">-- {t("common.select")} --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* User Name */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="text-sm text-slate-600 sm:w-32">
            {t("inventory.asset_user")}
          </label>
          <input
            type="text"
            name="user_name"
            value={formData.user_name || ""}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Device Name */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="text-sm text-slate-600 sm:w-32">
            {t("inventory.asset_device_name")}
          </label>
          <input
            type="text"
            name="device_name"
            value={formData.device_name || ""}
            onChange={handleChange}
            placeholder="IT-PC-01"
            className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Serial Number */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="text-sm text-slate-600 sm:w-32">
            {t("inventory.asset_serial")}
          </label>
          <input
            type="text"
            name="serial_number"
            value={formData.serial_number || ""}
            onChange={handleChange}
            placeholder="S/R: 12345678"
            className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Model */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="text-sm text-slate-600 sm:w-32">
            {t("inventory.asset_model")}
          </label>
          <input
            type="text"
            name="model"
            value={formData.model || ""}
            onChange={handleChange}
            placeholder="Dell Optiplex 3080"
            className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* IP Address */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="text-sm text-slate-600 sm:w-32">
            {t("inventory.asset_ip")}
          </label>
          <input
            type="text"
            name="ip_address"
            value={formData.ip_address || ""}
            onChange={handleChange}
            placeholder="192.168.1.10"
            className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* MAC Address */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="text-sm text-slate-600 sm:w-32">
            {t("inventory.asset_mac")}
          </label>
          <input
            type="text"
            name="mac_address"
            value={formData.mac_address || ""}
            onChange={handleChange}
            placeholder="00:00:00:00:00:00"
            className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
      </div>

      {/* --- Dynamic Fields based on Category --- */}

      {formData.category === "PC/LAPTOP" && (
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider">{t("inventory.asset_form_hardware", "Hardware Specifications")}</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm text-slate-600 sm:w-32">{t("inventory.asset_cpu")}</label>
              <input type="text" name="cpu" value={formData.cpu || ""} onChange={handleChange} className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none" placeholder="i5-10400" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm text-slate-600 sm:w-32">{t("inventory.asset_ram")}</label>
              <input type="text" name="ram" value={formData.ram || ""} onChange={handleChange} className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none" placeholder="8GB" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm text-slate-600 sm:w-32">{t("inventory.asset_hdd")}</label>
              <input type="text" name="hdd" value={formData.hdd || ""} onChange={handleChange} className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none" placeholder="256GB SSD" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm text-slate-600 sm:w-32">{t("inventory.asset_os")}</label>
              <input type="text" name="os" value={formData.os || ""} onChange={handleChange} className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Windows 10 Pro" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <label className="text-sm text-slate-600 sm:w-32 pt-2">{t("inventory.asset_part_upgrade")}</label>
            <textarea 
              name="part_upgrade" 
              value={formData.part_upgrade || ""} 
              onChange={handleChange} 
              rows="2" 
              className="w-full lg:max-w-3xl border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none" 
              placeholder="Added 8GB RAM in June..." 
            />
          </div>
        </div>
      )}

      {formData.category === "Printer" && (
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider">{t("inventory.asset_form_location", "Location & Dept info")}</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm text-slate-600 sm:w-32">{t("inventory.asset_office")}</label>
              <input type="text" name="office_dept" value={formData.office_dept || ""} onChange={handleChange} className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Finance Dept" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm text-slate-600 sm:w-32">{t("inventory.asset_location")}</label>
              <input type="text" name="location" value={formData.location || ""} onChange={handleChange} className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Counter A" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm text-slate-600 sm:w-32">{t("inventory.asset_building")}</label>
              <input type="text" name="building_brand" value={formData.building_brand || ""} onChange={handleChange} className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none" placeholder="KSR-Building" />
            </div>
          </div>
        </div>
      )}

      {/* RACK, Router, etc */}
      {(["Router", "Switch", "UPS", "RACK"].includes(formData.category)) && (
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm text-slate-600 sm:w-32">{t("inventory.asset_location")}</label>
              <input type="text" name="location" value={formData.location || ""} onChange={handleChange} className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none" />
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t border-slate-50">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-700 text-sm font-semibold transition-all"
        >
          {isEdit ? t("common.update") : t("common.save")}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-sm font-semibold transition-all"
        >
          {t("common.cancel")}
        </button>
      </div>
    </form>
  );
};

export default AssetForm;
