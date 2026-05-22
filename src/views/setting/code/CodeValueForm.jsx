import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faTimes, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import codeService from "@/services/codeService";
import { useError } from "@/context/ErrorContext";

const emptyForm = {
  code_value: "",
  code_description: "",
  order_position: "",
  is_active: true,
};

const CodeValueForm = () => {
  const { t } = useTranslation();
  const { codeId, valueId } = useParams();
  const navigate = useNavigate();
  const { showError, showSuccess } = useError();
  const [form, setForm] = useState(emptyForm);
  const [codeValues, setCodeValues] = useState([]);
  const [saving, setSaving] = useState(false);
  const numericCodeId = Number(codeId);
  const numericValueId = valueId ? Number(valueId) : null;
  const isEditing = Boolean(numericValueId);

  const values = useMemo(
    () =>
      codeValues
        .filter((item) => item.code_id === numericCodeId && item.is_active !== false)
        .sort(
          (a, b) =>
            ((a?.order_position ?? a?.position ?? "") || 0) -
            ((b?.order_position ?? b?.position ?? "") || 0),
        ),
    [codeValues, numericCodeId],
  );

  const loadValues = async () => {
    const res = await codeService.getCodeValues();
    setCodeValues(res.data || []);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const tasks = [loadValues()];
        if (numericValueId) tasks.push(codeService.getCodeValueById(numericValueId));
        const results = await Promise.all(tasks);
        const value = results[1]?.data;
        if (value) {
          setForm({
            code_value: value?.code_value || value?.code_value_name || value?.name || "",
            code_description: value?.code_description || value?.description || "",
            order_position: value?.order_position ?? value?.position ?? "",
            is_active: !!value.is_active,
          });
        }
      } catch (err) {
        console.error(err);
        showError("Failed to load code value.");
      }
    };

    loadData();
  }, [numericValueId, showError]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const value = form.code_value.trim();
    if (!value) return;

    const payload = {
      code_id: numericCodeId,
      code_value: value,
      code_description: form.code_description.trim() || null,
      order_position: Number(form.order_position) || 1,
      is_active: form.is_active,
    };

    try {
      setSaving(true);
      if (numericValueId) {
        await codeService.updateCodeValue(numericValueId, payload);
        showSuccess(t("codes.value_updated_success", "Code value updated."));
        navigate(`/settings/codes/${numericCodeId}/values`);
      } else {
        await codeService.createCodeValue(payload);
        showSuccess(t("codes.value_created_success", "Code value added."));
        resetForm();
        await loadValues();
      }
    } catch (err) {
      console.error(err);
      showError(err?.response?.data?.detail || t("codes.value_save_failed", "Failed to save code value."));
    } finally {
      setSaving(false);
    }
  };

  const handleDisable = async (item) => {
    if (!window.confirm(t("codes.disable_value_confirm", "Disable this code value?"))) return;

    try {
      await codeService.disableCodeValue(item.id);
      setCodeValues((current) =>
        current.map((value) =>
          value.id === item.id ? { ...value, is_active: false } : value,
        ),
      );
      showSuccess(t("codes.value_disabled_success", "Code value removed."));
    } catch (err) {
      console.error(err);
      showError(t("codes.value_disabled_failed", "Failed to remove code value."));
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate(`/settings/codes/${numericCodeId}/values`)}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          {t("codes.back_to_values", "Back to Code Values")}
        </button>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
          <FontAwesomeIcon icon={faCode} />
          {isEditing ? t("codes.edit_value", "Edit Code Value") : t("codes.add_value", "Add Code Value")}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isEditing 
            ? t("codes.edit_value_description", "Modify this existing system code value detail.")
            : t("codes.add_value_description", "Create and associate a new value with this system code.")}
        </p>
      </div>

      {/* Form and List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4"
        >
          <div>
            <label className="text-sm text-slate-600 font-medium">
              {t("codes.value_label", "Code value")}
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              value={form.code_value}
              onChange={(event) => updateField("code_value", event.target.value)}
              placeholder={t("codes.value_placeholder", "Enter code value")}
              required
              className="w-full mt-1 border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600 font-medium">
              {t("codes.description_label", "Description")}
            </label>
            <textarea
              value={form.code_description}
              onChange={(event) => updateField("code_description", event.target.value)}
              placeholder={t("codes.description_placeholder", "Enter description")}
              rows={3}
              className="w-full mt-1 border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600 font-medium">
              {t("codes.position_label", "Position")}
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={form.order_position}
              onChange={(event) => updateField("order_position", event.target.value)}
              placeholder={t("codes.position_placeholder", "Enter position number")}
              required
              className="w-full mt-1 border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_active"
              checked={form.is_active}
              onChange={(event) => updateField("is_active", event.target.checked)}
              className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm font-semibold text-slate-700 cursor-pointer">
              {t("common.active", "Active")}
            </label>
          </div>

          <div className="flex gap-3 pt-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 disabled:opacity-70 text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
            >
              {isEditing ? t("common.save", "Save") : t("common.add", "Add")}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/settings/codes/${numericCodeId}/values`)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
            >
              {t("common.cancel", "Cancel")}
            </button>
          </div>
        </form>

        {/* Existing Values List Card */}
        {!isEditing && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">
              {t("codes.existing_values", "Existing Values")}
            </h2>
            {values.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">
                {t("codes.no_values_found", "No code values found.")}
              </p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {values.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-slate-800">
                        {item?.code_value || item?.code_value_name || item?.name || ""}
                      </div>
                      <div className="text-xs text-slate-500">
                        {item?.code_description || item?.description || "-"}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                        {t("codes.pos", "Pos")}: {item?.order_position ?? item?.position ?? ""}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDisable(item)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title={t("common.disable", "Disable")}
                      >
                        <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeValueForm;
