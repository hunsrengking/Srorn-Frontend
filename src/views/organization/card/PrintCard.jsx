import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import printCardService from "@/services/printCardService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { faAddressCard } from "@fortawesome/free-regular-svg-icons";
import { formatDate } from "../../../utils/formatdate";

const PrintCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [printCards, setPrintCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadPrintCards = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await printCardService.getPrintCards();
      setPrintCards(res.data || []);
    } catch (err) {
      console.error("Error loading print cards:", err);
      setError("Failed to load print cards. Please try again.");
      setPrintCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrintCards();
  }, []);

  const handleViewPrintCard = (id) => {
    navigate(`/organization/printcard/${id}`);
  };

  const handleEditPrintCard = (id) => {
    navigate(`/organization/printcard/${id}/edit`);
  };

  const filteredPrintCards = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return printCards;

    return printCards.filter((printCard) =>
      [
        printCard.id,
        printCard.person_name,
        printCard.seller_name,
        printCard.description,
        formatDate(printCard.print_date),
        printCard.is_print_card ? "printed true" : "not printed false",
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [printCards, searchTerm]);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
              <FontAwesomeIcon icon={faAddressCard} />
              {t("print_card.title")}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t("print_card.description")}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <FontAwesomeIcon icon={faSearch} className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search print cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl
                           focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
                           placeholder:text-slate-400 outline-none"
              />
            </div>

            <Link
              to="/organization/printcard/newcard"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm
                         font-medium rounded-xl bg-blue-600 text-white shadow-sm
                         hover:bg-blue-700 focus:outline-none focus:ring-2
                         focus:ring-blue-500/50"
            >
              <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
              <span>{t("print_card.print_new")}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">No.</th>
                <th className="px-4 py-3">Person Name</th>
                <th className="px-4 py-3">Print Date</th>
                <th className="px-4 py-3">Seller By</th>
                <th className="px-4 py-3">Is Print Card</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    {t("roles.loading")}
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
                      onClick={loadPrintCards}
                      className="ml-2 text-blue-600 hover:text-blue-800 underline"
                    >
                      {t("users.retry", "Retry")}
                    </button>
                  </td>
                </tr>
              ) : filteredPrintCards.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    {t("roles.not_found")}
                  </td>
                </tr>
              ) : (
                filteredPrintCards.map((printCard) => (
                  <tr
                    key={printCard.id}
                    onClick={() => handleViewPrintCard(printCard.id)}
                    className="transition-colors duration-150 hover:bg-slate-50 cursor-pointer"
                  >
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {printCard.id}
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      {printCard.person_name || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(printCard.print_date)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {printCard.seller_name || "-"}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          printCard.is_print_card
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            printCard.is_print_card
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        />
                        {printCard.is_print_card ? "Printed" : "Pending"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-600 max-w-xs">
                      <span className="line-clamp-2">
                        {printCard.description || "-"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div
                        className="inline-flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 text-xs text-slate-500 bg-slate-50 flex justify-between items-center">
          <span>
            Showing {filteredPrintCards.length} of {printCards.length} print
            cards
          </span>
          <span className="text-slate-400">Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};

export default PrintCard;
