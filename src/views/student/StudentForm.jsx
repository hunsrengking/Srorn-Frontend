// src/views/settings/Student/StudentForm.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const StudentForm = ({
  isEdit = false,
  formData,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    onChange({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4"
    >
      {/* First Name */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="text-sm text-slate-600 sm:w-32">
          First Name <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          name="firstname"
          value={formData.firstname || ""}
          onChange={handleChange}
          required
          className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm
          focus:ring-2 focus:ring-blue-400"
          placeholder="First name"
        />
      </div>

      {/* Last Name */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="text-sm text-slate-600 sm:w-32">
          Last Name <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          name="lastname"
          value={formData.lastname || ""}
          onChange={handleChange}
          required
          className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm
          focus:ring-2 focus:ring-blue-400"
          placeholder="Last name"
        />
      </div>

      {/* Khmer First Name */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="text-sm text-slate-600 sm:w-32">
          Khmer First Name
        </label>

        <input
          type="text"
          name="khmer_firstname"
          value={formData.khmer_firstname || ""}
          onChange={handleChange}
          className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm
          focus:ring-2 focus:ring-blue-400"
          placeholder="នាមខ្មែរ"
        />
      </div>

      {/* Khmer Last Name */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="text-sm text-slate-600 sm:w-32">
          Khmer Last Name
        </label>

        <input
          type="text"
          name="khmer_lastname"
          value={formData.khmer_lastname || ""}
          onChange={handleChange}
          className="w-full sm:max-w-md border rounded-xl p-2.5 text-sm
          focus:ring-2 focus:ring-blue-400"
          placeholder="គោត្តនាមខ្មែរ"
        />
      </div>

      {/* Active */}
      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          name="is_active"
          checked={formData.is_active || false}
          onChange={handleChange}
          id="is_active"
        />

        <label htmlFor="is_active" className="text-sm text-slate-600">
          Active
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 text-sm"
        >
          {isEdit ? "Update" : "Create"}
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

export default StudentForm;