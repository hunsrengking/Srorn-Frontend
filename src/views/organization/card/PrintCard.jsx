import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faAddressCard } from "@fortawesome/free-regular-svg-icons";
import { formatDate } from "../../../utils/formatdate";

const PrintCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [printCards, setPrintCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPrintCards = async () => {
    try {
      const res = await axiosClient.get("/api/organization/printcards");
      setPrintCards(res.data || []);
    } catch (err) {
      console.error("Error loading print cards:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrintCards();
  }, []);

  if (loading)
    return <p className="text-sm text-slate-500">{t("roles.loading")}</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
            <FontAwesomeIcon icon={faAddressCard} />
            {t("print_card.title")}
          </h1>
          <p className="text-sm text-slate-500">
            {t("print_card.description")}
          </p>
        </div>

        <Link
          to="/organization/printcard/newcard"
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-xl shadow hover:bg-blue-700"
        >
          <FontAwesomeIcon icon={faPlus} />
          {t("print_card.print_new")}
        </Link>
      </div>

      {/* Table */}
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
              {printCards.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-sm text-slate-400">
                    {t("roles.not_found")}
                  </td>
                </tr>
              ) : (
                printCards.map((printCard, index) => (
                  <tr
                    key={printCard.id}
                    onClick={() =>
                      navigate(`/organization/printcard/${printCard.id}`)
                    }
                    className="transition-colors duration-150 hover:bg-slate-50 cursor-pointer"
                  >
                    <td className="px-4 py-3 text-slate-700 font-medium">{printCard.id}</td>
                    <td className="px-4 py-3 text-slate-800 font-medium">
                      {printCard.person_name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(printCard.print_date)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {printCard.seller_name}
                    </td>

                    <td className="py-2 pr-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          printCard.is_print_card
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            printCard.is_print_card
                              ? "bg-emerald-500"
                              : "bg-zinc-400"
                          }`}
                        />
                        {printCard.is_print_card ? "True" : "False"}
                      </span>
                    </td>

                    <td className="py-2 pr-4 text-slate-600">
                      {printCard.description}
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

export default PrintCard;
