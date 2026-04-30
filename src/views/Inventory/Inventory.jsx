// src/views/settings/Settings.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsersCog,
  faBuilding,
  faPaperPlane,
  faUsers,
  faIdBadge,
  faGlobe,
  faBoxesStacked,
  faBox,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import { hasPermission } from "../../utils/permission";

const Inventory = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <FontAwesomeIcon icon={faBoxesStacked} />
          {t("inventory.title")}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {t("inventory.description")}
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* Product */}
        {hasPermission("MANAGE_PRODUCT") && (
          <Link
            to="/inventory/product"
            className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm 
                       hover:shadow-md hover:border-blue-400 hover:-translate-y-1 
                       transition-all duration-200 block"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faBox}
                  className="text-blue-600 w-5 h-5"
                />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900 group-hover:text-blue-600">
                  {t("inventory.product_title", "Product")}
                </h2>
                <p className="text-xs text-slate-500">{t("inventory.product_description", "Manage product")}</p>
              </div>
            </div>
          </Link>
        )}

        {/* Stock */}
        {hasPermission("MANAGE_STOCK") && (
          <Link
            to="/inventory/stock"
            className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm 
                       hover:shadow-md hover:border-blue-400 hover:-translate-y-1 
                       transition-all duration-200 block"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faListCheck}
                  className="text-blue-600 w-5 h-5"
                />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900 group-hover:text-blue-600">
                  {t("inventory.stock_title", "Stock")}
                </h2>
                <p className="text-xs text-slate-500">{t("inventory.stock_description", "Stock Management")}</p>
              </div>
            </div>
          </Link>
        )}

        {/* Assets */}
        {hasPermission("MANAGE_STOCK") && (
          <Link
            to="/inventory/asset"
            className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm 
                       hover:shadow-md hover:border-blue-400 hover:-translate-y-1 
                       transition-all duration-200 block"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faBoxesStacked}
                  className="text-blue-600 w-5 h-5"
                />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900 group-hover:text-blue-600">
                  {t("inventory.asset_title", "Asset Management")}
                </h2>
                <p className="text-xs text-slate-500">{t("inventory.asset_description", "Hardware & Device Inventory")}</p>
              </div>
            </div>
          </Link>
        )}

      </div>
    </div>
  );
};

export default Inventory;