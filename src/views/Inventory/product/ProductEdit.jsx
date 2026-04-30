import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "./ProductForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../../services/axiosClient";
import { errorService } from "../../../services/errorService";

const ProductEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    price: "",
    description: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/api/products/${id}`);
        const product = res.data;
        setFormData({
          name: product.name ?? "",
          code: product.code ?? "",
          price: product.price ?? "",
          description: product.description ?? "",
          is_active: product.is_active ?? true,
        });
      } catch (err) {
        console.error("Error loading product:", err);
        errorService.error(t("inventory.product_load_failed", "Failed to load product details"));
        navigate("/inventory/product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosClient.put(`/api/products/${id}`, formData);
      errorService.success(t("inventory.product_update_success", "Product updated successfully"));
      navigate("/inventory/product");
    } catch (err) {
      console.error("Update product error:", err);
      errorService.error(
        err?.response?.data?.message || err?.message ||
          t("inventory.product_update_failed", "Failed to update product")
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="text-sm text-slate-500">{t("common.loading", "Loading details...")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Actions */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
            <FontAwesomeIcon icon={faEdit} className="text-blue-600" />
            {t("inventory.product_edit_title", "Edit Product")}
          </h1>
          <p className="text-sm text-slate-500">
            {t("inventory.product_edit_desc", "Update existing product information")}
          </p>
        </div>

        <button
          onClick={() => navigate("/inventory/product")}
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-semibold text-sm"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          {t("common.back", "Back")}
        </button>
      </div>

      <ProductForm
        isEdit={true}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/inventory/product")}
      />
    </div>
  );
};

export default ProductEdit;
