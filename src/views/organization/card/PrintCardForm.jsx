// src/views/organization/card/PrintCardForm.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import printCardService from "@/services/printCardService";
import {
  faPlusCircle,
  faXmarkCircle,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO, isValid } from "date-fns";

const PrintCardForm = ({ formData, onChange, onSubmit, onCancel }) => {
  const { t } = useTranslation();

  const [sellerOptions, setSellerOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [cableChecked, setCableChecked] = useState(false);
  const [cables, setCables] = useState([]);
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  const loadTemplate = useCallback(
    async (entity_type, entry_id, current_seller_id) => {
      if (!entity_type || !entry_id) return;
      try {
        setLoadingTemplate(true);
        const res = await printCardService.getPrintCardTemplatesByEntity(
          entity_type,
          entry_id,
        );
        const data = res.data;

        const allSellers = data.sellerOption || [];
        const filtered = allSellers
          .filter((s) => s.position_title?.toLowerCase() === "seller")
          .map((s) => ({
            value: s.id,
            label: s.display_name,
          }));

        if (current_seller_id) {
          const hasCurrent = filtered.some(
            (s) => String(s.value) === String(current_seller_id),
          );
          if (!hasCurrent) {
            const currentStaff = allSellers.find(
              (s) => String(s.id) === String(current_seller_id),
            );
            if (currentStaff) {
              filtered.push({
                value: currentStaff.id,
                label: currentStaff.display_name,
              });
            }
          }
        }

        setSellerOptions(filtered);
        setColorOptions(
          (data.cardColorsOption || []).map((c) => ({
            value: c.id,
            label: c.code_value,
          })),
        );
      } catch (err) {
        console.error("Error loading template:", err);
      } finally {
        setLoadingTemplate(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadTemplate(formData.entity_type, formData.entry_id, formData.seller_id);
  }, [
    formData.entity_type,
    formData.entry_id,
    formData.seller_id,
    loadTemplate,
  ]);

  // ── Sync cables ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (formData.cables?.length > 0) {
      setCableChecked(true);
      setCables(formData.cables);
    } else {
      setCableChecked(false);
      setCables([]);
    }
  }, [formData.cables]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleDateChange = (date) =>
    onChange({
      ...formData,
      print_date: date && isValid(date) ? format(date, "yyyy-MM-dd") : "",
    });

  const handleSellerChange = (sel) =>
    onChange({ ...formData, seller_id: sel?.value || "" });

  const handleInputChange = (e) =>
    onChange({ ...formData, [e.target.name]: e.target.value });

  const handleCableCheckbox = (e) => {
    const checked = e.target.checked;
    setCableChecked(checked);
    if (checked && cables.length === 0) {
      const init = [{ value: "1", color: "" }];
      setCables(init);
      onChange({ ...formData, cables: init });
    } else if (!checked) {
      setCables([]);
      onChange({ ...formData, cables: [] });
    }
  };

  const handleAddCable = () => {
    const next = [...cables, { value: "1", color: "" }];
    setCables(next);
    onChange({ ...formData, cables: next });
  };

  const handleRemoveCable = (i) => {
    const next = cables.filter((_, idx) => idx !== i);
    setCables(next);
    onChange({ ...formData, cables: next });
  };

  const handleCableChange = (i, field, val) => {
    const next = cables.map((c, idx) =>
      idx === i ? { ...c, [field]: val } : c,
    );
    setCables(next);
    onChange({ ...formData, cables: next });
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const sellerValue =
    sellerOptions.find((o) => String(o.value) === String(formData.seller_id)) ||
    null;

  const canSubmit =
    formData.entry_id &&
    formData.print_date &&
    formData.seller_id &&
    !(cableChecked && cables.some((c) => !c.value || !c.color));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4"
    >
      {/* Print Card toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="text-sm text-slate-600 sm:w-36">
          {t("print_card.print_card", "Print Card")}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(formData.is_print_card)}
            onChange={(e) =>
              onChange({ ...formData, is_print_card: e.target.checked })
            }
          />
          <span className="text-sm text-slate-600">
            {t("print_card.enable_print", "Enable printing")}
          </span>
        </div>
      </div>

      {/* Print Date */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="text-sm text-slate-600 sm:w-36">
          {t("print_card.print_date", "Print Date")}{" "}
          <span className="text-red-500">*</span>
        </label>
        <div className="relative w-full sm:max-w-md">
          <DatePicker
            selected={
              formData.print_date ? parseISO(formData.print_date) : null
            }
            onChange={handleDateChange}
            dateFormat="eeee dd MMMM yyyy"
            placeholderText={t("print_card.select_date", "Select date...")}
            className="w-full border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            wrapperClassName="w-full"
            showPopperArrow={false}
            required
          />
          <FontAwesomeIcon
            icon={faCalendarAlt}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Seller By — from template response */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="text-sm text-slate-600 sm:w-36">
          {t("print_card.seller_by", "Seller By")}{" "}
          <span className="text-red-500">*</span>
        </label>
        <div className="w-full sm:max-w-md">
          <Select
            options={sellerOptions}
            value={sellerValue}
            onChange={handleSellerChange}
            isLoading={loadingTemplate}
            placeholder={t("print_card.search_name", "Select seller...")}
            isClearable
            isSearchable
          />
        </div>
      </div>

      {/* Cable section */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="text-sm text-slate-600 sm:w-36">
            {t("print_card.cable", "Cable")}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={cableChecked}
              onChange={handleCableCheckbox}
            />
            <span className="text-sm text-slate-600">
              {t("print_card.enable_cable", "Enable cables")}
            </span>
            <button
              type="button"
              onClick={handleAddCable}
              disabled={!cableChecked}
              className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs text-white transition-colors ${
                cableChecked
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              <FontAwesomeIcon icon={faPlusCircle} />
            </button>
          </div>
        </div>

        {cableChecked &&
          cables.map((c, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:max-w-md sm:ml-36"
            >
              <input
                type="number"
                min="1"
                placeholder={t("print_card.enter_quantity", "Qty...")}
                value={c.value}
                onChange={(e) =>
                  handleCableChange(idx, "value", e.target.value)
                }
                className="border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 flex-1"
              />
              <Select
                options={colorOptions}
                value={
                  colorOptions.find(
                    (o) => String(o.value) === String(c.color),
                  ) || null
                }
                onChange={(sel) =>
                  handleCableChange(idx, "color", sel?.value || "")
                }
                placeholder={t("print_card.select_color", "Color...")}
                isClearable
                className="w-56"
              />
              <button
                type="button"
                onClick={() => handleRemoveCable(idx)}
                className="px-3 py-1 bg-red-500 text-white rounded-xl text-sm"
              >
                <FontAwesomeIcon icon={faXmarkCircle} />
              </button>
            </div>
          ))}
      </div>

      {/* Description */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-2">
        <label className="text-sm text-slate-600 sm:w-36">
          {t("departments.description")}
        </label>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          rows={3}
          className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 resize-none"
          placeholder={t("departments.desc_placeholder")}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("common.submit")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-sm"
        >
          {t("common.cancel")}
        </button>
      </div>
    </form>
  );
};

export default PrintCardForm;
