// src/views/settings/staff/StaffForm.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axiosClient from "../../../services/axiosClient";

const OfficeForm = ({
  isEdit = false,
  formData,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let updated = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    onChange(updated);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* External ID */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            {t("office.external_id", "External ID")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="external_id"
            value={formData.external_id || ""}
            onChange={handleChange}
            required
            className="w-full border border-slate-200 rounded-xl p-2.5 text-sm
               focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            placeholder={t("office.external_id_placeholder", "Enter external ID")}
          />
        </div>

        {/* Office Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            {t("office.name")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            required
            className="w-full border border-slate-200 rounded-xl p-2.5 text-sm
               focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            placeholder={t("office.name_placeholder", "Enter office name")}
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-3 py-2">
          <div className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active ?? true}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 
                          peer-focus:ring-blue-300 rounded-full peer 
                          peer-checked:after:translate-x-full peer-checked:after:border-white 
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                          after:bg-white after:border-gray-300 after:border after:rounded-full 
                          after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-slate-600">
              {formData.is_active ?? true ? t("office.active") : t("office.inactive")}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 
                   hover:bg-slate-50 font-medium text-sm transition-all"
        >
          {t("common.cancel")}
        </button>

        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-2.5 rounded-xl shadow-sm 
                   hover:bg-blue-700 font-medium text-sm transition-all
                   active:scale-[0.98]"
        >
          {isEdit ? t("common.update") : t("common.create")}
        </button>
      </div>
    </form>
  );
};

export default OfficeForm;
