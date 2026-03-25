import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useError } from "../../../context/ErrorContext";

const Telegram = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showSuccess, showError } = useError();

  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [configId, setConfigId] = useState(null);

  const [configs, setConfigs] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    fetchConfigList();
  }, []);

  const fetchConfigList = async () => {
    try {
      setLoadingList(true);
      const res = await axiosClient.get("/api/telegram");
      setConfigs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  };

  // ================= SAVE / UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (configId) {
        await axiosClient.put(`/api/telegram/${configId}`, {
          bot_token: botToken,
          chat_id: chatId,
          is_active: isActive,
        });
      } else {
        await axiosClient.post("/api/telegram", {
          bot_token: botToken,
          chat_id: chatId,
          is_active: isActive,
        });
      }

      resetForm();
      fetchConfigList();
      showSuccess(t("telegram.save_success", "Telegram configuration saved successfully"));
    } catch (err) {
      console.error(err);
      showError(err?.response?.data?.message || err?.message || t("telegram.save_failed", "Failed to save configuration"));
    } finally {
      setLoading(false);
    }
  };

  // ================= SELECT ROW (EDIT) =================
  const handleSelectRow = (item) => {
    setConfigId(item.id);
    setBotToken(item.bot_token);
    setChatId(item.chat_id);
    setIsActive(!!item.is_active);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm(t("telegram.delete_confirm"))) return;

    try {
      await axiosClient.delete(`/api/telegram/${id}`);
      fetchConfigList();

      if (configId === id) resetForm();
      showSuccess(t("telegram.delete_success", "Telegram configuration deleted successfully"));
    } catch (err) {
      console.error(err);
      showError(err?.response?.data?.message || err?.message || t("telegram.delete_failed", "Failed to delete configuration"));
    }
  };

  const resetForm = () => {
    setConfigId(null);
    setBotToken("");
    setChatId("");
    setIsActive(true);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <FontAwesomeIcon icon={faPaperPlane} />
          {t("telegram.title")}
        </h1>
        <p className="text-sm text-slate-500">
          {t("telegram.edit_info")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-5 shadow-sm space-y-4"
        >
          <div>
            <label className="text-sm">{t("telegram.bot_token")}</label>
            <input
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              required
              className="w-full mt-1 border rounded-xl p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="text-sm">{t("telegram.chat_id")}</label>
            <input
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              required
              className="w-full mt-1 border rounded-xl p-2.5 text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{t("telegram.active")}</span>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative h-6 w-11 rounded-full ${
                isActive ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 bg-white rounded-full transition ${
                  isActive ? "left-5" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="flex gap-3">
            <button
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl"
            >
              {configId ? t("telegram.update") : t("telegram.save")}
            </button>

            {configId && (
              <button
                type="button"
                onClick={resetForm}
                className="border px-4 py-2 rounded-xl"
              >
                {t("telegram.clear")}
              </button>
            )}
          </div>
        </form>

        {/* LIST */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-semibold">{t("telegram.list_title")}</h2>
          </div>

          {loadingList ? (
            <div className="p-8 text-center text-sm text-slate-400">
              {t("telegram.loading")}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3">{t("telegram.bot_token")}</th>
                    <th className="px-4 py-3">{t("telegram.chat_id")}</th>
                    <th className="px-4 py-3">{t("users.status", "Status")}</th>
                    <th className="px-4 py-3 text-right">{t("users.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {configs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-400">
                        {t("reports.no_data", "No data found")}
                      </td>
                    </tr>
                  ) : (
                    configs.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => handleSelectRow(item)}
                        className={`transition-colors duration-150 cursor-pointer 
                          ${configId === item.id ? "bg-blue-50" : "hover:bg-slate-50"}`}
                      >
                        <td className="px-4 py-3 text-slate-600 truncate max-w-[160px]">
                          {item.bot_token}
                        </td>
                        <td className="px-4 py-3 text-slate-800 font-medium">{item.chat_id}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                              ${item.is_active
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-red-50 text-red-700 border border-red-100"
                              }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1.5
                                ${item.is_active ? "bg-emerald-500" : "bg-red-500"}`}
                            />
                            {item.is_active ? t("telegram.active") : t("telegram.inactive")}
                          </span>
                        </td>
                        <td
                          className="px-4 py-3 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                     text-slate-500 hover:text-red-600 hover:bg-red-50
                                     transition-colors"
                          >
                            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          <div className="px-4 py-3 text-xs text-slate-500 bg-slate-50 mt-auto border-t border-slate-100">
            Total: {configs.length} configs
          </div>
        </div>
      </div>
    </div>
  );
};

export default Telegram;
