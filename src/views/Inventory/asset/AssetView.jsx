import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import {
  faArrowLeft,
  faEdit,
  faDesktop,
  faPrint,
  faServer,
  faTv,
  faWifi,
  faNetworkWired,
  faVolumeUp,
  faPlug,
  faAddressCard,
  faMicrochip,
  faMemory,
  faHdd,
  faWindowRestore,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../../services/axiosClient";
import { errorService } from "../../../services/errorService";

const AssetView = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryIcons, setCategoryIcons] = useState({});

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await axiosClient.get(`/api/assets/${id}`);
        setAsset(res.data);
      } catch (err) {
        errorService.error(t("inventory.asset_load_failed"));
        navigate("/inventory/asset");
      } finally {
        setLoading(false);
      }
    };
    fetchAsset();
    loadCategoryIcons();
  }, [id]);

  const loadCategoryIcons = async () => {
    try {
      const res = await axiosClient.get("/api/category");
      const filtered = res.data.filter((item) => item.groups === "Asset");
      
      const iconMap = {};
      filtered.forEach((cat) => {
        iconMap[cat.name] = Icons[cat.icons] || faDesktop;
      });
      
      setCategoryIcons(iconMap);
    } catch (err) {
      console.error("Error loading category icons:", err);
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/inventory/asset")}
          className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-all"
        >
          <div className="w-8 h-8 rounded-full border border-slate-200 group-hover:border-blue-400 flex items-center justify-center transition-all group-hover:-translate-x-1">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          </div>
          {t("common.back")}
        </button>

        <button
          onClick={() => navigate(`/inventory/asset/${id}/edit`)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faEdit} />
          {t("common.edit")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -translate-y-16 translate-x-16 transition-transform group-hover:scale-110"></div>
            
            <div className="w-24 h-24 mx-auto rounded-3xl bg-blue-600 text-white flex items-center justify-center relative z-10 shadow-xl shadow-blue-600/30 mb-6">
              <FontAwesomeIcon icon={categoryIcons[asset.category] || faServer} className="text-4xl" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-1">{asset.device_name || "N/A"}</h2>
            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest bg-blue-50 inline-block px-3 py-1 rounded-full">{asset.category}</p>
            
            <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col gap-4 text-left">
               <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">{t("inventory.asset_user")}</span>
                  <span className="text-sm font-bold text-slate-800">{asset.user_name || "-"}</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">{t("inventory.asset_serial")}</span>
                  <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700 tracking-tight">{asset.serial_number || "-"}</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">{t("inventory.asset_model")}</span>
                  <span className="text-sm font-bold text-slate-800">{asset.model || "-"}</span>
               </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-900/10">
             <div className="flex items-center gap-3 mb-6">
                 <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <FontAwesomeIcon icon={faWifi} className="text-blue-400 text-xs" />
                 </div>
                 <h3 className="text-sm font-black uppercase tracking-widest">{t("inventory.asset_form_network", "Network config")}</h3>
             </div>
             <div className="space-y-4">
                 <div className="bg-white/5 p-4 rounded-2xl flex items-center justify-between">
                     <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter italic">IP ADDRESS</span>
                     <span className="text-sm font-mono font-black text-blue-400 tracking-wider transition-all hover:scale-110 cursor-default">{asset.ip_address || "0.0.0.0"}</span>
                 </div>
                 <div className="bg-white/5 p-4 rounded-2xl flex items-center justify-between">
                     <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter italic">MAC ADDRESS</span>
                     <span className="text-[11px] font-mono font-bold text-white/90 tracking-widest">{asset.mac_address || "00-00-00-00-00-00"}</span>
                 </div>
             </div>
          </div>
        </div>

        {/* Right Column - Details Cards */}
        <div className="lg:col-span-2 space-y-6">
           {/* Section 1: Dynamic Specs based on Category */}
           {asset.category === "PC/LAPTOP" && (
             <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                        <FontAwesomeIcon icon={faMicrochip} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t("inventory.asset_form_hardware", "System Specifications")}</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider italic">Detailed hardware profile</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-200 hover:bg-white transition-all group/cell">
                        <FontAwesomeIcon icon={faMicrochip} className="text-2xl text-slate-300 group-hover/cell:text-blue-500 transition-colors" />
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("inventory.asset_cpu")}</div>
                            <div className="text-sm font-black text-slate-700">{asset.cpu || "Not Specified"}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-200 hover:bg-white transition-all group/cell">
                        <FontAwesomeIcon icon={faMemory} className="text-2xl text-slate-300 group-hover/cell:text-blue-500 transition-colors" />
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("inventory.asset_ram")}</div>
                            <div className="text-sm font-black text-slate-700">{asset.ram || "Not Specified"}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-200 hover:bg-white transition-all group/cell">
                        <FontAwesomeIcon icon={faHdd} className="text-2xl text-slate-300 group-hover/cell:text-blue-500 transition-colors" />
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("inventory.asset_hdd")}</div>
                            <div className="text-sm font-black text-slate-700">{asset.hdd || "Not Specified"}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-200 hover:bg-white transition-all group/cell">
                        <FontAwesomeIcon icon={faWindowRestore} className="text-2xl text-slate-300 group-hover/cell:text-blue-500 transition-colors" />
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("inventory.asset_os")}</div>
                            <div className="text-sm font-black text-blue-600">{asset.os || "Not Specified"}</div>
                        </div>
                    </div>
                </div>

                {asset.part_upgrade && (
                    <div className="mt-8 p-6 bg-amber-50 rounded-3xl border border-amber-100 italic font-medium text-amber-900 relative">
                        <div className="text-[10px] font-black text-amber-600 uppercase mb-2">Upgrade Logs</div>
                        "{asset.part_upgrade}"
                    </div>
                )}
             </div>
           )}

           {asset.category === "Printer" && (
             <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-emerald-600"></div>
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t("inventory.asset_form_location", "Placement & Location")}</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider italic">Physical position data</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t("inventory.asset_office")}</span>
                        <span className="text-lg font-black text-slate-800">{asset.office_dept || "-"}</span>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t("inventory.asset_location")}</span>
                        <span className="text-lg font-black text-slate-800">{asset.location || "-"}</span>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t("inventory.asset_building")}</span>
                        <span className="text-lg font-black text-slate-800">{asset.building_brand || "-"}</span>
                    </div>
                </div>
             </div>
           )}

           <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100 flex items-center gap-6">
               <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl shadow-xl shadow-blue-500/30">
                   <FontAwesomeIcon icon={faAddressCard} />
               </div>
               <div>
                  <h4 className="text-sm font-black text-blue-900 uppercase tracking-wider mb-1">Status Report</h4>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-tighter opacity-70 italic mb-2">Device integrity verification</p>
                  <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Active & Operational</span>
                  </div>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AssetView;
