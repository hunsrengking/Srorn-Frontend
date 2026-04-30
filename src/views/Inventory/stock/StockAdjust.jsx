import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../../services/axiosClient";
import { errorService } from "../../../services/errorService";

const StockAdjust = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_id: "",
    adjustment_type: "in", // "in" or "out"
    quantity: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await axiosClient.get("/api/products");
        setProducts(res.data || []);
      } catch (err) {
        console.error("Error loading products:", err);
      }
    };
    loadProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product_id || !formData.quantity) {
      errorService.warning(t("common.fill_required", "Please fill required fields"));
      return;
    }

    try {
      setLoading(true);
      // Backend should have an endpoint like /api/stocks/adjust or similar
      await axiosClient.post("/api/stocks/adjust", {
        ...formData,
        quantity: parseInt(formData.quantity) * (formData.adjustment_type === "out" ? -1 : 1)
      });
      errorService.success(t("inventory.stock_adjust_success", "Stock adjusted successfully"));
      navigate("/inventory/stock");
    } catch (err) {
      console.error("Stock adjust error:", err);
      errorService.error(t("inventory.stock_adjust_failed", "Failed to adjust stock"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
            <span className="flex items-center">
              <FontAwesomeIcon icon={faPlus} className="text-emerald-500 scale-75" />
              <FontAwesomeIcon icon={faMinus} className="text-red-500 scale-75" />
            </span>
            {t("inventory.stock_adjust_title", "Stock Adjustment")}
          </h1>
          <p className="text-sm text-slate-500">
            {t("inventory.stock_adjust_desc", "Add or remove stock from inventory")}
          </p>
        </div>

        <button
          onClick={() => navigate("/inventory/stock")}
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-semibold text-sm"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          {t("common.back", "Back")}
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          {/* Product Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              {t("inventory.select_product", "Select Product")} <span className="text-red-500">*</span>
            </label>
            <select
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              required
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none"
            >
              <option value="">{t("inventory.choose_product", "-- Choose a product --")}</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Adjustment Type */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                {t("inventory.adjustment_type", "Adjustment Type")}
              </label>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, adjustment_type: "in" }))}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.adjustment_type === "in" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  {t("inventory.stock_in", "Stock In")}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, adjustment_type: "out" }))}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.adjustment_type === "out" ? "bg-white text-red-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <FontAwesomeIcon icon={faMinus} className="mr-2" />
                  {t("inventory.stock_out", "Stock Out")}
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                {t("inventory.quantity", "Quantity")} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none"
                placeholder="0"
              />
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              {t("inventory.adjustment_reason", "Reason / Notes")}
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none resize-none"
              placeholder="e.g. restock, damaged, correction..."
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 text-sm font-bold text-white rounded-xl shadow-lg transition-all flex items-center justify-center gap-2
                ${formData.adjustment_type === "in" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20" : "bg-red-600 hover:bg-red-700 shadow-red-500/20"}
                ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <FontAwesomeIcon icon={faSave} />
              {loading ? t("common.processing", "Processing...") : t("inventory.confirm_adjustment", "Confirm Adjustment")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockAdjust;
