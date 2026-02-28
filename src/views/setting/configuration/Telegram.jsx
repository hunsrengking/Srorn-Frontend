import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faTrash } from "@fortawesome/free-solid-svg-icons";

const Telegram = () => {
  const navigate = useNavigate();

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
    } catch (err) {
      console.error(err);
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
    if (!window.confirm("Delete this Telegram config?")) return;

    try {
      await axiosClient.delete(`/api/telegram/${id}`);
      fetchConfigList();

      if (configId === id) resetForm();
    } catch (err) {
      console.error(err);
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
          Telegram Configuration
        </h1>
        <p className="text-sm text-slate-500">
          Click row to edit, delete from action column
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-5 shadow-sm space-y-4"
        >
          <div>
            <label className="text-sm">Bot Token</label>
            <input
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              required
              className="w-full mt-1 border rounded-xl p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="text-sm">Chat ID</label>
            <input
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              required
              className="w-full mt-1 border rounded-xl p-2.5 text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Active</span>
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
              {configId ? "Update" : "Save"}
            </button>

            {configId && (
              <button
                type="button"
                onClick={resetForm}
                className="border px-4 py-2 rounded-xl"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* LIST */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold mb-4">Telegram List</h2>

          {loadingList ? (
            <p className="text-sm">Loading...</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-2 text-left">Bot Token</th>
                  <th className="p-2 text-left">Chat ID</th>
                  <th className="p-2 text-center">Status</th>
                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {configs.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleSelectRow(item)}
                    className={`border-t cursor-pointer hover:bg-blue-50 ${
                      configId === item.id ? "bg-blue-100" : ""
                    }`}
                  >
                    <td className="p-2 truncate max-w-[160px]">
                      {item.bot_token}
                    </td>
                    <td className="p-2">{item.chat_id}</td>
                    <td className="p-2 text-center">
                      {item.is_active ? "Active" : "Inactive"}
                    </td>
                    <td
                      className="p-2 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Telegram;
