import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import {
  faPlus,
  faSearch,
  faEdit,
  faTrash,
  faEye,
  faServer,
  faList,
  faDesktop,
} from "@fortawesome/free-solid-svg-icons";
import { hasPermission } from "../../../utils/permission";
import axiosClient from "../../../services/axiosClient";
import { errorService } from "../../../services/errorService";

const Asset = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [categories, setCategories] = useState([]);
  const iconMap = Icons;

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get("/api/category");
      const filtered = res.data.filter((item) => item.groups === "Asset");

      const allOption = {
        id: "ALL",
        name: t("common.all", "All Assets"),
        icons: "faList",
      };

      setCategories([allOption, ...(filtered || [])]);
    } catch (err) {
      console.error("Error loading categories:", err);
      setError(t("inventory.category_load_failed", "Failed to load categories"));
    } finally {
      setLoading(false);
    }
  };

  const loadAssets = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get("/api/assets");
      setAssets(res.data || []);
    } catch (err) {
      console.error("Error loading assets:", err);
      setError(t("inventory.asset_load_failed", "Failed to load assets"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
    loadCategories();
  }, []);

  const handleAddAsset = () => {
    navigate("/inventory/asset/create");
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.device_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serial_number?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === "ALL" || asset.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleDelete = async (id) => {
    if (!window.confirm(t("inventory.asset_delete_confirm"))) return;
    try {
      await axiosClient.delete(`/api/assets/${id}`);
      setAssets(prev => prev.filter(a => a.id !== id));
      errorService.success(t("inventory.asset_delete_success"));
    } catch (err) {
      errorService.error(t("inventory.asset_delete_failed"));
    }
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FontAwesomeIcon icon={faServer} className="w-5 h-5" />
              </div>
              {t("inventory.asset_title")}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t("inventory.asset_description")}
            </p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder={t("inventory.asset_search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl w-64 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {hasPermission("MANAGE_STOCK") && (
              <button
                onClick={handleAddAsset}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-sm shadow-blue-500/20 transition-all flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} />
                {t("inventory.asset_add")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="bg-white p-1 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar scroll-smooth flex">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id === "ALL" ? "ALL" : cat.name)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap
              ${activeTab === (cat.id === "ALL" ? "ALL" : cat.name)
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 translate-y-[-1px]"
                : "text-slate-500 hover:bg-slate-50"
              }`}
          >
            <FontAwesomeIcon icon={iconMap[cat.icons] || faDesktop} className={(activeTab === (cat.id === "ALL" ? "ALL" : cat.name)) ? "text-white" : "text-slate-400"} />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Content Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">{t("inventory.product_id", "ID")}</th>
                <th className="px-6 py-4">{t("inventory.asset_user")}</th>
                <th className="px-6 py-4">{t("inventory.asset_model")}</th>
                <th className="px-6 py-4">{t("inventory.asset_serial")}</th>

                {/* Dynamic Columns based on Tab */}
                {activeTab === "PC/LAPTOP" && (
                  <>
                    <th className="px-6 py-4">{t("inventory.asset_cpu")}</th>
                    <th className="px-6 py-4">{t("inventory.asset_ram")}</th>
                    <th className="px-6 py-4">{t("inventory.asset_hdd")}</th>
                    <th className="px-6 py-4">{t("inventory.asset_os")}</th>
                  </>
                )}

                {activeTab === "Printer" && (
                  <>
                    <th className="px-6 py-4">{t("inventory.asset_location")}</th>
                    <th className="px-6 py-4">{t("inventory.asset_office")}</th>
                  </>
                )}

                <th className="px-6 py-4">{t("inventory.asset_ip")}</th>
                <th className="px-6 py-4 text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="12" className="py-20 text-center">
                    <div className="inline-block animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mb-2"></div>
                    <p className="text-xs text-slate-400 font-medium">{t("common.loading")}</p>
                  </td>
                </tr>
              ) : filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 text-xs font-bold text-slate-400">{asset.id}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-900">{asset.user_name || "-"}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{asset.category}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{asset.model || "-"}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                        {asset.serial_number || "-"}
                      </span>
                    </td>

                    {activeTab === "PC/LAPTOP" && (
                      <>
                        <td className="px-6 py-4 text-xs text-slate-500">{asset.cpu || "-"}</td>
                        <td className="px-6 py-4 text-xs text-slate-500">{asset.ram || "-"}</td>
                        <td className="px-6 py-4 text-xs text-slate-500">{asset.hdd || "-"}</td>
                        <td className="px-6 py-4 text-xs text-slate-500 font-bold text-blue-600">{asset.os || "-"}</td>
                      </>
                    )}

                    {activeTab === "Printer" && (
                      <>
                        <td className="px-6 py-4 text-xs text-slate-500">{asset.location || "-"}</td>
                        <td className="px-6 py-4 text-xs text-slate-500">{asset.office_dept || "-"}</td>
                      </>
                    )}

                    <td className="px-6 py-4 text-xs font-mono text-slate-600">{asset.ip_address || "-"}</td>

                    <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => navigate(`/inventory/asset/${asset.id}/view`)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => navigate(`/inventory/asset/${asset.id}/edit`)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all"
                        >
                          <FontAwesomeIcon icon={faEdit} className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white transition-all"
                        >
                          <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="py-20 text-center">
                    <img src="/assets/empty.svg" alt="" className="w-24 mx-auto mb-4 opacity-50" />
                    <p className="text-sm text-slate-400 font-medium">{t("common.no_data")}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Asset;
