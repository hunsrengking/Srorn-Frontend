// src/views/organization/card/PrintCardForm.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import axiosClient from "../../../services/axiosClient";
import { faPlusCircle, faXmarkCircle, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO, isValid } from "date-fns";

const PrintCardForm = ({ formData, onChange, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [positions, setPositions] = useState([]);
  const [allNames, setAllNames] = useState([]);
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cableChecked, setCableChecked] = useState(false);
  const [cables, setCables] = useState([]);

  // Load template data (positions, staffs, students)
  const loadTemplate = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/api/organization/templates/printcards");
      const { staffs, students, positions } = res.data;

      setPositions(positions || []);

      const combined = [
        ...(staffs || []).map((s) => ({ ...s, person_type: "staff", dropdown_id: `staff_${s.id}` })),
        ...(students || []).map((s) => ({ ...s, person_type: "student", dropdown_id: `student_${s.id}` })),
      ];

      setAllNames(combined);

      // If editing, load names for the current position
      if (formData.position_id) {
        const filtered = combined.filter(
          (item) => String(item.position_id) === String(formData.position_id)
        );
        setNames(filtered);
      }
    } catch (err) {
      console.error("Error loading template:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplate();
  }, []);

  // Sync names and auto-discover position_id if missing
  useEffect(() => {
    if (allNames.length > 0) {
      let currentPositionId = formData.position_id;

      // If position_id is missing but staff_id exists, try to find the position from allNames
      if (!currentPositionId && formData.staff_id) {
        const person = allNames.find(n => String(n.id) === String(formData.staff_id));
        if (person) {
          currentPositionId = person.position_id;
          // Silently update parent with the discovered position_id
          onChange({
            ...formData,
            position_id: currentPositionId
          });
        }
      }

      if (currentPositionId) {
        const filtered = allNames.filter(
          (item) => String(item.position_id) === String(currentPositionId)
        );
        setNames(filtered);
      } else {
        setNames([]);
      }
    }
  }, [formData.position_id, formData.staff_id, allNames]);

  useEffect(() => {
    if (formData.cables && formData.cables.length > 0) {
      setCableChecked(true);
      setCables(formData.cables);
    } else {
      setCableChecked(false);
      setCables([]);
    }
  }, [formData.cables]);

  // Handlers
  const handlePositionChange = (selected) => {
    const positionId = selected ? selected.value : "";

    onChange({
      ...formData,
      position_id: positionId,
      staff_id: "",
      dropdown_id: "",
      display_name: "",
      cables: [],
    });

    if (!positionId) {
      setNames([]);
    } else {
      const filtered = allNames.filter(
        (item) => String(item.position_id) === String(positionId)
      );
      setNames(filtered);
    }

    setCableChecked(false);
    setCables([]);
  };

  const handleNameChange = (selected) => {
    const person = allNames.find(n => n.dropdown_id === selected?.value);

    onChange({
      ...formData,
      staff_id: person ? person.id : "",
      dropdown_id: selected ? selected.value : "",
      display_name: selected ? selected.label : "",
    });
  };

  const handleInputChange = (e) => {
    onChange({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    const dateString = date && isValid(date) ? format(date, "yyyy-MM-dd") : "";
    onChange({
      ...formData,
      print_date: dateString,
    });
  };

  const handleCableCheckbox = (e) => {
    const checked = e.target.checked;
    setCableChecked(checked);

    if (checked && cables.length === 0) {
      const newCables = [{ value: "1", color: "" }];
      setCables(newCables);
      onChange({ ...formData, cables: newCables });
    } else if (!checked) {
      setCables([]);
      onChange({ ...formData, cables: [] });
    }
  };

  const handleAddCable = () => {
    const newCables = [...cables, { value: "1", color: "" }];
    setCables(newCables);
    onChange({ ...formData, cables: newCables });
  };

  const handleRemoveCable = (index) => {
    const newCables = [...cables];
    newCables.splice(index, 1);
    setCables(newCables);
    onChange({ ...formData, cables: newCables });
  };

  const handleCableChange = (index, field, val) => {
    const newCables = [...cables];
    newCables[index][field] = val;
    setCables(newCables);
    onChange({ ...formData, cables: newCables });
  };

  const handleSellerChange = (selected) => {
    const person = allNames.find(n => n.dropdown_id === selected?.value);
    onChange({
      ...formData,
      seller_id: person ? person.id : "",
      seller_dropdown_id: selected ? selected.value : "",
      seller_name: selected ? selected.label : "",
    });
  };

  // Map options
  const positionOptions = positions.map((p) => ({
    value: p.id,
    label: p.title,
  }));

  const nameOptions = names.map((n) => ({
    value: n.dropdown_id,
    label: n.display_name,
  }));

  const sellerOptions = allNames
    .filter(n => {
      if (n.person_type !== "staff") return false;
      const pos = positions.find(p => String(p.id) === String(n.position_id));
      return pos && pos.title?.toLowerCase() === "seller";
    })
    .map(n => ({
      value: n.dropdown_id,
      label: n.display_name,
    }));

  const colorOptions = [
    { value: "1", label: "Red" },
    { value: "2", label: "Green" },
    { value: "3", label: "Blue" },
    { value: "4", label: "Yellow" },
  ];

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4"
    >
      {/* Position select */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="text-sm text-slate-600 sm:w-32">
          {t("staff.position", "Position")}{" "}
          <span className="text-red-500">*</span>
        </label>
        <div className="w-full sm:max-w-md">
          <Select
            options={positionOptions}
            isLoading={loading}
            onChange={handlePositionChange}
            placeholder={t("staff.select_position")}
            value={
              positionOptions.find((o) => String(o.value) === String(formData.position_id)) ||
              null
            }
            isClearable
          />
        </div>
      </div>

      {/* Show fields only after position is selected */}
      {formData.position_id && (
        <>
          {/* Name select */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm text-slate-600 sm:w-32">
              {t("departments.member_name", "Name")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="w-full sm:max-w-md">
              <Select
                options={nameOptions}
                isLoading={loading}
                onChange={handleNameChange}
                placeholder={t(
                  "print_card.search_name",
                  "Select and search by name...",
                )}
                value={
                  nameOptions.find((o) => {
                    const person = allNames.find(n => n.dropdown_id === o.value);
                    return person && String(person.id) === String(formData.staff_id);
                  }) || null
                }
                isClearable
                isSearchable
              />
            </div>
          </div>
          {/* Print Card Checkbox */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm text-slate-600 sm:w-32">
              {t("print_card.print_card", "Print Card")}
            </label>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(formData.is_print_card)}
                onChange={(e) =>
                  onChange({
                    ...formData,
                    is_print_card: e.target.checked,
                  })
                }
              />
              <span className="text-sm text-slate-600">
                {t("print_card.enable_print", "Enable printing")}
              </span>
            </div>
          </div>
          {/* Print Date */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm text-slate-600 sm:w-32">
              {t("print_card.print_date", "Print Date")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative w-full sm:max-w-md">
              <DatePicker
                selected={formData.print_date ? parseISO(formData.print_date) : null}
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

          {/* Seller By Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm text-slate-600 sm:w-32">
              {t("print_card.seller_by", "Seller By")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="w-full sm:max-w-md">
              <Select
                options={sellerOptions}
                isLoading={loading}
                onChange={handleSellerChange}
                placeholder={t(
                  "print_card.search_name",
                  "Select and search by name...",
                )}
                value={
                  sellerOptions.find((o) => {
                    const person = allNames.find(n => n.dropdown_id === o.value);
                    return person && String(person.id) === String(formData.seller_id);
                  }) || null
                }
                isClearable
                isSearchable
              />
            </div>
          </div>

          {/* Cable Section */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm text-slate-600 sm:w-32">
                {t("print_card.cable", "Cable")}
              </label>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="checkbox"
                  checked={cableChecked}
                  onChange={handleCableCheckbox}
                  className="h-5 w-5"
                />
                <button
                  type="button"
                  onClick={handleAddCable}
                  disabled={!cableChecked}
                  className={`px-3 py-1 rounded-xl text-sm text-white ${cableChecked
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
                  className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:max-w-md sm:ml-34"
                >
                  <input
                    type="number"
                    min="1"
                    placeholder={t(
                      "print_card.enter_quantity",
                      "Enter quantity...",
                    )}
                    value={c.value}
                    onChange={(e) =>
                      handleCableChange(idx, "value", e.target.value)
                    }
                    className="border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 flex-1"
                  />
                  <Select
                    options={colorOptions}
                    value={
                      colorOptions.find((col) => String(col.value) === String(c.color)) || null
                    }
                    onChange={(sel) =>
                      handleCableChange(idx, "color", sel?.value || "")
                    }
                    placeholder={t(
                      "print_card.select_color",
                      "Select color...",
                    )}
                    isClearable
                    className="w-64"
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
            <label className="text-sm text-slate-600 sm:w-32">
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
        </>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2">
        <button
          type="submit"
          disabled={
            !formData.position_id ||
            !formData.staff_id ||
            !formData.print_date ||
            (cableChecked && cables.some((c) => !c.value || !c.color))
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 text-sm"
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
