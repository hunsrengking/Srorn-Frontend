import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

const ProductForm = ({
  isEdit = false,
  formData,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();

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
      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Code */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            {t("inventory.product_code", "Product Code")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="code"
            value={formData.code || ""}
            onChange={handleChange}
            required
            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none"
            placeholder="PRO-001"
          />
        </div>

        {/* Product Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            {t("inventory.product_name", "Product Name")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            required
            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none"
            placeholder="Enter product name"
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            {t("inventory.product_price", "Price")}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-slate-400 text-sm">$</span>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl p-3 pl-7 text-sm focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex items-end h-full pt-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active ?? true}
              onChange={handleChange}
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
              {t("common.active_status", "Active Status")}
            </span>
          </label>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          {t("inventory.product_description_field", "Description")}
        </label>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          rows="3"
          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none resize-none"
          placeholder="Enter product details..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
        >
          <FontAwesomeIcon icon={faTimes} className="mr-2" />
          {t("common.cancel", "Cancel")}
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
        >
          <FontAwesomeIcon icon={faSave} className="mr-2" />
          {isEdit ? t("common.update", "Update Product") : t("common.save", "Save Product")}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
