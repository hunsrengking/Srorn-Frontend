import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faImage, faSave } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../../services/axiosClient";
import { useError } from "../../../context/ErrorContext";
import { useSystem } from "../../../context/SystemContext";

const GeneralSettings = () => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useError();
  const { systemInfo, updateSystemInfo } = useSystem();

  const [formData, setFormData] = useState({
    system_name: "",
    logo: null,
  });
  const [previewLogo, setPreviewLogo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      system_name: systemInfo.system_name,
      logo: null,
    });
    setPreviewLogo(systemInfo.logo_url);
  }, [systemInfo]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("system_name", formData.system_name);
      if (formData.logo) {
        data.append("logo", formData.logo);
      }

      const res = await axiosClient.post("/api/system-settings", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      updateSystemInfo({
        system_name: res.data.system_name,
        logo_url: res.data.logo_url,
      });

      showSuccess(t("settings.update_success", "Settings updated successfully"));
    } catch (err) {
      console.error(err);
      showError(err?.response?.data?.message || t("settings.update_failed", "Update failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <FontAwesomeIcon icon={faGear} />
          {t("settings.general_title", "General Settings")}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {t("settings.general_desc", "Manage your system name and logo")}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              {t("settings.system_name", "System Name")}
            </label>
            <input
              type="text"
              name="system_name"
              value={formData.system_name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
              placeholder="e.g. My Awesome System"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              {t("settings.logo", "System Logo")}
            </label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50">
                {previewLogo ? (
                  <img src={previewLogo} alt="Logo Preview" className="w-full h-full object-contain" />
                ) : (
                  <FontAwesomeIcon icon={faImage} className="text-slate-300 text-2xl" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="logo-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
                <label
                  htmlFor="logo-upload"
                  className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition inline-block"
                >
                  {t("common.choose_file", "Choose File")}
                </label>
                <p className="text-xs text-slate-500 mt-2">
                  Recommended size: 200x200px. Supports PNG, JPG.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium shadow-sm hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faSave} />
              {loading ? t("common.saving", "Saving...") : t("common.save_changes", "Save Changes")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneralSettings;
