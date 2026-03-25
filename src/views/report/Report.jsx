import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import axiosClient from "../../services/axiosClient"; // your axios instance
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFileExcel, faFileCsv, faSearch } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../utils/formatdate";

const Report = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("");

  // Fetch filtered reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/api/reports", {
        params: {
          from_date: fromDate || undefined,
          to_date: toDate || undefined,
          status: status || undefined,
        },
      });
      setReports(res.data || []);
    } catch (err) {
      console.error(t("reports.load_error"), err);
    } finally {
      setLoading(false);
    }
  };

  // Filter button
  const handleFilter = (e) => {
    e.preventDefault();
    fetchReports();
  };

  // Export reports
  const handleExport = async (type) => {
    try {
      const params = new URLSearchParams({
        from_date: fromDate || "",
        to_date: toDate || "",
        status: status || "",
        type,
      });
      const response = await axiosClient.get(`/api/reports/export?${params.toString()}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      const ext = type === "excel" ? "xlsx" : type;
      link.href = url;
      link.setAttribute("download", `report.${ext}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(t("reports.export_failed"), err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-800">{t("reports.title")}</h1>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleExport("pdf")} className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 whitespace-nowrap">
            <FontAwesomeIcon icon={faFilePdf} /> {t("reports.pdf")}
          </button>
          <button onClick={() => handleExport("excel")} className="px-3 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 whitespace-nowrap">
            <FontAwesomeIcon icon={faFileExcel} /> {t("reports.excel")}
          </button>
          <button onClick={() => handleExport("csv")} className="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 whitespace-nowrap">
            <FontAwesomeIcon icon={faFileCsv} /> {t("reports.csv")}
          </button>
        </div>
      </div>

      {/* Filter */}
      <form onSubmit={handleFilter} className="bg-white rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm text-gray-600">{t("reports.from_date")}</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-gray-600">{t("reports.to_date")}</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-gray-600">{t("reports.status")}</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full mt-1 border rounded-lg px-3 py-2">
            <option value="">{t("reports.all")}</option>
            <option value="open">{t("reports.open")}</option>
            <option value="Doing">{t("reports.doing")}</option>
            <option value="close">Closed</option>
          </select>
        </div>
        <div className="flex items-end mt-2 md:mt-0">
          <button type="submit" className="w-full bg-gray-900 text-white rounded-lg py-2 hover:bg-gray-800">
            <FontAwesomeIcon icon={faSearch} /> Filter
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                   <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    Loading reports...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                   <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    No report data found
                  </td>
                </tr>
              ) : (
                reports.map((r, index) => (
                  <tr key={r.id} className="transition-colors duration-150 hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-700 font-medium">{index + 1}</td>
                    <td className="px-4 py-3 text-slate-800">{r.title}</td>
                    <td className="px-4 py-3 text-slate-700">{r.department ?? "-"}</td>
                    <td className="px-4 py-3 text-slate-700">{r.category}</td>
                    <td className="px-4 py-3 text-slate-700">{r.priority}</td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-slate-600 font-medium">{r.status}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{r.assigned_to}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(r.create_date)}</td>
                  </tr>
                )))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 text-xs text-slate-500 bg-slate-50 flex justify-between items-center border-t border-slate-100">
          <span>
            Total: {reports.length} reports
          </span>
          <span className="text-slate-400">Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};

export default Report;
