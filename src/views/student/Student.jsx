// src/views/settings/Student/Student.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEdit,
  faTrash,
  faPlus,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import { hasPermission } from "../../utils/permission";
import { errorService } from "../../services/errorService";

const Student = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [Student, setStudent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Fixed page size, can make it configurable
  const [totalItems, setTotalItems] = useState(0);

  const loadStudent = async (page = 1, limit = pageSize, search = "") => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append('search', search);
      const res = await axiosClient.get(`/api/students?${params.toString()}`);
      setStudent(res.data.data || res.data || []);
      setTotalItems(res.data.total || res.data.length || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error loading Student:", err);
      setError("Failed to load Student. Please try again.");
      setStudent([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm]);

  useEffect(() => {
    loadStudent(currentPage, pageSize, searchTerm);
    if (location.state?.message) {
      errorService.success(location.state.message);
    }
  }, [currentPage, searchTerm]);

  const handleAddStudent = () => {
    navigate("/students/create");
  };

  const handleEditStudent = (id) => {
    navigate(`/students/${id}/edit`);
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Student?")) return;

    try {
      await axiosClient.delete(`/api/students/${id}`);
      setStudent((prev) => prev.filter((u) => u.id !== id));
      errorService.success("Student deleted successfully");
    } catch (err) {
      console.error("Error deleting Student:", err);
    }
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // No client-side filtering needed since search is server-side

  return (
    <div className="space-y-5">
      {/* Header + Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
              <FontAwesomeIcon icon={faUserGraduate} />
              {t("Student.title")}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t("Student.description")}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <FontAwesomeIcon icon={faSearch} className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder={t("Student.search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl
                           focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
                           placeholder:text-slate-400 outline-none"
              />
            </div>

            {hasPermission("CREATE_STUDENTS") && (
              <button
                onClick={handleAddStudent}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm
                         font-medium rounded-xl bg-blue-600 text-white shadow-sm
                         hover:bg-blue-700 focus:outline-none focus:ring-2
                         focus:ring-blue-500/50"
              >
                <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                <span>{t("Student.add_new")}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">{t("Student.id")}</th>
                <th className="px-4 py-3">First Name</th>
                <th className="px-4 py-3">Last Name</th>
                <th className="px-4 py-3">Khmer Name</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">{t("Student.status")}</th>
                <th className="px-4 py-3 text-right">{t("Student.actions")}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    {t("Student.loading")}
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-red-500"
                  >
                    {error}
                    <button
                      onClick={() => loadStudent(currentPage, pageSize, searchTerm)}
                      className="ml-2 text-blue-600 hover:text-blue-800 underline"
                    >
                      {t("Student.retry")}
                    </button>
                  </td>
                </tr>
              ) : Student.length > 0 ? (
                Student.map((u) => (
                  <tr
                    key={u.id}
                    onClick={
                      hasPermission("VIEW_STUDENTS")
                        ? () => handleViewStudent(u.id)
                        : undefined
                    }
                    className={`transition-colors duration-150
                    ${hasPermission("VIEW_STUDENTS")
                        ? "hover:bg-slate-50 cursor-pointer"
                        : "cursor-not-allowed opacity-60"
                      }`}
                  >
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {u.id}
                    </td>

                    <td className="px-4 py-3 text-slate-800">
                      {u.firstname || "-"}
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {u.lastname || "-"}
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {u.khmer_firstname} {u.khmer_lastname}
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {u.position_name || "-"}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                          ${u.is_active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-red-50 text-red-700 border border-red-100"
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5
                            ${u.is_active ? "bg-emerald-500" : "bg-red-500"
                            }`}
                        />
                        {u.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div
                        className="inline-flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {hasPermission("UPDATE_STUDENTS") && (
                          <button
                            onClick={() => handleEditStudent(u.id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                     text-slate-500 hover:text-blue-600 hover:bg-blue-50
                                     transition-colors"
                          >
                            <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                          </button>
                        )}

                        {hasPermission("DELETE_STUDENTS") && (
                          <button
                            onClick={() => handleDeleteStudent(u.id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                     text-slate-500 hover:text-red-600 hover:bg-red-50
                                     transition-colors"
                          >
                            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    {t("Student.not_found")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 text-xs text-slate-500 bg-slate-50 flex justify-between items-center">
          <span>
            Showing {Student.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} students
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 text-xs border border-slate-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              Previous
            </button>
            <span className="text-slate-600">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-2 py-1 text-xs border border-slate-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Student;