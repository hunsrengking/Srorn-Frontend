import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faEdit,
  faTrash,
  faBox,
} from "@fortawesome/free-solid-svg-icons";
import { hasPermission } from "../../../utils/permission";
import axiosClient from "../../../services/axiosClient";
import { errorService } from "../../../services/errorService";

const Product = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get("/api/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error loading products:", err);
      setError(t("inventory.product_load_failed", "Failed to load products"));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = () => {
    navigate("/inventory/product/create");
  };

  const handleEditProduct = (id) => {
    navigate(`/inventory/product/${id}/edit`);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm(t("inventory.product_delete_confirm", "Are you sure you want to delete this product?"))) return;

    try {
      await axiosClient.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      errorService.success(t("inventory.product_delete_success", "Product deleted successfully"));
    } catch (err) {
      console.error("Error deleting product:", err);
      errorService.error(t("inventory.product_delete_failed", "Failed to delete product"));
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header + Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
              <FontAwesomeIcon icon={faBox} />
              {t("inventory.product_title", "Product Management")}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t("inventory.product_description", "Manage your products catalog")}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <FontAwesomeIcon icon={faSearch} className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder={t("inventory.product_search_placeholder", "Search product name or code...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl
                           focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
                           placeholder:text-slate-400 outline-none"
              />
            </div>

            {hasPermission("MANAGE_PRODUCT") && (
              <button
                onClick={handleAddProduct}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm
                         font-medium rounded-xl bg-blue-600 text-white shadow-sm
                         hover:bg-blue-700 focus:outline-none focus:ring-2
                         focus:ring-blue-500/50"
              >
                <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                <span>{t("inventory.product_add_new", "Add Product")}</span>
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
                <th className="px-4 py-3">{t("inventory.product_id", "ID")}</th>
                <th className="px-4 py-3">{t("inventory.product_code", "Code")}</th>
                <th className="px-4 py-3">{t("inventory.product_name", "Product Name")}</th>
                <th className="px-4 py-3">{t("inventory.product_price", "Price")}</th>
                <th className="px-4 py-3">{t("inventory.product_status", "Status")}</th>
                <th className="px-4 py-3 text-right">{t("common.actions", "Actions")}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    {t("common.loading", "Loading...")}
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-red-500"
                  >
                    {error}
                    <button
                      onClick={loadProducts}
                      className="ml-2 text-blue-600 hover:text-blue-800 underline"
                    >
                      {t("common.retry", "Retry")}
                    </button>
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="transition-colors duration-150 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {p.id}
                    </td>
                    <td className="px-4 py-3 text-slate-800 font-medium whitespace-nowrap">
                      {p.code || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      {p.name || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {p.price ? `$${p.price}` : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                          ${p.is_active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-red-50 text-red-700 border border-red-100"
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5
                            ${p.is_active ? "bg-emerald-500" : "bg-red-500"
                            }`}
                        />
                        {p.is_active ? t("common.active", "Active") : t("common.inactive", "Inactive")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div
                        className="inline-flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {hasPermission("MANAGE_PRODUCT") && (
                          <>
                            <button
                              onClick={() => handleEditProduct(p.id)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                       text-slate-500 hover:text-blue-600 hover:bg-blue-50
                                       transition-colors"
                            >
                              <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                       text-slate-500 hover:text-red-600 hover:bg-red-50
                                       transition-colors"
                            >
                              <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    {t("inventory.product_not_found", "No products found.")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-4 py-3 text-xs text-slate-500 bg-slate-50 flex justify-between items-center">
          <span>
            {t("inventory.product_showing", { filtered: filteredProducts.length, total: products.length })}
          </span>
          <span className="text-slate-400">{t("common.page_of", { current: 1, total: 1 })}</span>
        </div>
      </div>
    </div>
  );
};

export default Product;
