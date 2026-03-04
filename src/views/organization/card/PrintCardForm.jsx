// src/views/organization/card/PrintCardForm.jsx
import React, { useState, useEffect } from "react";
import Select from "react-select";
import axiosClient from "../../../services/axiosClient";
import { faPlusCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PrintCardForm = ({ formData, onChange, onSubmit, onCancel }) => {
  const [positions, setPositions] = useState([]);
  const [names, setNames] = useState([]);
  const [loadingPositions, setLoadingPositions] = useState(true);
  const [loadingNames, setLoadingNames] = useState(false);

  const [cableChecked, setCableChecked] = useState(false);
  const [cables, setCables] = useState([]); // array of { value, color }

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

  // Load names based on position
  const loadNames = async (positionId) => {
    if (!positionId) return setNames([]);
    setLoadingNames(true);
    try {
      const res = await axiosClient.get(`/api/staff?position_id=${positionId}`);
      setNames(res.data || []);
    } catch (err) {
      console.error("Error loading names:", err);
    } finally {
      setLoadingNames(false);
    }
  };

  useEffect(() => {
    loadPositions();
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
      // Add first cable by default
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

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4"
    >
      {/* Position select */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="text-sm text-slate-600 sm:w-32">
          Position <span className="text-red-500">*</span>
        </label>
        <div className="w-full sm:max-w-md">
          <Select
            options={positionOptions}
            isLoading={loadingPositions}
            onChange={handlePositionChange}
            placeholder="Select position..."
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
              Name <span className="text-red-500">*</span>
            </label>
            <div className="w-full sm:max-w-md">
              <Select
                options={nameOptions}
                isLoading={loadingNames}
                onChange={handleNameChange}
                placeholder="Select and search by name..."
                value={
                  nameOptions.find((o) => o.value === formData.staff_id) || null
                }
                isClearable
                isSearchable
              />
            </div>
          </div>

          {/* Print Date */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm text-slate-600 sm:w-32">
              Print Date <span className="text-red-500">*</span>
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
              Seller By <span className="text-red-500">*</span>
            </label>
            <div className="w-full sm:max-w-md">
              <Select
                options={nameOptions}
                isLoading={loadingNames}
                onChange={handleNameChange}
                placeholder="Select and search by name..."
                value={
                  nameOptions.find((o) => o.value === formData.staff_id) || null
                }
                isClearable
                isSearchable
              />
            </div>
          </div>

          {/* Cable Section */}
          <div className="flex flex-col gap-2">
            {/* Label + checkbox + Add button row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm text-slate-600 sm:w-32">Cable</label>
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

            {/* Cable entries: value + color */}
            {cableChecked &&
              cables.map((c, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:max-w-md sm:ml-34"
                >
                  <input
                    type="text"
                    placeholder="Enter cable value..."
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
                    placeholder="Select color..."
                    isClearable
                    className="w-64"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCable(idx)}
                    className="px-3 py-1 bg-red-500 text-white rounded-xl text-sm"
                  >
                    {/* <FontAwesomeIcon icon={faPlus} /> */}
                    <FontAwesomeIcon icon={faXmarkCircle} />
                  </button>
                </div>
              ))}
          </div>

          {/* Description */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
            <label className="text-sm text-slate-600 sm:w-32">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              rows={3}
              className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-400 resize-none"
              placeholder="Enter description..."
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
          Submit
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PrintCardForm;
