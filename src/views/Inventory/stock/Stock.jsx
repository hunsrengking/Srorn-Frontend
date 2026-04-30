import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faListCheck,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { hasPermission } from "../../../utils/permission";
import axiosClient from "../../../services/axiosClient";
import { errorService } from "../../../services/errorService";

const Stock = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadStocks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get("/api/stocks");
      setStocks(res.data || []);
    } catch (err) {
      console.error("Error loading stocks:", err);
      setError(t("inventory.stock_load_failed", "Failed to load stock levels"));
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStocks();
  }, []);

  const handleAdjustStock = () => {
    navigate("/inventory/stock/adjust");
  };

  const filteredStocks = stocks.filter(
    (s) =>
      s.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.product_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header + Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
              <FontAwesomeIcon icon={faListCheck} />
              {t("inventory.stock_title", "Stock Levels")}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t("inventory.stock_description", "Monitor and adjust your product inventory levels")}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <FontAwesomeIcon icon={faSearch} className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder={t("inventory.stock_search_placeholder", "Search product name or code...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl
                           focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
                           placeholder:text-slate-400 outline-none"
              />
            </div>

            {hasPermission("MANAGE_STOCK") && (
              <button
                onClick={handleAdjustStock}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm
                         font-medium rounded-xl bg-blue-600 text-white shadow-sm
                         hover:bg-blue-700 focus:outline-none focus:ring-2
                         focus:ring-blue-500/50"
              >
                <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" />
                <FontAwesomeIcon icon={faMinus} className="h-3.5 w-3.5" />
                <span>{t("inventory.stock_adjust", "Adjust Stock")}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">{t("inventory.product_code", "Code")}</th>
                <th className="px-4 py-3">{t("inventory.product_name", "Product Name")}</th>
                <th className="px-4 py-3">{t("inventory.stock_quantity", "Quantity in Stock")}</th>
                <th className="px-4 py-3">{t("inventory.stock_last_update", "Last Updated")}</th>
                <th className="px-4 py-3">{t("inventory.stock_status", "Stock Status")}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    {t("common.loading", "Loading...")}
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-red-500"
                  >
                    {error}
                    <button
                      onClick={loadStocks}
                      className="ml-2 text-blue-600 hover:text-blue-800 underline"
                    >
                      {t("common.retry", "Retry")}
                    </button>
                  </td>
                </tr>
              ) : filteredStocks.length > 0 ? (
                filteredStocks.map((s, idx) => (
                  <tr
                    key={idx}
                    className="transition-colors duration-150 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-slate-800 font-medium whitespace-nowrap">
                      {s.product_code || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      {s.product_name || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-bold">
                      {s.quantity || 0}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {s.updated_at ? new Date(s.updated_at).toLocaleString() : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                          ${s.quantity > 10
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : s.quantity > 0
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-red-50 text-red-700 border border-red-100"
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5
                            ${s.quantity > 10 ? "bg-emerald-500" : s.quantity > 0 ? "bg-amber-500" : "bg-red-500"
                            }`}
                        />
                        {s.quantity > 10 ? t("inventory.stock_ok", "In Stock") : s.quantity > 0 ? t("inventory.stock_low", "Low Stock") : t("inventory.stock_empty", "Out of Stock")}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    {t("inventory.stock_not_found", "No stock information found.")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-4 py-3 text-xs text-slate-500 bg-slate-50 flex justify-between items-center">
          <span>
            {t("inventory.stock_showing", { filtered: filteredStocks.length, total: stocks.length })}
          </span>
          <span className="text-slate-400">{t("common.page_of", { current: 1, total: 1 })}</span>
        </div>
      </div>
    </div>
  );
};

export default Stock;
