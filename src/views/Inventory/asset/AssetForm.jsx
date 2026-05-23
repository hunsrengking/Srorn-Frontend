import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import assetService from "@/services/assetService";
import ticketService from "@/services/ticketService";
import { useError } from "@/context/ErrorContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faTrash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const AssetForm = ({
  isEdit = false,
  formData,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [deviceModels, setDeviceModels] = useState([]);
  const [cpus, setCpus] = useState([]);
  const [oss, setOss] = useState([]);
  const [rams, setRams] = useState([]);
  const [hdds, setHdds] = useState([]);
  const [locations, setLocations] = useState([]);
  const [offices, setOffices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess } = useError();
  const [uploading, setUploading] = useState(false);
  const [localImageFile, setLocalImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  useEffect(() => {
    const loadFormData = async () => {
      try {
        setLoading(true);
        const res = await assetService.getAssetsTemplate();
        const data = res.data || {};

        // Categories (Device Types)
        setCategories(
          (data.assetTypeOptions || []).map((item) => ({
            id: item.id,
            name: item.code_value,
          })),
        );

        // Models
        setDeviceModels(
          (data.modelOptions || []).map((item) => ({
            id: item.id,
            name: item.code_value,
          })),
        );

        // CPUs
        setCpus(
          (data.cpuOptions || []).map((item) => ({
            id: item.id,
            name: item.code_value,
          })),
        );

        // OSs
        setOss(
          (data.osOptions || []).map((item) => ({
            id: item.id,
            name: item.code_value,
          })),
        );

        // RAMs
        setRams(
          (data.ramOptions || []).map((item) => ({
            id: item.id,
            name: item.code_value,
          })),
        );

        // HDDs
        setHdds(
          (data.hhdOptions || []).map((item) => ({
            id: item.id,
            name: item.code_value,
          })),
        );

        // Locations
        setLocations(
          (data.locationOptions || []).map((item) => ({
            id: item.id,
            name: item.code_value,
          })),
        );

        // Offices
        setOffices(
          (data.officeOptions || []).map((item) => ({
            id: item.id,
            name: item.name,
          })),
        );

        // Departments
        setDepartments(
          (data.departmentOptions || []).map((item) => ({
            id: item.id,
            name: item.name,
          })),
        );
      } catch (err) {
        console.error("Error loading asset form reference data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadFormData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === "checkbox" ? checked : value;

    // Convert select numeric ID values to numbers
    if (
      [
        "device_type_id",
        "device_model_id",
        "cpu_id",
        "ram_id",
        "hhd_id",
        "os_id",
        "location_id",
        "office_id",
        "department_id",
      ].includes(name)
    ) {
      val = val ? Number(val) : null;
    }

    onChange({
      ...formData,
      [name]: val,
    });
  };

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const getImageUrl = (url) => {
    if (!url) return "";
    if (
      url.startsWith("blob:") ||
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }
    const cleanPath = url.replace(/^app\//, "");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
    return `${API_BASE_URL}/${cleanPath}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      showError(
        t(
          "common.invalid_image_type",
          "Please select a valid image file (PNG, JPG, JPEG, WEBP)",
        ),
      );
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError(
        t("common.image_too_large", "Image size must be less than 5MB"),
      );
      return;
    }

    // Set local image file
    setLocalImageFile(file);

    // Create local blob preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);

    // Set parent's image_url with blob preview so that the visual UI is updated instantly
    onChange({
      ...formData,
      image_url: previewUrl,
    });
  };

  const handleRemoveImage = () => {
    setLocalImageFile(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl("");
    }
    onChange({
      ...formData,
      image_url: "",
    });
  };

  const handleSubmitInternal = async (e) => {
    e.preventDefault();

    let finalImageUrl = formData.image_url;

    if (localImageFile) {
      setUploading(true);
      try {
        const data = new FormData();
        data.append("image", localImageFile);

        const res = await ticketService.uploadTicketFile(data);
        const imagePath = res.data?.image_path || res.image_path;

        if (imagePath) {
          finalImageUrl = imagePath;
          // Update parent state so it persists
          onChange({
            ...formData,
            image_url: imagePath,
          });
        } else {
          showError(
            t(
              "common.upload_failed",
              "Failed to upload image. Please try again.",
            ),
          );
          setUploading(false);
          return;
        }
      } catch (err) {
        console.error("Error uploading asset image:", err);
        showError(
          err?.response?.data?.detail ||
            err?.response?.data?.message ||
            err?.message ||
            t(
              "common.upload_error",
              "An error occurred during upload. Please try again.",
            ),
        );
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    // Pass the finalized form data containing the actual uploaded remote URL to the parent's onSubmit
    onSubmit({
      ...formData,
      image_url: finalImageUrl,
    });
  };

  return (
    <form
      onSubmit={handleSubmitInternal}
      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-8"
    >
      {/* Section: General Information */}
      <div className="space-y-5">
        <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
          <span className="w-1.5 h-3 bg-blue-600 rounded-full"></span>
          {t("inventory.asset_form_general", "General Information")}
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
          {/* Category Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-semibold text-slate-600 sm:w-36">
              {t("inventory.asset_device_type")}
              <span className="text-red-500">*</span>
            </label>
            <select
              name="device_type_id"
              value={formData.device_type_id || ""}
              onChange={handleChange}
              required
              className="w-full sm:max-w-md border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 outline-none bg-white transition-all"
            >
              <option value="">
                -- {t("inventory.asset_select_device_type")} --
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Model Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-semibold text-slate-600 sm:w-36">
              {t("inventory.asset_model", "Model")}
            </label>
            <select
              name="device_model_id"
              value={formData.device_model_id || ""}
              onChange={handleChange}
              className="w-full sm:max-w-md border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 outline-none bg-white transition-all"
            >
              <option value="">
                -- {t("inventory.asset_select_model")} --
              </option>
              {deviceModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Device Name */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-semibold text-slate-600 sm:w-36">
              {t("inventory.asset_device_name")}
            </label>
            <input
              type="text"
              name="device_name"
              value={formData.device_name || ""}
              onChange={handleChange}
              placeholder="IT-PC-01"
              className="w-full sm:max-w-md border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Serial Number */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-semibold text-slate-600 sm:w-36">
              {t("inventory.asset_serial")}
            </label>
            <input
              type="text"
              name="serial_number"
              value={formData.serial_number || ""}
              onChange={handleChange}
              placeholder="S/R: 12345678"
              className="w-full sm:max-w-md border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Switch Port */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-semibold text-slate-600 sm:w-36">
              {t("inventory.asset_switch_port", "Switch Port")}
            </label>
            <input
              type="text"
              name="switch_port"
              value={formData.switch_port || ""}
              onChange={handleChange}
              placeholder="Port 24"
              className="w-full sm:max-w-md border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Manufacturer */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-semibold text-slate-600 sm:w-36">
              {t("inventory.asset_manufacturer", "Manufacturer")}
            </label>
            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer || ""}
              onChange={handleChange}
              placeholder="Dell / HP"
              className="w-full sm:max-w-md border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Size */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-semibold text-slate-600 sm:w-36">
              {t("inventory.asset_size", "Size")}
            </label>
            <input
              type="text"
              name="size"
              value={formData.size || ""}
              onChange={handleChange}
              placeholder="24-inch / Mid-Tower"
              className="w-full sm:max-w-md border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* IP Address */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-semibold text-slate-600 sm:w-36">
              {t("inventory.asset_ip")}
            </label>
            <input
              type="text"
              name="ip_address"
              value={formData.ip_address || ""}
              onChange={handleChange}
              placeholder="192.168.1.10"
              className="w-full sm:max-w-md border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* MAC Address */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-semibold text-slate-600 sm:w-36">
              {t("inventory.asset_mac")}
            </label>
            <input
              type="text"
              name="mac_address"
              value={formData.mac_address || ""}
              onChange={handleChange}
              placeholder="00:00:00:00:00:00"
              className="w-full sm:max-w-md border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Asset Image Upload */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
            <label className="text-sm font-semibold text-slate-600 sm:w-36 sm:pt-2">
              {t("inventory.asset_image_url", "Asset Image")}
            </label>
            <div className="w-full sm:max-w-md">
              {uploading ? (
                <div className="flex flex-col items-center justify-center border border-dashed border-slate-300 rounded-xl p-6 bg-slate-50 min-h-36 transition-all duration-300">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="animate-spin text-blue-600 text-2xl mb-2"
                  />
                  <span className="text-xs font-semibold text-slate-500">
                    {t("common.uploading", "Uploading image...")}
                  </span>
                </div>
              ) : formData.image_url ? (
                <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-w-xs shadow-sm transition-all duration-300 hover:shadow-md">
                  <img
                    src={getImageUrl(formData.image_url)}
                    alt="Asset Preview"
                    className="w-full h-36 object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&q=80&w=400";
                    }}
                  />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all duration-300">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold shadow transition-all duration-200 transform scale-90 group-hover:scale-100 flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      <span>{t("common.delete", "Remove")}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-400 cursor-pointer transition-all duration-300 group min-h-36">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-2 group-hover:scale-110 transition-transform duration-300">
                      <FontAwesomeIcon icon={faUpload} />
                    </div>
                    <span className="text-xs font-bold text-slate-700 mb-1">
                      {t("common.upload_image_prompt", "Click to upload image")}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      PNG, JPG, JPEG (Max 5MB)
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section: Hardware Specifications */}
      <div className="space-y-5">
        <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
          <span className="w-1.5 h-3 bg-blue-600 rounded-full"></span>
          {t("inventory.asset_form_hardware", "Hardware Specifications")}
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
          {/* CPU Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-semibold text-slate-600 sm:w-36">
              {t("inventory.asset_cpu")}
            </label>
            <select
              name="cpu_id"
              value={formData.cpu_id || ""}
              onChange={handleChange}
              className="w-full sm:max-w-md border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 outline-none bg-white transition-all"
            >
              <option value="">-- {t("inventory.asset_select_cpu")} --</option>
              {cpus.map((cpu) => (
                <option key={cpu.id} value={cpu.id}>
                  {cpu.name}
                </option>
              ))}
            </select>
          </div>

          {/* RAM Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-semibold text-slate-600 sm:w-36">
              {t("inventory.asset_ram")}
            </label>
            <select
              name="ram_id"
              value={formData.ram_id || ""}
              onChange={handleChange}
              className="w-full sm:max-w-md border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 outline-none bg-white transition-all"
            >
              <option value="">-- {t("inventory.asset_select_ram")} --</option>
              {rams.map((ram) => (
                <option key={ram.id} value={ram.id}>
                  {ram.name}
                </option>
              ))}
            </select>
          </div>

          {/* HDD Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-semibold text-slate-600 sm:w-36">
              {t("inventory.asset_hdd")}
            </label>
            <select
              name="hhd_id"
              value={formData.hhd_id || ""}
              onChange={handleChange}
              className="w-full sm:max-w-md border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 outline-none bg-white transition-all"
            >
              <option value="">-- {t("inventory.asset_select_hdd")} --</option>
              {hdds.map((hdd) => (
                <option key={hdd.id} value={hdd.id}>
                  {hdd.name}
                </option>
              ))}
            </select>
          </div>

          {/* OS Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-semibold text-slate-600 sm:w-36">
              {t("inventory.asset_os")}
            </label>
            <select
              name="os_id"
              value={formData.os_id || ""}
              onChange={handleChange}
              className="w-full sm:max-w-md border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 outline-none bg-white transition-all"
            >
              <option value="">-- {t("inventory.asset_select_os")} --</option>
              {oss.map((os) => (
                <option key={os.id} value={os.id}>
                  {os.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Part Upgrade Logs */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <label className="text-sm font-semibold text-slate-600 sm:w-36 pt-2">
            {t("inventory.asset_part_upgrade")}
          </label>
          <textarea
            name="part_upgrade"
            value={formData.part_upgrade || ""}
            onChange={handleChange}
            rows="2"
            className="w-full lg:max-w-3xl border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 outline-none transition-all"
            placeholder="Describe hardware upgrade history..."
          />
        </div>
      </div>

      {/* Section: Placement & Location */}
      <div className="space-y-5">
        <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
          <span className="w-1.5 h-3 bg-blue-600 rounded-full"></span>
          {t("inventory.asset_form_location", "Placement & Location")}
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
          {/* Office Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-semibold text-slate-600 sm:w-36">
              {t("inventory.asset_office", "Office")}
            </label>
            <select
              name="office_id"
              value={formData.office_id || ""}
              onChange={handleChange}
              className="w-full sm:max-w-md border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 outline-none bg-white transition-all"
            >
              <option value="">
                -- {t("inventory.asset_select_office")} --
              </option>
              {offices.map((off) => (
                <option key={off.id} value={off.id}>
                  {off.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-semibold text-slate-600 sm:w-36">
              {t("inventory.asset_department", "Department")}
            </label>
            <select
              name="department_id"
              value={formData.department_id || ""}
              onChange={handleChange}
              className="w-full sm:max-w-md border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 outline-none bg-white transition-all"
            >
              <option value="">
                -- {t("inventory.asset_select_department")} --
              </option>
              {departments.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.name}
                </option>
              ))}
            </select>
          </div>

          {/* Location Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-semibold text-slate-600 sm:w-36">
              {t("inventory.asset_location")}
            </label>
            <select
              name="location_id"
              value={formData.location_id || ""}
              onChange={handleChange}
              className="w-full sm:max-w-md border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 outline-none bg-white transition-all"
            >
              <option value="">
                -- {t("inventory.asset_select_location")} --
              </option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Building Brand */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-semibold text-slate-600 sm:w-36">
              {t("inventory.asset_building")}
            </label>
            <input
              type="text"
              name="building_brand"
              value={formData.building_brand || ""}
              onChange={handleChange}
              className="w-full sm:max-w-md border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. Building A"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col sm:flex-row gap-2">
            <label className="text-sm font-semibold text-slate-600 sm:w-36 pt-2">
              {t("inventory.description", "Description")}
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows="2"
              className="w-full sm:max-w-md border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 outline-none transition-all"
              placeholder="Asset description..."
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-5 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm font-bold transition-all"
        >
          {t("common.cancel")}
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 hover:bg-blue-700 hover:shadow-blue-500/20 text-sm font-bold transition-all"
        >
          {isEdit ? t("common.update") : t("common.save")}
        </button>
      </div>
    </form>
  );
};

export default AssetForm;
