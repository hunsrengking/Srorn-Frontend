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
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        {printCards.length === 0 ? (
          <p className="text-sm text-slate-500">{t("roles.not_found")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="py-2 pr-4">No.</th>
                  <th className="py-2 pr-4">Person Name</th>
                  <th className="py-2 pr-4">Print Date</th>
                  <th className="py-2 pr-4">Seller By</th>
                  <th className="py-2 pr-4">Is Print Card</th>
                  <th className="py-2 pr-4">Description</th>
                </tr>
              </thead>

              <tbody>
                {printCards.map((printCard, index) => (
                  <tr
                    key={printCard.id}
                    onClick={() =>
                      navigate(`/organization/printcard/${printCard.id}`)
                    }
                    className="border-b last:border-b-0 hover:bg-slate-50 cursor-pointer"
                  >
                    <td className="py-2 pr-4">{printCard.id}</td>

                    <td className="py-2 pr-4 font-medium text-slate-800">
                      {printCard.person_name}
                    </td>

                    <td className="py-2 pr-4 text-slate-600">
                      {formatDate(printCard.print_date)}
                    </td>

                    <td className="py-2 pr-4 text-slate-600">
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintCard;
