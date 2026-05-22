import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import codeService from "@/services/codeService";
import { useError } from "@/context/ErrorContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faPlus } from "@fortawesome/free-solid-svg-icons";

const Code = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showError } = useError();
  const [codes, setCodes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCodes = async () => {
      try {
        setLoading(true);
        const res = await codeService.getCodes();
        setCodes(res.data || []);
      } catch (err) {
        console.error(err);
        showError("Failed to load codes.");
      } finally {
        setLoading(false);
      }
    };

    loadCodes();
  }, [showError]);

  const filteredCodes = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return codes;
    return codes.filter((item) => {
      const name = item.codes_name || item.code_name || item.name || "";
      return name.toLowerCase().includes(keyword);
    });
  }, [codes, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
            <FontAwesomeIcon icon={faCode} />
            {t("codes.title", "Codes")}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t("codes.description", "Manage system codes and sub codes.")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/settings/codes/create")}
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-xl shadow hover:bg-blue-700 font-medium transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} />
          {t("codes.create_new", "Add Code")}
        </button>
      </div>

      {/* Codes Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Search filter area */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("codes.filter_placeholder", "Filter by name")}
            className="w-full max-w-md border border-slate-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">{t("codes.name", "Code Name")}</th>
                <th className="px-4 py-3 text-right">
                  {t("codes.is_active", "is Active")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    {t("common.loading", "Loading...")}
                  </td>
                </tr>
              ) : filteredCodes.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    {t("codes.not_found", "No codes found.")}
                  </td>
                </tr>
              ) : (
                filteredCodes.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() =>
                      navigate(`/settings/codes/${item.id}/values`)
                    }
                    className="cursor-pointer transition-colors duration-150 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-slate-800 font-medium">
                      {item.codes_name}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          item.is_active !== false
                            ? "bg-blue-50 text-blue-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {String(item.is_active !== false)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 text-xs text-slate-500 bg-slate-50 flex justify-between items-center border-t border-slate-100">
          <span>Showing {filteredCodes.length} codes</span>
          <span className="text-slate-400">Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};

export default Code;
