import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import codeService from "@/services/codeService";
import { useError } from "@/context/ErrorContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";

const CodeCreate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showError, showSuccess } = useError();
  const [codeName, setCodeName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = codeName.trim();
    if (!name) return;

    try {
      setSaving(true);
      await codeService.createCode({
        codes_name: name,
        is_active: true,
      });
      showSuccess(t("codes.create_success", "Code created successfully."));
      navigate("/settings/codes");
    } catch (err) {
      console.error(err);
      showError(err?.response?.data?.detail || t("codes.create_failed", "Failed to create code."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
          <FontAwesomeIcon icon={faCode} />
          {t("codes.create_new", "Add Code")}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {t("codes.create_description", "Add a new configuration code into the system.")}
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 max-w-xl"
      >
        <div>
          <label className="text-sm text-slate-600 font-medium">
            {t("codes.name_label", "Code name")}
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            required
            value={codeName}
            onChange={(event) => setCodeName(event.target.value)}
            className="w-full mt-1 border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder={t("codes.name_placeholder", "Enter code name")}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 disabled:opacity-70 text-sm font-medium flex items-center gap-2 transition-colors"
          >
            {t("common.save", "Save")}
          </button>

          <button
            type="button"
            onClick={() => navigate("/settings/codes")}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-sm font-medium flex items-center gap-2 transition-colors"
          >
            {t("common.cancel", "Cancel")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CodeCreate;
