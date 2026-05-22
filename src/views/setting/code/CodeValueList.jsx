import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faCode, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import codeService from "@/services/codeService";
import { useError } from "@/context/ErrorContext";

const CodeValueList = () => {
  const { t } = useTranslation();
  const { codeId } = useParams();
  const navigate = useNavigate();
  const { showError, showSuccess } = useError();
  const [code, setCode] = useState(null);
  const [codeValues, setCodeValues] = useState([]);
  const [loading, setLoading] = useState(false);

  const numericCodeId = Number(codeId);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [codeRes, valuesRes] = await Promise.all([
          codeService.getCodeById(numericCodeId),
          codeService.getCodeValues(),
        ]);
        setCode(codeRes.data);
        setCodeValues(valuesRes.data || []);
      } catch (err) {
        console.error(err);
        showError("Failed to load code values.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [numericCodeId, showError]);

  const values = useMemo(
    () =>
      codeValues
        .filter((item) => item.code_id === numericCodeId)
        .sort(
          (a, b) =>
            ((a?.order_position ?? a?.position ?? "") || 0) -
            ((b?.order_position ?? b?.position ?? "") || 0),
        ),
    [codeValues, numericCodeId],
  );

  const handleDisable = async (item) => {
    if (!window.confirm(t("codes.disable_value_confirm", "Disable this code value?"))) return;

    try {
      await codeService.disableCodeValue(item.id);
      showSuccess(t("codes.disable_value_success", "Code value disabled."));
      setCodeValues((current) =>
        current.map((value) =>
          value.id === item.id ? { ...value, is_active: false } : value,
        ),
      );
    } catch (err) {
      console.error(err);
      showError(t("codes.disable_value_failed", "Failed to disable code value."));
    }
  };

  const codeName = (code?.codes_name || code?.code_name || code?.name || "");

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate("/settings/codes")}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          {t("common.back", "Back to Codes")}
        </button>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-slate-900">
            <FontAwesomeIcon icon={faCode} />
            {codeName || t("codes.values_title", "Code Values")}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t("codes.values_description", {
              name: codeName || "this code",
              defaultValue: `Manage values and details for ${codeName || "this code"}.`,
            })}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/settings/codes/${numericCodeId}/values/create`)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-xl shadow hover:bg-blue-700 font-medium transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} />
          {t("codes.add_value", "Add Value")}
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">{t("codes.value_name", "Name")}</th>
                <th className="px-4 py-3">{t("codes.value_description", "Description")}</th>
                <th className="px-4 py-3">{t("codes.value_position", "Position")}</th>
                <th className="px-4 py-3">{t("codes.value_status", "Active")}</th>
                <th className="px-4 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    {t("common.loading", "Loading...")}
                  </td>
                </tr>
              ) : values.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    {t("codes.no_values_found", "No code values found.")}
                  </td>
                </tr>
              ) : (
                values.map((item) => (
                  <tr key={item.id} className="transition-colors duration-150 hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-800 font-medium">
                      {item?.code_value || item?.code_value_name || item?.name || ""}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {(item?.code_description || item?.description || "") || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-medium">
                      {item?.order_position ?? item?.position ?? ""}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          item.is_active !== false
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {String(item.is_active !== false)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/settings/codes/${numericCodeId}/values/${item.id}/edit`)
                          }
                          className="inline-flex items-center justify-center h-8 px-3 rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors text-xs font-medium cursor-pointer"
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faEdit} className="mr-1" />
                          {t("common.edit", "Edit")}
                        </button>
                        {item.is_active !== false && (
                          <button
                            type="button"
                            onClick={() => handleDisable(item)}
                            className="inline-flex items-center justify-center h-8 px-3 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors text-xs font-medium cursor-pointer"
                            title="Disable"
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-1" />
                            {t("common.disable", "Disable")}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 text-xs text-slate-500 bg-slate-50 flex justify-between items-center border-t border-slate-100">
          <span>
            Showing {values.length} code values
          </span>
          <span className="text-slate-400">Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};

export default CodeValueList;
