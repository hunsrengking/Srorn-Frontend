// src/views/organization/card/PrintCardForm.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import axiosClient from "../../../services/axiosClient";
import { faPlusCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PrintCardForm = ({ formData, onChange, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [positions, setPositions] = useState([]);
  const [allNames, setAllNames] = useState([]);
  const [names, setNames] = useState([]);
  const [loadingPositions, setLoadingPositions] = useState(true);
  const [loadingNames, setLoadingNames] = useState(false);

  const [cableChecked, setCableChecked] = useState(false);
  const [cables, setCables] = useState([]);

  // Load positions
  const loadPositions = async () => {
    try {
      const res = await axiosClient.get("/api/positions");
      setPositions(res.data || []);
    } catch (err) {
      console.error("Error loading positions:", err);
    } finally {
      setLoadingPositions(false);
    }
  };

  // Load students
  const loadStudents = async () => {
    try {
      const res = await axiosClient.get("/api/students");
      const data = res.data || [];
      setAllNames((prev) => {
        const merged = [...prev, ...data];
        const unique = merged.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id),
        );
        return unique;
      });
    } catch (err) {
      console.error("Error loading names:", err);
    }
  };

  // Load Employees
  const loadEmployees = async () => {
    try {
      const res = await axiosClient.get("/api/staff");
      const data = res.data || [];
      setAllNames((prev) => {
        const merged = [...prev, ...data];
        const unique = merged.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id),
        );
        return unique;
      });
    } catch (err) {
      console.error("Error loading names:", err);
    }
  };

  // Load names based on position
  const loadNames = async (positionId) => {
    if (!positionId) return setNames([]);

    const filtered = allNames.filter(
      (item) => String(item.position_id) === String(positionId),
    );

    // remove duplicate ids
    const unique = filtered.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id),
    );

    setNames(unique);
  };

  useEffect(() => {
    setAllNames([]); // prevent duplicate in React StrictMode
    loadPositions();
    loadStudents();
    loadEmployees();
  }, []);

  // Handlers
  const handlePositionChange = (selected) => {
    const positionId = selected ? selected.value : "";
    onChange({
      ...formData,
      position_id: positionId,
      staff_id: "",
      display_name: "",
      print_date: "",
      description: "",
      is_print_card: "",
      cables: [],
    });
    setCableChecked(false);
    setCables([]);
    loadNames(positionId);
  };

  const handleNameChange = (selected) => {
    onChange({
      ...formData,
      staff_id: selected ? selected.value : "",
      display_name: selected ? selected.label : "",
    });
  };

  const handleInputChange = (e) => {
    onChange({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCableCheckbox = (e) => {
    const checked = e.target.checked;
    setCableChecked(checked);

    if (checked && cables.length === 0) {
      const newCables = [{ value: "", color: "" }];
      setCables(newCables);
      onChange({ ...formData, cables: newCables });
    } else if (!checked) {
      setCables([]);
      onChange({ ...formData, cables: [] });
    }
  };

  const handleAddCable = () => {
    const newCables = [...cables, { value: "", color: "" }];
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

  // Map data for react-select
  const positionOptions = positions.map((p) => ({
    value: p.id,
    label: p.title,
  }));

  const nameOptions = names.map((n) => ({
    value: n.id,
    label: n.display_name,
  }));

  const colorOptions = [
    { value: "1", label: "Red" },
    { value: "2", label: "Green" },
    { value: "3", label: "Blue" },
    { value: "4", label: "Yellow" },
  ];
  const handleSellerChange = (selected) => {
    onChange({
      ...formData,
      seller_id: selected ? selected.value : "",
      seller_name: selected ? selected.label : "",
    });
  };
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
            isLoading={loadingPositions}
            onChange={handlePositionChange}
            placeholder={t("staff.select_position")}
            value={
              positionOptions.find((o) => o.value === formData.position_id) ||
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
                isLoading={loadingNames}
                onChange={handleNameChange}
                placeholder={t(
                  "print_card.search_name",
                  "Select and search by name...",
                )}
                value={
                  nameOptions.find((o) => o.value === formData.staff_id) || null
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
            <input
              type="date"
              name="print_date"
              value={formData.print_date || ""}
              onChange={handleInputChange}
              required
              className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Seller By Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm text-slate-600 sm:w-32">
              {t("print_card.seller_by", "Seller By")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="w-full sm:max-w-md">
              <Select
                options={[
                  ...new Map(
                    allNames.map((n) => [
                      n.id,
                      { value: n.id, label: n.display_name },
                    ]),
                  ).values(),
                ]}
                isLoading={loadingNames}
                onChange={handleSellerChange}
                placeholder={t(
                  "print_card.search_name",
                  "Select and search by name...",
                )}
                value={
                  allNames
                    .map((n) => ({ value: n.id, label: n.display_name }))
                    .find((o) => o.value === formData.seller_id) || null
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
                  className={`px-3 py-1 rounded-xl text-sm text-white ${
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
                  className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:max-w-md sm:ml-34"
                >
                  <input
                    type="text"
                    placeholder={t(
                      "print_card.enter_cable",
                      "Enter cable value...",
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
                      colorOptions.find((col) => col.value === c.color) || null
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
