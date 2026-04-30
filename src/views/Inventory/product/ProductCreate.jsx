import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ProductForm from "./ProductForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../../services/axiosClient";
import { errorService } from "../../../services/errorService";

const ProductCreate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    price: "",
    description: "",
    is_active: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosClient.post("/api/products", formData);
      errorService.success(t("inventory.product_create_success", "Product created successfully"));
      navigate("/inventory/product");
    } catch (err) {
      console.error("Create product error:", err);
      errorService.error(
        err?.response?.data?.message || err?.message ||
          t("inventory.product_create_failed", "Failed to create product")
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
            <FontAwesomeIcon icon={faPlus} className="text-blue-600" />
            {t("inventory.product_create_title", "Create New Product")}
          </h1>
          <p className="text-sm text-slate-500">
            {t("inventory.product_create_desc", "Add a new product to your inventory")}
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
        isEdit={false}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/inventory/product")}
      />
    </div>
  );
};

export default ProductCreate;
