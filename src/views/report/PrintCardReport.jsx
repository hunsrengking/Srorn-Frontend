import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import printCardService from "@/services/printCardService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExcel,
  faSearch,
  faAddressCard,
  faEye,
  faUserGraduate,
  faUserTie,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../utils/formatdate";

const PrintCardReport = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [printCards, setPrintCards] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters Input States
  const [searchQueryInput, setSearchQueryInput] = useState("");
  const [entityTypeInput, setEntityTypeInput] = useState("");
  const [fromDateInput, setFromDateInput] = useState("");
  const [toDateInput, setToDateInput] = useState("");

  // Applied Filters State
  const [appliedFilters, setAppliedFilters] = useState({
    searchQuery: "",
    entityType: "",
    fromDate: "",
    toDate: "",
  });

  const handleApply = (e) => {
    if (e) e.preventDefault();
    setAppliedFilters({
      searchQuery: searchQueryInput,
      entityType: entityTypeInput,
      fromDate: fromDateInput,
      toDate: toDateInput,
    });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await printCardService.getPrintCards();
      setPrintCards(res.data || []);
    } catch (err) {
      console.error("Error loading print cards data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered dataset (submitting / applying changes triggers recalculation)
  const filteredCards = React.useMemo(() => {
    return printCards.filter((card) => {
      const { searchQuery, entityType, fromDate, toDate } = appliedFilters;

      // 1. Search Query (Owner name or Description or ID)
      const ownerName = (card.person_name || "").toLowerCase();
      const description = (card.description || "").toLowerCase();
      const cardId = String(card.id || "");
      const matchesSearch =
        ownerName.includes(searchQuery.toLowerCase()) ||
        description.includes(searchQuery.toLowerCase()) ||
        cardId.includes(searchQuery);

      // 2. Entity Type
      const matchesEntityType = entityType
        ? card.entity_type === entityType
        : true;

      // 3. Date range
      if (fromDate || toDate) {
        if (!card.print_date) return false;
        const cardDate = new Date(card.print_date).getTime();

        if (fromDate) {
          const fromTime = new Date(`${fromDate}T00:00:00`).getTime();
          if (cardDate < fromTime) return false;
        }

        if (toDate) {
          const toTime = new Date(`${toDate}T23:59:59`).getTime();
          if (cardDate > toTime) return false;
        }
      }

      return matchesSearch && matchesEntityType;
    });
  }, [printCards, appliedFilters]);

  // Export to CSV/Excel in frontend
  const handleExportCSV = () => {
    if (filteredCards.length === 0) return;

    // Build CSV Content
    const headers = [
      "Card ID",
      "Date Issued",
      "Card Owner",
      "Role",
      "Seller Name",
      "Status",
      "Description",
    ];
    const rows = filteredCards.map((card) => [
      `ENT-${String(card.id).padStart(5, "0")}`,
      formatDate(card.print_date),
      card.person_name || "-",
      card.entity_type === "student" ? "Student" : "Teacher/Employee",
      card.seller_name || "-",
      card.is_print_card ? "Active" : "Inactive",
      card.description || "-",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers.join(","),
        ...rows.map((e) =>
          e.map((val) => `"${val.replace(/"/g, '""')}"`).join(","),
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Print_Card_Report_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
            <FontAwesomeIcon icon={faAddressCard} className="text-blue-600" />
            Print Card Report
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Analyze, filter, and export logs of printed student and employee
            cards.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            disabled={filteredCards.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus:outline-none disabled:opacity-50 cursor-pointer transition-colors"
          >
            <FontAwesomeIcon icon={faFileExcel} /> Export Excel / CSV
          </button>
        </div>
      </div>

      {/* Advanced Filter Form */}
      <form
        onSubmit={handleApply}
        className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
      >
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Search Owner
          </label>
          <div className="relative mt-1.5">
            <input
              type="text"
              placeholder="Search by name, ID..."
              value={searchQueryInput}
              onChange={(e) => setSearchQueryInput(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm pl-9 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-3 text-slate-400 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Entity Type
          </label>
          <select
            value={entityTypeInput}
            onChange={(e) => setEntityTypeInput(e.target.value)}
            className="w-full mt-1.5 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Types</option>
            <option value="student">Student</option>
            <option value="staff">Teacher / Employee</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            From Date
          </label>
          <input
            type="date"
            value={fromDateInput}
            onChange={(e) => setFromDateInput(e.target.value)}
            className="w-full mt-1.5 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            To Date
          </label>
          <input
            type="date"
            value={toDateInput}
            onChange={(e) => setToDateInput(e.target.value)}
            className="w-full mt-1.5 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-slate-900 text-white rounded-xl py-2.5 hover:bg-slate-800 text-sm font-semibold shadow-sm focus:outline-none transition-colors cursor-pointer"
          >
            <FontAwesomeIcon
              icon={faSearch}
              className="mr-1.5 text-xs opacity-75"
            />
            Apply Filters
          </button>
        </div>
      </form>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Ref ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">seller By</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Remarks</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="text-xs">Loading report logs...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCards.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-slate-400 italic"
                  >
                    No print card logs found matching filters.
                  </td>
                </tr>
              ) : (
                filteredCards.map((card) => {
                  const isStudent = card.entity_type === "student";
                  const roleBadge = isStudent
                    ? "bg-blue-50 text-blue-800 border-blue-100"
                    : "bg-purple-50 text-purple-800 border-purple-100";

                  return (
                    <tr
                      key={card.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                        ENT-{String(card.id).padStart(5, "0")}
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">
                        {formatDate(card.print_date)}
                      </td>
                      <td className="px-4 py-3 text-slate-900 font-semibold">
                        {card.person_name}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs border rounded-full font-semibold ${roleBadge}`}
                        >
                          <FontAwesomeIcon
                            icon={isStudent ? faUserGraduate : faUserTie}
                            className="h-3 w-3"
                          />
                          {isStudent ? "Student" : "Teacher"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs">
                        {card.seller_name || "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold ${
                            card.is_print_card
                              ? "text-emerald-600"
                              : "text-rose-500"
                          }`}
                        >
                          <FontAwesomeIcon
                            icon={
                              card.is_print_card ? faCircleCheck : faCircleXmark
                            }
                            className="h-3.5 w-3.5"
                          />
                          {card.is_print_card ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td
                        className="px-4 py-3 text-slate-500 text-xs max-w-xs truncate"
                        title={card.description}
                      >
                        {card.description || "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() =>
                            navigate(`/organization/printcard/${card.id}`)
                          }
                          className="inline-flex items-center justify-center p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 text-xs text-slate-500 bg-slate-50 flex justify-between items-center border-t border-slate-100">
          <span>
            Total Filtered: {filteredCards.length} of {printCards.length}{" "}
            records
          </span>
          <span className="text-slate-400 font-medium">
            Srorn Cards Report System
          </span>
        </div>
      </div>
    </div>
  );
};

export default PrintCardReport;
